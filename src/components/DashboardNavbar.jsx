"use client";

import AnimatedGavelIcon from "@/components/ui/AnimatedGavelIcon";
import Link from "next/link";
import { LogOut } from "lucide-react";
import axios from "axios";

export default function DashboardNavbar({ open, setOpen }) {
  
  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login"; // Force full page reload to clear middleware state
  };

  return (
    <header className="w-full bg-secondary-main shadow flex items-center justify-between px-s24 pt-16 pb-3 lg:pt-24 lg:pb-4 sticky top-0 z-30">
      
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(!open)} className="md:hidden p-s8 -ml-s8">
          <AnimatedGavelIcon isOpen={open} />
        </button>
        <h1 className="subheading-h3 text-primary-main hidden sm:block">
          Arshiv Legal CMS
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          target="_blank" 
          className="text-sm font-semibold text-accent-main hover:underline hidden sm:block"
        >
          View Live Site ↗
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-main/10 rounded-full hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-semibold text-primary-main">Admin</span>
          </div>
          
          {/* 🔥 Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Lock Dashboard"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}