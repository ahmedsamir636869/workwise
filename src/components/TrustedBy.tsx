"use client";

import React from "react";
import Image from "next/image";

const PARTNERS = [
  { name: "Teleperformance", src: "/assets/teleperformance_partner.png", width: 215, height: 54 },
  { name: "Foundever", src: "/assets/foundever_partner.png", width: 250, height: 54 },
  { name: "Xceed", src: "/assets/xceed_partner.png", width: 118, height: 54 },
  { name: "Concentrix", src: "/assets/concentrix_partner.png", width: 162, height: 25 },
  { name: "Vodafone", src: "/assets/vodafone_partner.png", width: 162, height: 49 },
  { name: "Sutherland", src: "/assets/sutherland_partner.png", width: 220, height: 34 },
];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#FFFFFF] flex justify-center py-16 overflow-hidden">
      <div 
        className="flex flex-col items-center w-full max-w-[1440px] px-4"
        style={{ gap: "39px" }}
      >
        
        {/* Title */}
        <h2 
          className="text-[#262C31] text-center"
          style={{ fontFamily: "'thmanyah serif display', serif", fontWeight: 700, fontSize: "32px", lineHeight: "40px", width: "100%", maxWidth: "477px" }}
        >
          Trusted by leading companies
        </h2>

        {/* Logos Row */}
        <div 
          className="flex flex-row items-center justify-start lg:justify-center w-full overflow-x-auto pb-4 custom-scrollbar"
          style={{ gap: "32px" }}
        >
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="relative shrink-0"
              style={{ width: `${partner.width}px`, height: `${partner.height}px` }}
            >
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
