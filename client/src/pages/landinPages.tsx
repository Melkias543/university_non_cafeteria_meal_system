import React from "react";
import {
  QrCode,
  CreditCard,
  LayoutGrid,
  Zap,
  Users,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FF4F00] text-white font-sans selection:bg-white selection:text-[#FF4F00]">
      {/* High-Contrast Header */}
      <nav className="sticky top-0 z-50 bg-[#121212] border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF4F00] p-1.5 rounded-md">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">
            System <span className="text-[#FF4F00]">Core</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-[#FF4F00] transition">
              Infrastructure
            </a>
            <a href="#" className="hover:text-[#FF4F00] transition">
              Admin Portal
            </a>
            <a href="#" className="hover:text-[#FF4F00] transition">
              Documentation
            </a>
          </div>

          <Link to="/login">
          <button className="bg-white text-black px-4 py-2 rounded-sm font-black text-[10px] uppercase tracking-tighter hover:bg-[#FF4F00] hover:text-white transition-all">
            Enter System
          </button>

          </Link>
        </div>
      </nav>

      {/* Hero Header with Grid Pattern */}
      <header className="relative px-8 py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-0 opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-black text-white px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-[0.3em]">
            Digital Meal Protocol v1.0
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black leading-[0.75] tracking-[ -0.05em] mb-8">
            ORDER.
            <br />
            SCAN.
            <br />
            EAT.
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-xl leading-snug">
            A high-performance digital ledger for university dining. Removing
            the friction between the student and the kitchen.
          </p>
        </div>
      </header>

      {/* Modern Grid Services */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* QR Service Card */}
          <div className="md:col-span-4 bg-[#121212] p-10 rounded-3xl flex flex-col justify-between min-h-[400px] group transition-all hover:bg-zinc-900 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-start">
              <QrCode
                size={80}
                strokeWidth={1}
                className="text-[#FF4F00] group-hover:rotate-12 transition-transform duration-500"
              />
              <ArrowUpRight
                className="opacity-20 group-hover:opacity-100 transition-opacity"
                size={32}
              />
            </div>
            <div>
              <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter">
                Instant QR Verification
              </h3>
              <p className="text-zinc-400 max-w-md">
                Student-side generation of time-sensitive QR tokens linked
                directly to account balances.
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="md:col-span-2 bg-white text-black p-10 rounded-3xl flex flex-col justify-between shadow-2xl">
            <CreditCard size={48} strokeWidth={1.5} />
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                Real-time Balance
              </h3>
              <p className="text-sm font-medium opacity-60 italic">
                Automated Ledger Updates
              </p>
            </div>
          </div>

          {/* Admin Tools Card */}
          <div className="md:col-span-2 bg-[#FF6A28] p-10 rounded-3xl border border-white/20 flex flex-col justify-between group">
            <Zap size={40} fill="white" />
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              Admin Fast-Track Scan
            </h3>
          </div>

          {/* Infrastructure Card */}
          <div className="md:col-span-4 bg-zinc-100 text-black p-10 rounded-3xl flex items-center gap-8 group overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                Kitchen Protocol
              </h3>
              <p className="text-sm font-medium text-zinc-500 max-w-sm">
                Phase 1 integration focusing on administrative dispatch and
                manual kitchen synchronization.
              </p>
            </div>
            <Users
              size={180}
              className="absolute -right-10 -bottom-10 text-black/5 rotate-12 group-hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Architectural Goals */}
      <section className="bg-black py-24 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <Shield className="text-[#FF4F00]" size={32} />
            <h4 className="text-xl font-bold uppercase tracking-widest">
              Security First
            </h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Encrypted token generation ensures that meal credits cannot be
              duplicated or spoofed.
            </p>
          </div>
          <div className="space-y-4">
            <LayoutGrid size={32} className="text-[#FF4F00]" />
            <h4 className="text-xl font-bold uppercase tracking-widest">
              Centralized Hub
            </h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              One dashboard for admins to manage pricing, student groups, and
              meal availability.
            </p>
          </div>
          <div className="space-y-4">
            <Zap size={32} className="text-[#FF4F00]" />
            <h4 className="text-xl font-bold uppercase tracking-widest">
              Zero Latency
            </h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Optimized for high-traffic periods between lectures to ensure no
              student waits.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-black p-8 text-center border-t border-white/5">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.5em]">
          University Digital Meal System // Terminal Access 2026
        </p>
      </footer>
    </div>
  );
}
