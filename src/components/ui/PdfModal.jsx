"use client";

import { useState, useEffect } from "react";
import { X, Download, FileText, Loader2 } from "lucide-react";

export default function PdfModal({ isOpen, onClose, material }) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Prevent body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !material) return null;

  // Custom function to force a direct download (Great logic here!)
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch(material.pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch the PDF");
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const safeTitle = material.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
      a.download = `${safeTitle}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Direct download failed, falling back to new tab:", error);
      window.open(material.pdfUrl, "_blank"); 
    } finally {
      setIsDownloading(false);
    }
  };

  // 🔥 THE FIX FOR MOBILE VIEWING: Force Google Docs Viewer
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(material.pdfUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="w-6 h-6 text-[var(--accent-main)] shrink-0" />
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{material.title}</h3>
              <p className="text-xs text-gray-500">{material.category} • {material.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {/* Download Button */}
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
              {/* Hide text on very small screens to save space */}
              <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Download PDF"}</span>
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
            src={viewerUrl} 
            title={material.title}
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>

      </div>
    </div>
  );
}