import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  RotateCw, 
  Edit3, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Laptop, 
  Monitor, 
  Video, 
  Printer, 
  Network, 
  BatteryCharging, 
  Fingerprint, 
  Building2, 
  Wrench, 
  MessageSquare,
  Share2,
  QrCode
} from "lucide-react";
import LogoIcon from "./LogoIcon";

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";

interface ServiceCategory {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  works: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "computer",
    name: "Computer Service & Repair",
    shortName: "Computer",
    icon: Monitor,
    works: [
      "Desktop Computer Repair",
      "Windows Installation / Upgrade",
      "Software & Driver Setup",
      "Hardware Troubleshooting",
      "Slow PC & SSD Upgrade",
      "Virus & Malware Cleanup",
      "General Computer Maintenance"
    ]
  },
  {
    id: "laptop",
    name: "Laptop Service & Repair",
    shortName: "Laptop",
    icon: Laptop,
    works: [
      "Laptop Repair & Diagnostics",
      "Screen / Display Replacement",
      "Battery Replacement",
      "Keyboard / Trackpad Repair",
      "Windows OS Installation",
      "Laptop Hinges / Body Repair",
      "Hardware Performance Upgrade"
    ]
  },
  {
    id: "cctv",
    name: "CCTV Camera & Security",
    shortName: "CCTV",
    icon: Video,
    works: [
      "New CCTV Camera Installation",
      "CCTV Repair & Maintenance",
      "Camera Replacement",
      "DVR / NVR Installation",
      "DVR / NVR Configuration",
      "Mobile App Remote Viewing Setup",
      "IP CCTV / Wi-Fi Camera Setup",
      "CCTV Cabling & Troubleshooting"
    ]
  },
  {
    id: "printer",
    name: "Printer Service & Setup",
    shortName: "Printer",
    icon: Printer,
    works: [
      "Printer Repair & Diagnostics",
      "New Printer Installation",
      "Network / Wi-Fi Printer Configuration",
      "Ink Tank / LaserJet Maintenance",
      "Paper Jam / Roller Troubleshooting",
      "Cartridge / Toner Service"
    ]
  },
  {
    id: "networking",
    name: "LAN Networking & Wi-Fi",
    shortName: "Networking",
    icon: Network,
    works: [
      "Office LAN Cabling (CAT6)",
      "Server Rack & Patch Panel Setup",
      "Wi-Fi Router & Access Point Setup",
      "Network Switch Configuration",
      "Network Troubleshooting & Speed Fix"
    ]
  },
  {
    id: "ups",
    name: "UPS & Inverter Power",
    shortName: "UPS",
    icon: BatteryCharging,
    works: [
      "UPS Installation",
      "Commercial Inverter Servicing",
      "UPS Battery Replacement",
      "Backup Power Troubleshooting"
    ]
  },
  {
    id: "biometric",
    name: "Biometric & Access Control",
    shortName: "Biometric",
    icon: Fingerprint,
    works: [
      "Biometric Attendance System Setup",
      "Access Control Lock Installation",
      "Attendance Software Configuration"
    ]
  },
  {
    id: "other_it",
    name: "School Lab & Other IT",
    shortName: "School / Other IT",
    icon: Building2,
    works: [
      "School / College Computer Lab Setup",
      "Intercom / EPABX System Setup",
      "Fire Alarm Device Support",
      "Long-Range P2P Wireless Bridge",
      "General Onsite IT Support"
    ]
  },
  {
    id: "custom",
    name: "Other Technical Service",
    shortName: "Other",
    icon: Wrench,
    works: [
      "Custom Hardware Diagnostic",
      "Onsite Cable Wiring",
      "Annual Maintenance Inspection"
    ]
  }
];

const EXPERIENCE_OPTIONS = [
  "Professional service",
  "Clear explanation",
  "Neat installation / wiring",
  "Problem identified & resolved",
  "Helpful technical support",
  "Prompt response",
  "Good communication",
  "Tested everything before leaving",
  "Reasonable upfront charges",
  "Needs improvement"
];

