"use client";

import { useState } from "react";
import { X, Download, FileText, Loader2 } from "lucide-react";

export default function PdfModal({ isOpen, onClose, material }) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !material) return null;

  // 🔥 THE FIX: Custom function to force a direct download
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Fetch the file directly from Cloudinary
      const response = await fetch(material.pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch the PDF");
      
      // Convert it to a Blob (raw file data)
      const blob = await response.blob();
      
      // Create a temporary local URL for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // Create a clean filename from the material title
      const safeTitle = material.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
      a.download = `${safeTitle}.pdf`;
      
      // Force the click to download, then clean up
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Direct download failed, falling back to new tab:", error);
      // Fallback just in case the user's browser blocks the blob fetch
      window.open(material.pdfUrl, "_blank"); 
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[var(--accent-main)]" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{material.title}</h3>
              <p className="text-xs text-gray-500">{material.category} • {material.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🔥 Updated Download Button */}
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[var(--accent-main)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm disabled:opacity-80"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Embedded Viewer */}
        <div className="flex-1 w-full bg-gray-100 relative">
          <iframe 
            src={`${material.pdfUrl}#toolbar=0`} 
            title={material.title}
            className="w-full h-full border-none"
          />
        </div>

      </div>
    </div>
  );
}