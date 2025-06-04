import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Globe,
  Map,
  MapPin,
  Package,
  Hotel,
  MessageSquare,
  ChevronRight,
  TicketsPlane,
} from "lucide-react";

const SideNav = ({ handleClick, sidebarOpen, currentSelection }) => {
  const options = [
    { label: "Users", value: "users", icon: <Users className="w-5 h-5" /> },
    {
      label: "Continent",
      value: "continent",
      icon: <Globe className="w-5 h-5" />,
    },
    { label: "Country", value: "country", icon: <Map className="w-5 h-5" /> },
    { label: "State", value: "state", icon: <MapPin className="w-5 h-5" /> },
    {
      label: "Packages",
      value: "package",
      icon: <Package className="w-5 h-5" />,
    },
    { label: "Hotels", value: "hotels", icon: <Hotel className="w-5 h-5" /> },
    {
      label: "Enquiries",
      value: "contact-enquiry",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Bookings",
      value: "booking-details",
      icon: <TicketsPlane className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-full py-4 overflow-y-auto">
      <nav className="flex flex-col space-y-1 px-3">
        {options.map(({ label, value, icon }, idx) => (
          <NavLink
            key={idx}
            to={`/adminpanel/${value}`}
            onClick={() => handleClick(value)}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <div className={`${!sidebarOpen && "mx-auto"}`}>{icon}</div>

            {sidebarOpen && (
              <>
                <span className="ml-3 text-sm font-medium">{label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 ${
                    currentSelection === value
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