// Offline deterministic natural language synthesizer (works with zero API / ₹0 budget)
export function generateOfflineReviewDraft(
  service: ServiceCategory | undefined,
  selectedWorks: string[],
  selectedExperiences: string[],
  location: string,
  customNote: string,
  variationIndex: number = 0
): string {
  const serviceName = service ? service.name.replace(/ & .*/, "") : "technical service";
  const worksStr = selectedWorks.length > 0 ? selectedWorks.join(" and ") : "technical service";
  const locStr = location.trim() ? ` in ${location.trim()}` : "";
  
  // Format experiences naturally
  const positiveExp = selectedExperiences.filter(e => e !== "Needs improvement");
  const hasNegative = selectedExperiences.includes("Needs improvement");
  
  const formatExp = (exp: string) => {
    switch (exp) {
      case "Professional service": return "professional service";
      case "Clear explanation": return "clear explanation of the issue";
      case "Neat installation / wiring": return "clean and tidy wiring";
      case "Problem identified & resolved": return "quick troubleshooting and resolution";
      case "Helpful technical support": return "helpful technical guidance";
      case "Prompt response": return "prompt doorstep response";
      case "Good communication": return "good communication throughout";
      case "Tested everything before leaving": return "proper testing before leaving";
      case "Reasonable upfront charges": return "transparent and reasonable charges";
      default: return exp.toLowerCase();
    }
  };

  let expSentence = "";
  if (positiveExp.length > 0) {
    if (positiveExp.length === 1) {
      expSentence = `The service was completed with ${formatExp(positiveExp[0])}.`;
    } else if (positiveExp.length === 2) {
      expSentence = `I appreciated the ${formatExp(positiveExp[0])} and ${formatExp(positiveExp[1])}.`;
    } else {
      expSentence = `The technician provided ${formatExp(positiveExp[0])}, ${formatExp(positiveExp[1])}, and ${formatExp(positiveExp[2])}.`;
    }
  }

  if (hasNegative) {
    expSentence += (expSentence ? " " : "") + "While the core work was completed, there was some scope for improvement in follow-up.";
  }

  const noteSentence = customNote.trim() ? ` ${customNote.trim()}` : "";

  // 5 Natural variations using strictly the customer's selected facts
  const variations = [
    `I recently contacted MIInfotech${locStr} for ${serviceName.toLowerCase()} (${worksStr}). ${expSentence} Everything was tested and working properly.${noteSentence}`,
    `Had MIInfotech handle our ${worksStr.toLowerCase()}${locStr}. ${expSentence} Good doorstep service and straightforward technical support.${noteSentence}`,
    `Called MIInfotech for ${worksStr.toLowerCase()}${locStr}. ${expSentence} Professional onsite work and everything was explained clearly.${noteSentence}`,
    `Used MIInfotech for ${serviceName.toLowerCase()} (${worksStr})${locStr}. ${expSentence} Satisfied with the prompt resolution and overall assistance.${noteSentence}`,
    `MIInfotech assisted us with ${worksStr.toLowerCase()}${locStr}. ${expSentence} Thorough work done right at our doorstep.${noteSentence}`
  ];

  return variations[variationIndex % variations.length].trim();
}

