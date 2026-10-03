import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SkyControls } from "@/components/SkyControls";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nocturne Planetarium",
  description: "Real night sky with accurate star density and scroll-driven sidereal rotation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#03040a] text-neutral-100`}>
        <Nav />
        {children}
        <SkyControls />
      </body>
    </html>
  );
}