import React, { useState } from "react";
import axios from "axios";
import AddPlanetModal from "./AddPlanetModal";
import ReactMarkdown from "react-markdown";

// Updated ResponseDetails component with probability dashboard
const ResponseDetails = ({ response }) => {
  // Get all similarity scores as entries
  const allScores = Object.entries(response.similarity_scores || {});
  
  // Find the top match (highest score)
  const topMatch = allScores.sort((a, b) => b[1] - a[1])[0];
  
  // Get the 4 least matching planets (lowest scores)
  const leastMatches = allScores
    .sort((a, b) => a[1] - b[1])  // Sort in ascending order
    .slice(0, 4);                  // Take the 4 lowest scores
  
  // Combine top match with least matches for display
  const displayScores = [topMatch, ...leastMatches];

  // Planet class names from the response
  const planetClasses = response.class_to_body || {
    "0": "Mercury-like",
    "1": "Venus-like",
    "2": "Earth-like",
    "3": "Mars-like",
    "4": "Jupiter-like",
    "5": "Saturn-like",
    "6": "Uranus-like",
    "7": "Neptune-like",
    "8": "Pluto-like",
    "9": "Super-Earth",
    "10": "Gas Giant"
  };

  return (
    <div className="bg-gray-800 text-gray-300 p-4 rounded-lg h-full border-2 border-gray-700 shadow-lg">
      <h3 className="text-lg font-bold text-red-500 mb-4">Planet Analysis</h3>
      
      {/* Most similar class */}
      <div className="mb-4">
        <p className="mb-2">
          <span className="text-gray-400">Most Similar Class:</span>{" "}
          <span className="text-cyan-400 font-medium">
            {planetClasses[response.most_similar_class] || `Class ${response.most_similar_class}`}
          </span>
        </p>
      </div>
      
      {/* Probability Dashboard */}
      <div className="mb-6">
        <h4 className="text-red-400 font-medium mb-4">Similarity Analysis</h4>
        <div className="flex justify-between items-end h-64 gap-2">
          {displayScores.map(([classId, score], index) => {
            const isTopMatch = classId === topMatch[0];
            const barHeight = isTopMatch ? `${score * 100}%` : `${score * 85}%`;
            
            return (
              <div key={classId} className="flex flex-col items-center flex-1">
                <div className="text-sm mb-2">{(score * 100).toFixed(1)}%</div>
                <div className="relative w-full bg-gray-700 rounded-t-md h-56 flex justify-center">
                  <div 
                    className={`absolute bottom-0 w-full ${isTopMatch ? 'bg-red-500' : 'bg-gray-500'} rounded-t-md animate-grow-up`} 
                    style={{ 
                      height: barHeight,
                      animation: `growUp 1s ease-out ${index * 0.2}s` 
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-2 text-center truncate w-full" title={planetClasses[classId]}>
                  {planetClasses[classId] ? 
                    (planetClasses[classId].length > 10 ? 
                      planetClasses[classId].substring(0, 8) + "..." : 
                      planetClasses[classId]) : 
                    `Class ${classId}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


const PokedexForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [params, setParams] = useState({
    mass: "",
    radius: "",
    gravity: "",
    density: "",
    temperature: ""
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const handleAddPlanetClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!image || Object.values(params).some((param) => param === "")) {
      setError("Please upload an image and provide all parameters.");
      return;
    }
  
    const paramsString = `${params.mass},${params.radius},${params.gravity},${params.density},${params.temperature}`;
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("params", paramsString);
  
    try {
      setIsSearching(true); // Start searching animation
      
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setResponse(response.data);
      setError("");

      setIsTyping(true);
      setDisplayedText("");
      
      // Simulate typing effect
      const text = response.data.description;
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 15); // Adjust speed as needed
    
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing the request.");
    } finally {
      setIsSearching(false); // Stop searching animation
    }
  };

  return (
    
    <div className="bg-gray-900 text-red-500 p-6 rounded-lg shadow-xl w-full max-w-7xl mx-auto mt-8">
      {/* Header with Pokedex title and search indicator */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500 tracking-wider">PLANETDEX</h1>
        <div className={`w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center ${isSearching ? 'animate-pulse bg-red-500' : 'bg-gray-800'}`}>
          <div className={`w-6 h-6 rounded-full ${isSearching ? 'bg-red-300' : 'bg-gray-600'}`}></div>
        </div>
      </div>
      
      {/* Main content with form and response details side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3): Pokedex Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Half */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left (2/5): Image Upload */}
              <div className="md:col-span-2 flex flex-col items-center justify-center">
                <div className="border-2 border-gray-700 rounded-lg bg-gray-800 w-full h-80 flex items-center justify-center overflow-hidden shadow-inner">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-gray-500 text-lg mb-2">No image uploaded</p>
                      <p className="text-gray-600 text-sm">Upload an image of your planet</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="planet-image"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                    file:border-0 file:text-sm file:font-medium
                    file:bg-red-600 file:text-white
                    hover:file:bg-red-700 file:transition-colors file:duration-200
                    file:cursor-pointer mt-4"
                />
              </div>

              {/* Right (3/5): Input Fields */}
              <div className="md:col-span-3">
                <div className="border-2 border-gray-700 rounded-lg bg-gray-800 p-5 h-full shadow-lg">
                  <h3 className="text-gray-300 font-medium text-xl mb-4">Enter Parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="mass"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Mass
                      </label>
                      <input
                        type="text"
                        id="mass"
                        name="mass"
                        value={params.mass}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, mass: e.target.value }))
                        }
                        placeholder="e.g., 6.5"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="radius"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Radius
                      </label>
                      <input
                        type="text"
                        id="radius"
                        name="radius"
                        value={params.radius}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, radius: e.target.value }))
                        }
                        placeholder="e.g., 6000"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gravity"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Gravity
                      </label>
                      <input
                        type="text"
                        id="gravity"
                        name="gravity"
                        value={params.gravity}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, gravity: e.target.value }))
                        }
                        placeholder="e.g., 10.2"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="density"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Density
                      </label>
                      <input
                        type="text"
                        id="density"
                        name="density"
                        value={params.density}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, density: e.target.value }))
                        }
                        placeholder="e.g., 13000"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="temperature"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Temperature
                      </label>
                      <input
                        type="text"
                        id="temperature"
                        name="temperature"
                        value={params.temperature}
                        onChange={(e) =>
                          setParams((prev) => ({ ...prev, temperature: e.target.value }))
                        }
                        placeholder="e.g., -50"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Half - LLM Response Box */}
            {!response ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-20 h-20 mb-3">
                  {/* Animated planet */}
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-80 animate-pulse"></div>
                  <div className="absolute w-5 h-5 rounded-full bg-gray-300 animate-orbit"></div>
                </div>
                <p className="text-gray-500 text-center">Response will appear here...</p>
              </div>
            ) : (
              <div>
              <h3 className="text-gray-300 font-medium text-xl mb-2">Information</h3>
              <div className="w-full h-64 rounded-md border-2 border-gray-700 bg-gray-900 text-gray-300 p-4 overflow-y-auto shadow-inner custom-scrollbar relative">
                {response ? (
                  <>
                    <ReactMarkdown >
                      {isTyping ? displayedText : response.description}
                    </ReactMarkdown>
                    {isTyping && (
                      <span className="inline-block h-4 w-2 ml-1 bg-cyan-500 animate-pulse"></span>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">Response will appear here...</p>
                  </div>
                )}
              </div>
            </div>
            )}
            

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex-1 transition-colors duration-200"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleAddPlanetClick}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex-1 transition-colors duration-200"
              >
                Add Planet
              </button>
            </div>
          </form>
        </div>

        {/* Right (1/3): Response Details with Probability Dashboard */}
        <div className="lg:col-span-1">
          {!response ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="loading-animation">
                <div className="pulse-circle"></div>
              </div>
              <p className="text-gray-500 text-center mt-4">Analysis will appear here after submission</p>
            </div>
          ) : (
            <ResponseDetails response={response} />
          )}
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Add Planet Modal */}
      {/* Add Planet Modal */}
      {showModal && (
        <AddPlanetModal
          onClose={handleCloseModal}
          image={image}
          params={`${params.mass},${params.radius},${params.gravity},${params.density},${params.temperature}`}
        />
      )}

    </div>
  );
};

export default PokedexForm;