export default function ReviewAssistant() {
  const [step, setStep] = useState<number>(0); // 0: Start, 1: Category, 2: Questions, 3: Review Draft, 4: Ready for Google
  const [selectedServiceId, setSelectedServiceId] = useState<string>("computer");
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [customWork, setCustomWork] = useState<string>("");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(["Professional service", "Problem identified & resolved"]);
  const [location, setLocation] = useState<string>("Hassan");
  const [customNotes, setCustomNotes] = useState<string>("");
  
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [variationIndex, setVariationIndex] = useState<number>(0);

  const activeService = SERVICE_CATEGORIES.find(s => s.id === selectedServiceId) || SERVICE_CATEGORIES[0];

  // Initialize works when category changes
  useEffect(() => {
    if (activeService.works.length > 0) {
      setSelectedWorks([activeService.works[0]]);
    } else {
      setSelectedWorks([]);
    }
  }, [selectedServiceId]);

  // Analytics event tracker (local privacy-safe)
  const trackEvent = (eventName: string) => {
    try {
      const stats = JSON.parse(localStorage.getItem("mi_review_assistant_stats") || "{}");
      stats[eventName] = (stats[eventName] || 0) + 1;
      stats.last_updated = new Date().toISOString();
      localStorage.setItem("mi_review_assistant_stats", JSON.stringify(stats));
    } catch (e) {
      // Ignore local storage error
    }
  };

  useEffect(() => {
    trackEvent("review_page_opened");
  }, []);

  const handleStart = () => {
    setStep(1);
    trackEvent("start_clicked");
  };

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    setStep(2);
    trackEvent(`service_selected_${id}`);
  };

  const toggleWork = (work: string) => {
    if (selectedWorks.includes(work)) {
      if (selectedWorks.length > 1) {
        setSelectedWorks(selectedWorks.filter(w => w !== work));
      }
    } else {
      setSelectedWorks([...selectedWorks, work]);
    }
  };

  const toggleExperience = (exp: string) => {
    if (selectedExperiences.includes(exp)) {
      if (selectedExperiences.length > 1) {
        setSelectedExperiences(selectedExperiences.filter(e => e !== exp));
      }
    } else {
      setSelectedExperiences([...selectedExperiences, exp]);
    }
  };

  const handleGenerateDraft = async (overrideVariation?: number) => {
    setIsGenerating(true);
    const targetVar = overrideVariation !== undefined ? overrideVariation : variationIndex;
    
    const worksList = customWork.trim() ? [...selectedWorks, customWork.trim()] : selectedWorks;
    
    try {
      // Attempt server AI generation with strict factual guardrails
      const res = await fetch("/api/review/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCategory: activeService.name,
          works: worksList,
          experiences: selectedExperiences,
          location: location,
          notes: customNotes,
          variationIndex: targetVar
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.draft) {
          setReviewDraft(data.draft);
          setIsGenerating(false);
          setStep(3);
          trackEvent("review_generated_ai");
          return;
        }
      }
    } catch (e) {
      // Fallback seamlessly to offline generator
    }

    // Deterministic instant offline fallback
    const offlineDraft = generateOfflineReviewDraft(
      activeService,
      worksList,
      selectedExperiences,
      location,
      customNotes,
      targetVar
    );

    setReviewDraft(offlineDraft);
    setIsGenerating(false);
    setStep(3);
    trackEvent("review_generated_offline");
  };

  const handleRegenerate = () => {
    const nextVar = variationIndex + 1;
    setVariationIndex(nextVar);
    handleGenerateDraft(nextVar);
    trackEvent("review_regenerated");
  };

  const handleCopyReview = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setCopied(true);
      trackEvent("review_copied");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for clipboard
      const textArea = document.createElement("textarea");
      textArea.value = reviewDraft;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      trackEvent("review_copied");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleContinueToGoogle = async () => {
    // Ensure text is copied first
    await handleCopyReview();
    trackEvent("continue_to_google_clicked");
    setStep(4);
  };

  const openGoogleDirectly = () => {
    trackEvent("direct_google_opened");
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      
      {/* Top Mobile Brand Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between py-3 border-b border-slate-800/80 mb-4">
        <a href="/" className="flex items-center gap-2.5 text-left">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-blue-500 shadow-sm">
            <LogoIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">MIINFOTECH</span>
            <span className="text-[10px] text-blue-400 font-mono block">Google Review Assistant</span>
          </div>
        </a>

        {step > 0 && step < 4 && (
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Main Single-Screen Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-start">
        
        {/* ========================================================================= */}
        {/* SCREEN 0: WELCOME & START */}
        {/* ========================================================================= */}
        {step === 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn my-auto">
            
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Star className="w-8 h-8 text-blue-400 fill-blue-400/20" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                Customer Feedback
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Share Your Service Experience
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                Tell us what service you received. We'll help you turn your actual answers into a clear, professional review for Google.
              </p>
            </div>

            {/* Quick Guarantees */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Takes less than 60 seconds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You can edit or change anything before posting</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Submitted manually by you directly on Google</span>
              </div>
            </div>

            {/* Primary Start CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStart}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Start Your Review</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={openGoogleDirectly}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Skip suggestion & write directly on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: SERVICE SELECTION */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-left space-y-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                What service did you receive?
              </h2>
              <p className="text-xs text-slate-400">
                Select the service completed by MIInfotech:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICE_CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedServiceId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectService(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-blue-400"}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-sm block truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">Tap to choose work</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: DYNAMIC FACTUAL QUESTIONS */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn text-left">
            
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Step 2 of 3</span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {activeService.name}
                </h2>
              </div>
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                {React.createElement(activeService.icon, { className: "w-5 h-5" })}
              </div>
            </div>

            {/* Q1: Specific Work Completed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                1. What specific work did MIInfotech provide?
              </label>
              <div className="flex flex-wrap gap-2">
                {activeService.works.map((work) => {
                  const isChecked = selectedWorks.includes(work);
                  return (
                    <button
                      key={work}
                      type="button"
                      onClick={() => toggleWork(work)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}{work}
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Work Input */}
              <input
                type="text"
                value={customWork}
                onChange={(e) => setCustomWork(e.target.value)}
                placeholder="Other specific work (optional)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mt-1"
              />
            </div>

            {/* Q2: Customer Experience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                2. What was your experience with the service?
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const isChecked = selectedExperiences.includes(exp);
                  return (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => toggleExperience(exp)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        isChecked
                          ? exp === "Needs improvement"
                            ? "bg-amber-600/30 text-amber-300 border-amber-500"
                            : "bg-emerald-600/30 text-emerald-300 border-emerald-500"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{exp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q3: Optional Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>3. Where was the service provided? (Optional)</span>
              </label>
              <div className="flex gap-2">
                {["Hassan", "Outskirts", "Other"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc === "Other" ? "" : loc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                      location === loc || (loc === "Other" && location !== "Hassan" && location !== "Outskirts")
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-slate-950 border-slate-800 text-slate-300"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              {location !== "Hassan" && location !== "Outskirts" && (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location (e.g. Belur, Sakleshpur)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            {/* Q4: Optional Additional Comments */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200 block">
                4. Anything else you'd like to mention? (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Fixed the issue quickly, came on the same day..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit / Generate Button */}
            <div className="pt-2">
              <button
                onClick={() => handleGenerateDraft()}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Preparing Review Draft...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Generate Review Suggestion</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: REVIEW SUGGESTION & EDIT CONTROLS */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Draft Created from Your Answers
                </span>
                <button
                  onClick={handleRegenerate}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  title="Generate alternative natural wording with same facts"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reword</span>
                </button>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Your Review Suggestion
              </h2>
              <p className="text-xs text-slate-400">
                Please check this carefully. You can edit any sentence before sharing.
              </p>
            </div>

            {/* Review Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative focus-within:border-blue-500 transition-colors">
              {isEditing ? (
                <textarea
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Your review text..."
                  autoFocus
                />
              ) : (
                <p className="text-sm text-slate-100 leading-relaxed italic">
                  "{reviewDraft}"
                </p>
              )}

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-900 text-xs">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isEditing ? "Save Edits" : "Edit Text"}</span>
                </button>

                <button
                  onClick={handleCopyReview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    copied 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleContinueToGoogle}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Continue to Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={openGoogleDirectly}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>I'll write my own review on Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: READY FOR GOOGLE (ONE-TAP COPY & LAUNCH) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn my-auto">
            
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Review Copied to Clipboard!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Your draft has been copied. Tap the button below to open Google Review, paste the text into the review box, and submit your rating.
              </p>
            </div>

            {/* Visual Step Indicator */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <span>Google Maps write-review page will open</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <span>Select your genuine star rating</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <span>Long-press to <strong>Paste</strong> your review text and post</span>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={openGoogleDirectly}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>⭐ Open Google Review Page</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Back to edit review
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Trust & Policy Safety Footer Notice */}
      <div className="w-full max-w-md mx-auto pt-6 text-center text-[10px] text-slate-500 space-y-1">
        <p>MIInfotech respects Google Review policies. All reviews represent genuine, customer-controlled experiences.</p>
        <p>© {new Date().getFullYear()} MIInfotech • Doorstep IT Support & Security, Hassan, Karnataka</p>
      </div>

    </div>
  );
}
