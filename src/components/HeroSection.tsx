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
    <section className="relative w-full flex justify-center pt-[100px] sm:pt-[120px] lg:pt-[130px] pb-12 sm:pb-16 lg:pb-[90px] px-4 sm:px-6 bg-transparent overflow-hidden">
      {/* Frame 31: Responsive Main Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1280px] gap-10 lg:gap-[60px] xl:gap-[107px]">
        
        {/* Frame 10: Left Content Column */}
        <div className="flex flex-col items-start lg:shrink-0 w-full max-w-[500px] lg:max-w-[460px] xl:max-w-[480px] gap-6 sm:gap-8">
          
          {/* Frame 9: Typography Heading & Subtitle */}
          <div className="flex flex-col items-start w-full gap-4">
            {/* Title */}
            <h1 
              className="text-[#262C31] text-[38px] sm:text-[52px] lg:text-[62px] xl:text-[72px] leading-[1.12] tracking-tight font-serif"
              style={{ 
                fontFamily: "'thmanyah serif display', serif", 
                fontWeight: 700,
              }}
            >
              Your next opportunity starts here.
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-[#48525A] font-sans font-normal text-base sm:text-lg leading-relaxed max-w-[460px]"
            >
              Explore exciting career opportunities, build your skills, and take the next step with a team that believes in your potential.
            </p>
          </div>

          {/* Frame 5 (Button) */}
          <button
            onClick={onExploreClick || (() => {
              document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
            })}
            className="flex flex-row justify-center items-center bg-[#0958A7] hover:bg-[#074787] active:scale-95 cursor-pointer transition-all shadow-md hover:shadow-lg rounded-[33px] px-5 py-3.5 gap-2.5"
          >
            <span 
              className="text-[#FFFFFF] font-sans font-semibold text-sm sm:text-base leading-snug"
            >
              Explore opportunities
            </span>
            <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
          </button>

        </div>

        {/* Right Image Container - Fully Responsive */}
        <div className="w-full max-w-[736px] h-[280px] sm:h-[400px] md:h-[480px] lg:h-[548px] relative shrink-0">
          <Image
            src="/assets/hero_illustration.png"
            alt="Your next opportunity starts here"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 736px"
            className="object-contain"
            priority
          />
        </div>

      </div>
    </section>
  );
}
