"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JobsCarousel from "@/components/JobsCarousel";
import ServicesGrid from "@/components/ServicesGrid";
import VideoSection from "@/components/VideoSection";
import TrustedBy from "@/components/TrustedBy";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#F3F8FF]">
      {/* Top Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Hero Section */}
      <HeroSection
        onExploreClick={() => {
          document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Jobs Carousel */}
      <JobsCarousel />

      {/* Services Grid (Recruitment Solutions) */}
      <ServicesGrid />

      {/* Video & Behind The Scenes */}
      <VideoSection />

      {/* Trusted By Leading Companies */}
      <TrustedBy />

      {/* Testimonials */}
      <Testimonials />

      {/* Call to Action Banner */}
      <CtaBanner />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </main>
  );
}
