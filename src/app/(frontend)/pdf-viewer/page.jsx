"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2, Download, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

function PdfViewerContent() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("file");
  const fileTitle = searchParams.get("title") || "Arshiv_Legal_Document";
  
  const [isDownloading, setIsDownloading] = useState(false);

  if (!fileUrl) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-gray-500 flex-col gap-4">
        <FileText className="w-12 h-12 text-gray-300" />
        <p className="text-lg font-medium">No document link provided.</p>
        <Link href="/" className="text-[var(--accent-main)] hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Uses Google Docs Viewer for a perfect full-screen view
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  // The robust blob download logic
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch the PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      
      // Clean up the title for saving
      const safeTitle = fileTitle.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
      a.download = `${safeTitle}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Direct download failed:", error);
      window.open(fileUrl, "_blank"); 
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100 overflow-hidden mt-16">
      
      {/* 🎨 Professional Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm z-10">
        
        {/* Left Side: Back Button & Title */}
        <div className="flex items-center gap-3 overflow-hidden">
          <Link 
            href="/" 
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
          <FileText className="w-5 h-5 text-[var(--accent-main)] shrink-0" />
          <h1 className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[200px] sm:max-w-md">
            {fileTitle.replace(/_/g, " ")}
          </h1>
        </div>

        {/* Right Side: Download Button */}
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[var(--accent-main)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm disabled:opacity-80 shrink-0"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isDownloading ? "Downloading..." : "Download"}
          </span>
        </button>
      </header>

      {/* 📄 PDF Iframe Content */}
      <div className="flex-1 w-full bg-[#525659] relative">
        <iframe
          src={viewerUrl}
          className="w-full h-full border-none"
          title={fileTitle}
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function PdfViewerPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-main)]" />
        </div>
      }
    >
      <PdfViewerContent />
    </Suspense>
  );
}