import React from "react";

function Policies({ data }) {
  if (!data || data.trim() === "") {
    return (
      <div className="w-full md:w-[90%] mx-auto h-auto p-4">
        <p className="text-gray-500">No policies available.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full mx-auto h-auto prose prose-sm md:prose-base"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

export default Policies;
