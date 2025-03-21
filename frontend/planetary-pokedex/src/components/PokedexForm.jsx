import React, { useState } from "react";
import axios from "axios";
import AddPlanetModal from "./AddPlanetModal";
import ResponseDetails from "./ResponseDetails";

const PokedexForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [params, setParams] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleAddPlanetClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Save the file for submission
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!image || !params) {
      setError("Please upload an image and provide parameters.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("params", params);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(response.data); // Set the response data
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing the request.");
    }
  };

  return (
    <div className="bg-gray-900 text-red-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        {/* Top Half */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left (2/5): Image Upload */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className="border border-gray-700 rounded-lg bg-gray-800 w-full h-64 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
            </div>
            <label
              htmlFor="planet-image"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md mt-4 cursor-pointer"
            >
              Choose File
            </label>
            <input
              type="file"
              id="planet-image"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Right (3/5): Input Fields */}
          <div className="col-span-3">
            <label
              htmlFor="params"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Enter Numerical Parameters (comma-separated):
            </label>
            <input
              type="text"
              id="params"
              value={params}
              onChange={(e) => setParams(e.target.value)}
              placeholder="e.g., 6.5,6000,10.2,13000,-50"
              className="w-full rounded-md border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Bottom Half */}
        <div className="grid grid-cols-5 gap-6 mt-6">
          {/* Left (3/5): LLM Response Box */}
          <div className="col-span-3">
            <textarea
              placeholder="Response will appear here..."
              readOnly
              value={response ? JSON.stringify(response, null, 2) : ""}
              className="w-full h-24 rounded-md border-gray-700 bg-gray-800 text-gray-300 p-2 resize-none focus:ring-red-500 focus:border-red-500"
            ></textarea>
          </div>

          {/* Right (2/5): Buttons */}
          <div className="col-span-2 flex flex-col items-end gap-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-red-500"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleAddPlanetClick}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-gray-500"
            >
              Add Planet
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Response Details Component */}
      {response && <ResponseDetails response={response} />}

      {/* Add Planet Modal */}
      {showModal && (
        <AddPlanetModal
          onClose={handleCloseModal}
          image={image}
          params={params}
        />
      )}
    </div>
  );
};

export default PokedexForm;