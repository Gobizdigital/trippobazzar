import React from "react";

function TrmsConditions({ data }) {
  if (!data || data.trim() === "") {
    return (
      <div className="w-full md:w-[90%] mx-auto h-auto px-2 py-4">
        <p className="text-gray-500">No Terms and Condition Stated.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full md:w-[90%] mx-auto h-auto p-4 prose prose-sm md:prose-base"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

export default TrmsConditions;
