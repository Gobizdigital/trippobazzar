import React, { useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import AdminContactEnquiryList from "./AdminContactEnquiryList";
import EditContactEnquiryList from "./EditContactEnquiryList";

export default function AdminContactEnquiry() {
  const initialFormData = {
    contactName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    contactReason: "Support Assistance",
    contactDescription: "",
    contactMePhoneNumber: false,
  };
  const baseUrl = "https://trippo-bazzar-backend.vercel.app/api/contact";
  const [formData, setFormData] = useState(initialFormData);
  const { data, updateById, deleteById } = useApiData(baseUrl);
  const [editData, setEditData] = useState({ type: "View", id: null });

  const [filter, setFilter] = useState({
    filterBy: "All",
    month: new Date().getMonth() + 1, // Default to current month
    year: new Date().getFullYear(),
    currentYear: 2025,
    contactReason: "",
  });

  const filteredData = data.filter((property) => {
    const matchesType =
      filter.contactReason === "" ||
      property?.contactReason === filter.contactReason;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to 00:00:00

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date
    yesterday.setHours(0, 0, 0, 0); // Normalize yesterday's date to 00:00:00

    const propertyDate = new Date(property?.["Date&Time"]);
    propertyDate.setHours(0, 0, 0, 0); // Normalize the property date to 00:00:00

    const isToday =
      propertyDate.getFullYear() === today.getFullYear() &&
      propertyDate.getMonth() === today.getMonth() &&
      propertyDate.getDate() === today.getDate();

    const isYesterday =
      propertyDate.getFullYear() === yesterday.getFullYear() &&
      propertyDate.getMonth() === yesterday.getMonth() &&
      propertyDate.getDate() === yesterday.getDate();

    const matchesDate =
      filter.filterBy === "Today"
        ? isToday // Show only today's entries
        : filter.filterBy === "Yesterday"
        ? isYesterday // Show only yesterday's entries
        : filter.filterBy === "All" // Show all entries if 'All' filter is selected
        ? true
        : filter.year && !filter.month // Show entries for the selected year, all months
        ? propertyDate.getFullYear() === Number(filter.year)
        : filter.month && filter.year // Show entries for selected month/year
        ? propertyDate >= new Date(filter.year, filter.month - 1, 1) &&
          propertyDate <= new Date(filter.year, filter.month, 0)
        : true;
    return matchesType && matchesDate;
  });

  const handleEdit = (type, id) => {
    const selectedEnquiry = data.find((enquiry) => enquiry._id === id); // Find the selected enquiry by ID

    if (selectedEnquiry) {
      // Set form data with selected enquiry's values, using initialFormData as a template
      setFormData({
        contactName: selectedEnquiry.contactName || initialFormData.contactName,
        contactEmail:
          selectedEnquiry.contactEmail || initialFormData.contactEmail,
        contactPhoneNumber:
          selectedEnquiry.contactPhoneNumber ||
          initialFormData.contactPhoneNumber,
        contactReason:
          selectedEnquiry.contactReason || initialFormData.contactReason,
        contactDescription:
          selectedEnquiry.contactDescription ||
          initialFormData.contactDescription,
        contactMePhoneNumber:
          selectedEnquiry.contactMePhoneNumber ||
          initialFormData.contactMePhoneNumber,
      });
    }

    // Update the editData state with the selected type and id
    setEditData({ type, id });
  };

  if (!data) {
    return (
      <p className="text-white text-center text-3xl mt-5 mx-auto p-4">
        Loading....
      </p>
    );
  }
  return (
    <>
      <div>
        <div className="flex justify-between w-full ">
          {" "}
          <p className="text-xl font-semibold uppercase  text-med-green">
            View Enquiries
          </p>
          <div className="mb-6">
            <div className="flex justify-between  gap-4">
              <button
                className={`border  py-1  ${
                    filter.filterBy === "Today" && "bg-med-green text-white"
                  } px-4 rounded`}
                onClick={() =>
                  setFilter((prevFilter) => ({
                    ...prevFilter,
                    filterBy: prevFilter.filterBy === "Today" ? "" : "Today", // Toggle between today and no filter
                  }))
                }
              >
                Today's
              </button>
              <button
            className={`border  py-1  ${
                filter.filterBy === "Yesterday" && "bg-med-green text-white"
              } px-4 rounded`}
                onClick={() =>
                  setFilter((prevFilter) => ({
                    ...prevFilter,
                    filterBy:
                      prevFilter.filterBy === "Yesterday" ? "" : "Yesterday", // Toggle between today and no filter
                  }))
                }
              >
                Yesterday's
              </button>
              <button
                className={`border  py-1  ${
                  filter.filterBy === "All" && "bg-med-green text-white"
                } px-4 rounded`}
                onClick={() =>
                  setFilter((prevFilter) => ({
                    ...prevFilter,
                    filterBy: prevFilter.filterBy === "All" ? "" : "All", // Toggle between today and no filter
                  }))
                }
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>
      {editData.type === "View" && (
        <AdminContactEnquiryList
          handleEdit={handleEdit}
          data={filteredData}
          deleteById={deleteById}
        />
      )}
      {editData.type === "Edit" && (
        <EditContactEnquiryList
          updateById={updateById}
          handleEdit={handleEdit}
          setFormData={setFormData}
          formData={formData}
          editData={editData}
          deleteById={deleteById}
        />
      )}
    </>
  );
}
