"use client";

import React, { useState, useMemo } from "react";
import { Users, History, Filter, Download, ArrowUpRight, ArrowUpCircle, Info, RefreshCw, Eye } from "lucide-react";
import { DetectorRecord } from "@/lib/sample-data";

interface DashboardViewProps {
  records: DetectorRecord[];
  onRefresh: () => void;
  onOpenUpload: () => void;
}

export function DashboardView({ records, onRefresh, onOpenUpload }: DashboardViewProps) {
  // Local filters states
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Derive unique countries from current records to populate country selector dynamically
  const availableCountries = useMemo(() => {
    const list = records.map((r) => r.country);
    return Array.from(new Set(list));
  }, [records]);

  // Handle dynamic stats counting
  const stats = useMemo(() => {
    const baseTotal = 12480 + records.length;
    const baseNew = 3841 + records.filter((r) => r.status === "New").length;
    const baseReturning = 8639 + records.filter((r) => r.status === "Returning").length;

    return {
      total: baseTotal.toLocaleString(),
      newVal: baseNew.toLocaleString(),
      returning: baseReturning.toLocaleString(),
    };
  }, [records]);

  // Match records against selections (All status, gender, country, local search query string)
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Status filter
      if (selectedStatus && item.status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      // Gender filter
      if (selectedGender && item.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }
      // Country filter
      if (selectedCountry && item.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }
      // Search keywords match
      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const combined = `${item.id} ${item.city} ${item.country} ${item.reason} ${item.gender}`.toLowerCase();
        if (!combined.includes(query)) return false;
      }
      return true;
    });
  }, [records, selectedStatus, selectedGender, selectedCountry, localSearch]);

  // Paginated elements
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));

  // Export actual filtered dataset as a downloadable CSV table!
  const handleExportCSV = () => {
    try {
      const headers = ["ID", "Status", "Gender", "Age", "Country", "City", "Reason", "Timestamp"].join(",");
      const rows = filteredRecords.map((item) => {
        return [
          item.id,
          item.status,
          item.gender,
          item.age,
          `"${item.country.replace(/"/g, '""')}"`,
          `"${item.city.replace(/"/g, '""')}"`,
          `"${item.reason.replace(/"/g, '""')}"`,
          item.timestamp,
        ].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `RLabs_visitor_detections_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with title & global control relays */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2b1613] tracking-tight">Overview</h1>
          <p className="text-xs text-[#603e39]/80 mt-1 font-medium italic">
            Real-time visitor analytics and edge recognition telemetry feed.
          </p>
        </div>

        {/* Dashboard actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#ebbbb4] rounded-lg text-xs font-semibold text-[#2b1613] hover:bg-[#fff0ee] transition-all bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5e5e5e] hover:rotate-180 transition-transform duration-500" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#bc0100] text-white rounded-lg hover:bg-[#2b1613] hover:shadow-sm transition-all text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 rotate-180" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Visitors */}
        <div className="bg-white rounded-xl p-5 border border-[#ebbbb4]/60 shadow-[0px_4px_20px_rgba(43,22,19,0.02)] relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-bold text-[#603e39] uppercase tracking-wider">Total Visitors</h3>
            <div className="w-8 h-8 rounded-lg bg-[#fff8f6] flex items-center justify-center border border-[#ebbbb4]/40">
              <Users className="w-4 h-4 text-[#bc0100]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#2b1613]">{stats.total}</span>
            <span className="text-[10px] text-[#0059ba] font-bold font-mono flex items-center gap-0.5 bg-[#d7e2ff] px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 8.2%
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#ebbbb4]/10 rounded-full blur-xl group-hover:bg-[#ebbbb4]/25 transition-all"></div>
        </div>

        {/* New Visitors (Alert focused style) */}
        <div className="bg-[#fff8f6] rounded-xl p-5 border border-[#bc0100]/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-bold text-[#bc0100] uppercase tracking-wider">New Visitors</h3>
            <div className="w-8 h-8 rounded-lg bg-[#ffdad4] flex items-center justify-center border border-[#bc0100]/20">
              <ArrowUpCircle className="w-4 h-4 text-[#bc0100]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#bc0100]">{stats.newVal}</span>
            <span className="text-[10px] text-red-700 font-bold font-mono flex items-center gap-0.5 bg-[#ffdad4] px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 12.5%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#bc0100]/20 to-transparent"></div>
        </div>

        {/* Returning Visitors */}
        <div className="bg-white rounded-xl p-5 border border-[#ebbbb4]/60 shadow-[0px_4px_20px_rgba(43,22,19,0.02)] relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-bold text-[#603e39] uppercase tracking-wider">Returning Visitors</h3>
            <div className="w-8 h-8 rounded-lg bg-[#fff8f6] flex items-center justify-center border border-[#ebbbb4]/40">
              <History className="w-4 h-4 text-[#5e5e5e]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#2b1613]">{stats.returning}</span>
            <span className="text-[10px] text-[#0059ba] font-bold font-mono flex items-center gap-0.5 bg-[#d7e2ff] px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 4.1%
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#ebbbb4]/10 rounded-full blur-xl group-hover:bg-[#ebbbb4]/25 transition-all"></div>
        </div>

      </div>

      {/* Filter and controls row */}
      <div className="bg-white rounded-xl p-3 border border-[#ebbbb4]/60 flex flex-wrap gap-3 items-center shadow-sm">
        
        {/* Local Table Search field */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5e5e] text-sm" />
          <input
            type="text"
            placeholder="Search within result dataset..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#fff8f6] border border-[#ebbbb4]/60 rounded-lg px-4.5 py-2 text-xs text-[#2b1613] outline-none placeholder-[#603e39]/60 focus:border-[#bc0100] transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none bg-[#fff8f6] border border-[#ebbbb4]/65 px-3 py-2 text-xs text-[#2b1613] rounded-lg outline-none cursor-pointer focus:border-[#bc0100] transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Returning">Returning</option>
          </select>
        </div>

        {/* Gender Dropdown */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none bg-[#fff8f6] border border-[#ebbbb4]/65 px-3 py-2 text-xs text-[#2b1613] rounded-lg outline-none cursor-pointer focus:border-[#bc0100] transition-colors"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Country Dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none bg-[#fff8f6] border border-[#ebbbb4]/65 px-3 py-2 text-xs text-[#2b1613] rounded-lg outline-none cursor-pointer focus:border-[#bc0100] transition-colors"
          >
            <option value="">All Countries</option>
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Visitor telemetry table */}
      <div className="bg-white rounded-xl border border-[#ebbbb4]/60 shadow-[0px_4px_20px_rgba(43,22,19,0.01)] flex flex-col overflow-hidden">
        
        {/* Table Title and Actions */}
        <div className="px-6 py-4.5 border-b border-[#ebbbb4]/60 bg-[#fff8f6] flex justify-between items-center">
          <h2 className="text-xs font-bold text-[#2b1613] uppercase tracking-wider">Recent visitor detections</h2>
          <button
            onClick={handleExportCSV}
            title="Export filtered records to CSV file"
            className="text-[#5e5e5e] hover:text-[#bc0100] flex items-center gap-1.5 text-xs font-semibold select-none transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Scannable area for tables */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#fff0ee] border-b border-[#ebbbb4]/50">
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider">Visitor ID</th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider">Demographics</th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider">Detected Location</th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider">Check-in Reason</th>
                <th className="px-6 py-3.5 text-xs font-bold text-[#603e39] uppercase tracking-wider text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebbbb4]/30">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => {
                  const isNew = rec.status === "New";
                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-[#fff8f6]/70 transition-colors duration-100 group text-xs text-[#2b1613]"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-mono font-semibold text-gray-500">{rec.id}</td>
                      
                      {/* Status pill badge with beautiful contrast */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${
                            isNew
                              ? "bg-[#ffdad4] text-[#bc0100] border-[#ebbbb4]"
                              : "bg-[#e2e2e2] text-[#474747] border-gray-300"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isNew ? "bg-[#bc0100]" : "bg-gray-500"}`} />
                          {rec.status}
                        </span>
                      </td>

                      {/* Demographics with Lucide indicator */}
                      <td className="px-6 py-4 font-medium">
                        {rec.gender}, {rec.age}
                      </td>

                      {/* Location with city and country nested layout */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#2b1613]">{rec.city}</span>
                          <span className="text-[10px] text-[#603e39] font-medium font-mono">{rec.country}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 text-[#2b1613] font-medium">{rec.reason}</td>

                      {/* Timestamp */}
                      <td className="px-6 py-4 text-right text-gray-500 font-mono text-[11px] font-medium whitespace-nowrap">
                        {rec.timestamp}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#603e39] font-medium bg-[#fff8f6]/10">
                    <Info className="w-5 h-5 mx-auto mb-2 text-[#5e5e5e]" />
                    No visitor records found matching the active search filters or filters setup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        <div className="p-4 border-t border-[#ebbbb4]/60 flex justify-between items-center bg-[#fff8f6]/50">
          <span className="text-xs text-[#603e39] font-medium">
            Showing <strong className="text-[#2b1613]">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
            <strong className="text-[#2b1613]">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> of{" "}
            <strong className="text-[#2b1613]">{filteredRecords.length}</strong> detections
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-[#ebbbb4] rounded text-xs text-[#2b1613] hover:bg-[#fff0ee] transition-all bg-white disabled:opacity-40 disabled:cursor-not-allowed select-none font-bold"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 border border-[#ebbbb4] rounded text-xs text-[#2b1613] hover:bg-[#fff0ee] transition-all bg-white disabled:opacity-40 disabled:cursor-not-allowed select-none font-bold"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
