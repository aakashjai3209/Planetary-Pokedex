import React from "react";

const ResponseDetails = ({ response }) => {
  return (
    <div className="bg-gray-800 text-gray-300 p-4 rounded-lg mt-6">
      <h3 className="text-lg font-bold text-red-500 mb-4">Response Details</h3>
      <p>
        <strong>Most Similar Class:</strong> {response.most_similar_class}
      </p>
      <p>
        <strong>Most Similar Image:</strong> {response.most_similar_image}
      </p>
      <p>
        <strong>Description:</strong> {response.description}
      </p>
      <p>
        <strong>Similarity Scores:</strong>
      </p>
      <pre className="bg-gray-900 p-2 rounded-md">
        {JSON.stringify(response.similarity_scores, null, 2)}
      </pre>
    </div>
  );
};

export default ResponseDetails;