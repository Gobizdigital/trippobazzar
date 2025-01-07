import React from "react";

function TrmsConditions({ data }) {
  // Split the data by newlines
  const content = data.split("\n");

  if (
    !data ||
    content.length === 0 ||
    content.every((line) => line.trim() === "")
  ) {
    return (
      <div className="w-full md:w-[90%] mx-auto h-auto px-2 py-4">
        <p className="text-gray-500">No Terms and Condition Stated.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[90%] mx-auto h-auto p-4">
      {content.map((line, index) => {
        // Trim leading and trailing spaces and check if the line contains '**' at both ends
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
          return (
            <h2 key={index} className="text-green-500 text-xl md:text-2xl font-bold">
              {trimmedLine.slice(2, -2).trim()}{" "}
            </h2>
          );
        }

        // For normal lines, render them as paragraphs and add line breaks
        return (
          <p
            key={index}
            className={`${index !== content.length - 1 ? "mb-4" : ""} md:text-base text-sm`}
          >
            {trimmedLine}
          </p>
        );
      })}
    </div>
  );
}

export default TrmsConditions;
