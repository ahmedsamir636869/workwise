import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LiquidGlassFilter } from "@/components/LiquidGlassOrb";
import { LiquidGlassProvider } from "@/context/LiquidGlassContext";
import LiquidGlassCMSDrawer from "@/components/LiquidGlassCMS/LiquidGlassCMSDrawer";

import { ThemeProvider } from "@/context/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Work Wise – Your Next Opportunity Starts Here",
  description: "Explore exciting career opportunities, build your skills, and take the next step with a team that believes in your potential.",
  keywords: ["Jobs", "Careers", "Work Wise", "Recruitment", "Talent Acquisition", "Egypt Careers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${poppins.variable} ${playfair.variable}`} data-theme="dark">
      <body className="min-h-screen bg-[#060C16] text-white dark:bg-[#060C16] dark:text-white antialiased selection:bg-[#0958A7] selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <LiquidGlassProvider>
            {/* Global Liquid Glass Optical Refraction Filter */}
            <LiquidGlassFilter />
            {children}
            {/* Floating Liquid Glass CMS Control Widget */}
            <LiquidGlassCMSDrawer />
          </LiquidGlassProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
