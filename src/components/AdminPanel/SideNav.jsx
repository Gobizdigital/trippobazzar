import { NavLink } from "react-router-dom";

const SideNav = ({ handleClick }) => {
  const options = ["users", "continent", "country", "state", "package","hotels"];

  return (
    <div className="w-auto pr-3 bg-green-50 h-auto m-0 border-r-4 border-white font-poppins font-medium ">
      <nav className="flex flex-col pt-10  items-start">
        {options.map((item, idx) => {
          return (
            <NavLink
              key={idx}
              to={`/adminpanel/${item}`} // Use dynamic route for each item
              onClick={() => handleClick(item.toLowerCase().trim())} // Optional, if you still want to handle state changes
              className="mb-4 text-start capitalize pl-2 w-full hover:bg-green-50 hover:text-green-600"
              activeclassname="bg-green-600 text-white" // Styling for the active link
            >
              {item}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default SideNav;
