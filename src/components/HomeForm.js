import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export function HomeForm() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Set the number of users per page to 10
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    searchUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      const response = await axios.get("https://sc-mfi.onrender.com/api/v1/customers");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { id } = useParams();
  const loadUser = async () => {
    try {
      const response = await axios.get(`https://sc-mfi.onrender.com/api/v1/customers/${id}`);
  //  const response = await axios.get(`http://localhost:8080/api/v1/customers/${id}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchUsers = () => {
    const results = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchQuery
    ? searchResults
    : users.slice(indexOfFirstUser, indexOfLastUser);

  // Generate page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil((searchQuery ? searchResults.length : users.length) / usersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownload = () => {
    // Logic to handle the download of the grid data
    let dataToDownload = [];

    if (searchQuery && searchResults.length > 0) {
      dataToDownload = searchResults.map((user) => ({
        customerId: user.customerId,
        firstName: user.firstName,
        lastName: user.lastName,
        firstNameInKhmer: user.firstNameInKhmer,
        lastNameInKhmer: user.lastNameInKhmer,
        phoneNumbers1: user.phoneNumbers1,
        phoneNumbers2: user.phoneNumbers2,
        gender: user.gender,
      }));
    } else {
      dataToDownload = currentUsers.map((user) => ({
        customerId: user.customerId,
        firstName: user.firstName,
        lastName: user.lastName,
        firstNameInKhmer: user.firstNameInKhmer,
        lastNameInKhmer: user.lastNameInKhmer,
        phoneNumbers1: user.phoneNumbers1,
        phoneNumbers2: user.phoneNumbers2,
        gender: user.gender,
      }));
    }

    if (dataToDownload.length === 0) {
      // Handle the case where there is no data to download
      alert("No data to download");
      return;
    }

    // Convert the data to CSV format
    const csvData = convertToCSV(dataToDownload);

    // Create a download link
    const link = document.createElement("a");
    link.href = encodeURI(`data:text/csv;charset=utf-8,${csvData}`);
    link.download = "users.csv";
    link.click();
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const csvRows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    return `${headers}\n${csvRows.join("\n")}`;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    loadUser();
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by first name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-right bg-white">
        <thead>
          <tr>
            <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600">First Name</th>
            <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600">Last Name</th>
            <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600">Phone Number</th>
            <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600">Phone Number1</th>
            <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 border-b border-gray-200">{user.firstName}</td>
              <td className="px-4 py-3 border-b border-gray-200">{user.lastName}</td>
              <td className="px-4 py-3 border-b border-gray-200">{user.phoneNumbers1}</td>
              <td className="px-4 py-3 border-b border-gray-200">{user.phoneNumbers2}</td>
              <td className="px-4 py-3 border-b border-gray-200">
                {/* <button
                  className="text-blue-500 hover:text-blue-700 underline"
                  onClick={() => handleViewDetails(user.id)}
                >
                  View Details
                </button> */}
                                  <Link
                    className="btn btn-primary mr-2"
                    to={`/users/${user.id}`}
                  >
                    View
                  </Link> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
          </p>
        </div>
        <div>
          <nav className="flex items-center justify-center">
            <ul className="flex items-center">
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    className={`${
                      currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                    } hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md mx-1`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
          onClick={handleDownload}
        >
          Download CSV
        </button>
      </div>
      {selectedUser && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-2">User Details</h2>
            <p>
              <span className="font-bold">First Name:</span> {selectedUser.firstName}
            </p>
            <p>
              <span className="font-bold">Last Name:</span> {selectedUser.lastName}
            </p>
            <p>
              <span className="font-bold">Phone Number:</span> {selectedUser.phoneNumber}
            </p>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-700 underline mt-4"
              onClick={() => setSelectedUser(null)}
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}