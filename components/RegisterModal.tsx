"use client";

import React, { useState } from "react";
import { X, Calendar, Loader2, Sparkles } from "lucide-react";
import { DetectorRecord } from "@/lib/sample-data";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<DetectorRecord, "id" | "timestamp">) => void;
  faceId?: string;
  fileName?: string;
}

export function RegisterModal({ isOpen, onClose, onSave, faceId, fileName }: RegisterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setDob("");
    setAge("");
    setGender("");
    setCountry("");
    setCity("");
    setReason("");
    setSuccess(false);
    setErrorMessage("");
    setCancelMessage("");
  };

  const handleDobChange = (value: string) => {
    setDob(value);
    if (value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : "");
    } else {
      setAge("");
    }
  };

  const handleCancel = async () => {
    try {
      await fetch("https://8d4sbmaiui.execute-api.eu-north-1.amazonaws.com/contentProcessing/cancel-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ face_id: faceId, file_name: fileName }),
      });
    } catch (_) {}
    setCancelMessage("Visitor Registration was cancelled and not logged");
    setTimeout(() => {
      handleReset();
      onClose();
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim() || !reason.trim()) {
      setErrorMessage("Please fill in all required fields indicated with a red asterisk.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        firstName,
        lastName,
        dob,
        age: age ? parseInt(age) : 25,
        gender: (gender || "Prefer not to say") as any,
        country: country.trim() || "Local Office",
        city: city.trim() || "HQ Intake",
        reason: reason.trim(),
        ...(faceId && { face_id: faceId }),
        ...(fileName && { file_name: fileName }),
      };

      const response = await fetch("https://8d4sbmaiui.execute-api.eu-north-1.amazonaws.com/contentProcessing/register-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Registration failed");

      await new Promise((res) => setTimeout(res, 800));

      onSave({
        status: "New" as const,
        gender: (gender || "Prefer not to say") as any,
        age: age ? parseInt(age) : 31,
        city: city.trim() || "General Intake",
        country: country.trim() || "Global Registry",
        reason: reason.trim(),
      });

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage("Failed to register visitor profile. Please verify inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1613]/50 backdrop-blur-[6px] p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-[0_12px_40px_rgba(43,22,19,0.15)] border border-[#ebbbb4] flex flex-col relative my-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#ebbbb4] bg-[#fff0ee] rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-[#2b1613] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#bc0100]" />
              Register New Visitor
            </h2>
            <p className="text-xs text-[#603e39] mt-1 font-medium">Enter details to generate an intelligence visitor badge and profile.</p>
          </div>
          {!success && !cancelMessage && (
            <button onClick={handleCancel} className="text-[#603e39] hover:text-[#bc0100] transition-colors p-1.5 rounded-full hover:bg-[#ffe9e6]" aria-label="Close modal">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Cancel state */}
        {cancelMessage ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#f5eeec] rounded-full flex items-center justify-center text-[#603e39] mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#2b1613]">{cancelMessage}</h3>
          </div>

        ) : success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#ffdad4] rounded-full flex items-center justify-center text-[#bc0100] mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#2b1613]">New Visitor Successfully Captured!</h3>
            <p className="text-xs text-[#603e39] mt-1 max-w-sm">The visitor has been registered and their profile has been saved to the system.</p>
            <button
              onClick={() => { handleReset(); onClose(); }}
              className="mt-5 px-6 py-2.5 bg-[#bc0100] hover:bg-[#2b1613] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Done
            </button>
          </div>

        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2b1613]" htmlFor="firstName">First Name <span className="text-[#bc0100]">*</span></label>
                <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Jane"
                  className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2b1613]" htmlFor="lastName">Last Name <span className="text-[#bc0100]">*</span></label>
                <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Doe"
                  className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2b1613]" htmlFor="dob">Date of Birth</label>
                <div className="relative">
                  <input id="dob" type="date" value={dob} onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
                  <Calendar className="w-4 h-4 text-[#5e5e5e] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#2b1613]" htmlFor="age">Age</label>
                  <input id="age" type="number" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25"
                    className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#2b1613]" htmlFor="gender">Gender</label>
                  <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-3 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] cursor-pointer">
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2b1613]" htmlFor="country">Country</label>
                <input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United Kingdom"
                  className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#2b1613]" htmlFor="city">City</label>
                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. London"
                  className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg px-4 py-2.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all" />
              </div>

            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#2b1613]" htmlFor="reason">Reason for Visit <span className="text-[#bc0100]">*</span></label>
              <textarea id="reason" required rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Business meeting, delivery, consultation..."
                className="w-full bg-[#fff8f6] border border-[#ebbbb4]/80 rounded-lg p-3.5 text-xs text-[#2b1613] outline-none focus:border-[#bc0100] focus:ring-1 focus:ring-[#bc0100] transition-all resize-none" />
            </div>
          </form>
        )}

        {/* Footer */}
        {!success && !cancelMessage && (
          <div className="p-6 border-t border-[#ebbbb4] bg-white flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={handleCancel}
              className="px-5 py-2.5 text-xs font-semibold text-[#603e39] border border-[#ebbbb4]/70 rounded-lg hover:bg-[#fff0ee] transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isLoading}
              className="px-5 py-2.5 text-xs font-semibold bg-[#bc0100] hover:bg-[#c00100] text-white rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-2 focus:ring-red-300 disabled:opacity-50 min-w-[140px]">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Registering...</span></>
              ) : (
                <span>Save Visitor Profile</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
