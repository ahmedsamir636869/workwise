"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface Job {
  id: string;
  company: string;
  logo: string;
  location: string;
  title: string;
  type: string;
  workplace: string;
  description: string;
  tags: string[];
}

const JOBS_DATA: Job[] = [
  {
    id: "job-1",
    company: "Teleperformance",
    logo: "/assets/teleperformance_logo.png",
    location: "Cairo, Egypt",
    title: "Customer Experience Specialist",
    type: "Full time",
    workplace: "On-site",
    description: "Deliver exceptional customer experiences and help brands build strong relationships.",
    tags: ["Customer Service", "Communications"],
  },
  {
    id: "job-2",
    company: "Concentrix",
    logo: "/assets/concentrix_logo.png",
    location: "Cairo, Egypt",
    title: "Technical Support Engineer",
    type: "Full time",
    workplace: "Hybrid",
    description: "Provide technical solutions and support to ensure smooth customer experiences.",
    tags: ["Technical Support", "Problem Solving"],
  },
  {
    id: "job-3",
    company: "Concentrix",
    logo: "/assets/concentrix_logo.png",
    location: "Cairo, Egypt",
    title: "Multilingual Operations Lead",
    type: "Full time",
    workplace: "Hybrid",
    description: "Lead multilingual support teams across global client accounts with proactive leadership.",
    tags: ["Technical Support", "Team Leadership"],
  },
  {
    id: "job-4",
    company: "Vodafone",
    logo: "/assets/vodafone_partner.png",
    location: "Giza, Egypt",
    title: "Enterprise Solutions Consultant",
    type: "Full time",
    workplace: "On-site",
    description: "Consult corporate clients on digital transformation, cloud connectivity, and managed telecom.",
    tags: ["Consulting", "Enterprise Tech"],
  },
];

