import{r as f,a as S,m as F,f as L,n as h,j as e,o as M,D as g,p as E}from"./index-D_lxvvfu.js";import{B as P}from"./BreadCrumbsLink-C4LKlRIs.js";const B="/assets/africa-bg-D1ltRThk.webp";function A(){const[c,p]=f.useState(!1),[j,i]=f.useState(!1),d=()=>p(!c),m=S(),{searchData:s,setSearchData:l}=F(),{item:u,country:b,state:o}=L(),w=()=>{l(t=>({...t,guests:t.guests+1}))},y=()=>{l(t=>({...t,guests:t.guests>1?t.guests-1:1}))},x=h.filter(t=>t.name.toLowerCase().includes(s.destination.toLowerCase())),r=(t,a)=>{l(n=>({...n,[t]:a}))},N=t=>{const a=t.region,n=t.name,k=a==="India"?`/destination/asia/India/${n}`:`/destination/${a}/${n}`;m(k),i(!1)},v=()=>{const t=h.find(a=>a.name.toLowerCase()===s.destination.toLowerCase());t?N(t):m("/")},C=()=>i(!0),D=()=>setTimeout(()=>i(!1),200);return e.jsxs("div",{className:"rounded-b-3xl font-poppins ",children:[u?e.jsx(e.Fragment,{}):e.jsx("div",{className:"w-[90%] relative z-10 mx-auto py-2",children:e.jsx(P,{})}),e.jsxs("div",{className:"w-full h-full relative",children:[e.jsx("img",{src:B,alt:"main-Picture",className:"w-full h-auto object-contain",loading:"eager",fetchpriority:"high",width:"1920",height:"1080",style:{objectFit:"contain"}}),e.jsx("div",{className:"absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",children:e.jsx("div",{className:"w-full flex items-center justify-center",children:e.jsx("h2",{className:"text-base uppercase tracking-[30px] md:tracking-[40px] text-white ew:text-xl sm:text-7xl  lg:mb-4 text-center font-bold",children:o||u||b})})}),e.jsx("div",{className:"flex absolute z-10 -bottom-[420px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col py-20 w-[90%] mx-auto justify-center items-center",children:e.jsxs("div",{className:"w-[90%] max-w-[1720px] h-auto p-4 md:p-16 bg-[#f8f8f8] shadow-lg rounded-lg mx-auto top-[43rem] sm:top-[42rem] md:top-[19rem] lg:top-[5rem] lg:mt-[-2rem] relative ",children:[e.jsxs("div",{className:"flex flex-col md:flex-row items-center jusitfy-between gap-4",children:[e.jsx("div",{className:"flex items-center border bg-[#f8f8f8] rounded-md py-3 px-2 w-full",children:e.jsx("input",{type:"text",placeholder:"Where are you starting from?",value:s.startLocation,onChange:t=>r("startLocation",t.target.value),className:"w-full bg-transparent focus:outline-none"})}),e.jsx("p",{className:"text-gray-500 font-medium",children:"To"}),e.jsxs("div",{className:"relative w-full",children:[e.jsx("div",{className:"flex items-center bg-[#f8f8f8] border rounded-md py-3 px-2 w-full",children:e.jsx("input",{type:"text",placeholder:"Enter Destination",className:"w-full bg-transparent focus:outline-none",value:s.destination,onChange:t=>r("destination",t.target.value),onFocus:C,onBlur:D})}),(s.destination||x.length>0)&&j&&e.jsx("ul",{className:"mt-4 absolute bg-[#f8f8f8] rounded-md p-4 min-h-[10px] w-full z-20",children:x.map((t,a)=>e.jsxs("li",{onClick:()=>{l(n=>({...n,destination:t.name}))},className:"py-2 border-b cursor-pointer",children:[e.jsx("strong",{children:t.name})," -"," ",t.region]},a))})]}),o?"":e.jsx("div",{className:"md:w-auto w-full  flex justify-end",children:e.jsx("div",{className:"cursor-pointer",onClick:d,children:e.jsx(M,{})})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 items-end",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("p",{className:"text-gray-500 font-medium mb-1",children:"Start Date"}),e.jsx("div",{className:"flex items-center bg-gray-100 rounded-md p-2 h-12",children:e.jsx(g,{placeholderText:"E.g 2004-03-02",selected:s.startDate,onChange:t=>r("startDate",t),className:"outline-2 p-2 w-full outline-med-green bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer",dateFormat:"yyyy-MM-dd",required:!0})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("p",{className:"text-gray-500 font-medium mb-1",children:"End Date"}),e.jsx("div",{className:"flex items-center bg-gray-100 rounded-md p-2 h-12",children:e.jsx(g,{placeholderText:"E.g 2004-03-02",selected:s.endDate,onChange:t=>r("endDate",t),className:"outline-2 p-2 w-full outline-med-green bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer",dateFormat:"yyyy-MM-dd",required:!0})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("p",{className:"text-gray-500 mb-1 font-medium",children:"Guests"}),e.jsxs("div",{className:"flex items-center justify-around bg-gray-100 rounded-md p-2 h-12",children:[e.jsx("button",{onClick:y,className:"bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full",children:"-"}),e.jsxs("p",{className:"font-medium text-[#717A7C] text-lg",children:[s.guests||1," guests"]}),e.jsx("button",{onClick:w,className:"bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full",children:"+"})]})]}),e.jsx("button",{onClick:v,className:"flex w-full text-center text-lg h-11 items-center justify-center font-medium px-4 py-2 bg-med-green text-white rounded-md",children:e.jsx("p",{children:"Search Packages"})})]})]})}),e.jsx(E,{showModal:c,onClose:d})]})]})}export{A as S};
