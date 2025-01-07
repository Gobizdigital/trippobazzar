import axios from "axios";
import { useState } from "react";

const Users = ({ data }) => {
  const [users, setUsers] = useState(data);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});

  const deleteUser = async (id) => {
    setUsers(users.filter((user) => user._id !== id)); // Use _id to match the correct user
    try {
      await axios.delete(
        `https://tripobazar-backend.vercel.app/api/users/${id}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id); // Set the user id to mark as editing
    setEditedDetails({ ...user }); // Set the user details for editing
  };

  const saveUser = async () => {
    setUsers(
      users.map((user) =>
        user._id === editingUserId ? { ...user, ...editedDetails } : user
      )
    );

    try {
      await axios.put(
        `https://tripobazar-backend.vercel.app/api/users/${editingUserId}`,
        editedDetails
      );
    } catch (error) {
      console.log(error);
    }
    setEditingUserId(null); // Stop editing
  };


  return (
    <div className="mr-1 p-6">
      <div className="mb-6">
        <p className="text-green-600 font-poppins font-bold">
          Total Users: {users?.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-left">Sr.</th>
              <th className="border border-gray-200 p-2 text-left">Name</th>
              <th className="border border-gray-200 p-2 text-left">Email</th>
              <th className="border border-gray-200 p-2 text-left">Phone</th>
              <th className="border border-gray-200 p-2 text-left">IsAdmin</th>
              <th className="border border-gray-200 p-2 text-left">D.O.B</th>
              <th className="border border-gray-200 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, idx) => {
              return (
                <tr key={user._id} className="border-b border-gray-200">
                  {editingUserId === user._id ? (
                    <>
                      <td className="border border-gray-200 p-2">{idx}</td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="text"
                          value={editedDetails.FullName || ""}
                          onChange={(e) =>
                            setEditedDetails({
                              ...editedDetails,
                              FullName: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="email"
                          value={editedDetails.Email || ""}
                          onChange={(e) =>
                            setEditedDetails({
                              ...editedDetails,
                              Email: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="text"
                          value={editedDetails.MobileNumber || ""}
                          onChange={(e) =>
                            setEditedDetails({
                              ...editedDetails,
                              MobileNumber: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <select
                          value={editedDetails.isAdmin || false}
                          onChange={(e) =>
                            setEditedDetails({
                              ...editedDetails,
                              isAdmin: e.target.value === "true",
                            })
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value={true}>True</option>
                          <option value={false}>False</option>
                        </select>
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input
                          type="date"
                          value={editedDetails.DateOfBirth || ""}
                          onChange={(e) =>
                            setEditedDetails({
                              ...editedDetails,
                              DateOfBirth: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <button
                          className="text-green-400 px-3 py-1 rounded mr-2"
                          onClick={saveUser}
                        >
                          Save
                        </button>
                        <button
                          className="text-red-400 px-3 py-1 rounded"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-200 p-2">{idx + 1}</td>
                      <td className="border border-gray-200 p-2">
                        {user.FullName}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.Email}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.MobileNumber}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.isAdmin ? "True" : "False"}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.DateOfBirth}
                      </td>
                      <td className="border border-gray-200 p-2">
                        <button
                          className="text-green-400 px-3 py-1 rounded mr-2"
                          onClick={() => startEditing(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 px-3 py-1 rounded"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
