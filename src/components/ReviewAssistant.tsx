import React, { useState, useEffect } from "react";
import { 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Copy,
  Share2,
  Download,
  QrCode,
  Sparkles,
  ChevronRight,
  UserCheck,
  UserPlus
} from "lucide-react";
import LogoIcon from "./LogoIcon";
import { 
  REVIEW_SERVICE_CATEGORIES, 
  GOOGLE_REVIEW_URL, 
  REVIEW_PAGE_URL, 
  ServiceCategoryConfig,
  CustomerRelationship
} from "../lib/reviewConfig";

export { GOOGLE_REVIEW_URL, REVIEW_PAGE_URL };
export const SERVICE_CATEGORIES = REVIEW_SERVICE_CATEGORIES;

export default function ReviewAssistant() {
  // Step 0: Relationship (New vs Existing)
  // Step 1: Service Category, Subcategory & Optional Brand
  // Step 2: Final Service Experience Summary & Google Review Destination
  const [step, setStep] = useState<number>(0);
  const [relationship, setRelationship] = useState<CustomerRelationship>("new");
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>("cctv");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("CCTV Installation");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");
  
  const [copied, setCopied] = useState<boolean>(false);

  const activeCategory: ServiceCategoryConfig = 
    REVIEW_SERVICE_CATEGORIES.find(c => c.id === selectedServiceId) || REVIEW_SERVICE_CATEGORIES[0];

  // Track privacy-safe local events
  const trackEvent = (eventName: string) => {
    try {
      const stats = JSON.parse(localStorage.getItem("mi_review_assistant_stats") || "{}");
      stats[eventName] = (stats[eventName] || 0) + 1;
      stats.last_updated = new Date().toISOString();
      localStorage.setItem("mi_review_assistant_stats", JSON.stringify(stats));
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    trackEvent("review_assistant_opened");
  }, []);

  // Update default subcategory when service category changes
  const handleSelectCategory = (catId: string) => {
    setSelectedServiceId(catId);
    const cat = REVIEW_SERVICE_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategory(cat.subcategories[0]);
    }
    setSelectedBrand("");
    trackEvent(`category_selected_${catId}`);
  };

  const handleSelectRelationship = (rel: CustomerRelationship) => {
    setRelationship(rel);
    setStep(1);
    trackEvent(`relationship_selected_${rel}`);
  };

  const handleProceedToSummary = () => {
    setStep(2);
    trackEvent("proceed_to_summary");
  };

  const handleOpenGoogle = () => {
    trackEvent("google_review_clicked");
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  const handleCopyReviewLink = async () => {
    try {
      await navigator.clipboard.writeText(REVIEW_PAGE_URL);
      setCopied(true);
      trackEvent("review_link_copied");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = REVIEW_PAGE_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const brandText = selectedBrand && selectedBrand !== "Not sure" && selectedBrand !== "Other / Mixed" 
      ? ` (${selectedBrand})` 
      : "";
    const text = encodeURIComponent(
      `Hello! Thank you for choosing MIINFOTECH for your ${selectedSubcategory}${brandText} service.\n\nPlease share your genuine experience with us on Google:\n${REVIEW_PAGE_URL}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    trackEvent("whatsapp_share_clicked");
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

        {step > 0 && (
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
        {/* SCREEN 0: CUSTOMER RELATIONSHIP (NEW VS EXISTING) */}
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
              <p className="text-sm text-slate-300 leading-relaxed pt-1 font-medium">
                Have you used MIINFOTECH services before?
              </p>
            </div>

            {/* Step 1 Choice Cards */}
            <div className="space-y-3 pt-1">
              {/* Option A: New Customer */}
              <button
                type="button"
                onClick={() => handleSelectRelationship("new")}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/60 p-4 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white block">First-time service</span>
                      <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase">
                        New Customer
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block pt-0.5">
                      Tap if this is your first service with MIInfotech
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Option B: Existing Customer */}
              <button
                type="button"
                onClick={() => handleSelectRelationship("existing")}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 p-4 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white block">I have used MIINFOTECH before</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                        Existing Customer
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block pt-0.5">
                      Tap if you are a returning or ongoing customer
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>

            {/* Policy & Direct Skip */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleOpenGoogle}
                className="w-full text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer py-1.5 transition-colors"
              >
                <span>Or write directly on Google without selecting</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Takes less than 30 seconds • No login required</span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: SERVICE CATEGORY & SUBCATEGORY SELECTION */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            {/* Friendly Relationship Banner */}
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                  {relationship === "new" ? "New Customer" : "Returning Customer"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Step 1 of 2</span>
              </div>
              <p className="text-xs font-semibold text-emerald-400">
                {relationship === "existing"
                  ? "Thank you for continuing to trust MIINFOTECH."
                  : "Thank you for choosing MIINFOTECH."}
              </p>
              <h2 className="text-base font-bold text-white tracking-tight pt-1">
                {relationship === "existing"
                  ? "What service would you like to share your experience about?"
                  : "What service did we provide?"}
              </h2>
            </div>

            {/* 8 Primary Service Category Selector (Pills / Grid) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Select Service Category:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REVIEW_SERVICE_CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedServiceId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-blue-400"}`} />
                      <span className="text-xs truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Subcategory Work Selector */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 block">
                Specific Work Completed ({activeCategory.name}):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeCategory.subcategories.map((sub) => {
                  const isSelected = selectedSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-sm font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {isSelected ? "✓ " : ""}{sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Brand Selection (Only where relevant) */}
            {activeCategory.brands && activeCategory.brands.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Device / Brand (Optional):
                  </label>
                  <span className="text-[10px] text-slate-400 italic">Optional</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.brands.map((b) => {
                    const isSelected = selectedBrand === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBrand(selectedBrand === b ? "" : b)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleProceedToSummary}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenGoogle}
                className="w-full text-xs text-slate-400 hover:text-white py-1.5 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Skip to Google Review</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: SERVICE EXPERIENCE SUMMARY & GOOGLE DESTINATION */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left my-auto">
            
            {/* Header Identity */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-blue-400" />
                <span>MIINFOTECH</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                YOUR SERVICE EXPERIENCE
              </h2>
            </div>

            {/* Clean Experience Summary Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 text-xs">
                <span className="text-slate-400">Customer Type:</span>
                <span className="font-semibold text-white">
                  {relationship === "new" ? "First-time service" : "Returning customer"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 text-xs">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-blue-400">
                  {selectedSubcategory}
                </span>
              </div>

              {selectedBrand && selectedBrand !== "Not sure" && selectedBrand !== "Other / Mixed" && (
                <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 text-xs">
                  <span className="text-slate-400">Brand / Device:</span>
                  <span className="font-semibold text-white">{selectedBrand}</span>
                </div>
              )}

              <div className="pt-1 text-xs text-slate-300 leading-relaxed">
                <p className="font-medium text-emerald-400">
                  {relationship === "existing"
                    ? "Thank you for your continued trust in MIINFOTECH."
                    : "Thank you for choosing MIINFOTECH."}
                </p>
                <p className="text-slate-400 pt-1 text-[11px]">
                  Your genuine feedback helps us improve our service and helps other customers understand our work.
                </p>
              </div>
            </div>

            {/* Primary Google Review CTA Button */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleOpenGoogle}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>SHARE YOUR EXPERIENCE ON GOOGLE</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Secondary Actions Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={REVIEW_PAGE_URL}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Review Page</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyReviewLink}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Review Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>

                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${encodeURIComponent(REVIEW_PAGE_URL)}&bgcolor=ffffff&color=0f172a&margin=4&format=png`}
                  download="miinfotech-review-qr-1200px.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-blue-400 hover:text-blue-300 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </a>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Change service selection
                </button>
              </div>
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
