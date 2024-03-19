import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export function HomeForm() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Set the number of users per page to 10
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
      console.log(response);
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

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:bg-opacity-50"
                />
                <label htmlFor="checkbox-all-search" className="ml-2">
                  Select All
                </label>
              </div>
            </th>
            <th scope="col" className="px-4 py-3">
              Customer ID
            </th>
            <th scope="col" className="px-4 py-3">
              First Name
            </th>
            <th scope="col" className="px-4 py-3">
              Last Name
            </th>
            <th scope="col" className="px-4 py-3">
              Phone Number 1
            </th>
            <th scope="col" className="px-4 py-3">
              Phone Number 2
            </th>
            <th scope="col" className="px-4 py-3">
              Gender
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          {currentUsers.map((user) => (
            <tr key={user.customerId}>
              <td className="p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2"
                />
              </td>
              <td className="px-4 py-3">{user.customerId}</td>
              <td className="px-4 py-3">{user.firstName}</td>
              <td className="px-4 py-3">{user.lastName}</td>
              <td className="px-4 py-3">{user.phoneNumbers1}</td>
              <td className="px-4 py-3">{user.phoneNumbers2}</td>
              <td className="px-4 py-3">{user.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <nav
        className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showing {indexOfFirstUser + 1} to {indexOfLastUser} of{" "}
            {searchQuery ? searchResults.length : users.length} results
          </p>
        </div>
        <div className="flex justify-between flex-1 sm:justify-end">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`${
                  pageNumber === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 dark:text-gray-400"
                } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:text-gray-400 text-sm font-medium`}
              >
                {pageNumber}
              </button>
            ))}
          </nav>
        </div>
      </nav>
    </div>
  );
}