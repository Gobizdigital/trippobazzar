import { NavLink } from "react-router-dom";

const SideNav = ({ handleClick }) => {
  const options = [
    { label: "Users", value: "users" },
    { label: "Continent", value: "continent" },
    { label: "Country", value: "country" },
    { label: "State", value: "state" },
    { label: "Packages", value: "package" },
    { label: "Hotels", value: "hotels" },
    { label: "Enquiries", value: "contact-enquiry" },
  ];

  return (
    <div className="w-auto pr-3 bg-green-50 h-auto m-0 border-r-4 border-white font-poppins font-medium ">
      <nav className="flex flex-col pt-10 items-start">
        {options.map(({ label, value }, idx) => (
          <NavLink
            key={idx}
            to={`/adminpanel/${value}`} // Use 'value' for navigation
            onClick={() => handleClick(value)} // Pass 'value' to handleClick
            className="mb-4 text-start capitalize pl-2 w-full hover:bg-green-50 hover:text-green-600"
            activeclassname="bg-green-600 text-white" // Styling for the active link
          >
            {label} {/* Display 'label' instead of 'value' */}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
