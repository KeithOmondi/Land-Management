// pages/SearchLand.jsx
import React, { useState } from "react";

const mockParcels = [
  {
    id: "LR00123",
    titleDeed: "TD-KE-9482-01",
    location: "Kajiado",
    owner: "John Kamau",
    size: 5.2,
    status: "Active",
  },
  {
    id: "LR00124",
    titleDeed: "TD-KE-9483-02",
    location: "Nakuru",
    owner: "Mary Atieno",
    size: 3.7,
    status: "Active",
  },
  {
    id: "LR00125",
    titleDeed: "TD-KE-9484-03",
    location: "Machakos",
    owner: "Peter Njoroge",
    size: 2.0,
    status: "Inactive",
  },
];

export default function SearchLand() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = mockParcels.filter(
      (p) =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Search Land Parcels</h1>

      <div className="bg-white p-4 rounded shadow mb-6 max-w-2xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by LR Number or Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Parcel ID</th>
                <th className="px-6 py-3">Title Deed</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Size (Ha)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">{p.titleDeed}</td>
                  <td className="px-6 py-4">{p.location}</td>
                  <td className="px-6 py-4">{p.owner}</td>
                  <td className="px-6 py-4">{p.size}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No results yet. Try searching above.</p>
      )}
    </div>
  );
}
