"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="about" className="py-14 sm:py-20 bg-transparent overflow-hidden">
      {/* Container - Matches Figma Frame 47 (width: 1438px, bg: #FFFFFF, radius: 16px) */}
      <div className="max-w-[1438px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-white rounded-2xl sm:rounded-[24px] p-6 sm:p-10 lg:p-14 border border-slate-200/70 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Text Column - Matches Figma Frame 46 (width: 533px) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#262C31] tracking-tight leading-[40px] sm:leading-[50px]">
                See what happens <br />
                behind every <br />
                opportunity.
              </h2>
              
              <p className="font-sans text-base sm:text-[18px] text-[#262C31] leading-[27px] max-w-[371px] pt-1">
                Meet the people and process helping candidates move from application to
                opportunity.
              </p>
            </div>

            {/* Right Video Preview Column - Matches Figma Group 5 (width: 721px, height: 423px) */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full aspect-[721/423] rounded-[24px] overflow-hidden group cursor-pointer border border-slate-100 shadow-md"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src="/assets/video_thumbnail.png"
                  alt="Behind the scenes at Work Wise"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Translucent overlay matching Figma Rectangle 13 */}
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

                {/* 3D Liquid Glass Play Button - Matches Figma Buttons (136px × 136px) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="liquid-glass-play w-20 h-20 sm:w-[120px] sm:h-[120px] lg:w-[136px] lg:h-[136px] flex items-center justify-center group-hover:scale-105 transition-all duration-300 select-none relative overflow-hidden">
                    {/* Diagonal Optical Glass Lens Reflection Streak */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-full z-[3] opacity-60"
                      style={{
                        background:
                          "linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.4) 38%, rgba(255, 255, 255, 0.8) 44%, transparent 56%)",
                      }}
                    />
                    <Play className="w-8 h-8 sm:w-11 sm:h-11 lg:w-14 lg:h-14 text-white fill-white translate-x-1 drop-shadow-sm relative z-10" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setIsPlaying(false)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                aria-label="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Work Wise Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
