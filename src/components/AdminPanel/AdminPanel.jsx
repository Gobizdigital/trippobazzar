import React, { useEffect, useState } from "react";

import SideNav from "./SideNav";
import { Route, Routes, useNavigate } from "react-router-dom";
import Users from "./Users";
import { jwtDecode } from "jwt-decode";

import useFetch from "../../../hooks/useFetch";
import AdminContinent from "./AdminContinent";
import AdminCountry from "./AdminCountry";
import AdminState from "./AdminState/AdminState";
import AdminPackage from "./AdminPackage/AdminPackage";
import Loader from "../Loader";
import AdminHotel from "./AdminHotel/AdminHotel";


function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selection, setSelection] = useState("users");

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

  const { data, loading, error } = useFetch(
    "https://tripobazar-backend.vercel.app/api/users"
  );

  if (!isAdmin || loading === true) {
    return <Loader/>;
  }

  return (
    <div className="flex h-auto font-poppins bg-[#F8F8F8]">
      <SideNav handleClick={handleClick} />
      <div className="flex-1  p-6">
        <Routes>
          <Route path="users" element={<Users data={data} />} />
          <Route path="continent" element={<AdminContinent />} />
          <Route path="country" element={<AdminCountry />} />
          <Route path="state" element={<AdminState />} />
          <Route path="package" element={<AdminPackage />} />
          <Route path="hotels" element={<AdminHotel />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default AdminPanel;
