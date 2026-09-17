"use client";

import React from "react";
import {
  Users,
  FileText,
  Globe,
  Search,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

const SERVICES = [
  {
    icon: Users,
    title: "Talent Acquisition",
    description:
      "Find qualified professionals who match your business goals through a strategic recruitment approach.",
  },
  {
    icon: FileText,
    title: "HR Support",
    description:
      "Our HR specialists guide you through the recruitment process, providing continuous support for both employers and candidates.",
  },
  {
    icon: Globe,
    title: "Multilingual Recruitment",
    description:
      "Access top talent across multiple languages and industries with a recruitment process designed for global and local hiring needs.",
  },
  {
    icon: Search,
    title: "Candidate Assessment",
    description:
      "Use advanced assessment tools to evaluate skills, personality and cultural fit so you hire with confidence.",
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description:
      "Help your teams grow with personalized training programs and career development support for long-term success.",
  },
  {
    icon: UsersRound,
    title: "Workforce Solutions",
    description:
      "Get flexible hiring solutions, from temporary staffing to permanent placements, tailored to your business needs.",
  },
];

export default function ServicesGrid() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Heading - Matches Figma Frame 36 */}
        <div className="max-w-[705px] mb-14 lg:mb-16 text-left">
          <h2 className="font-serif text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#262C31] leading-[42px] sm:leading-[50px] mb-3.5 tracking-tight">
            Recruitment solutions built for better hiring.
          </h2>
          <p className="font-sans text-[16px] sm:text-[18px] text-[#262C31] leading-[27px] font-normal">
            Discover a full range of recruitment services designed to help businesses find,
            support and hire the right talent.
          </p>
        </div>

        {/* 6 Services - Matches Figma Frame 98 (2 rows x 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex items-start gap-4 sm:gap-4.5 group"
              >
                {/* 3D Liquid Glass Circular Dome Icon - Matches Figma Buttons (48px × 48px) */}
                <div className="liquid-glass-icon w-[48px] h-[48px] shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 select-none overflow-hidden relative">

                  <Icon className="w-[22px] h-[22px] text-[#0958A7] relative z-10" strokeWidth={1.8} />
                </div>

                {/* Service Text - Matches Figma Frame 84 (width: 336px) */}
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <h3 className="font-serif text-[18px] font-semibold text-[#262C31] leading-[22px] tracking-normal">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[12px] sm:text-[13px] text-[#262C31] leading-[18px] font-normal">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
