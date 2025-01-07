import React, { forwardRef } from "react";
const Coupns = forwardRef(({ profileFields }, ref) => {
  return (
    <section ref={ref} className="relative bg-cover bg-opacity-0 px-0 py-5">
      <div className="overflow-x-auto scrollbar-hide rounded-lg py-8 px-5 bg-white h-auto w-full">
        <h3 className="text-base em:text-xl mb-4 font-bold">Coupons</h3>
        <div className="flex gap-8 w-56">
          {profileFields?.Coupons?.map((card) => (
            <div
              key={card._id}
              className="relative group rounded-lg overflow-hidden shadow-lg h-[250px] w-[230px] flex-shrink-0 snap-center bg-cover bg-center"
              style={{ backgroundImage: `url(/bg-home.webp)` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bg-[#fafafa] w-12 h-12 -left-[22px] top-1/2 rounded-full"></div>
              <div className="absolute bg-[#fafafa] w-12 h-12 -right-[22px] top-1/2 rounded-full"></div>
              <div className="absolute w-[72%] mx-auto h-1 left-1/2 top-[59%] -translate-x-1/2 border-t-[3px] border-dashed border-white"></div>

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-1 gap-2"
                style={{
                  textShadow: "4px 4px 8px rgba(0.1, 0.2, 0.5, 0.7)", // Apply text shadow to all children
                }}
              >
                {/* H1 - 50% OFF */}
                <h1 className="text-4xl font-extrabold">
                  {card?.discountPercentage}% OFF
                </h1>

                {/* Thin Line */}
                <div className="w-[50%] h-[2px] bg-white"></div>

                {/* P tag - On Manali Trips */}
                <p className="text-sm font-semibold mb-11">On All Trips</p>

                {/* Button */}
                <button className="mt-4 text-sm px-4 py-2 w-[90%] bg-[#03B58B] text-white rounded-md hover:bg-[#029f7c] transition">
                  Redeem Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Coupns;
