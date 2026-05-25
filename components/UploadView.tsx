"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FolderOpen, AlertCircle, FileText, X, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { DetectorRecord } from "@/lib/sample-data";
import { RegisterModal } from "./RegisterModal";

export interface CustomFileItem {
  id: string;
  name: string;
  progress: number;
  status: "processing" | "completed" | "error";
  message: string;
  thumbnail?: string;
  parsedRecord?: Partial<DetectorRecord>;
}

interface UploadViewProps {
  onAddDetection: (rec: Omit<DetectorRecord, "id" | "timestamp">) => void;
}

export function UploadView({ onAddDetection }: UploadViewProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileList, setFileList] = useState<CustomFileItem[]>([
    {
      id: "proc-1",
      name: "cam_feed_main_entrance.mp4",
      progress: 45,
      status: "processing",
      message: "Analyzing visitor motion data...",
      thumbnail: "https://picsum.photos/seed/camera1/120/120",
    },
    {
      id: "proc-2",
      name: "lobby_scan_14.jpg",
      progress: 10,
      status: "processing",
      message: "Processing edge snapshot matrices...",
    },
    {
      id: "proc-3",
      name: "historical_batch_02.zip",
      progress: 100,
      status: "completed",
      message: "Batch registry ingestion index compiled",
      thumbnail: "https://picsum.photos/seed/lobby1/120/120",
    },
  ]);
  const [generalError, setGeneralError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newVisitor, setNewVisitor] = useState<{ faceId: string; fileName: string } | null>(null);

  // File drag state handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  // Convert File to base64 format safely
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip prefix details if present
        const base64Data = result.split(",")[1] || result;
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const processSelectedFile = async (file: File) => {
    setGeneralError("");
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo && !file.name.endsWith(".zip")) {
      setGeneralError("Unsupported format. Please select deep image analysis media (PNG, JPG, BMP) or video containers.");
      return;
    }

    const uniqueId = `file-${Date.now()}`;
    const newFileItem: CustomFileItem = {
      id: uniqueId,
      name: file.name,
      progress: 10,
      status: "processing",
      message: "Initializing secure ingest tunnels...",
    };

    setFileList((prev) => [newFileItem, ...prev]);

    try {
      if (isImage) {
        setFileList((prev) =>
          prev.map((item) =>
            item.id === uniqueId ? { ...item, progress: 50, message: "Uploading image..." } : item
          )
        );

        const base64Content = await convertToBase64(file);

        const uploadRes = await fetch("https://8d4sbmaiui.execute-api.eu-north-1.amazonaws.com/contentProcessing/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: base64Content,
            file_name: file.name,
            content_type: file.type || "image/jpeg",
          }),
        });

        const uploadData = await uploadRes.json().catch(() => null);

        if (uploadData?.status === "New_visitor") {
          setNewVisitor({ faceId: uploadData.face_id, fileName: uploadData.file_name });
        }

        setFileList((prev) =>
          prev.map((item) =>
            item.id === uniqueId
              ? { ...item, progress: 100, status: "completed", message: uploadData?.status === "New_visitor" ? "New visitor detected. Please complete registration." : "Upload complete." }
              : item
          )
        );
      }
    } catch (err: any) {
      setFileList((prev) =>
        prev.map((item) =>
          item.id === uniqueId ? { ...item, status: "error", message: "Error mapping image indices." } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upper Context Header */}
      <div className="max-w-3xl">
        <h1 className="text-2xl font-black text-[#2b1613] tracking-tight">Upload Visitor Data</h1>
        <p className="text-xs text-[#603e39]/80 mt-1 font-medium italic">
          Ingest deep security camera media, live stream feeds, or snapshots for AI-enabled visitor identification.
        </p>
      </div>

      {/* Upload Interface Dashboard Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Drag/Drop Interface */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl bg-[#fff8f6] flex flex-col items-center justify-center p-8 min-h-[380px] transition-all relative overflow-hidden group ${
              isDragOver
                ? "border-[#bc0100] bg-[#fff0ee] shadow-inner"
                : "border-[#ebbbb4] hover:border-[#bc0100]"
            }`}
          >
            {/* Ambient radar design overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #bc0100 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*"
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#ffdad4] rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-8 h-8 text-[#bc0100]" />
              </div>

              <h3 className="text-lg font-bold text-[#2b1613]">Drag &amp; Drop Media</h3>
              <p className="text-xs text-[#603e39] mt-2 mb-6 max-w-sm font-medium leading-relaxed">
                Supports JPG, PNG, MP4 up to 500MB per file. Selecting high-density biometric security snapshots increases detection accuracy.
              </p>

              <button
                type="button"
                className="bg-[#bc0100] text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-[#2b1613] transition-colors shadow-sm flex items-center gap-2 group-hover:shadow"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Browse Files</span>
              </button>
            </div>
          </div>

          {/* Validation alerts */}
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Endpoint documentation slot */}
          <div className="flex items-start gap-2 text-[10px] text-[#603e39] font-mono leading-relaxed bg-[#fff0ee] p-3.5 rounded-lg border border-[#ebbbb4]/55">
            <ShieldAlert className="w-4 h-4 text-[#bc0100] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase text-[#2b1613]">Edge Node Endpoint Ingestion:</span>
              <p className="mt-1">
                Data analyzed is securely cataloged via POST https://8d4sbmaiui.execute-api.eu-north-1.amazonaws.com/contentProcessing/upload. Privacy parameters strictly maintained for edge analytics records.
              </p>
            </div>
          </div>
        </div>

        {/* Right Active Processing State Panel */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-[#2b1613] tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#bc0100]" />
              Active System Telemetry
            </h3>
            <span className="bg-[#ffdad4] text-[#bc0100] font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ebbbb4]/45">
              {fileList.length} Items
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {fileList.map((item) => {
              const isProcessing = item.status === "processing";
              const isError = item.status === "error";

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#ebbbb4]/50 rounded-xl p-4 flex gap-3 items-center shadow-sm relative group"
                >
                  {/* Thumbnail / Status icons */}
                  <div className="w-10 h-10 rounded bg-[#fff8f6] flex-shrink-0 flex items-center justify-center border border-[#ebbbb4]/40 overflow-hidden text-[#bc0100]">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="Ref" className="w-full h-full object-cover" />
                    ) : isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#bc0100]" />
                    ) : (
                      <FileText className="w-5 h-5 text-[#5e5e5e]" />
                    )}
                  </div>

                  {/* Core detail item specs */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1">
                      <p className="text-xs text-[#2b1613] font-bold truncate max-w-[150px]">{item.name}</p>
                      <span className="text-[10px] font-bold text-gray-500 font-mono">{item.progress}%</span>
                    </div>
                    <p className="text-[10px] text-[#603e39] font-medium mt-1 truncate">{item.message}</p>

                    {/* Multi-tier progress loaders */}
                    <div className="w-full bg-[#e2e2e2] rounded-full h-1 mt-2 overflow-hidden">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${isError ? "bg-red-600" : "bg-[#bc0100]"}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Cancel / Remove triggers */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-[#bc0100] transition-colors p-1 rounded-full hover:bg-[#fff0ee] self-start"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {newVisitor && (
        <RegisterModal
          isOpen={true}
          faceId={newVisitor.faceId}
          fileName={newVisitor.fileName}
          onClose={() => setNewVisitor(null)}
          onSave={(record) => {
            onAddDetection(record);
            setNewVisitor(null);
          }}
        />
      )}
    </div>
  );
}
