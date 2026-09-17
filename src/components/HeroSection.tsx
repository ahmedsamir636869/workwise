"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LiquidGlass from "./LiquidGlass";

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
        <div className="w-full max-w-[736px] h-[300px] sm:h-[400px] md:h-[480px] lg:h-[548px] relative shrink-0 flex items-center justify-center">
          <Image
            src="/assets/hero_illustration.png"
            alt="Your next opportunity starts here"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 736px"
            className="object-contain"
            priority
          />

          {/* Floating Liquid Glass Card with User Specified Configuration */}
          <div className="absolute -bottom-2 sm:bottom-4 left-2 sm:left-6 z-20 pointer-events-auto">
            <LiquidGlass
              width={300}
              height={200}
              borderRadius={28}
              innerShadowColor="#ffffff"
              innerShadowBlur={17}
              innerShadowSpread={6}
              glassTintColor="rgba(255, 255, 255, 0.18)"
              glassTintOpacity={18}
              frostBlurRadius={5}
              noiseFrequency={0.011}
              noiseStrength={39}
              className="max-w-[88vw] sm:max-w-none"
            >
              <div className="p-5 text-left w-full h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0958A7] bg-white/70 px-2.5 py-0.5 rounded-full shadow-sm">
                    Verified Match
                  </span>
                  <span className="text-[11px] text-[#48525A] font-semibold">98% Fit</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#262C31] leading-snug">
                    Senior UI/UX Designer
                  </h4>
                  <p className="text-[12px] text-[#48525A] mt-0.5">
                    Remote • $85,000 - $110,000/yr
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/40 text-[12px]">
                  <span className="text-[#48525A] font-medium">Work Wise Talent</span>
                  <span className="text-[#0958A7] font-semibold hover:underline cursor-pointer">
                    Apply Now →
                  </span>
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>

      </div>
    </section>
  );
}
