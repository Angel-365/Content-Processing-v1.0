"use client";

import React from "react";
import { HelpCircle, Mail, MessageSquare, BookOpen, ShieldAlert, BadgeInfo } from "lucide-react";

export function SupportScreen() {
  const faqs = [
    {
      q: "How are visitor statuses processed dynamically?",
      a: "Statuses 'New' and 'Returning' are mapped based on historical credential matching indices calculated natively at edge nodes. Multiple logs generate a unified biometric profile index.",
    },
    {
      q: "Can I print visitor credentials directly?",
      a: "Yes. Selecting any registered visitor in the Visitor Directory displays their virtual SECURE ACCREDITATION card, from which you can stream instructions to any localized label printer node.",
    },
    {
      q: "Is image data parsed on device or in node servers?",
      a: "By default, raw snapshots are securely run through local pipeline models. Real-time intelligence processing is enhanced server-side utilizing robust, end-to-end sandbox frameworks.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#2b1613] tracking-tight">RLabs Support</h1>
        <p className="text-xs text-[#603e39]/80 mt-1 font-medium italic">
          Resolution guidelines, diagnostic parameters, and SecOps integration details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Contact SecOps Card */}
        <div className="bg-white border border-[#ebbbb4] p-5 rounded-xl flex flex-col items-center text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#bc0100] mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-[#2b1613] uppercase tracking-wider">Ops Help Desk</h3>
          <p className="text-[10px] text-[#603e39] mt-2 leading-relaxed">
            Open standard tickets for facility terminal hardware calibration. Response interval: under 30 minutes.
          </p>
          <a
            href="mailto:support@rlabs.world"
            className="text-[#bc0100] hover:underline font-bold text-[10px] uppercase font-mono tracking-widest mt-4"
          >
            Email Support
          </a>
        </div>

        {/* Live chat node */}
        <div className="bg-white border border-[#ebbbb4] p-5 rounded-xl flex flex-col items-center text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#bc0100] mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-[#2b1613] uppercase tracking-wider">Live Chat</h3>
          <p className="text-[10px] text-[#603e39] mt-2 leading-relaxed">
            Instant consulting with RLabs infrastructure systems experts directly inside your sandbox control terminals.
          </p>
          <button
            onClick={() => alert("Connecting to SecOps terminal on the cloud...")}
            className="text-[#bc0100] hover:underline font-bold text-[10px] uppercase font-mono tracking-widest mt-4 cursor-pointer"
          >
            Launch Chat
          </button>
        </div>

        {/* Documentation slot */}
        <div className="bg-[#fff8f6] border border-[#ebbbb4] p-5 rounded-xl flex flex-col items-center text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#bc0100] mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-[#2b1613] uppercase tracking-wider">Knowledge Base</h3>
          <p className="text-[10px] text-[#603e39] mt-2 leading-relaxed">
            Access secure schematics, compliance policies, privacy framework sheets, and system configuration guides.
          </p>
          <span className="text-gray-400 font-bold text-[10px] uppercase font-mono tracking-widest mt-4 select-none">
            v4.1.11 Secure
          </span>
        </div>

      </div>

      {/* FAQs Panel */}
      <div className="bg-white border border-[#ebbbb4]/60 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-[#fff8f6] border-b border-[#ebbbb4]/60">
          <h2 className="text-xs uppercase font-bold text-[#2b1613] tracking-wide flex items-center gap-2">
            <BadgeInfo className="w-4 h-4 text-[#bc0100]" />
            Frequently Asked Operations Diagnostics
          </h2>
        </div>
        <div className="p-5 divide-y divide-[#ebbbb4]/30">
          {faqs.map((faq, i) => (
            <div key={i} className={`py-4 ${i === 0 ? "pt-0" : ""} ${i === faqs.length - 1 ? "pb-0" : ""}`}>
              <h4 className="text-xs font-bold text-[#c00100]">{faq.q}</h4>
              <p className="text-xs text-[#2b1613] mt-2 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
