"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Work wise helped me find the right opportunity and prepared me for every step. The process was smooth and professional.",
    name: "Mariam Ahmed",
    role: "Customer Service Specialist",
    avatar: "/assets/testimonial_avatar.png",
    company: "Teleperformance",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "The personalized career guidance was unmatched. I landed a senior role at a global tech leader within two weeks of my initial application.",
    name: "Omar Hassan",
    role: "Technical Support Engineer",
    avatar: "/assets/testimonial_avatar.png",
    company: "Concentrix",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "From interview prep to contract negotiation, the recruitment advisors were supportive, transparent, and truly invested in my success.",
    name: "Nouran Khalil",
    role: "HR Operations Associate",
    avatar: "/assets/testimonial_avatar.png",
    company: "Vodafone",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1B2A] tracking-tight font-serif mb-4">
            People. Progress. <span className="text-[#0066FF]">Opportunities.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-sans">
            Real stories from people who found more than just a job.
          </p>
        </div>

        {/* Testimonials 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon */}
                <div className="text-[#0066FF] mb-6 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Quote className="w-6 h-6 fill-[#0066FF]" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-base text-slate-700 leading-relaxed font-sans mb-8">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0D1B2A]">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
