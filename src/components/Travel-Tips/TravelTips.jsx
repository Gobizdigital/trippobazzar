import React, { useRef } from 'react'
import TravelTipsTitle from './TravelTipsTitle'
import SubNavTravelTips from './SubNavTravelTips'
import TravelDescription from './TravelDescription'

function TravelTips() {

  const sections = ["WHAT TO BRING", "TRANSPORT", "SAFETYMEDICAL", "BANKS, CREDIT CARDS & MONEY", "SHOPPING" ,"TIME"];

  const descriptionRefs = useRef(sections.map(() => React.createRef()));

  return (
    <div className='className="bg-[#F8F8F8] max-w-[1920px] mx-auto'>
        <TravelTipsTitle/>
        <SubNavTravelTips descriptionRefs={descriptionRefs} sections={sections}/>
        <TravelDescription descriptionRefs={descriptionRefs} />
    </div>
  )
}

export default TravelTips