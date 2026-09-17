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
import { useTheme } from "@/context/ThemeContext";
import { useLiquidGlass } from "@/context/LiquidGlassContext";

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
  const { isDark } = useTheme();
  const { config } = useLiquidGlass();

  // Connect services icon glass strictly to CMS settings in light mode
  const lightGlassStyle = !isDark
    ? ({
        backgroundColor: `color-mix(in srgb, ${config.navbar.tintColor} ${Math.round(
          Math.max(0.18, config.navbar.tintOpacity * 2.2) * 100
        )}%, rgba(255, 255, 255, 0.76))`,
        borderColor: `color-mix(in srgb, ${config.navbar.borderLightColor} 85%, transparent)`,
        WebkitBackdropFilter: `blur(${config.navbar.blur}px) saturate(${config.navbar.saturation}%) contrast(${config.global.contrastBoost}%) brightness(${config.global.brightnessBoost}%) url(#liquid-glass-nav-filter)`,
        backdropFilter: `blur(${config.navbar.blur}px) saturate(${config.navbar.saturation}%) contrast(${config.global.contrastBoost}%) brightness(${config.global.brightnessBoost}%) url(#liquid-glass-nav-filter)`,
        boxShadow: `
          0 14px 28px -4px rgba(9, 88, 167, 0.22),
          0 6px 14px -1px rgba(0, 0, 0, 0.10),
          0 2px 4px 0 rgba(0, 0, 0, 0.06),
          0 0 0 1px rgba(9, 88, 167, 0.08),
          inset 0 0 0 0.5px color-mix(in srgb, ${config.navbar.borderLightColor} 90%, transparent),
          inset 1.8px 3px 0px -1px color-mix(in srgb, ${config.navbar.borderLightColor} ${Math.round((config.navbar.specularOpacity ?? 0.5) * 1.8 * 100)}%, transparent),
          inset -2px -2px 0px -2px color-mix(in srgb, ${config.navbar.borderLightColor} ${Math.round((config.navbar.bounceIntensity ?? 0.25) * 3 * 100)}%, transparent),
          inset 0 0 ${config.navbar.innerShadowBlur}px ${config.navbar.innerShadowSpread}px rgba(255, 255, 255, 0.35),
          inset -0.5px 1.5px 4px -1px color-mix(in srgb, ${config.navbar.borderDarkColor} 14%, transparent),
          inset -1.5px 2.5px 0px -2px color-mix(in srgb, ${config.navbar.borderDarkColor} 8%, transparent)
        `,
      } as React.CSSProperties)
    : undefined;

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Heading - Matches Figma Frame 36 */}
        <div className="max-w-[705px] mb-14 lg:mb-16 text-left">
          <h2 className={`font-serif text-[32px] sm:text-[38px] lg:text-[40px] font-bold leading-[42px] sm:leading-[50px] mb-3.5 tracking-tight transition-colors duration-200 ${
            isDark ? "text-white" : "text-[#262C31]"
          }`}>
            {isDark ? (
              <>Recruitment solutions built for <span className="text-[#FFBA26]">better hiring.</span></>
            ) : (
              "Recruitment solutions built for better hiring."
            )}
          </h2>
          <p className={`font-sans text-[16px] sm:text-[18px] leading-[27px] font-normal transition-colors duration-200 ${
            isDark ? "text-[#94A3B8]" : "text-[#48525A]"
          }`}>
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
                {/* 3D Liquid Glass Circular Dome Icon - Connected to CMS in Light Mode + 3D Shadow (48px × 48px) */}
                <div 
                  className="service-glass-icon w-[48px] h-[48px] select-none"
                  style={lightGlassStyle}
                >
                  <Icon className={`w-[22px] h-[22px] relative z-10 transition-colors duration-200 ${
                    isDark ? "text-[#38BDF8]" : "text-[#0958A7]"
                  }`} strokeWidth={1.8} />
                </div>

                {/* Service Text - Matches Figma Frame 84 (width: 336px) */}
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <h3 className={`font-serif text-[18px] font-semibold leading-[22px] tracking-normal transition-colors duration-200 ${
                    isDark ? "text-white" : "text-[#262C31]"
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`font-sans text-[12px] sm:text-[13px] leading-[18px] font-normal transition-colors duration-200 ${
                    isDark ? "text-[#94A3B8]" : "text-[#48525A]"
                  }`}>
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