export default function JobsCarousel() {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const nextSlide = () => {
    if (currentIndex < JOBS_DATA.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleJobs = JOBS_DATA.slice(currentIndex, currentIndex + 3);
  const totalDots = Math.max(1, JOBS_DATA.length - 2);

  return (
    <section id="jobs" className="relative w-full max-w-[1440px] mx-auto py-12 px-4 flex justify-center scroll-mt-24">
      {/* Frame 64 Container */}
      <div 
        className={`relative flex flex-col justify-center items-center w-full max-w-[1438px] rounded-[16px] border transition-colors duration-300 ${
          isDark
            ? "bg-[#0A111F] border-white/10 shadow-2xl"
            : "bg-[#FFFFFF] border-slate-200/60 shadow-sm"
        }`}
        style={{ padding: "40px 80px 24px", gap: "30px" }}
      >
        
        {/* Navigation Buttons (Liquid Glass) */}
        <button 
          onClick={prevSlide}
          className={`!absolute liquid-glass-icon w-[48px] h-[48px] flex items-center justify-center rounded-[300px] transition-all hover:scale-105 active:scale-95 z-20 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ left: "16px", top: "50%", transform: "translateY(-50%)" }}
          disabled={currentIndex === 0}
          aria-label="Previous jobs"
        >
          <ChevronLeft className={`w-6 h-6 relative z-10 ${isDark ? "text-white" : "text-[#262C31]"}`} />
        </button>

        <button 
          onClick={nextSlide}
          className={`!absolute liquid-glass-icon w-[48px] h-[48px] flex items-center justify-center rounded-[300px] transition-all hover:scale-105 active:scale-95 z-20 ${currentIndex >= JOBS_DATA.length - 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ right: "16px", top: "50%", transform: "translateY(-50%)" }}
          disabled={currentIndex >= JOBS_DATA.length - 3}
          aria-label="Next jobs"
        >
          <ChevronRight className={`w-6 h-6 relative z-10 ${isDark ? "text-white" : "text-[#262C31]"}`} />
        </button>


        {/* Frame 32: Header */}
        <div className="flex flex-row justify-between items-end w-full flex-wrap gap-4">
          <h2 
            className={`transition-colors duration-200 ${isDark ? "text-white" : "text-[#262C31]"}`}
            style={{ fontFamily: "'thmanyah serif display', serif", fontWeight: 700, fontSize: "40px", lineHeight: "50px", maxWidth: "410px" }}
          >
            {isDark ? (
              <>Find something that feels like <span className="text-[#FFBA26]">you.</span></>
            ) : (
              "Find something that feels like you."
            )}
          </h2>
          
          <Link href="/jobs" className="flex flex-row items-center group" style={{ gap: "8px" }}>
            <span 
              className={`font-sans transition-colors ${isDark ? "text-[#38BDF8] hover:text-white" : "text-[#0958A7] hover:text-[#074787]"}`}
              style={{ fontWeight: 600, fontSize: "16px", lineHeight: "24px" }}
            >
              View all jobs
            </span>
            <ArrowRight className={`w-4 h-4 transition-all group-hover:translate-x-1 ${isDark ? "text-[#38BDF8] group-hover:text-white" : "text-[#0958A7]"}`} />
          </Link>
        </div>

        {/* Frame 22: Cards Grid */}
        <div className="flex flex-row items-center w-full" style={{ gap: "24px", minHeight: "299px" }}>
          <AnimatePresence mode="popLayout">
            {visibleJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex flex-col items-start rounded-[12px] border flex-1 min-w-[300px] transition-all duration-300 ${
                  isDark
                    ? "bg-[#0D1627] border-white/10 hover:border-blue-500/30 shadow-lg"
                    : "bg-[#FFFFFF] border-[#D9D5D5] hover:border-blue-300 shadow-sm"
                }`}
                style={{ maxWidth: "410px", height: "299px", padding: "16px", gap: "16px" }}
              >
                {/* Frame 18 (Top) */}
                <div className="flex flex-row items-start w-full relative" style={{ gap: "16px" }}>
                  {/* Logo Container */}
                  <div 
                    className={`flex-none rounded-[4px] border overflow-hidden relative ${
                      isDark ? "bg-[#141E33] border-white/10" : "bg-white border-[#DDDDDD]"
                    }`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      fill
                      className="object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/workwise_logo.png";
                      }}
                    />
                  </div>
                  
                  {/* Company Info */}
                  <div className="flex flex-col items-start flex-1" style={{ gap: "4px" }}>
                    <span 
                      className={`font-sans transition-colors ${isDark ? "text-white" : "text-[#262C31]"}`}
                      style={{ fontWeight: 600, fontSize: "16px", lineHeight: "24px" }}
                    >
                      {job.company}
                    </span>
                    <span 
                      className={`font-sans transition-colors ${isDark ? "text-[#94A3B8]" : "text-[#888888]"}`}
                      style={{ fontWeight: 400, fontSize: "14px", lineHeight: "21px" }}
                    >
                      {job.location}
                    </span>
                  </div>

                  {/* Bookmark Badge */}
                  <button
                    onClick={() => toggleBookmark(job.id)}
                    className={`absolute right-0 top-0 flex items-center justify-center rounded-full border transition-colors drop-shadow-sm cursor-pointer ${
                      isDark
                        ? "border-white/15 bg-white/5 hover:bg-white/10"
                        : "border-[#DEDEDE] bg-white hover:bg-slate-50"
                    }`}
                    style={{ width: "40px", height: "40px" }}
                    aria-label="Bookmark job"
                  >
                    <Bookmark 
                      className={`w-4 h-4 transition-all ${isDark ? "text-[#38BDF8]" : "text-[#0958A7]"}`}
                      fill={bookmarkedIds.has(job.id) ? (isDark ? "#38BDF8" : "#0958A7") : "transparent"} 
                    />
                  </button>
                </div>

                {/* Frame 17 (Body) */}
                <div className="flex flex-col items-start w-full" style={{ gap: "20px" }}>
                  
                  {/* Frame 29 / 15 Title & Tags */}
                  <div className="flex flex-col items-start w-full" style={{ gap: "12px" }}>
                    {/* Frame 13 Title & Details */}
                    <div className="flex flex-col items-start w-full" style={{ gap: "4px" }}>
                      <h3 
                        className={`font-sans line-clamp-1 transition-colors ${isDark ? "text-white" : "text-[#262C31]"}`}
                        style={{ fontWeight: 600, fontSize: "14px", lineHeight: "21px" }}
                      >
                        {job.title}
                      </h3>
                      
                      {/* Frame 12 Badges */}
                      <div className="flex flex-row items-center" style={{ gap: "6px" }}>
                        <span className={`font-sans transition-colors ${isDark ? "text-[#94A3B8]" : "text-[#888888]"}`} style={{ fontWeight: 400, fontSize: "14px", lineHeight: "21px" }}>
                          {job.type}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${isDark ? "bg-[#64748B]" : "bg-[#888888]"}`} />
                        <span className={`font-sans transition-colors ${isDark ? "text-[#94A3B8]" : "text-[#888888]"}`} style={{ fontWeight: 400, fontSize: "14px", lineHeight: "21px" }}>
                          {job.workplace}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p 
                      className={`font-sans line-clamp-2 transition-colors ${isDark ? "text-[#CBD5E1]" : "text-[#262C31]"}`}
                      style={{ fontWeight: 400, fontSize: "12px", lineHeight: "18px", width: "100%" }}
                    >
                      {job.description}
                    </p>
                  </div>

                  {/* Frame 28 Pills */}
                  <div className="flex flex-row items-center w-full" style={{ gap: "8px" }}>
                    {job.tags.slice(0, 2).map((tag, idx) => (
                      <div 
                        key={idx}
                        className={`flex flex-row justify-center items-center border rounded-[25px] transition-colors ${
                          isDark
                            ? "border-white/10 bg-white/5 text-[#94A3B8]"
                            : "border-[#DCDCDC] bg-transparent text-[#909090]"
                        }`}
                        style={{ padding: "6px 12px", gap: "10px", height: "32px" }}
                      >
                        <span 
                          className="font-sans whitespace-nowrap"
                          style={{ fontWeight: 400, fontSize: "12px", lineHeight: "18px" }}
                        >
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Line 1 */}
                  <div className={`w-full border-t transition-colors ${isDark ? "border-white/10" : "border-[#E7E7E7]"}`} />

                  {/* View details link */}
                  <Link href={`/jobs/${job.id}`} className="flex flex-row items-center group" style={{ gap: "8px" }}>
                    <span 
                      className={`font-sans transition-colors ${
                        isDark ? "text-[#38BDF8] group-hover:text-white" : "text-[#0958A7] group-hover:text-[#074787]"
                      }`}
                      style={{ fontWeight: 600, fontSize: "12px", lineHeight: "18px" }}
                    >
                      View details
                    </span>
                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-all ${
                      isDark ? "text-[#38BDF8] group-hover:text-white" : "text-[#0958A7]"
                    }`} />
                  </Link>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Frame 34: Pagination Dots */}
        <div className="flex flex-row items-center justify-center mt-2" style={{ gap: "4px" }}>
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="transition-all duration-300 ease-out cursor-pointer"
              style={{
                width: currentIndex === idx ? "24px" : "12px",
                height: "12px",
                backgroundColor: currentIndex === idx ? "#0958A7" : (isDark ? "#1E293B" : "#D9D9D9"),
                borderRadius: "9px"
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
