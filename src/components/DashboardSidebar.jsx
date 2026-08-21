"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Scale,
  Video,
  Newspaper,
  BookOpen,
  Contact,
} from "lucide-react";

export default function DashboardSidebar({ desktop, open, setOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!desktop) {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open, desktop]);

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      {desktop && (
        <aside className="w-64 h-screen bg-primary-main text-background shadow-xl fixed top-0 left-0 z-50">
          <SidebarContent pathname={pathname} />
        </aside>
      )}

      {/* MOBILE SLIDE-IN SIDEBAR */}
      {!desktop && (
        <aside
          className={`
            fixed top-0 left-0 h-screen w-64 bg-primary-main text-background 
            shadow-xl transition-transform duration-300 
            z-50 
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent pathname={pathname} onClick={() => setOpen(false)} />
        </aside>
      )}

      {/* MOBILE OVERLAY (Click outside to close) */}
      {!desktop && open && (
        <div 
          onClick={() => setOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </>
  );
}

function SidebarContent({ pathname, onClick = () => {} }) {
  // 🔥 Exactly your 5 Modules + Contacts and Dashboard
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Blogs", href: "/dashboard/blog", icon: <FileText size={18} /> },
    { name: "Case Studies", href: "/dashboard/case-study", icon: <Scale size={18} /> },
    { name: "Daily Content", href: "/dashboard/daily-content", icon: <Video size={18} /> },
    { name: "Articles", href: "/dashboard/article", icon: <Newspaper size={18} /> },
    { name: "Knowledge Hub", href: "/dashboard/study-material", icon: <BookOpen size={18} /> },
    { name: "Contacts", href: "/dashboard/contact", icon: <Contact size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 border-b border-primary-light">
        <h2 className="text-xl font-bold text-secondary-main tracking-wide">Arshiv CMS</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
        {links.map((link) => {
          // Check if current path starts with the link href (so it stays highlighted when editing)
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-secondary-light text-accent-main font-semibold shadow-sm"
                  : "hover:bg-primary-light hover:text-secondary-light text-background/80"
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-light text-xs text-background/50 text-center">
        © {new Date().getFullYear()} Arshiv Legal
      </div>
    </div>
  );
}