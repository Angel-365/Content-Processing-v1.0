"use client";

import React, { useState, useMemo } from "react";
import { Users, Search, Plus, MapPin, Tag, ArrowRight, IdCard, ShieldCheck, Mail, Printer, X } from "lucide-react";
import { DetectorRecord } from "@/lib/sample-data";

interface VisitorsViewProps {
  records: DetectorRecord[];
  onOpenRegisterModal: () => void;
}

export function VisitorsView({ records, onOpenRegisterModal }: VisitorsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<DetectorRecord | null>(null);

  // Search filter matching
  const filteredVisitors = useMemo(() => {
    return records.filter((rec) => {
      if (statusFilter && rec.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const combined = `${rec.id} ${rec.city} ${rec.country} ${rec.reason} ${rec.gender}`.toLowerCase();
        if (!combined.includes(query)) return false;
      }
      return true;
    });
  }, [records, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2b1613] tracking-tight">Visitor Directory</h1>
          <p className="text-xs text-[#603e39]/80 mt-1 font-medium italic">
            Manage, verify permissions, and review guest authorization history.
          </p>
        </div>
        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#bc0100] text-white rounded-lg hover:bg-[#2b1613] transition-all text-xs font-semibold focus:ring-2 focus:ring-red-200"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Visitor</span>
        </button>
      </div>

      {/* Main Grid: Directory is on the left, active selected guest physical pass simulation is on the right! */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Guest Directory Grid (Column spans 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls bar */}
          <div className="bg-white rounded-xl p-3 border border-[#ebbbb4]/60 flex gap-3 shadow-sm select-none">
            <div className="relative flex-1">
              <Search className="w-4.5 h-4.5 text-[#5e5e5e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, city, reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#fff8f6] border border-[#ebbbb4]/60 rounded-lg pl-10 pr-4 py-2 text-xs text-[#2b1613] outline-none placeholder-[#603e39]/50 focus:border-[#bc0100] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#fff8f6] border border-[#ebbbb4]/65 px-3 py-2 text-xs text-[#2b1613] rounded-lg outline-none cursor-pointer focus:border-[#bc0100] transition-colors min-w-[130px]"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Returning">Returning</option>
            </select>
          </div>

          {/* Directory Listings cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVisitors.map((guest) => {
              const isSelected = selectedVisitor?.id === guest.id;
              return (
                <div
                  key={guest.id}
                  onClick={() => setSelectedVisitor(guest)}
                  className={`bg-white border rounded-xl p-4.5 cursor-pointer hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? "border-[#bc0100] ring-1 ring-[#bc0100] bg-[#fff8f6]/50" : "border-[#ebbbb4]/60"
                  }`}
                >
                  <div>
                    {/* Badge identifier & guest status */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-[10px] font-bold text-gray-400 group-hover:text-gray-600 block">
                        {guest.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          guest.status === "New"
                            ? "bg-[#ffdad4] text-[#bc0100] border-[#ebbbb4]"
                            : "bg-[#e2e2e2] text-[#474747] border-gray-300"
                        }`}
                      >
                        {guest.status}
                      </span>
                    </div>

                    {/* Guest primary characteristics fields */}
                    <h3 className="text-xs font-bold text-[#2b1613] flex items-center gap-1.5">
                      {guest.gender}, {guest.age} years
                    </h3>

                    {/* Location specs */}
                    <p className="text-[10px] text-[#603e39] font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#bc0100] flex-shrink-0" />
                      <span>{guest.city}, {guest.country}</span>
                    </p>

                    <p className="text-[10px] text-gray-500 font-medium mt-3 leading-relaxed border-t border-dashed border-[#ebbbb4]/30 pt-2 italic">
                      {guest.reason}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-mono font-medium border-t border-gray-100 pt-3.5 select-none">
                    <span>Active Detections</span>
                    <button className="flex items-center gap-0.5 text-[#bc0100] font-bold hover:underline">
                      <span>View Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Preview Panel: High-fidelity biometric identification card pass */}
        <div className="lg:col-span-1">
          {selectedVisitor ? (
            <div className="bg-white border border-[#ebbbb4] rounded-xl overflow-hidden shadow-md space-y-5 animate-fade-in relative max-w-sm mx-auto select-none">
              
              {/* Pass identifier header */}
              <div className="bg-[#bc0100] p-4.5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[11px] font-mono tracking-widest uppercase font-bold">SECURE ACCREDITATION</span>
                </div>
                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="text-white/80 hover:text-white"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Portrait container block */}
              <div className="px-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#ffdad4] rounded-full border-4 border-[#fff0ee] flex items-center justify-center p-1.5 shadow mb-3 relative">
                  <IdCard className="w-12 h-12 text-[#bc0100]" />
                  <div className="absolute bottom-1 right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white" />
                </div>

                <div className="font-mono text-[10px] font-bold text-[#bc0100] uppercase tracking-widest bg-[#fff0ee] px-2.5 py-0.5 rounded border border-[#ebbbb4]/50">
                  {selectedVisitor.id}
                </div>

                <h2 className="text-sm font-bold text-[#2b1613] mt-3">
                  {selectedVisitor.gender === "Male" ? "MR." : "MS."} GUEST AUTHORIZED
                </h2>
                <div className="text-[10px] text-[#603e39] font-bold mt-1 uppercase font-mono tracking-wider">
                  {selectedVisitor.gender}, {selectedVisitor.age} Years Old
                </div>

                {/* QR simulation code block */}
                <div className="w-28 h-28 my-4.5 border border-dashed border-[#ebbbb4] p-2 rounded bg-white flex flex-col items-center justify-center">
                  {/* Decorative pixel pattern for QR mock */}
                  <div className="grid grid-cols-4 gap-2 opacity-80">
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                    <div className="w-4 h-4 bg-transparent" />
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                    <div className="w-4 h-4 bg-[#bc0100] rounded-xs" />
                    <div className="w-4 h-4 bg-[#bc0100] rounded-xs" />
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                    <div className="w-4 h-4 bg-transparent" />
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                    <div className="w-4 h-4 bg-transparent" />
                    <div className="w-4 h-4 bg-[#bc0100]" />
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                    <div className="w-4 h-4 bg-[#2b1613] rounded-xs" />
                  </div>
                  <span className="text-[7px] text-[#603e39] font-mono mt-3.5 font-bold uppercase tracking-widest leading-none">
                    VERIFIED REGISTRY
                  </span>
                </div>

                {/* Specific details */}
                <div className="w-full text-left bg-[#fff8f6] p-4 rounded-lg border border-[#ebbbb4]/40 text-xs">
                  <div className="flex justify-between border-b border-[#ebbbb4]/30 pb-1.5 mb-1.5">
                    <span className="font-semibold text-[#603e39]">Assigned City:</span>
                    <span className="font-bold text-[#2b1613] font-mono">{selectedVisitor.city}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#ebbbb4]/30 pb-1.5 mb-1.5">
                    <span className="font-semibold text-[#603e39]">Assigned Country:</span>
                    <span className="font-bold text-[#2b1613] font-mono">{selectedVisitor.country}</span>
                  </div>
                  <div className="flex flex-col text-[#2b1613]">
                    <span className="font-semibold text-[#603e39] mr-1 block text-[10px]">Reason:</span>
                    <span className="font-medium text-[11px] leading-relaxed italic mt-0.5">{selectedVisitor.reason}</span>
                  </div>
                </div>
              </div>

              {/* Print command action footer button */}
              <div className="p-4 border-t border-[#ebbbb4]/40 bg-[#fff0ee] flex gap-2">
                <button
                  onClick={() => alert("Simulation pass printed successfully on device relays!")}
                  className="w-full bg-[#2b1613] hover:bg-[#bc0100] text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Visitor Pass</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#fff8f6] border border-dashed border-[#ebbbb4] rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <IdCard className="w-12 h-12 text-[#5e5e5e] mb-4 stroke-2" />
              <h3 className="text-xs font-bold text-[#2b1613] uppercase tracking-wider">No Pass Selected</h3>
              <p className="text-[11px] text-[#603e39] mt-2 mb-4 leading-relaxed font-semibold font-sans">
                Click &quot;View Pass&quot; or pick a visitor from the directory dataset cards to load their dynamic credentials badge and securely print indices.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
