import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Menu, X, ChevronRight, Bell, Search, User } from "lucide-react";

import SideNav from "./SideNav";
import Users from "./Users";
import useFetch from "../../../hooks/useFetch";
import AdminContinent from "./AdminContinent";
import AdminCountry from "./AdminCountry";
import AdminState from "./AdminState/AdminState";
import AdminPackage from "./AdminPackage/AdminPackage";
import Loader from "../Loader";
import AdminHotel from "./AdminHotel/AdminHotel";
import AdminContactEnquiry from "./AdminContactEnquiry/AdminContactEnquiry";
import AdminBookings from "./AdminBookings/AdminBookings";

function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selection, setSelection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const verifyToken = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/login");
        return;
      }
      const decodedToken = jwtDecode(userInfo.token);
      if (decodedToken && decodedToken.isAdmin) {
        setIsAdmin(true);
      } else {
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleClick = (name) => {
    setSelection(name);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data, loading, error } = useFetch(
    "https://trippo-bazzar-backend.vercel.app/api/users"
  );

  if (!isAdmin || loading === true) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen font-poppins bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        } bg-white shadow-lg transition-all duration-300 z-20 h-screen overflow-hidden`}
      >
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">
                T
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-800">Trippo</h1>
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}

        <SideNav
          handleClick={handleClick}
          sidebarOpen={sidebarOpen}
          currentSelection={selection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>

              <div className="ml-4 flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="ml-2 text-gray-600 capitalize">
                  {selection}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/adminpanel/users" replace />}
            />
            <Route path="users" element={<Users data={data} />} />
            <Route path="continent" element={<AdminContinent />} />
            <Route path="country" element={<AdminCountry />} />
            <Route path="state" element={<AdminState />} />
            <Route path="package" element={<AdminPackage />} />
            <Route path="hotels" element={<AdminHotel />} />
            <Route path="contact-enquiry" element={<AdminContactEnquiry />} />
            <Route path="booking-details" element={<AdminBookings />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
