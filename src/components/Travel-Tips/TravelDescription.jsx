import React from "react";
import { TRAVELTIPSDATA } from "./TravelData";

export default function TravelDescription({ descriptionRefs }) {
  return (
    <div className="bg-[#f8f8f8] font-poppins">
      {TRAVELTIPSDATA.map((item, idx) => {
        return (
          <div
            key={idx}
            ref={descriptionRefs.current[idx]}
            className="max-w-[1720px] h-auto rounded-lg my-10 bg-white w-[90%] mx-auto"
          >
            <div className="border-b w-[98%] ml-auto pt-8 md:pt-16" />
            <div className="w-[98%] pb-8 md:pb-16 mt-8 flex flex-col md:flex-row ml-auto">
              <div className="border-r mt-[22px] mx-2 relative md:block hidden border-[#A5C7CE47] ">
                <div className="rounded-full text-med-green bg-white absolute flex items-center justify-center top-0 left-0 -translate-x-1/2 -translate-y-1/2 border p-2">
                  {item.icon}
                </div>
                <div className="rounded-full border p-[6px] absolute flex items-center justify-center top-[53px] left-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-full bg-gray-400 p-[4px]"></div>
                </div>
              </div>
              <div className="px-6">
                <p className=" flex items-center gap-4  mb-4">
                  <span className="rounded-full w-10 h-10 text-med-green bg-white  md:hidden flex items-center justify-center  border p-2">
                    {item.icon}
                  </span>
                  <span className="md:text-3xl text-xl">{item.title}</span>
                </p>
                <div className="text-sm md:text-base leading-relaxed">
                  {item.desc.split("\n\n").map((line, lineIdx) => (
                    <p key={lineIdx} className="mb-4">
                      {line}
                    </p>
                  ))}
                </div>
                {item.show && (
                  <ul className="ml-3 md:ml-10 md:text-base text-sm flex flex-col gap-2 list-disc">
                    <li>Dress is casual, smart casual for evenings.</li>
                    <li>Swimming costume, hat, and sun protection.</li>
                    <li>Shoes for bush and reef walking, flip flops.</li>
                    <li>Day pack for walks and beach trips.</li>
                    <li>
                      A raincoat and windcheater are recommended owing to
                      occasional showers and squalls that can occur at any time
                      of the year.
                    </li>
                    <li>
                      Pack required medication in your carry-on baggage for
                      travel with prescription.
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
