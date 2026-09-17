import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${poppins.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#F3F8FF] text-slate-900 antialiased selection:bg-[#0958A7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
