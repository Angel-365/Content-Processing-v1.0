"use client";

import React from "react";
import { Search, Bell, Settings, User, Compass, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onMobileMenuToggle?: () => void;
  userEmail?: string;
}

export function TopNav({ onSearchChange, searchValue = "", onMobileMenuToggle, userEmail = "angelkhanye3@gmail.com" }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 bg-white border-b border-[#ebbbb4]/60 transition-colors">
      {/* Brand logo block */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-1.5 hover:bg-[#ffe9e6] rounded-md text-[#2b1613] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="font-extrabold text-2xl tracking-tighter text-[#bc0100] cursor-pointer hover:opacity-90 select-none">
          RLabs
        </div>
      </div>

      {/* Embedded Search (Hidden on Mobile) */}
      <div className="hidden md:flex relative text-[#bc0100] w-72 lg:w-96 select-none">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e5e5e]">
          <Search className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search visitors, city, reason..."
          className="pl-10 pr-4 py-2 w-full bg-[#fff0ee] border border-[#ebbbb4] rounded-full text-xs placeholder-[#603e39]/60 text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all"
        />
      </div>

      {/* Menu controls (Notifications, Settings, Avatar) */}
      <div className="flex items-center gap-3">
        <button
          title="Notifications"
          className="p-2 text-[#5e5e5e] hover:text-[#bc0100] transition-colors duration-200 flex items-center justify-center rounded-full hover:bg-[#fff0ee] relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#bc0100] rounded-full" />
        </button>

        <button
          title="Settings"
          className="p-2 text-[#5e5e5e] hover:text-[#bc0100] transition-colors duration-200 flex items-center justify-center rounded-full hover:bg-[#fff0ee]"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-px w-4 bg-[#ebbbb4] hidden md:block" />

        {/* User visual identity avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ffdad4] border border-[#ebbbb4] overflow-hidden flex items-center justify-center cursor-pointer select-none" title={userEmail}>
            <User className="w-4 h-4 text-[#bc0100]" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[11px] font-bold text-[#2b1613] truncate max-w-[124px]">Angel Khanye</span>
            <span className="text-[8px] font-mono text-[#603e39]/80 truncate max-w-[124px]">{userEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
