"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer 
      id="footer"
      className={`flex flex-col justify-center items-center w-full overflow-hidden scroll-mt-10 transition-colors duration-300 ${
        isDark ? "bg-[#060C16] border-t border-white/10" : "bg-[#022A57]"
      }`}
      style={{ padding: "48px 80px", gap: "48px" }}
    >
      <div className="flex flex-col items-start w-full max-w-[1280px]" style={{ gap: "48px" }}>
        
        {/* Top */}
        <div className="flex flex-row items-center w-full h-[56px]" style={{ gap: "48px" }}>
          {/* Frame 1 (Logo) */}
          <Link href="/" className="flex flex-row items-center h-full" style={{ gap: "8px" }}>
            <div className="relative w-[77px] h-[56px]">
              <Image
                src="/assets/workwise_logo.png"
                alt="Work Wise"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <span 
              className="text-[#FFFFFF] font-sans"
              style={{ fontWeight: 600, fontSize: "18px", lineHeight: "27px" }}
            >
              Work Wise
            </span>
          </Link>
        </div>

        {/* Rectangle 11 (Separator) */}
        <div className={`w-full h-[1px] transition-colors ${isDark ? "bg-white/10" : "bg-[#C1C7CD]"}`} />

        {/* Columns */}
        <div className="flex flex-col md:flex-row items-start w-full" style={{ gap: "48px" }}>
          
          {/* Menu 1 */}
          <div className="flex flex-col items-start flex-1" style={{ gap: "16px" }}>
            <div className="flex flex-row items-center py-[12px]">
              <h4 className="text-[#FFFFFF] font-sans uppercase" style={{ fontWeight: 700, fontSize: "16px", lineHeight: "24px" }}>
                PLATFORM
              </h4>
            </div>
            {["Find Jobs", "Explore Companies", "How it Works", "Career Advice"].map((item) => (
              <div key={item} className="flex flex-row items-center">
                <a 
                  href="#" 
                  className={`font-sans transition-colors ${
                    isDark ? "text-[#94A3B8] hover:text-white" : "text-[#FFFFFF] hover:text-[#C1C7CD]"
                  }`} 
                  style={{ fontWeight: 500, fontSize: "16px", lineHeight: "24px" }}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* Menu 2 */}
          <div className="flex flex-col items-start flex-1" style={{ gap: "16px" }}>
            <div className="flex flex-row items-center py-[12px]">
              <h4 className="text-[#FFFFFF] font-sans uppercase" style={{ fontWeight: 700, fontSize: "16px", lineHeight: "24px" }}>
                FOR Employers
              </h4>
            </div>
            {["Post a Job", "Find Talent", "Employer Solutions", "Pricing"].map((item) => (
              <div key={item} className="flex flex-row items-center">
                <a 
                  href="#" 
                  className={`font-sans transition-colors ${
                    isDark ? "text-[#94A3B8] hover:text-white" : "text-[#FFFFFF] hover:text-[#C1C7CD]"
                  }`} 
                  style={{ fontWeight: 500, fontSize: "16px", lineHeight: "24px" }}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* Menu 3 */}
          <div className="flex flex-col items-start flex-1" style={{ gap: "16px" }}>
            <div className="flex flex-row items-center py-[12px]">
              <h4 className="text-[#FFFFFF] font-sans uppercase" style={{ fontWeight: 700, fontSize: "16px", lineHeight: "24px" }}>
                Company
              </h4>
            </div>
            {["About Us", "Careers", "Contact Us", "Newsroom"].map((item) => (
              <div key={item} className="flex flex-row items-center">
                <a 
                  href="#" 
                  className={`font-sans transition-colors ${
                    isDark ? "text-[#94A3B8] hover:text-white" : "text-[#FFFFFF] hover:text-[#C1C7CD]"
                  }`} 
                  style={{ fontWeight: 500, fontSize: "16px", lineHeight: "24px" }}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* Menu 4 (Join Us & Socials) */}
          <div className="flex flex-col items-start flex-1" style={{ gap: "16px" }}>
            <div className="flex flex-row items-center py-[12px]">
              <h4 className="text-[#FFFFFF] font-sans uppercase" style={{ fontWeight: 700, fontSize: "16px", lineHeight: "24px" }}>
                JOIN US
              </h4>
            </div>
            
            {/* Social Buttons Container - Liquid Glass */}
            <div className="flex flex-row items-center" style={{ gap: "16px", height: "32px" }}>
              
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="liquid-glass-icon flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0" style={{ width: "32px", height: "32px" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-white relative z-10"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>

              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="liquid-glass-icon flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0" style={{ width: "32px", height: "32px" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-white relative z-10"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>

              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="liquid-glass-icon flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0" style={{ width: "32px", height: "32px" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-white relative z-10"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>

              {/* Twitter */}
              <a href="#" aria-label="Twitter" className="liquid-glass-icon flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0" style={{ width: "32px", height: "32px" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-white relative z-10"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>

              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="liquid-glass-icon flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0" style={{ width: "32px", height: "32px" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] text-white relative z-10"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>

            </div>
          </div>

        </div>

        {/* Rectangle 10 (Separator) */}
        <div className={`w-full h-[1px] transition-colors ${isDark ? "bg-white/10" : "bg-[#C1C7CD]"}`} />

        {/* Bottom */}
        <div className="flex flex-row items-center w-full" style={{ gap: "48px" }}>
          <p className={`font-sans w-full transition-colors ${isDark ? "text-[#94A3B8]" : "text-[#FFFFFF]"}`} style={{ fontWeight: 500, fontSize: "14px", lineHeight: "20px" }}>
            Workwise @ 2026. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
