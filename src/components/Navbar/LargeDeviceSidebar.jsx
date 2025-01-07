import { useEffect, useState } from "react";
import { socialMediaData } from "../../../utils/SocialMediaData";
import TransitionLink from "../../../utils/TransitionLink";
import CompanyLogo from "../../../svgs/CompanyLogo";
import { useNavigate } from "react-router-dom";

const LargeDeviceSidebar = ({ isSidebarOpen, closeSidebar }) => {
  const [activeItem, setActiveItem] = useState(null);
  const navigate=useNavigate();

  const menuItems = [
    {
      title: "My Profile",
      link: "/myprofile",
      subItems: ["Sub-item 1", "Sub-item 2", "Sub-item 3"],
    },
    {
      title: "My Bookings",
      link: "",
      subItems: ["Modify Bookings", "Cancel Bookings", "New Bookings"],
    },
    {
      title: "Our Policy",
      link: "/aboutus/privacy-policy",
      subItems: ["Sub-item X", "Sub-item Y", "Sub-item Z"],
    },
    {
      title: "Careers",
      link: "/aboutus/careers",
      subItems: ["Sub-item 1", "Sub-item 2", "Sub-item 3"],
    },
    {
      title: "FAQs",
      link: "",
      subItems: ["Sub-item A", "Sub-item B", "Sub-item C"],
    },
    {
      title: "Contact Us",
      link: "/contactus",
      subItems: ["Sub-item X", "Sub-item Y", "Sub-item Z"],
    },
    { title: "Admin Panel", link: "/adminpanel/*", subItems: [] },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clears all data from localStorage
    closeSidebar(); // Closes the menu
    navigate("/");
  };

  useEffect(() => {
    // Prevent body scroll when the menu is open
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  return (
    <div
      className={`fixed z-30 max-w-[1920px] h-full  mx-auto  top-0 flex w-full bg-white shadow-lg transition-all duration-700 ${
        isSidebarOpen
          ? "translate-x-0 opacity-100 visible"
          : "-translate-x-full opacity-0 invisible"
      }`}
    >
      <div className="flex items-center w-full relative h-full">
        <button
          onClick={closeSidebar}
          className="text-gray-600 p-0 text-5xl font-light absolute top-0 right-5"
        >
          x
        </button>

        {/* First Part: Large logo */}
        <div
          onClick={closeSidebar}
          className="w-1/4 h-32 flex  justify-center items-center md:w-1/3 lg:w-1/4"
        >
          <TransitionLink to={"/"}>
            <CompanyLogo className="w-full h-full " />
          </TransitionLink>
        </div>

        {/* Second Part: List of items */}
        <div className="w-auto block items-center mx-10 md:mx-20 lg:mx-40">
          <div className="p-4 relative">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                <li
                  className="list-none pb-6 text-[#00283166] font-semibold text-xl md:text-2xl cursor-pointer hover:text-green-500"
                  onClick={closeSidebar}
                >
                  <TransitionLink to={item.link} className="block">
                    {item.title}
                  </TransitionLink>
                </li>

                {activeItem === index && (
                  <ul className="absolute top-0 left-[70%] text-start cursor-pointer space-y-3 p-0 rounded">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="text-[0.875rem] md:text-[1rem] font-semibold text-black"
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Third Part: Bottom logos */}
        <div className="w-auto absolute bottom-4 right-0 flex flex-col justify-end items-center space-y-4 p-4">
          {socialMediaData.map((item, index) => (
            <div
              key={index}
              className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center cursor-pointer rounded-full border p-[6px] hover:shadow-xl hover:shadow-green-200 border-black"
            >
              {item.icon}
            </div>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 hover:bg-green-50 rounded-lg text-[#00283166] font-semibold text-lg md:text-xl cursor-pointer border border-green-500 hover:text-green-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LargeDeviceSidebar;
