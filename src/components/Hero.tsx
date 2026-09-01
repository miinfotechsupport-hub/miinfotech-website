import React from "react";
import { Phone, MessageSquare, ShieldCheck, MapPin, Award, Star, ArrowRight, UserCheck } from "lucide-react";
import LogoIcon from "./LogoIcon";

interface HeroProps {
  onQuoteClick: () => void;
  onExploreServicesClick: () => void;
}

export default function Hero({ onQuoteClick, onExploreServicesClick }: HeroProps) {
  return (
    <section id="hero-section" className="relative bg-slate-950 pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-slate-800">
      {/* Visual Tech grid background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.25),rgba(255,255,255,0))]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_120px,rgba(59,130,246,0.08),transparent_70%)] hidden md:block" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy Grid Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* SEO Keyword-Rich Local Trust Badge & Previous Logo Slogan */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-semibold w-fit tracking-wide uppercase font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>Onsite IT Support & Security in Hassan, Karnataka</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-bold w-fit tracking-wide uppercase font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Complete IT & Security</span>
              </div>
            </div>

            {/* Main Single H1 - Localized, Clear, and Actionable */}
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Computer Repair, Laptop Service & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">CCTV Installation</span> in Hassan
            </h1>

            {/* Subtitle establishing SAB Service Model (No Physical Shop) & Founder */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Doorstep <strong className="text-white">Computer Repair in Hassan</strong>, Laptop Repair, Printer Repair, and <strong className="text-white">CCTV Camera Installation in Hassan</strong> by founder <strong className="text-white">Mohammed Ishtiaqh</strong> directly at your home, office, or shop.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-blue-400 font-mono">
              <span>Same-day service</span>
              <span className="text-slate-600">•</span>
              <span>Quality replacement parts available</span>
              <span className="text-slate-600">•</span>
              <span>Experienced technicians</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400">Doorstep Service Across Hassan & Nearby Areas</span>
            </div>

            {/* Key Value Proposition Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 text-sm mt-2">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Quality Parts & Careful Data Handling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Professional Doorstep Diagnosis by Mohammed Ishtiaqh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <span>Google reviews from real customers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Clear Service Estimates & Professional Support</span>
              </div>
            </div>

            {/* Call To Action Buttons (Lead Generation Driven) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
              <button
                onClick={onQuoteClick}
                className="bg-blue-600 hover:bg-blue-500 text-white font-sans text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Request Onsite Support</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onExploreServicesClick}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-sans text-base font-semibold px-6 py-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Services & Rates
              </button>
            </div>

            {/* Primary Action Fastlinks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-slate-900/50 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-500 font-mono">Quick Contact:</span>
              <a href="tel:+919964761624" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <span className="p-1 bg-blue-500/10 rounded text-blue-400">📞</span> Call +91 9964761624
              </a>
              <a 
                href="https://wa.me/919964761624?text=Hi%20MIInfotech,%20I%20would%20like%20to%20enquire%20about%20your%20onsite%20services." 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <span className="p-1 bg-emerald-500/10 rounded text-emerald-400">💬</span> WhatsApp +91 9964761624
              </a>
            </div>
          </div>

          {/* Graphical Live Stats & Lead Generator Widget Column */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-xl text-blue-500 flex-shrink-0">
                    <LogoIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans font-bold text-lg">MI Infotech</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Hassan, Karnataka</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full text-blue-400 text-xs font-mono font-bold">
                  Onsite Support
                </span>
              </div>

              {/* Grid of Key Local Facts */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Service Delivery</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white block mt-1 tracking-tight">Doorstep / Onsite</span>
                  <span className="text-[10px] text-blue-400 font-medium mt-0.5 block">Hassan City & Outskirts</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Operating Hours</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white block mt-1 tracking-tight">9 AM – 9 PM</span>
                  <span className="text-[10px] text-emerald-400 font-medium mt-0.5 block">Monday – Sunday</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Direct Assistance</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white block mt-1 tracking-tight">+91 9964761624</span>
                  <span className="text-[10px] text-blue-400 font-medium mt-0.5 block">Direct Call & WhatsApp</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Google Profile</span>
                  <a 
                    href="https://share.google/hnUk6Bt7LUOFrdL2g"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base sm:text-lg font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1 tracking-tight"
                  >
                    <span>View Reviews</span>
                    <span className="text-xs">↗</span>
                  </a>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Google Business Profile</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
