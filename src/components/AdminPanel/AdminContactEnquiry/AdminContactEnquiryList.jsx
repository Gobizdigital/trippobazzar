import React, { useState } from "react";
import ConfirmationModal from "../../ConfirmationModal";

export default function AdminContactEnquiryList({ data, handleEdit,deleteById }) {
  const [openEnquiryId, setOpenEnquiryId] = useState(null);
  const [modal, setModal] = useState(null);

  const toggleAccordion = (id) => {
    setOpenEnquiryId(openEnquiryId === id ? null : id);
  };

  const handleDelete = (id, data) => {
    setModal({
      message: `Are you sure you want to delete ${data?.contactName}'s enquiry?`,
      onConfirm: () => {
        deleteById(id); // Perform delete operation
        setModal(null); // Close modal
        handleEdit("View");
      },
      onCancel: () => setModal(null), // Close modal
    });
  };
  return (
    <>
      {modal && (
        <ConfirmationModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}{" "}
      <ul className="space-y-6">
        {data?.map((enquiry) => (
          <li
            key={enquiry._id}
            onClick={() => toggleAccordion(enquiry._id)} // Toggle the accordion on list item click
            className="border border-med-green rounded-lg p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 transform cursor-pointer"
          >
            <div className="flex justify-between items-center w-full">
              <h3 className="text-xl font-semibold text-med-green mb-4">
                {enquiry?.contactName || "No Name Available"}
              </h3>

              {enquiry?.contactReason && (
                <p className="text-sm text-med-green">
                  <strong>Reason:</strong> {enquiry?.contactReason}
                </p>
              )}
            </div>

            {/* Accordion Panel */}
            <div
              className={`overflow-hidden transition-all flex flex-col gap-2 duration-500 ease-in-out ${
                openEnquiryId === enquiry._id ? "max-h-screen" : "max-h-0"
              }`}
            >
              {enquiry?.contactPhoneNumber && (
                <p className="text-sm text-med-green">
                  <strong>Phone Number:</strong> {enquiry?.contactPhoneNumber}
                </p>
              )}

              {enquiry?.contactEmail && (
                <p className="text-sm text-med-green">
                  <strong>Email:</strong> {enquiry?.contactEmail}
                </p>
              )}
              {enquiry?.contactDescription && (
                <p className="text-sm text-med-green">
                  <strong>Description:</strong> {enquiry?.contactDescription}
                </p>
              )}

              {enquiry?.contactMePhoneNumber && (
                <p className="text-sm text-med-green">
                  <strong>Contact Me by Phone:</strong>{" "}
                  {enquiry?.contactMePhoneNumber ? "Yes" : "No"}
                </p>
              )}

              {enquiry?.contactDate && (
                <p className="text-sm text-med-green">
                  <strong>Date:</strong>{" "}
                  {new Date(enquiry.contactDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    handleDelete(enquiry._id, enquiry); // Call the handleEdit function
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
