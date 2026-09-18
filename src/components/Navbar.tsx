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
  const lensRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapSizeRef = useRef<string>("");

  const opticalResolution = 3;
  const zoom = 0.96;

  const stateRef = useRef({
    center: 0,
    width: 0,
    targetCenter: 0,
    targetWidth: 0,
    lastTime: 0,
    frame: 0,
    initialized: false,
    litIndex: 0,
  });

  const handleNavMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const updateRefraction = useCallback((w: number, h: number) => {
    if (typeof document === "undefined") return;
    const displacement = document.getElementById("lens-map");
    if (!displacement) return;

    if (!mapCanvasRef.current) {
      mapCanvasRef.current = document.createElement("canvas");
    }
    const mapCanvas = mapCanvasRef.current;
    const mapContext = mapCanvas.getContext("2d");
    if (!mapContext) return;

    const density = Math.min(2, Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1));
    const W = Math.max(2, Math.round(w * density));
    const H = Math.max(2, Math.round(h * density));
    const key = `${W}:${H}`;
    if (key === mapSizeRef.current) return;
    mapSizeRef.current = key;

    mapCanvas.width = W;
    mapCanvas.height = H;
    const pixels = mapContext.createImageData(W, H);
    const radius = H / 2;
    const halfLine = Math.max(0, W / 2 - radius);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const px = x + 0.5 - W / 2;
        const py = y + 0.5 - H / 2;
        const nx = px - Math.max(-halfLine, Math.min(halfLine, px));
        const distance = Math.hypot(nx, py);
        const depth = Math.min(1, distance / radius);
        const rim = Math.max(0, (depth - 0.55) / 0.45);
        const bend = Math.sin((rim * Math.PI) / 2) ** 2 * 0.46;
        const i = (y * W + x) * 4;
        pixels.data[i] = Math.round(255 * (0.5 + (distance ? nx / distance : 0) * bend));
        pixels.data[i + 1] = Math.round(255 * (0.5 + (distance ? py / distance : 0) * bend));
        pixels.data[i + 2] = 128;
        pixels.data[i + 3] = 255;
      }
    }

    mapContext.putImageData(pixels, 0, 0);
    const data = mapCanvas.toDataURL();
    displacement.setAttribute("href", data);
    displacement.setAttributeNS("http://www.w3.org/1999/xlink", "href", data);
  }, []);

  const measureScene = useCallback(() => {
    const nav = navRef.current;
    const scene = sceneRef.current;
    if (!nav || !scene) return;

    scene.style.width = `${nav.clientWidth}px`;
    scene.style.height = `${nav.clientHeight}px`;

    linksRef.current.forEach((link, index) => {
      const label = labelsRef.current[index];
      if (!link || !label) return;
      Object.assign(label.style, {
        left: `${link.offsetLeft - 1}px`,
        top: `${link.offsetTop - 1}px`,
        width: `${link.offsetWidth}px`,
        height: `${link.offsetHeight}px`,
        fontSize: getComputedStyle(link).fontSize,
      });
    });
  }, []);

  const paintLens = useCallback((centerPos: number, widthVal: number) => {
    const lens = lensRef.current;
    const nav = navRef.current;
    const scene = sceneRef.current;
    if (!lens || !nav || !scene) return;

    lens.style.width = `${widthVal}px`;
    lens.style.transform = `translateX(${centerPos - widthVal / 2}px)`;

    updateRefraction((widthVal - 2) * opticalResolution, lens.clientHeight * opticalResolution);

    const x = (widthVal - 2) / 2 - centerPos * zoom;
    const y = lens.clientHeight / 2 - (nav.clientHeight * zoom) / 2;
    scene.style.transform = `translate(${x * opticalResolution}px,${y * opticalResolution}px) scale(${zoom * opticalResolution})`;
  }, [updateRefraction]);

  const animate = useCallback((time: number) => {
    const state = stateRef.current;
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blend = reducedMotion ? 1 : 1 - Math.exp(-Math.min(time - state.lastTime || 16, 64) / 65);
    state.lastTime = time;

    state.center += (state.targetCenter - state.center) * blend;
    state.width += (state.targetWidth - state.width) * blend;

    const settled = Math.abs(state.targetCenter - state.center) < 0.05 && Math.abs(state.targetWidth - state.width) < 0.05;
    if (settled) {
      state.center = state.targetCenter;
      state.width = state.targetWidth;
    }

    paintLens(state.center, state.width);

    if (!settled) {
      state.frame = requestAnimationFrame(animate);
    } else {
      state.frame = 0;
    }
  }, [paintLens]);

  const moveLens = useCallback((nextCenter: number) => {
    const state = stateRef.current;
    const nav = navRef.current;
    const litLink = linksRef.current[state.litIndex];
    if (!litLink || !nav) return;

    state.targetWidth = litLink.offsetWidth * 1.24;
    state.targetCenter = Math.max(
      state.targetWidth / 2 - 4,
      Math.min(nav.clientWidth - state.targetWidth / 2 + 4, nextCenter)
    );

    if (!state.initialized) {
      state.center = state.targetCenter;
      state.width = state.targetWidth;
      state.initialized = true;
      paintLens(state.center, state.width);
    }

    if (!state.frame) {
      state.lastTime = 0;
      state.frame = requestAnimationFrame(animate);
    }
  }, [animate, paintLens]);

  const illuminate = useCallback((index: number) => {
    const state = stateRef.current;
    state.litIndex = index;
    linksRef.current.forEach((item, idx) => {
      if (!item) return;
      const isLit = idx === index;
      item.dataset.lit = String(isLit);
      const label = labelsRef.current[idx];
      if (label) label.dataset.lit = String(isLit);
    });

    const link = linksRef.current[index];
    if (link) {
      moveLens(link.offsetLeft + link.offsetWidth / 2);
    }
  }, [moveLens]);

  const handleNavPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    handleNavMouseMove(e);
    if (e.pointerType === "touch") return;
    const state = stateRef.current;
    const litLink = linksRef.current[state.litIndex];
    const nav = navRef.current;
    if (!litLink || !nav) return;

    const midpoint = litLink.offsetLeft + litLink.offsetWidth / 2;
    const pointer = e.clientX - nav.getBoundingClientRect().left - nav.clientLeft;
    moveLens(midpoint + (pointer - midpoint) * 0.12);
  };

  const handleNavPointerLeave = () => {
    setIsNavHovered(false);
    const activeIndex = navLinks.findIndex((l) => l.name === activeTab);
    illuminate(activeIndex >= 0 ? activeIndex : 0);
  };

  const handleLinkPointerMove = (e: React.PointerEvent<HTMLAnchorElement>, idx: number) => {
    const link = linksRef.current[idx];
    const lens = lensRef.current;
    if (!link || !lens) return;
    const bounds = link.getBoundingClientRect();
    lens.style.setProperty("--glow-x", `${((e.clientX - bounds.left) / bounds.width) * 100}%`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeIndex = navLinks.findIndex((l) => l.name === activeTab);
    measureScene();
    illuminate(activeIndex >= 0 ? activeIndex : 0);

    const nav = navRef.current;
    if (!nav) return;

    const ro = new ResizeObserver(() => {
      measureScene();
      const currentIdx = stateRef.current.litIndex;
      illuminate(currentIdx);
    });
    ro.observe(nav);

    return () => {
      ro.disconnect();
      if (stateRef.current.frame) {
        cancelAnimationFrame(stateRef.current.frame);
      }
    };
  }, [measureScene, illuminate, activeTab]);

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
            onPointerMove={handleNavPointerMove}
            onMouseEnter={() => setIsNavHovered(true)}
            onPointerLeave={handleNavPointerLeave}
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
            {/* Optical Glass Lens Hover Layer */}
            <div ref={lensRef} className="glass-lens">
              <div className="lens-view">
                <div className="lens-optics">
                  <div ref={sceneRef} className="lens-scene">
                    {navLinks.map((item, idx) => (
                      <span
                        key={item.name}
                        ref={(el) => { labelsRef.current[idx] = el; }}
                        className="lens-label font-sans text-[13px] lg:text-[14px]"
                        data-lit={activeTab === item.name ? "true" : "false"}
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lens-sheen" />
            </div>

            {/* Interactive Links Container */}
            <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
              {navLinks.map((item, idx) => {
                const isActive = activeTab === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    ref={(el) => { linksRef.current[idx] = el; }}
                    onClick={(e) => {
                      if (item.href === "#") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      setActiveTab(item.name);
                      illuminate(idx);
                    }}
                    onPointerEnter={() => illuminate(idx)}
                    onFocus={() => illuminate(idx)}
                    onPointerMove={(e) => handleLinkPointerMove(e, idx)}
                    data-lit={isActive ? "true" : "false"}
                    className={`relative z-10 flex items-center justify-center px-3 lg:px-4 py-2 rounded-full font-sans text-[13px] lg:text-[14px] leading-[21px] transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? isDark
                          ? "text-[#38BDF8] font-semibold"
                          : "text-[#0958A7] font-semibold"
                        : isDark
                          ? "text-[#94A3B8] hover:text-white font-medium"
                          : "text-[#48525A] hover:text-[#0958A7] font-medium"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
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
      {/* SVG Refraction Filter for Optical Glass Lens */}
      <svg className="fixed pointer-events-none opacity-0 w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="glass-refraction" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage id="lens-map" preserveAspectRatio="none" />
            <feDisplacementMap in="SourceGraphic" in2="lens-map" xChannelSelector="R" yChannelSelector="G" scale="22" />
          </filter>
        </defs>
      </svg>
    </header>
  );
}
