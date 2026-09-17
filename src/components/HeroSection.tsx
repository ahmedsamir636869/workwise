"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative w-full flex justify-center py-[60px] lg:py-[100px] px-4 bg-transparent overflow-hidden">
      {/* Frame 31 */}
      <div 
        className="flex flex-col lg:flex-row items-center w-full lg:max-w-[1280px]"
        style={{ gap: "107px", minHeight: "548px" }}
      >
        
        {/* Frame 10 */}
        <div 
          className="flex flex-col items-start lg:shrink-0 w-full max-w-[437px]"
          style={{ gap: "32px" }}
        >
          {/* Frame 9 */}
          <div 
            className="flex flex-col items-start w-full"
            style={{ gap: "16px" }}
          >
            {/* Title */}
            <h1 
              className="text-[#262C31]"
              style={{ 
                fontFamily: "'thmanyah serif display', serif", 
                fontWeight: 700, 
                fontSize: "72px", 
                lineHeight: "90px",
                width: "100%",
                maxWidth: "437px"
              }}
            >
              Your next opportunity starts here.
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-[#262C31] font-sans"
              style={{ 
                fontWeight: 400, 
                fontSize: "18px", 
                lineHeight: "27px",
                width: "437px",
                height: "81px"
              }}
            >
              Explore exciting career opportunities, build your skills, and take the next step with a team that believes in your potential.
            </p>
          </div>

          {/* Frame 5 (Button) */}
          <button
            onClick={onExploreClick || (() => {
              document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
            })}
            className="flex flex-row justify-center items-center bg-[#0958A7] hover:bg-[#074787] active:scale-95 cursor-pointer transition-all shadow-sm hover:shadow-md"
            style={{ 
              width: "207px", 
              height: "48px", 
              padding: "14px 16px", 
              gap: "8px", 
              borderRadius: "33px" 
            }}
          >
            <span 
              className="text-[#FFFFFF] font-sans"
              style={{ fontWeight: 600, fontSize: "14px", lineHeight: "21px", width: "151px" }}
            >
              Explore opportunities
            </span>
            <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
          </button>

        </div>

        {/* Right Image */}
        <div 
          className="shrink-0 relative"
          style={{ width: "736px", height: "548px" }}
        >
          <Image
            src="/assets/hero_illustration.png"
            alt="Your next opportunity starts here"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </section>
  );
}
