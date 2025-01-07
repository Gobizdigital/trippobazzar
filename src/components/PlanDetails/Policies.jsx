import React from "react";

function Policies({ data }) {
  const content = data.split("\n");

  if (
    !data ||
    content.length === 0 ||
    content.every((line) => line.trim() === "")
  ) {
    return (
      <div className="w-full md:w-[90%] mx-auto h-auto p-4">
        <p className="text-gray-500">No policies available.</p>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto h-auto ">
      {content.map((line, index) => {
        // Trim leading and trailing spaces and check if the line contains '**' at both ends
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
          return (
            <React.Fragment key={index}>
              <h2 className="text-green-500 text-xl mb-3 md:mb-5 md:text-2xl font-bold">
                {trimmedLine.slice(2, -2).trim()}
              </h2>
              
            </React.Fragment>
          );
        }

        // Otherwise, render the text normally
        return (
          <React.Fragment key={index}>
            <p className={`${index !== content.length - 1 ? "mb-4" : ""} md:text-base text-sm`}>{trimmedLine}</p>
            {/* Add a <br /> to force the line break */}
     
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Policies;
