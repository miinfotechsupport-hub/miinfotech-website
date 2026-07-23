import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, Menu, X, Shield, MapPin, Cpu, Clock } from "lucide-react";
import LogoIcon from "./LogoIcon";
import { useSettings } from "../lib/supabase";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects & Work" },
    { id: "blog", label: "Tech Tips" },
    { id: "faqs", label: "FAQs" },
    { id: "contact", label: "Contact & Quote" }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header id="main-header" className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* Top Utility Banner */}
      <div className="bg-slate-950 text-slate-400 text-xs py-1.5 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              Onsite Support: <strong className="text-slate-200">Hassan, Karnataka</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Service Hours: <span className="text-slate-200">{settings.opening_hours_mon_sat || "9:00 AM - 9:00 PM"}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-500 font-medium">● Doorstep Service Area Business (No Walk-in Shop)</span>
            <a href={`mailto:${settings.email_support || "miinfotech.support@gmail.com"}`} className="hover:text-white transition-colors">
              {settings.email_support || "miinfotech.support@gmail.com"}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full py-4 px-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800" 
          : "bg-slate-950/80 backdrop-blur-sm border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Brand Group */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer group animate-fadeIn"
            onClick={() => handleNavClick("home")}
          >
            {settings.logo_url ? (
              <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-md w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg overflow-hidden shrink-0">
                <img 
                  src={settings.logo_url} 
                  alt={settings.business_name || "MI INFOTECH"} 
                  loading="eager"
                  className="h-full w-full object-contain rounded-lg" 
                />
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-blue-500 shadow-md group-hover:border-blue-500/30 transition-all shrink-0">
                <LogoIcon className="w-8 h-8 text-blue-500 transition-transform group-hover:scale-105" />
              </div>
            )}
            <div>
              <span className="font-sans font-bold text-xl text-white tracking-tight flex items-center gap-1">
                {(() => {
                  const name = settings.business_name || "MI INFOTECH";
                  const parts = name.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        {parts[0]} <span className="text-blue-500">{parts.slice(1).join(" ")}</span>
                      </>
                    );
                  }
                  return <span className="text-blue-500">{name}</span>;
                })()}
              </span>
              <p className="text-[9px] text-blue-400 tracking-wider uppercase font-bold font-mono">
                Computer • Laptop • CCTV • Networking
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "text-white bg-blue-600/10 border border-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919964761624"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-sans text-sm font-semibold px-4.5 py-2 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>+91 9964761624</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 py-4 px-4 absolute w-full top-full left-0 shadow-xl flex flex-col gap-3 animate-fadeIn">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+919964761624"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors"
              >
                <Phone className="w-4 h-4 fill-current" />
                Call Now
              </a>
              <a
                href="https://wa.me/919964761624?text=Hi%20MIInfotech,%20I%20have%20an%20enquiry%20regarding%20your%20IT%20services."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                +91 99647 61624
              </a>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-1">
              Onsite Support: Hassan City & Surrounding Areas
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
