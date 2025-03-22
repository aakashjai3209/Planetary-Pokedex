import React, { useState } from "react";
import axios from "axios";

const AddPlanetModal = ({ onClose, image, params }) => {
  const [planetName, setPlanetName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!planetName || !image || !params) {
      setError("Please provide a planet name, image, and parameters.");
      return;
    }

    const formData = new FormData();
    formData.append("name", planetName);
    formData.append("image", image);
    formData.append("params", params);

    try {
      const response = await axios.post("http://10.220.73.109:10000/add_class", formData, {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-red-500 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add New Planet Class</h2>
        <form onSubmit={handleSubmit}>
          {/* Planet Name */}
          <div className="mb-4">
            <label
              htmlFor="planet-name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Planet Name
            </label>
            <input
              type="text"
              id="planet-name"
              value={planetName}
              onChange={(e) => setPlanetName(e.target.value)}
              placeholder="e.g., ExoPlanet-X"
              className="w-full rounded-md border-gray-700 bg-gray-800 text-gray-300 p-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-red-500"
            >
              Add Planet Class
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Response Section */}
        {response && (
          <div className="bg-gray-800 text-gray-300 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-bold text-red-500 mb-2">Response</h3>
            <p>
              <strong>Message:</strong> {response.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPlanetModal;
