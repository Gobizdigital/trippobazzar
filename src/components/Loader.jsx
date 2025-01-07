import React from "react";

import HomeLogoSvg from "../../svgs/HomeLogo";

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blend-saturation">
      <div className="relative flex justify-center items-center">
        {/* Spinning circle */}
        <div className="absolute w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 border-2 border-t-8 border-gray-200 border-t-med-green animate-spin rounded-full"></div>

        {/* Logo image */}
        <HomeLogoSvg />
      </div>
    </div>
  );
}

export default Loader;
