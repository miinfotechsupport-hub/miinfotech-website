import React, { useState, useEffect, useMemo } from "react";
import { 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Copy, 
  Clock, 
  Edit3, 
  RotateCw, 
  Sparkles, 
  Info,
  ChevronRight
} from "lucide-react";
import LogoIcon from "./LogoIcon";
import { 
  REVIEW_SERVICE_CATEGORIES, 
  CUSTOMER_EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  GOOGLE_REVIEW_URL, 
  REVIEW_PAGE_URL, 
  ServiceCategoryOption,
  generateDeterministicReview
} from "../lib/reviewConfig";

export { GOOGLE_REVIEW_URL, REVIEW_PAGE_URL };

export default function ReviewAssistant() {
  // Screen 1 = Landing, Screen 2 = Step 1 (Service), Screen 3 = Step 2 (Details/Hardware), Screen 4 = Step 3 (Experience), Screen 5 = Step 4 (Location & Rating), Screen 6 = Generated Review
  const [step, setStep] = useState<number>(1);
  
  // Step 4: Rating (1-5 stars)
  const [rating, setRating] = useState<number>(5);

  // Step 1: Selected Category & Main Services
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("cctv");
  const [selectedMainServices, setSelectedMainServices] = useState<string[]>([]);

  // Step 2: Selected Work Done (Max 5)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatureText, setCustomFeatureText] = useState<string>("");

  // Step 3: Experience Feedback (Max 3)
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  // Step 4: Location & Optional Custom Note
  const [selectedLocation, setSelectedLocation] = useState<string>("Hassan");
  const [customNote, setCustomNote] = useState<string>("");

  // Friendly Limit Message banner
  const [limitNotice, setLimitNotice] = useState<string | null>(null);

  // Review Draft result & editing states
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [draftText, setDraftText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [googleNotice, setGoogleNotice] = useState<boolean>(false);

  // Active Category Object
  const currentCategory: ServiceCategoryOption = useMemo(() => {
    return REVIEW_SERVICE_CATEGORIES.find(c => c.id === selectedCategoryId) || REVIEW_SERVICE_CATEGORIES[0];
  }, [selectedCategoryId]);

  // Compute available Step 2 work options based on active category & all selected main services
  const availableFeatureOptions: string[] = useMemo(() => {
    if (!currentCategory.featureOptions) return [];
    
    if (selectedMainServices.length === 0) {
      return currentCategory.featureOptions["default"] || currentCategory.workOptions || [];
    }

    // Combine feature options from ALL selected main services without duplicates
    const combinedSet = new Set<string>();
    for (const service of selectedMainServices) {
      const options = currentCategory.featureOptions[service];
      if (options && Array.isArray(options)) {
        options.forEach(opt => combinedSet.add(opt));
      }
    }

    if (combinedSet.size === 0) {
      const defaultOpts = currentCategory.featureOptions["default"] || currentCategory.workOptions || [];
      defaultOpts.forEach(opt => combinedSet.add(opt));
    }

    return Array.from(combinedSet);
  }, [currentCategory, selectedMainServices]);

  // Combined work for generation
  const allFeaturesForGeneration = useMemo(() => {
    const list = [...selectedFeatures];
    if (selectedFeatures.includes("Other") && customFeatureText.trim()) {
      list.push(customFeatureText.trim());
    }
    return list;
  }, [selectedFeatures, customFeatureText]);

  // Automatically update generated review draft whenever selections change
  useEffect(() => {
    if (!isEditing) {
      const generated = generateDeterministicReview({
        rating,
        serviceNames: [currentCategory.name],
        mainServices: selectedMainServices,
        importantFeatures: allFeaturesForGeneration,
        experiences: selectedExperiences,
        location: selectedLocation,
        customNote,
        variationIndex
      });
      setDraftText(generated);
    }
  }, [
    rating, 
    currentCategory, 
    selectedMainServices, 
    allFeaturesForGeneration, 
    selectedExperiences, 
    selectedLocation, 
    customNote, 
    variationIndex, 
    isEditing
  ]);

  // Helper to show temporary friendly limit alert
  const triggerLimitAlert = (msg: string) => {
    setLimitNotice(msg);
    setTimeout(() => setLimitNotice(null), 3500);
  };

  // Toggle Category selection
  const handleSelectCategory = (catId: string) => {
    if (catId === selectedCategoryId) return;
    setSelectedCategoryId(catId);
    setSelectedMainServices([]);
    setSelectedFeatures([]);
    setCustomFeatureText("");
  };

  // Toggle Main Service (Max 2)
  const handleToggleMainService = (service: string) => {
    setSelectedMainServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      }
      if (prev.length >= 2) {
        triggerLimitAlert("You can select up to 2 main services. Choose the ones that matter most.");
        return prev;
      }
      return [...prev, service];
    });
  };

  // Toggle Work Done / Task Option (Max 5)
  const handleToggleFeature = (feat: string) => {
    setSelectedFeatures(prev => {
      if (prev.includes(feat)) {
        return prev.filter(f => f !== feat);
      }
      if (prev.length >= 5) {
        triggerLimitAlert("You can select up to 5 options. Choose the details that matter most to your experience.");
        return prev;
      }
      return [...prev, feat];
    });
  };

  // Toggle Experience (Max 3)
  const handleToggleExperience = (exp: string) => {
    setSelectedExperiences(prev => {
      if (prev.includes(exp)) {
        return prev.filter(e => e !== exp);
      }
      if (prev.length >= 3) {
        triggerLimitAlert("You can select up to 3 options. Choose the details that matter most to your experience.");
        return prev;
      }
      return [...prev, exp];
    });
  };

  // Reword variation cycling
  const handleReword = () => {
    setIsEditing(false);
    setVariationIndex(prev => prev + 1);
  };

  // Copy Review text to Clipboard safely
  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    }
  };

  // Copy Review Button
  const handleCopyReview = async () => {
    await copyToClipboard(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Continue to Google Review Action:
  const handleContinueToGoogle = async () => {
    await copyToClipboard(draftText);
    setGoogleNotice(true);
    setTimeout(() => {
      window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
    }, 400);
  };

  // Direct Skip to Google
  const handleDirectGoogle = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return "5 Stars • Highly Satisfied";
      case 4: return "4 Stars • Good & Reliable";
      case 3: return "3 Stars • Fair / Average";
      case 2: return "2 Stars • Needs Improvement";
      case 1: return "1 Star • Dissatisfied";
      default: return "5 Stars";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between py-3 border-b border-slate-800/80 mb-4">
        <a href="/" className="flex items-center gap-2.5 text-left">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-blue-500 shadow-sm">
            <LogoIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">MIINFOTECH</span>
            <span className="text-[10px] text-blue-400 font-mono block">Google Review Assistant</span>
          </div>
        </a>

        {step > 1 && (
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Limit Notice Toast */}
      {limitNotice && (
        <div className="w-full max-w-xl mx-auto mb-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{limitNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-start">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: LANDING SCREEN */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn my-auto w-full">
            
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Star className="w-8 h-8 text-blue-400 fill-blue-400/20" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                CUSTOMER FEEDBACK
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Share Your Service Experience
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Answer 4 quick questions to generate a genuine, natural review suggestion for Google in under 60 seconds.
              </p>
            </div>

            {/* Trust / Speed Points */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-2.5 text-left text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Takes only 30–60 seconds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>You can edit or reword before sharing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Submitted manually by you directly on Google</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Start Your Review</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleDirectGoogle}
                className="w-full text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 py-2 cursor-pointer transition-colors"
              >
                <span>Skip suggestion & Write directly on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: WHAT SERVICE DID YOU RECEIVE? */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  Step 1 of 4: Service
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Select 1–2
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                What service did you receive?
              </h2>
              <p className="text-xs text-slate-400">
                Choose the main technical service provided by MIINFOTECH:
              </p>
            </div>

            {/* Category Selector Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {REVIEW_SERVICE_CATEGORIES.map(cat => {
                const isSelected = selectedCategoryId === cat.id;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400/40"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{cat.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Service Options for Selected Category */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  {currentCategory.shortName} Service (Choose 1–2):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedMainServices.length}/2 selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentCategory.mainServices.map(service => {
                  const isSelected = selectedMainServices.includes(service);
                  const isMaxReached = selectedMainServices.length >= 2;
                  const isDisabled = !isSelected && isMaxReached;
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleToggleMainService(service)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm font-semibold ring-1 ring-blue-400/40 cursor-pointer"
                          : isDisabled
                            ? "bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-60"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer"
                      }`}
                    >
                      <span>{service}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-white text-blue-600 border-white" : "border-slate-700 bg-slate-800"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={selectedMainServices.length === 0}
                onClick={() => setStep(3)}
                className={`w-full font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  selectedMainServices.length > 0
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WHAT WORK WAS DONE? (OPTIONAL) */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  Step 2 of 4: Work Done
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Optional • Select up to 5
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                What work was done?
              </h2>
              <p className="text-xs text-slate-400">
                Choose up to 5 tasks completed by our technician:
              </p>
            </div>

            {/* Smart Dynamic Work Options Grid */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">
                  {currentCategory.shortName} Work Completed (Select up to 5):
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedFeatures.length}/5 selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableFeatureOptions.map(feat => {
                  const isSelected = selectedFeatures.includes(feat);
                  const isMaxReached = selectedFeatures.length >= 5;
                  const isDisabled = !isSelected && isMaxReached;
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => handleToggleFeature(feat)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm font-semibold ring-1 ring-blue-400/40 cursor-pointer"
                          : isDisabled
                            ? "bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-60"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer"
                      }`}
                    >
                      <span className="leading-snug">{feat}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-white text-blue-600 border-white" : "border-slate-700 bg-slate-800"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If 'Other' is checked, show small custom text input */}
              {selectedFeatures.includes("Other") && (
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-semibold text-blue-400 block mb-1">
                    Specify other work:
                  </label>
                  <input
                    type="text"
                    value={customFeatureText}
                    onChange={(e) => setCustomFeatureText(e.target.value)}
                    placeholder="e.g. Rack dressing, power backup wiring..."
                    className="w-full bg-slate-900 border border-blue-500/70 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              )}
            </div>

            {/* Navigation CTAs */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-3.5 px-4 rounded-2xl border border-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: HOW WAS THE SERVICE? */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  Step 3 of 4: Experience
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedExperiences.length}/3 selected
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                How was the service?
              </h2>
              <p className="text-xs text-slate-400">
                Select up to 3 statements that best describe your experience with our team:
              </p>
            </div>

            {/* 7 Clean Customer Experience Options */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CUSTOMER_EXPERIENCE_OPTIONS.map(exp => {
                  const isSelected = selectedExperiences.includes(exp);
                  const isMaxReached = selectedExperiences.length >= 3;
                  const isDisabled = !isSelected && isMaxReached;
                  return (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => handleToggleExperience(exp)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-sm font-semibold ring-1 ring-emerald-400/40 cursor-pointer"
                          : isDisabled
                            ? "bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-60"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer"
                      }`}
                    >
                      <span>{exp}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-white text-emerald-600 border-white" : "border-slate-700 bg-slate-800"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-3.5 px-4 rounded-2xl border border-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={selectedExperiences.length === 0}
                onClick={() => setStep(5)}
                className={`flex-1 font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  selectedExperiences.length > 0
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: LOCATION & OPTIONAL DETAILS */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  Step 4 of 4: Location & Rating
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                Almost done!
              </h2>
              <p className="text-xs text-slate-400">
                Confirm your rating and where the service was provided:
              </p>
            </div>

            {/* Star Rating */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Overall Rating
                </label>
                <span className="text-[11px] font-semibold text-amber-400">
                  {getRatingLabel(rating)}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title={`${starVal} Star`}
                  >
                    <Star 
                      className={`w-7 h-7 transition-colors ${
                        starVal <= rating 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-slate-700 hover:text-slate-500"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                Where was the service provided?
              </label>
              <div className="flex gap-2 pt-0.5">
                {LOCATION_OPTIONS.map((loc) => {
                  const isSelected = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500 font-semibold shadow-sm ring-1 ring-blue-400/40"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Custom Note */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">
                Anything else? (Optional)
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Tell us anything specific you would like included..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Generate CTA */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-3.5 px-4 rounded-2xl border border-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(6)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Generate My Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: GENERATED REVIEW RESULT */}
        {/* ========================================================================= */}
        {step === 6 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn text-left my-auto w-full">
            
            <div className="space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                  READY FOR GOOGLE
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-0.5">
                Your Review Suggestion
              </h2>
              <p className="text-xs text-slate-400">
                Please check this review. You can edit, reword, or copy before posting on Google.
              </p>
            </div>

            {/* Review Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative shadow-inner">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-blue-500 rounded-xl p-3 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                    >
                      Done Editing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed min-h-[60px] select-all">
                  &ldquo;{draftText}&rdquo;
                </div>
              )}

              {/* In-Card Tools */}
              <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={handleReword}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                  title="Generate alternative phrasing from same facts"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reword</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Done" : "Edit Text"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyReview}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
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

            {/* Copy Notification Banner */}
            {googleNotice && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Review copied to clipboard! Paste it into Google's review box and submit.</span>
              </div>
            )}

            {/* Continue to Google CTA */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleContinueToGoogle}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Continue to Google</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleDirectGoogle}
                className="w-full text-xs text-slate-400 hover:text-slate-200 py-1.5 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>I'll write my own review on Google</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Change answers
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Trust & Policy Safety Footer Notice */}
      <div className="w-full max-w-xl mx-auto pt-6 text-center text-[10px] text-slate-500 space-y-1">
        <p>MIInfotech respects Google Review policies. All reviews represent genuine, customer-controlled experiences.</p>
        <p>© {new Date().getFullYear()} MIInfotech • Doorstep IT Support & Security, Hassan, Karnataka</p>
      </div>

    </div>
  );
}
