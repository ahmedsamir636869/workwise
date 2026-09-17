"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  const handleExploreClick = () => {
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full flex justify-center py-12 md:py-16 px-4 bg-[#FFFFFF]">
      <div 
        className="relative shrink-0 overflow-hidden w-full max-w-[1280px] aspect-[1280/315] shadow-sm"
        style={{ 
          borderRadius: "37px" 
        }}
      >
        <Image
          src="/assets/image.png"
          alt="Ready for what's next? Explore new opportunities, build your skills, and let's create a brighter future together."
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/1280x315.png?text=Banner+Image";
          }}
        />

        {/* Real interactive 'Explore Jobs' button positioned directly above the button in the photo */}
        <button
          type="button"
          onClick={handleExploreClick}
          aria-label="Explore Jobs"
          className="group absolute flex items-center justify-center gap-1.5 sm:gap-2 rounded-full font-sans font-semibold text-white cursor-pointer select-none transition-all duration-200 shadow-md hover:shadow-xl hover:brightness-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300/60"
          style={{
            left: "56.6%",
            top: "65.8%",
            width: "12.9%",
            height: "14.8%",
            minWidth: "115px",
            minHeight: "34px",
            backgroundColor: "#F7BD47",
            fontSize: "clamp(11px, 1.1vw, 15px)",
          }}
        >
          <span className="tracking-normal leading-none">Explore Jobs</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
        </button>
      </div>
    </section>
  );
}
