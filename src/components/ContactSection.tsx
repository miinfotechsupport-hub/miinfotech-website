import React, { useState } from "react";
import { SUPPORTED_BRANDS } from "../types";
import { 
  Phone, Mail, MessageSquare, Facebook, Instagram, Clock, MapPin, 
  Send, CheckCircle, RefreshCw, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Star 
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ContactSection({ showOnly }: { showOnly?: "contact" | "brands" } = {}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Computer & Laptop Repair",
    area: "",
    urgency: "Standard",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<any>(null);

  const getResponseTimeDetails = () => {
    switch (formData.urgency) {
      case "Urgent":
        return {
          callback: "within 10 - 15 minutes",
          onsite: "Onsite dispatch guaranteed within 2 - 4 hours",
          badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
          status: "⚡ Urgent Emergency Priority"
        };
      case "Weekend":
        return {
          callback: "within 1 - 2 hours",
          onsite: "Dispatched during weekend / holiday support slots",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          status: "🗓️ Weekend/Holiday Support"
        };
      case "Standard":
      default:
        return {
          callback: "within 30 - 45 minutes",
          onsite: "Scheduled next-day premium onsite visit",
          badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          status: "⏱️ Standard Dispatch"
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.area) {
      alert("Name, Phone number, and Onsite Location are required to request your doorstep visit.");
      return;
    }
    setIsSubmitting(true);

    const dataToSave = { ...formData };

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: `${formData.category} [${formData.urgency}]`,
        message: `Onsite Location Area: ${formData.area}. Special notes: ${formData.notes || "None"}`,
        status: "pending",
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.from("contact_enquiries").insert(payload);
      if (error) throw error;

      // Log booking to Express backend as well if running full-stack
      try {
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (bkErr) {
        console.warn("Express backend sync omitted or failed:", bkErr);
      }

      setSuccess(true);
      setLastSubmitted(dataToSave);
      setFormData({
        name: "",
        phone: "",
        email: "",
        category: "Computer & Laptop Repair",
        area: "",
        urgency: "Standard",
        notes: ""
      });
    } catch (err: any) {
      console.error("Failed to submit doorstep enquiry:", err);
      alert("Notice: Could not sync with the database. Please call Mohammed Ishtiaqh directly at +91 9964761624!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const workingHours = [
    { day: "Monday", hours: "9:00 AM - 9:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 9:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 9:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 9:00 PM" },
    { day: "Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 9:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 9:00 PM (Emergency Support)" }
  ];

  const categories = [
    "Computer & Laptop Repair",
    "CCTV & Surveillance Installation",
    "Networking & Structured Cabling",
    "Corporate AMC (Annual Maintenance)",
    "Printers & Peripherals Support",
    "UPS & Power Backup Solutions",
    "Intercom & EPABX Systems",
    "Fire Alarm & Safety Panels",
    "Other IT Support Inquiry"
  ];

  if (showOnly === "brands") {
    return (
      <section id="brands-section" className="py-16 bg-slate-950 text-left border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div id="brands-subsection">
            <div className="text-center max-w-3xl mx-auto mb-10 animate-fadeIn">
              <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Expert Certifications</span>
              <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                Brands We Proudly Support Onsite
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                We source OEM components and configure professional systems from world-class tech leaders.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 animate-fadeIn">
              {SUPPORTED_BRANDS.map((brand, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-slate-700 transition-colors"
                >
                  <span className="text-white font-bold text-sm tracking-wide">{brand.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Authorized Repair Spares</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-section" className="py-16 md:py-24 bg-slate-950 text-left border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SUPPORTED BRANDS GRID */}
        {!showOnly && (
          <div id="brands-subsection" className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Expert Certifications</span>
              <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                Brands We Proudly Support Onsite
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                We source OEM components and configure professional systems from world-class tech leaders.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {SUPPORTED_BRANDS.map((brand, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-slate-700 transition-colors"
                >
                  <span className="text-white font-bold text-sm tracking-wide">{brand.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Authorized Repair Spares</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTACT LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-12">
          
          {/* LEFT PANEL: Business details & Working Hours */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Get In Touch</span>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white mt-1 tracking-tight">
                  Contact Mohammed Ishtiaqh
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
                  Have a malfunctioning computer, broken laptop hinge, network drop, or security installation enquiry? Reach out directly. We visit your doorstep anywhere in Hassan.
                </p>
              </div>

              {/* Direct Contact Links */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                <a 
                  href="tel:+919964761624" 
                  className="flex items-center gap-3.5 bg-slate-900 border border-slate-850 p-4 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">Call Founder Directly</span>
                    <strong className="text-white text-base block mt-0.5">+91 99647 61624</strong>
                  </div>
                </a>

                <a 
                  href="https://wa.me/919964761624?text=Hi%20MIInfotech,%20I%20need%20onsite%20support." 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3.5 bg-slate-900 border border-slate-850 p-4 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group"
                >
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">Chat on WhatsApp</span>
                    <strong className="text-white text-base block mt-0.5">+91 99647 61624</strong>
                  </div>
                </a>

                <a 
                  href="https://share.google/hnUk6Bt7LUOFrdL2g" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3.5 bg-slate-900 border border-slate-850 p-4 rounded-xl hover:border-amber-500 transition-colors cursor-pointer group"
                >
                  <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left flex-grow">
                    <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">Find Us On Google</span>
                    <strong className="text-white text-sm sm:text-base block mt-0.5">Google Business Profile</strong>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
                    ★ 5.0 Rating
                  </span>
                </a>

                <a 
                  href="mailto:miinfotech.support@gmail.com" 
                  className="flex items-center gap-3.5 bg-slate-900 border border-slate-850 p-4 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">Official Support Email</span>
                    <strong className="text-white text-sm sm:text-base block mt-0.5">miinfotech.support@gmail.com</strong>
                  </div>
                </a>

              </div>

              {/* Social Channels Connect */}
              <div className="space-y-3 pt-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">Follow Our Work On Social Media:</span>
                <div className="flex gap-2">
                  <a 
                    href="https://www.facebook.com/share/18nFLrKJ1a/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Facebook className="w-4.5 h-4.5 fill-current" />
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/miinfotech.in" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-slate-800 hover:border-purple-500 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Instagram className="w-4.5 h-4.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Business operating timings panel */}
            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl">
              <h4 className="text-white font-bold text-xs uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Onsite Service Hours
              </h4>
              <div className="space-y-2 text-xs">
                {workingHours.map((wh) => (
                  <div key={wh.day} className="flex justify-between items-center text-slate-400 border-b border-slate-950/40 pb-1.5 last:border-b-0 last:pb-0">
                    <span className="font-semibold">{wh.day}:</span>
                    <span className="text-slate-200 font-mono">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: High-conversion Lead Form without Cost Calculations */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-xl relative text-left">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl -z-10" />

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase font-mono tracking-widest">Doorstep IT Dispatch</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Onsite Visit & Callback Request</h3>
                  <p className="text-xs text-slate-400 mt-1">Provide details below to book your physical onsite service, repair check or IT setup.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-name" className="block text-slate-400 text-xs font-semibold mb-1">Your Full Name *</label>
                    <input
                      id="form-name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g., Kiran Gowda"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-phone" className="block text-slate-400 text-xs font-semibold mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      id="form-phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g., +91 99647 61624"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-email" className="block text-slate-400 text-xs font-semibold mb-1">Email Address (Optional)</label>
                    <input
                      id="form-email"
                      type="email"
                      name="email"
                      placeholder="e.g., kiran@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-category" className="block text-slate-400 text-xs font-semibold mb-1">Required Service Category</label>
                    <select
                      id="form-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-area" className="block text-slate-400 text-xs font-semibold mb-1">Your Onsite Location / Address *</label>
                    <input
                      id="form-area"
                      type="text"
                      name="area"
                      required
                      placeholder="e.g., Kuvempu Nagar, Hassan"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-urgency" className="block text-slate-400 text-xs font-semibold mb-1">Response Priority</label>
                    <select
                      id="form-urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      <option value="Standard">Standard Schedule (Next-Day)</option>
                      <option value="Urgent">Urgent Emergency (2-4 Hrs Dispatch)</option>
                      <option value="Weekend">Weekend / Holiday Visit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="form-notes" className="block text-slate-400 text-xs font-semibold mb-1">Describe symptoms, device models, or wiring needs *</label>
                  <textarea
                    id="form-notes"
                    name="notes"
                    required
                    rows={4}
                    placeholder="e.g., HP LaserJet prints blank pages / CCTV camera signal loss / need structured CAT6 routing across 2 floors..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none text-xs sm:text-sm resize-none transition-colors"
                  />
                </div>

                {/* Estimated Response Time Indicator */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block font-bold">Estimated Response Time</span>
                      <strong className="text-white text-xs sm:text-sm block mt-0.5">
                        Callback expected <span className="text-blue-400">{getResponseTimeDetails().callback}</span>
                      </strong>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        {getResponseTimeDetails().onsite}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border self-start sm:self-center shrink-0 ${getResponseTimeDetails().badgeColor}`}>
                    {getResponseTimeDetails().status}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting Doorstep Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Doorstep Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-6 animate-scaleIn flex-grow flex flex-col justify-center items-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Visit Request Logged!</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{lastSubmitted?.name}</strong>. Your doorstep request for <strong className="text-white">{lastSubmitted?.category}</strong> has been saved.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                  <a
                    href={`https://wa.me/919964761624?text=${encodeURIComponent(
                      `Hi MIInfotech,\n\n` +
                      `I just submitted an onsite visit request on your website. Here are my details:\n\n` +
                      `• *Customer Name*: ${lastSubmitted?.name || ""}\n` +
                      `• *Phone Number*: ${lastSubmitted?.phone || ""}\n` +
                      `• *Email*: ${lastSubmitted?.email || "N/A"}\n` +
                      `• *Requirement*: ${lastSubmitted?.category || ""}\n` +
                      `• *Onsite Area*: ${lastSubmitted?.area || ""}\n` +
                      `• *Priority*: ${lastSubmitted?.urgency || ""}\n` +
                      `• *Service Address & Description*: ${lastSubmitted?.notes || ""}\n\n` +
                      `Please coordinate dispatch. Thank you!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Verify and Send on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setLastSubmitted(null);
                    }}
                    className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white px-5 py-3 rounded-xl text-xs font-mono transition-colors cursor-pointer font-semibold"
                  >
                    New Request
                  </button>
                </div>
              </div>
            )}

            {/* Safe service badge footer */}
            <div className="border-t border-slate-850 pt-5 mt-6 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Data Safe Policy
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
                100% Doorstep Satisfaction
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
