"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/Data/Navlink";
import AnimatedGavelIcon from "./AnimatedGavelIcon";
import ContactModal from "./ContactModal"; // 🔥 Imported the new modal! Adjust path if needed (e.g. "@/components/ContactModal")

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // 🔥 Added state for the modal
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-[var(--S24)] md:px-[var(--S40)] py-3 bg-white border-b border-black z-50">
      
      {/* LOGO */}
      <Link href="/" className="shrink-0" onClick={closeMenu}>
        <Image
          src="/logo.svg"
          alt="Logo"
          height={40}
          width={121}
          className="h-9 md:h-[40px] lg:h-[48px] w-fit object-contain"
        />
      </Link>

      {/* DESKTOP MENU */}
      <ul className="hidden xl:flex gap-[28px] items-center justify-center flex-1">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`font-secondary text-[15px] text-black transition-colors hover:text-[var(--accent-main)] underline-offset-4 ${
                  isActive ? "underline font-medium" : "hover:underline"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* RIGHT SIDE CTA & MOBILE TOGGLE */}
      <div className="flex items-center gap-[var(--S16)] shrink-0">
        
        {/* 🔥 Desktop CTA Button - Changed from <Link> to <button> */}
        <div className="hidden xl:block">
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center justify-center rounded-[8px] bg-[var(--primary-main)] px-[20px] py-[8px] font-secondary text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Free Consultation
          </button>
        </div>

        {/* Mobile Toggle Icon */}
        <div className="block xl:hidden">
          <AnimatedGavelIcon isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </div>

      {/* OVERLAY FOR MOBILE CLOSE ON OUTSIDE CLICK */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[60px] bg-black/20 xl:hidden z-40"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE MENU (Slide down) */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-b border-black overflow-hidden transition-all duration-300 ease-in-out xl:hidden z-50 ${
          isMenuOpen ? "max-h-[85vh] py-2 shadow-xl" : "max-h-0 py-0 border-transparent"
        }`}
      >
        <div className="flex flex-col px-[var(--S24)] md:px-[var(--S40)]">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`block py-3.5 border-b border-gray-100 font-secondary text-[16px] transition-colors ${
                  isActive
                    ? "text-[var(--primary-main)] font-semibold"
                    : "text-black hover:text-[var(--accent-main)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          
          {/* 🔥 Mobile CTA Button - Changed from <Link> to <button> */}
          <div className="mt-5 mb-3">
            <button
              onClick={() => {
                closeMenu(); // Closes the mobile dropdown
                setShowContactModal(true); // Opens the popup
              }}
              className="flex w-full items-center justify-center rounded-[8px] bg-[var(--primary-main)] px-[24px] py-[10px] font-secondary text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Free Consultation
            </button>
          </div>
        </div>
      </div>
      
      {/* 🔥 Attach the modal so it's always ready to trigger */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </nav>
  );
}