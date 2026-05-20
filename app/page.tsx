"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { DashboardView } from "@/components/DashboardView";
import { UploadView } from "@/components/UploadView";
import { VisitorsView } from "@/components/VisitorsView";
import { SupportScreen } from "@/components/SupportScreen";
import { AccountScreen } from "@/components/AccountScreen";
import { RegisterModal } from "@/components/RegisterModal";
import { INITIAL_DETECTION_RECORDS, DetectorRecord } from "@/lib/sample-data";
import { ShieldCheck, Info, X, Zap, RefreshCw } from "lucide-react";

export default function Page() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [records, setRecords] = useState<DetectorRecord[]>(INITIAL_DETECTION_RECORDS);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick toast notification trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Handler for manual and AI-driven visitor badge registrations
  const handleAddDetection = (rec: Omit<DetectorRecord, "id" | "timestamp">) => {
    const nextIdNum = Math.floor(1000 + Math.random() * 9000);
    const newRecord: DetectorRecord = {
      ...rec,
      id: `#V-${nextIdNum}`,
      timestamp: "Just now",
    };

    setRecords((prev) => [newRecord, ...prev]);
    triggerToast(`Visitor identification complete. Registered ID ${newRecord.id}!`);
  };

  // Simulated node refresh
  const handleRefresh = async () => {
    triggerToast("Starting edge data relays query...");
    await new Promise((res) => setTimeout(res, 600));
    setRecords((prev) => {
      // shuffle existing a bit or simulate refreshing timestamps
      return prev.map((item) => {
        if (item.timestamp === "Just now") {
          return { ...item, timestamp: "1 min ago" };
        }
        return item;
      });
    });
    triggerToast("Edge telemetry matrices synchronized successfully!");
  };

  // Synchronise global search with child components
  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    if (currentTab !== "dashboard" && currentTab !== "visitors") {
      setCurrentTab("dashboard"); // redirect to make research intuitive
    }
  };

  return (
    <div className="bg-[#fff8f6] text-[#2b1613] min-h-screen font-sans antialiased flex flex-col pt-16 select-none selection:bg-[#ffdad4] selection:text-[#bc0100]">
      
      {/* Dynamic top notifications toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-55 bg-[#2b1613] text-white overflow-hidden rounded-xl border border-[#ebbbb4]/40 py-3.5 px-5 shadow-2xl flex items-center gap-3 animate-slide-in max-w-sm">
          <Zap className="w-4 h-4 text-[#bc0100] animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold leading-normal">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top navigation container */}
      <TopNav
        searchValue={globalSearch}
        onSearchChange={handleGlobalSearch}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        userEmail="angelkhanye3@gmail.com"
      />

      {/* Primary content boundaries wrapper */}
      <div className="flex flex-1">
        
        {/* Workspace Sidebar (Desktop constant) */}
        <Sidebar
          currentTab={currentTab}
          setTab={(tab) => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />

        {/* Mobile Responsive Overlay Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <div className="relative flex-1 flex flex-col max-w-[260px] w-full bg-[#fff0ee] border-r border-[#ebbbb4] pt-5 pb-4 px-3 space-y-5 animate-slide-in">
              <div className="flex justify-between items-center px-3 pb-2 border-b border-[#ebbbb4]/50">
                <span className="font-extrabold text-xl tracking-tighter text-[#bc0100]">RLabs Intelligence</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#603e39] hover:bg-[#ffe9e6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* "+ New Entry" button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                className="w-full bg-[#2b1613] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>+ New Entry</span>
              </button>

              {/* Menu listings */}
              <div className="flex-1 flex flex-col gap-1.5 pt-2">
                {[
                  { id: "dashboard", label: "Dashboard" },
                  { id: "upload", label: "Upload screen" },
                  { id: "visitors", label: "Visitors Directory" },
                  { id: "support", label: "System Support" },
                  { id: "account", label: "Account Overview" },
                ].map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold ${
                        isActive
                          ? "bg-[#ffdad4] text-[#bc0100] font-bold"
                          : "text-[#603e39] hover:bg-[#ffe9e6]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main interactive frame coordinator */}
        <main className="flex-1 lg:ml-64 bg-[#fff8f6] transition-all min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-fade-in">
            
            {/* Navigation tab switch director */}
            {currentTab === "dashboard" && (
              <DashboardView
                records={records.filter((item) => {
                  if (globalSearch.trim()) {
                    const query = globalSearch.toLowerCase();
                    const combined = `${item.id} ${item.city} ${item.country} ${item.reason} ${item.gender}`.toLowerCase();
                    return combined.includes(query);
                  }
                  return true;
                })}
                onRefresh={handleRefresh}
                onOpenUpload={() => setCurrentTab("upload")}
              />
            )}

            {currentTab === "upload" && (
              <UploadView onAddDetection={handleAddDetection} />
            )}

            {currentTab === "visitors" && (
              <VisitorsView
                records={records.filter((item) => {
                  if (globalSearch.trim()) {
                    const query = globalSearch.toLowerCase();
                    const combined = `${item.id} ${item.city} ${item.country} ${item.reason} ${item.gender}`.toLowerCase();
                    return combined.includes(query);
                  }
                  return true;
                })}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              />
            )}

            {currentTab === "support" && <SupportScreen />}

            {currentTab === "account" && <AccountScreen userEmail="angelkhanye3@gmail.com" />}

          </div>
        </main>

      </div>

      {/* Synchronized Visitor registration modal overlay */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleAddDetection}
      />

    </div>
  );
}
