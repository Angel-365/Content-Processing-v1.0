"use client";

import React from "react";
import { LayoutDashboard, Upload, Users, HelpCircle, User, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
}

export function Sidebar({ currentTab, setTab, onOpenRegisterModal }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "visitors", label: "Visitors", icon: Users },
  ];

  const subItems = [
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 hidden lg:flex flex-col py-6 border-r border-[#ebbbb4] bg-[#fff0ee] shadow-sm z-30 transition-all">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-[#ebbbb4] shadow-sm text-[#bc0100]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-[#bc0100] tracking-tight text-sm">RLabs Intelligence</h2>
            <p className="text-[10px] uppercase tracking-wider text-[#603e39] font-medium font-mono">Visitor Platform</p>
          </div>
        </div>
      </div>

      {/* New Entry Action Callout */}
      <div className="px-4 mb-6">
        <button
          onClick={onOpenRegisterModal}
          className="w-full bg-[#2b1613] hover:bg-[#c00100] hover:shadow-md text-white rounded-lg py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all group duration-200"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex-1 flex flex-col gap-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer align-middle text-left",
                isActive
                  ? "bg-[#ffdad4] text-[#bc0100] font-bold shadow-sm"
                  : "text-[#603e39] hover:bg-[#ffe9e6] hover:text-[#2b1613]"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", isActive ? "text-[#bc0100]" : "text-[#5e5e5e]")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Support & Profile Actions */}
      <div className="mt-auto px-4 flex flex-col gap-1 border-t border-[#ebbbb4]/40 pt-4">
        {subItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer text-left",
                isActive
                  ? "bg-[#ffdad4] text-[#bc0100] font-bold"
                  : "text-[#603e39] hover:bg-[#ffe9e6] hover:text-[#2b1613]"
              )}
            >
              <Icon className="w-4 h-4 text-[#5e5e5e]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
