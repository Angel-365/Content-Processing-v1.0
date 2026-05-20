"use client";

import React from "react";
import { User, ShieldCheck, Cpu, Key, Radio, Settings, FileSpreadsheet } from "lucide-react";

interface AccountScreenProps {
  userEmail: string;
}

export function AccountScreen({ userEmail }: AccountScreenProps) {
  const auditLogs = [
    {
      action: "Badge Credential Generated",
      node: "Terminal Node-4",
      time: "2026-05-20 12:37:12 UTC",
      status: "normal",
    },
    {
      action: "Biometric Matrix Index Synchronized",
      node: "Edge Proxy Relay 08",
      time: "2026-05-20 12:15:20 UTC",
      status: "normal",
    },
    {
      action: "System Settings Calibrated",
      node: "Administration Dashboard",
      time: "2026-05-20 11:42:01 UTC",
      status: "audited",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#2b1613] tracking-tight">System Account</h1>
        <p className="text-xs text-[#603e39]/80 mt-1 font-medium italic">
          Manager credentials, edge permissions, and cryptographic security indices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* User administrative profile details */}
        <div className="bg-white border border-[#ebbbb4]/60 p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#ffdad4] border border-[#ebbbb4] flex items-center justify-center text-[#bc0100] p-1.5 shadow">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2b1613]">Angel Khanye</h2>
              <p className="text-[10px] font-mono font-medium text-[#603e39]">{userEmail}</p>
            </div>
          </div>

          <div className="border-t border-[#ebbbb4]/40 pt-4 space-y-2.5 text-xs text-[#2b1613]">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#603e39]">Assigned Role:</span>
              <span className="font-mono bg-[#fff0ee] px-2 py-0.5 rounded border border-[#ebbbb4]/50 text-[10px] font-bold text-[#bc0100] uppercase">
                SecOps Lead
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#603e39]">Client License Plan:</span>
              <span className="font-bold text-[#2b1613]">Enterprise Biometric Tier</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#603e39]">Facility Routing Terminal:</span>
              <span className="font-bold font-mono text-[10px]">europe-west2-cr-01</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#603e39]">Token Authentication:</span>
              <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 uppercase font-mono tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Active Verified
              </span>
            </div>
          </div>
        </div>

        {/* System node infrastructure stats */}
        <div className="bg-white border border-[#ebbbb4]/60 p-6 rounded-xl space-y-4 shadow-sm select-none">
          <h3 className="text-xs uppercase font-bold text-[#2b1613] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#bc0100]" />
            Node Infrastructure
          </h3>
          <p className="text-[11px] text-[#603e39] leading-relaxed font-semibold">
            This workspace sandbox is bound dynamically to standard Google Cloud Run virtualization containers supporting microsecond routing protocols.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
            <div className="bg-[#fff8f6] p-3 rounded-lg border border-[#ebbbb4]/40">
              <Radio className="w-4.5 h-4.5 mx-auto mb-1.5 text-[#bc0100]" />
              <div className="text-[10px] font-bold font-mono text-[#2b1613]">12 Edge Relays</div>
              <span className="text-[8px] text-[#603e39]/70 font-bold">ONLINE</span>
            </div>
            <div className="bg-[#fff8f6] p-3 rounded-lg border border-[#ebbbb4]/40">
              <Key className="w-4.5 h-4.5 mx-auto mb-1.5 text-[#0059ba]" />
              <div className="text-[10px] font-bold font-mono text-[#2b1613]">Standard Shards</div>
              <span className="text-[8px] text-[#603e39]/70 font-bold">CRYPTOGRAPHIC SECURE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Security Audit Log */}
      <div className="bg-white border border-[#ebbbb4]/60 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-[#fff8f6] border-b border-[#ebbbb4]/60">
          <h2 className="text-xs uppercase font-bold text-[#2b1613] tracking-wide flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#bc0100]" />
            Personal Security Audit Trail
          </h2>
        </div>
        <div className="divide-y divide-[#ebbbb4]/30">
          {auditLogs.map((log, index) => (
            <div key={index} className="px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-2 text-xs text-[#2b1613]">
              <div>
                <p className="font-bold text-[#2b1613]">{log.action}</p>
                <span className="text-[10px] text-[#603e39] font-semibold mt-0.5 block">{log.node}</span>
              </div>
              <div className="text-right flex flex-col items-start md:items-end">
                <span className="font-mono text-gray-400 text-[10px]">{log.time}</span>
                <span className="text-[9px] bg-green-50 text-green-700 font-bold font-mono uppercase border border-green-200 px-1.5 py-0.5 rounded-full mt-1 leading-none">
                  SECURE PASS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
