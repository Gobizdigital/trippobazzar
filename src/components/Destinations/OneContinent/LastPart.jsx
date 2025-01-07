import React from 'react'
import YutubeSvg from '../../../../svgs/Yutubelogo';


function LastPart() {
    const OURVALUESDATA = [
        {
          title: "Easy and Secure Payments",
          desc: "Elevate your travel experience with our unwavering dedication to excellence, where meticulous attention to detail meets professional service.",
        },
        {
          title: "Customize Your Travel",
          desc: "Unleash the power of choice with Trippo Bazaar, where personalized travel experiences put you in control of every adventure.",
        },
        {
          title: "Easy Modification",
          desc: "Navigate your journey with confidence – Our commitment to transparency ensures clear and honest communication, building trust at every step.",
        },
      ];
  return (
    <div>
        <h2 className='text-center text-5xl font-bold' >Book Your Travel</h2>
        
        <h2 className='text-center text-green-400 text-5xl font-bold'>With Just 3 Easy Steps</h2>
             <div className="w-[90%] mx-auto grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-10 mmd:gap-28 px-4 sm:px-10 md:px-28 h-auto py-8 sm:py-16 md:py-11 ">
          {OURVALUESDATA.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`sm:max-w-[503px] ${
                  idx === OURVALUESDATA.length - 1
                    ? "sm:col-span-2"
                    : "sm:col-span-1"
                } md:col-span-1 text-center pb-10 sm:pb-0 flex flex-col justify-center items-center h-auto md:h-[400px] w-full`}
              >
                <YutubeSvg/>
                <p className="font-bold mb-0 text-lg sm:text-sm md:text-lg mt-4">
                  {item.title}
                </p>
                <br />
                <p className="text-base sm:text-xs md:text-sm font-normal text-center">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
    </div>
  )
}

export default LastPart