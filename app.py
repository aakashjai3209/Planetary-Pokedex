import os
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from ultralytics import YOLO
from PIL import Image
import torch.nn.functional as F
from torchvision import transforms
import torch
from openai import OpenAI
from torchvision.transforms import functional as TF
import json
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

# Access the API key
PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')

# Initialize Flask app
app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")
# Define paths for PCA files and YOLO model
pca_dir = 'Solar-System-2/pca_features/'
yolo_model_path = 'best.pt'

# Load YOLO model
model = YOLO(yolo_model_path)

def get_class_labels():
    class_labels = []
    for file in os.listdir(pca_dir):
        if file.startswith("class_") and file.endswith("_pca_model.pkl"):
            label = int(file.split("_")[1])
            class_labels.append(label)
    return sorted(class_labels)

class_labels = get_class_labels()

# Load PCA models, reduced vectors, and mappings for all classes
pca_models = {}
stored_pca_vectors = {}
image_mappings = {}


for class_label in class_labels:
    pca_model_path = f'{pca_dir}class_{class_label}_pca_model.pkl'
    stored_pca_vectors_path = f'{pca_dir}class_{class_label}_pca_features.npy'
    mapping_path = f'{pca_dir}class_{class_label}_mapping.npy'

    if os.path.exists(pca_model_path) and os.path.exists(stored_pca_vectors_path) and os.path.exists(mapping_path):
        pca_models[class_label] = joblib.load(pca_model_path)
        stored_pca_vectors[class_label] = np.load(stored_pca_vectors_path)
        image_mappings[class_label] = np.load(mapping_path, allow_pickle=True)
    else:
        print(f"Data missing for Class {class_label}. Skipping.")

# Preprocess image function
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.Resize((640, 640)),
        transforms.ToTensor()
    ])
    return transform(image).unsqueeze(0)

# Extract feature vector function
def extract_feature_vectors(model, input_tensor):
    feature_maps = {}

    def hook_fn(module, input, output):
        feature_maps[module] = output

    # Register hooks on specific layers (SPPF and C3k2 layers)
    layer_names = [9, 16]
    for idx, layer in enumerate(model.model.model):
        if idx in layer_names:
            layer.register_forward_hook(hook_fn)

    # Perform inference
    with torch.no_grad():
        _ = model(input_tensor)

    # Extract flattened feature vectors from hooked layers
    flattened_vector_sppf = None
    flattened_vector_c3k2 = None

    for module, features in feature_maps.items():
        flattened_vector = F.adaptive_avg_pool2d(features, (1, 1)).view(features.size(0), -1)
        if "SPPF" in str(module):
            flattened_vector_sppf = flattened_vector
        elif "C3k2" in str(module):
            flattened_vector_c3k2 = flattened_vector

    # Concatenate feature vectors from SPPF and C3k2 layers
    concatenated_vector = torch.cat([flattened_vector_sppf, flattened_vector_c3k2], dim=1)
    return concatenated_vector.cpu().numpy()

