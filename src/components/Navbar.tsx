"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onOpenAuth?: (mode: "login" | "signup") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { config } = useLiquidGlass();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isNavHovered, setIsNavHovered] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Jobs", href: "#jobs" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#footer" },
  ];

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a")) as HTMLElement[];
    const lens = nav.querySelector(".glass-lens") as HTMLElement;
    if (!lens || links.length === 0) return;

    lens.innerHTML = "";

    const view = document.createElement("div");
    view.className = "lens-view";
    const meniscus = document.createElement("div");
    meniscus.className = "lens-meniscus";
    const sheen = document.createElement("div");
    sheen.className = "lens-sheen";

    lens.append(view, meniscus, sheen);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let center = 0,
      width = 0,
      targetCenter = 0,
      targetWidth = 0;
    let frame = 0,
      lastTime = 0,
      initialized = false;

    let selectedIndex = navLinks.findIndex((l) => l.name === activeTab);
    if (selectedIndex < 0) selectedIndex = 0;
    let selected = links[selectedIndex] || links[0];
    let lit = selected;

    function paintLens() {
      lens.style.width = `${width}px`;
      lens.style.transform = `translateX(${center - width / 2}px)`;
    }

    function animate(time: number) {
      const blend = reducedMotion.matches
        ? 1
        : 1 - Math.exp(-Math.min(time - lastTime || 16, 64) / 60);
      lastTime = time;
      center += (targetCenter - center) * blend;
      width += (targetWidth - width) * blend;
      const settled =
        Math.abs(targetCenter - center) < 0.05 && Math.abs(targetWidth - width) < 0.05;
      if (settled) {
        center = targetCenter;
        width = targetWidth;
      }
      paintLens();
      frame = settled ? 0 : requestAnimationFrame(animate);
    }

    function moveLens(nextCenter: number) {
      targetWidth = Math.max(96, Math.round(lit.offsetWidth * 1.18 + 14));
      targetCenter = Math.max(
        targetWidth / 2 - 4,
        Math.min(nav!.clientWidth - targetWidth / 2 + 4, nextCenter)
      );
      if (!initialized) {
        center = targetCenter;
        width = targetWidth;
        initialized = true;
        paintLens();
      }
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(animate);
      }
    }

    function illuminate(link: HTMLElement) {
      lit = link;
      links.forEach((item) => {
        item.dataset.lit = String(item === link);
      });
      moveLens(link.offsetLeft + link.offsetWidth / 2);
    }

    const cleanups: (() => void)[] = [];

    links.forEach((link) => {
      const onPointerEnter = () => illuminate(link);
      const onFocus = () => illuminate(link);
      const onPointerMove = (event: PointerEvent) => {
        const bounds = link.getBoundingClientRect();
        lens.style.setProperty(
          "--glow-x",
          `${((event.clientX - bounds.left) / bounds.width) * 100}%`
        );
      };

      link.addEventListener("pointerenter", onPointerEnter);
      link.addEventListener("focus", onFocus);
      link.addEventListener("pointermove", onPointerMove);

      cleanups.push(() => {
        link.removeEventListener("pointerenter", onPointerEnter);
        link.removeEventListener("focus", onFocus);
        link.removeEventListener("pointermove", onPointerMove);
      });
    });

    const onNavPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const midpoint = lit.offsetLeft + lit.offsetWidth / 2;
      const pointer = event.clientX - nav!.getBoundingClientRect().left - nav!.clientLeft;
      moveLens(midpoint + (pointer - midpoint) * 0.12);
    };

    const onNavPointerLeave = () => {
      illuminate(
        nav!.contains(document.activeElement)
          ? (document.activeElement as HTMLElement)
          : selected
      );
    };

    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (!nav!.contains(document.activeElement)) illuminate(selected);
      });
    };

    nav.addEventListener("pointermove", onNavPointerMove);
    nav.addEventListener("pointerleave", onNavPointerLeave);
    nav.addEventListener("focusout", onFocusOut);

    cleanups.push(() => {
      nav.removeEventListener("pointermove", onNavPointerMove);
      nav.removeEventListener("pointerleave", onNavPointerLeave);
      nav.removeEventListener("focusout", onFocusOut);
    });

    const ro = new ResizeObserver(() => {
      illuminate(lit);
    });
    ro.observe(nav);
    cleanups.push(() => ro.disconnect());

    requestAnimationFrame(() => {
      illuminate(selected);
    });

    return () => {
      cleanups.forEach((c) => c());
      if (frame) cancelAnimationFrame(frame);
    };
  }, [activeTab]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none transition-all duration-300 ${isScrolled ? "pt-3 sm:pt-4 pb-2" : "pt-8 sm:pt-10 pb-4"
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pointer-events-none">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo Island - Standalone floating glass pill when scrolling */}
          <Link
            href="/"
            className={`pointer-events-auto flex items-center gap-2.5 group shrink-0 transition-all duration-300 ${isScrolled
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
            <span className={`text-[18px] font-semibold tracking-tight font-sans pr-1 transition-colors duration-200 ${isDark ? "text-white" : "text-[#262C31]"
              }`}>
              Work Wise
            </span>
          </Link>

          {/* Desktop Center Navigation Capsule - Floating optical liquid glass island with dynamic lens */}
          <nav
            ref={navRef}
            className="navigation pointer-events-auto hidden md:flex items-center justify-between max-w-[532px] w-full h-[54px] select-none relative"
          >
            <div className="glass-lens" />
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "#") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setActiveTab(item.name);
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Controls - Separated standalone floating buttons */}
          <div className="pointer-events-auto hidden md:flex items-center justify-end gap-3.5 shrink-0">
            {/* Theme Toggle Circular 3D Glass Button (40px × 40px) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`liquid-glass-icon w-[40px] h-[40px] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0 select-none cursor-pointer ${isDark ? "text-white" : "text-[#262C31]"
                }`}
            >
              {isDark ? (
                <Moon className="w-[20px] h-[20px]" />
              ) : (
                <Sun className="w-[20px] h-[20px]" />
              )}
            </button>

            {/* Login Button - Standalone floating glass pill */}
            <button
              onClick={() => onOpenAuth?.("login")}
              className={`w-[72px] h-[40px] text-[14px] font-semibold rounded-[33px] backdrop-blur-md active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm cursor-pointer ${isDark
                ? "text-white border border-white/20 bg-white/10 hover:bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                : "text-[#0958A7] border border-white/60 bg-white/30 hover:bg-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                }`}
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
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`liquid-glass-icon w-9 h-9 flex items-center justify-center shrink-0 select-none cursor-pointer ${isDark ? "text-white" : "text-[#262C31]"
                }`}
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`liquid-glass-icon w-9 h-9 flex items-center justify-center cursor-pointer ${isDark ? "text-white" : "text-[#262C31]"
                }`}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-3 p-4 bg-[#0A111F]/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === "#") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    setActiveTab(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium ${activeTab === item.name
                    ? "bg-blue-900/40 text-[#38BDF8] font-semibold"
                    : "text-slate-300 hover:bg-white/5"
                    }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth?.("login");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-full border border-white/20 bg-white/5 hover:bg-white/10"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth?.("signup");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0958A7] hover:bg-[#074787] rounded-full shadow-sm"
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
