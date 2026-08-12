import React, { useState, useEffect } from "react";
import { SERVICES_DATA, ServiceDetail } from "../types";
import * as LucideIcons from "lucide-react";
import { ShieldCheck, Flame, Cpu, MessageSquare, PhoneCall, AlertCircle, Sparkles, Check, Clock, IndianRupee } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ServiceExplorerProps {
  onBookClick: (serviceName: string) => void;
  onViewFullPage?: (id: string) => void;
}

export default function ServiceExplorer({ onBookClick, onViewFullPage }: ServiceExplorerProps) {
  const [servicesList, setServicesList] = useState<ServiceDetail[]>(SERVICES_DATA);
  const [selectedId, setSelectedId] = useState<string>("computer");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from("services").select("*").order("order", { ascending: true });
        if (data && data.length > 0) {
          const mapped = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            iconName: s.iconName || "Monitor",
            tagline: s.tagline || "",
            description: s.description || "",
            seoKeywords: s.seoKeywords || [],
            features: s.features || [],
            symptoms: s.symptoms || [],
            startingPrice: s.startingPrice || "₹450",
            timeframe: s.timeframe || "Same-Day Service"
          }));
          setServicesList(mapped);
          if (!mapped.some((m) => m.id === selectedId)) {
            setSelectedId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load services from DB:", err);
      }
    };
    fetchServices();
  }, []);

  const activeService = servicesList.find((s) => s.id === selectedId) || servicesList[0] || SERVICES_DATA[0];

  // Helper to dynamically render a Lucide icon by its string name
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    // Fallback dictionary for dynamic matching
    const icons: Record<string, React.ComponentType<any>> = {
      Monitor: LucideIcons.Monitor,
      Laptop: LucideIcons.Laptop,
      Printer: LucideIcons.Printer,
      Eye: LucideIcons.Eye,
      Network: LucideIcons.Network,
      BatteryCharging: LucideIcons.BatteryCharging,
      PhoneCall: LucideIcons.PhoneCall,
      ShieldAlert: LucideIcons.ShieldAlert,
      Wifi: LucideIcons.Wifi,
      Briefcase: LucideIcons.Briefcase,
    };
    const IconComponent = icons[iconName] || LucideIcons.Monitor;
    return <IconComponent className={className} />;
  };

  return (
    <section id="services-section" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wide font-mono mb-3">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Professional Onsite IT & Security Services
          </h2>
          <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            MIInfotech provides a complete catalog of professional technical services delivered directly at your doorstep in Hassan.
          </p>
        </div>

        {/* Services Cards Grid with equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group h-full"
            >
              <div>
                {/* Icon Box */}
                <div className="bg-blue-600/10 p-3 rounded-xl text-blue-400 border border-blue-500/10 w-fit group-hover:bg-blue-600/20 group-hover:text-blue-300 transition-colors">
                  {renderIcon(service.iconName, "w-6 h-6")}
                </div>

                {/* Service Name */}
                <h3 className="font-sans text-lg font-bold text-white tracking-tight mt-5 group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h3>

                {/* One-line customer-focused description */}
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
                  {service.tagline}
                </p>
              </div>

              {/* Action Area */}
              <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (onViewFullPage) {
                      onViewFullPage(service.id);
                    } else {
                      window.location.hash = `service/${service.id}`;
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Learn More</span>
                  <LucideIcons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