@app.route('/analyze', methods=['POST'])
def analyze_planet():
    try:
        # Get image and params from request
        image_file = request.files['image']
        params = request.form.get('params')  # Params as JSON string (e.g., {"mass": ..., "diameter": ...})
         # Convert to numpy array

         # Load class-to-body mapping
        class_to_body_path = 'Solar-System-2/class_to_body.json'
        if os.path.exists(class_to_body_path):
            with open(class_to_body_path, 'r') as f:
                class_to_body = json.load(f)
        else:
            class_to_body = {}
        params = np.array(list(map(float, params.split(','))))
        # Preprocess image and extract features using YOLO
        image = Image.open(image_file).convert('RGB')
        input_tensor = preprocess_image(image)
        feature_vector = extract_feature_vectors(model, input_tensor)

        # Normalize numerical parameters and combine with features
        scaler = StandardScaler()
        numerical_params_normalized = scaler.fit_transform([params])[0]
        combined_vector = np.concatenate((feature_vector.flatten(), numerical_params_normalized), axis=0)

        # Compute similarity scores across all classes
        max_similarity_score = -1
        most_similar_class = None
        most_similar_image = None

        similarity_scores_dict = {}

        for class_label in pca_models.keys():
            pca_model = pca_models[class_label]
            reduced_vector = pca_model.transform([combined_vector])
            
            stored_vectors = stored_pca_vectors[class_label]
            similarity_scores_class = cosine_similarity(reduced_vector, stored_vectors)

            max_index_in_class = np.argmax(similarity_scores_class[0])
            max_score_in_class = similarity_scores_class[0][max_index_in_class]

            similarity_scores_dict[class_label] = max_score_in_class

            if max_score_in_class > max_similarity_score:
                max_similarity_score = max_score_in_class
                most_similar_class = class_label
                most_similar_image = image_mappings[class_label][max_index_in_class]
        
        planet_name = class_to_body.get(str(most_similar_class), "Unknown")

        description_prompt = f"""
        This planet is similar to {planet_name} Class {most_similar_class} planets with a similarity score of {max_similarity_score:.2f}.
        It has the following properties:
        - Mass: {params[0]} Earth masses
        - Diameter: {params[1]} km
        - Gravity: {params[2]} m/s²
        - Density: {params[3]} kg/m³
        - Mean Temperature: {params[4]}°C
        
        Provide a short description of this planet's characteristics and potential habitability in 5 small bullet points.
        And directly provide the points without any additional information.
        """

        # Make API call to Perplexity using OpenAI client
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an assistant that generates detailed descriptions "
                    "of planets based on their properties and similarity scores."
                ),
            },
            {
                "role": "user",
                "content": description_prompt,
            },
        ]

        response = client.chat.completions.create(
            model="sonar",  # Replace with appropriate model name from Perplexity API documentation
            messages=messages,
            max_tokens=250,
            temperature=0.7,
            top_p=0.9,
            n=1,
            stop=None,
        )

        description_response = response.choices[0].message.content.strip()


        return jsonify({
            "similarity_scores": similarity_scores_dict,
            "most_similar_class": most_similar_class,
            "most_similar_image": most_similar_image,
            "planet_name": planet_name,
            "description": description_response,
            "class_to_body": class_to_body 
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/add_class', methods=['POST'])
def add_class():
    try:
        # Get image and params from request
        image_file = request.files['image']
        params = request.form.get('params')  # Params as JSON string (e.g., {"mass": ..., "diameter": ...})
        
        name = request.form.get('name')  # Name of the planet
        if not name:
            return jsonify({"error": "Planet name is required"}), 400
        params = np.array(list(map(float, params.split(','))))  # Convert to numpy array
        # Preprocess image
        original_image = Image.open(image_file).convert('RGB')

        # Apply image augmentation
        augmented_images = [
            original_image,
            TF.rotate(original_image, angle=15),  # Rotate by 15 degrees
            TF.rotate(original_image, angle=-15),  # Rotate by -15 degrees
            TF.hflip(original_image),  # Horizontal flip
            TF.vflip(original_image),  # Vertical flip
            TF.adjust_brightness(original_image, brightness_factor=1.2),  # Brightness adjustment
            TF.adjust_contrast(original_image, contrast_factor=1.2),  # Contrast adjustment
        ]

        # Extract feature vectors for all augmented images
        feature_vectors = []
        for img in augmented_images:
            input_tensor = preprocess_image(img)
            feature_vector = extract_feature_vectors(model, input_tensor)
            feature_vectors.append(feature_vector.flatten())

        feature_vectors = np.array(feature_vectors)  # Convert list to numpy array

        # Normalize numerical parameters and combine with features
        scaler = StandardScaler()
        numerical_params_normalized = scaler.fit_transform([params])[0]
        combined_vectors = np.array([
            np.concatenate((fv, numerical_params_normalized), axis=0) for fv in feature_vectors
        ])

        # Create new class label
        new_class_label = max(class_labels) + 1  # Assign next available class label
        class_labels.append(new_class_label)  # Update class labels list

        # Save combined feature vectors for this new class
        output_dir = 'Solar-System-2/combined_features/'
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f'class_{new_class_label}_combined_features.npy')
        np.save(output_path, combined_vectors)
        print(f"Saved combined feature vectors for Class {new_class_label} to {output_path}")

        # Apply PCA to reduce dimensions for the new class
        from sklearn.decomposition import PCA
        pca = PCA(n_components=min(len(combined_vectors), combined_vectors.shape[1]))  # Use min(samples, features)
        pca_reduced_vectors = pca.fit_transform(combined_vectors)

        # Save PCA-reduced vectors
        pca_dir = 'Solar-System-2/pca_features/'
        os.makedirs(pca_dir, exist_ok=True)
        pca_output_path = os.path.join(pca_dir, f'class_{new_class_label}_pca_features.npy')
        np.save(pca_output_path, pca_reduced_vectors)
        print(f"Saved PCA-reduced feature vectors for Class {new_class_label} to {pca_output_path}")

        # Save PCA model
        pca_model_path = os.path.join(pca_dir, f'class_{new_class_label}_pca_model.pkl')
        joblib.dump(pca, pca_model_path)
        print(f"Saved PCA model for Class {new_class_label} to {pca_model_path}")

        # Save mapping of indices to identifiers (e.g., filenames)
        image_mapping = [image_file.filename] * len(augmented_images)  # Duplicate filename for all augmented images
        mapping_path = os.path.join(pca_dir, f'class_{new_class_label}_mapping.npy')
        np.save(mapping_path, image_mapping)
        print(f"Saved mapping for Class {new_class_label} to {mapping_path}")

        # Dynamically update PCA models and mappings in memory
        pca_models[new_class_label] = joblib.load(pca_model_path)
        stored_pca_vectors[new_class_label] = np.load(pca_output_path)
        image_mappings[new_class_label] = np.load(mapping_path, allow_pickle=True)

        class_to_body_path = 'Solar-System-2/class_to_body.json'
        if os.path.exists(class_to_body_path):
            with open(class_to_body_path, 'r') as f:
                class_to_body = json.load(f)
        else:
            class_to_body = {}

        class_to_body[str(new_class_label)] = name

        with open(class_to_body_path, 'w') as f:
            json.dump(class_to_body, f)

        return jsonify({
            "message": f"New class {new_class_label} added successfully.",
            "class_label": new_class_label,
            "mapping": image_mapping,
            "pca_model_path": pca_model_path,
            "pca_features_path": pca_output_path,
            "combined_features_path": output_path
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
