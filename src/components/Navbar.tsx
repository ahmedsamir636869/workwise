"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";

interface NavbarProps {
  onOpenAuth?: (mode: "login" | "signup") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { config } = useLiquidGlass();
  const [activeTab, setActiveTab] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isNavHovered, setIsNavHovered] = useState(false);

  const handleNavMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Jobs", href: "#jobs" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none transition-all duration-300 ${
        isScrolled ? "pt-3 sm:pt-4 pb-2" : "pt-8 sm:pt-10 pb-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pointer-events-none">
        <div className="flex items-center justify-between h-[70px]">
          
          {/* Logo Island - Standalone floating glass pill when scrolling */}
          <Link
            href="/"
            className={`pointer-events-auto flex items-center gap-2.5 group shrink-0 transition-all duration-300 ${
              isScrolled
                ? "px-4 py-2 rounded-full liquid-glass-island shadow-sm"
                : "px-1 py-1"
            }`}
          >
            <div className="relative w-10 h-8 sm:w-11 sm:h-9 transition-transform group-hover:scale-105 duration-200">
              <Image
                src="/assets/workwise_logo.png"
                alt="Work Wise"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[18px] font-semibold text-[#262C31] tracking-tight font-sans pr-1">
              Work Wise
            </span>
          </Link>

          {/* Desktop Center Navigation Capsule - Floating liquid glass island with dynamic reflection */}
          <nav
            onMouseMove={handleNavMouseMove}
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => setIsNavHovered(false)}
            style={
              {
                "--mouse-x": `${mousePos.x}%`,
                "--mouse-y": `${mousePos.y}%`,
                "--nav-glow-opacity": config.navbar.sheenEnabled
                  ? (isNavHovered ? Math.min(1, config.navbar.sheenIntensity * 1.8) : config.navbar.sheenIntensity)
                  : 0,
                "--nav-ridge-opacity": config.navbar.ridgeSpecular ? "1" : "0",
              } as React.CSSProperties
            }
            className="liquid-glass-nav pointer-events-auto hidden md:flex items-center justify-center relative max-w-[532px] w-full h-[64px] lg:h-[70px] px-3 select-none"
          >
            {/* Content Container Frame 4 (responsive padding and gap) */}
            <div className="relative z-10 flex items-center justify-between gap-[20px] lg:gap-[40px] px-2 w-full h-full">
              
              {/* Tab - Active Home Capsule */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("Home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center justify-center w-[70px] lg:w-[75px] h-[44px] lg:h-[50px] rounded-[40px] transition-all duration-200 ${
                  activeTab === "Home"
                    ? "liquid-glass-tab-active text-[#0958A7] font-semibold"
                    : "text-[#48525A] hover:text-[#0958A7] font-medium"
                } font-sans text-[13px] lg:text-[14px] leading-[21px]`}
              >
                Home
              </a>

              {/* Frame 3: Inactive links with responsive gap */}
              <div className="flex items-center gap-[20px] lg:gap-[40px]">
                {navItems.map((item) => {
                  const isActive = activeTab === item.name;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setActiveTab(item.name)}
                      className={`font-sans text-[13px] lg:text-[14px] leading-[21px] transition-all whitespace-nowrap ${
                        isActive
                          ? "liquid-glass-tab-active text-[#0958A7] font-semibold flex items-center justify-center h-[44px] lg:h-[50px] px-3 lg:px-4"
                          : "text-[#48525A] hover:text-[#0958A7] font-medium"
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop Right Controls - Separated standalone floating buttons */}
          <div className="pointer-events-auto hidden md:flex items-center justify-end gap-3.5 shrink-0">
            {/* Theme Toggle Circular 3D Glass Button (40px × 40px) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme"
              className="liquid-glass-icon w-[40px] h-[40px] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0 select-none cursor-pointer"
            >
              {isDarkMode ? (
                <Moon className="w-[20px] h-[20px] text-[#262C31]" />
              ) : (
                <Sun className="w-[20px] h-[20px] text-[#262C31]" />
              )}
            </button>

            {/* Login Button - Standalone floating glass pill */}
            <button
              onClick={() => onOpenAuth?.("login")}
              className="w-[72px] h-[40px] text-[14px] font-semibold text-[#0958A7] rounded-[33px] border border-white/60 bg-white/30 backdrop-blur-md hover:bg-white/50 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
            >
              Login
            </button>

            {/* Sign Up Button - Standalone floating action pill */}
            <button
              onClick={() => onOpenAuth?.("signup")}
              className="w-[84px] h-[40px] text-[14px] font-semibold text-[#FFFFFF] rounded-[33px] bg-[#0958A7] hover:bg-[#074787] active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm hover:shadow-md cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button - Standalone */}
          <div className="pointer-events-auto flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme"
              className="liquid-glass-icon w-9 h-9 flex items-center justify-center shrink-0 select-none cursor-pointer text-[#262C31]"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="liquid-glass-icon w-9 h-9 flex items-center justify-center text-[#262C31] cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl space-y-3">
            <div className="flex flex-col space-y-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("Home");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === "Home"
                    ? "bg-blue-50 text-[#0958A7] font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Home
              </a>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === item.name
                      ? "bg-blue-50 text-[#0958A7] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth?.("login");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-[#0958A7] rounded-full border border-[#0958A7]"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth?.("signup");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0958A7] rounded-full shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
