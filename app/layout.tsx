import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHAMPIONS TROPHY 2026",
  description: "Live Dashboard and Leaderboards for Champions Trophy 2026",
};

// --- Custom Navbar Component ---
function Navbar() {
  return (
    <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-black italic tracking-wider text-xl transition-opacity hover:opacity-80">
              CT<span className="text-emerald-500">26</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-2 sm:space-x-6">
            <Link
              href="/"
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all"
            >
              HOME
            </Link>
            <Link
              href="/leaderboard/runs"
              className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 px-3 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all"
            >
              🟠 RUNS
            </Link>
            <Link
              href="/leaderboard/wickets"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-2 rounded-md text-xs sm:text-sm font-bold tracking-wide transition-all"
            >
              🟣 WICKETS
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 
        Added bg-slate-950 and text-slate-200 to the body so the dark theme 
        is consistently applied everywhere, preventing white flashes during loads.
      */}
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
        <Navbar />
        {/* main wrapper ensures the children take up the remaining screen space */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}