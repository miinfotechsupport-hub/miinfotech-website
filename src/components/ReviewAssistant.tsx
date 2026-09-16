import React, { useState, useMemo, useEffect } from "react";
import { 
  Star, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquarePlus, 
  MapPin, 
  ShieldCheck, 
  PenTool,
  Clock,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { 
  GOOGLE_REVIEW_URL, 
  REVIEW_PAGE_URL,
  CUSTOMER_REVIEW_SERVICES,
  CustomerServiceItem,
  generateDeterministicReview,
  generateReviewDraftOptions,
  ReviewDraftOption,
  ReviewDraftInput,
  ReviewTone
} from "../lib/reviewConfig";

export { GOOGLE_REVIEW_URL, REVIEW_PAGE_URL };

const EXPERIENCE_OPTIONS = [
  "Professional Work",
  "Good Communication",
  "Quick Response",
  "Neat Installation",
  "Problem Solved",
  "Good Explanation",
  "Good Service"
];

const LOCATION_OPTIONS = [
  { id: "hassan", label: "Hassan (Doorstep / On-site)" },
  { id: "outskirts", label: "Hassan Outskirts / Nearby Taluk" },
  { id: "other", label: "Other Area" }
];

export default function ReviewAssistant() {
  // Wizard Step: 1 = Welcome, 2 = Select Services, 3 = Select Work, 4 = Experience & Location, 5 = Review Draft
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedWorkOptions, setSelectedWorkOptions] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    "Professional Work",
    "Good Communication"
  ]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Hassan");
  const [customNote, setCustomNote] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [tone, setTone] = useState<ReviewTone>("courteous");

  // Review Draft State
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [selectedDraftId, setSelectedDraftId] = useState<string>("draft-balanced");
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Display toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Selected service objects
  const selectedServices = useMemo(() => {
    return CUSTOMER_REVIEW_SERVICES.filter((s) => selectedServiceIds.includes(s.id));
  }, [selectedServiceIds]);

  // Step 2: Handle Service Toggle (Max 2)
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds((prev) => prev.filter((item) => item !== id));
      // Remove work options belonging to deselected service
      const svc = CUSTOMER_REVIEW_SERVICES.find((s) => s.id === id);
      if (svc) {
        setSelectedWorkOptions((prev) => prev.filter((w) => !svc.workOptions.includes(w)));
      }
    } else {
      if (selectedServiceIds.length >= 2) {
        showToast("You can select up to 2 services. Choose the services that matter most.");
        return;
      }
      setSelectedServiceIds((prev) => [...prev, id]);
    }
  };

  // Step 3: Handle Work Option Toggle (Max 3 total)
  const toggleWorkOption = (option: string) => {
    if (selectedWorkOptions.includes(option)) {
      setSelectedWorkOptions((prev) => prev.filter((item) => item !== option));
    } else {
      if (selectedWorkOptions.length >= 3) {
        showToast("You can select up to 3 options. Choose the details that matter most to your experience.");
        return;
      }
      setSelectedWorkOptions((prev) => [...prev, option]);
    }
  };

  // Step 4: Handle Experience Toggle (Max 3)
  const toggleExperience = (exp: string) => {
    if (selectedExperiences.includes(exp)) {
      setSelectedExperiences((prev) => prev.filter((item) => item !== exp));
    } else {
      if (selectedExperiences.length >= 3) {
        showToast("You can select up to 3 options. Choose the qualities that matter most.");
        return;
      }
      setSelectedExperiences((prev) => [...prev, exp]);
    }
  };

  // Generate 3 curated Review Draft Options whenever inputs change or user asks for new phrasing
  const draftOptions: ReviewDraftOption[] = useMemo(() => {
    const mainServiceNames = selectedServices.map((s) => s.name);
    const draftInput: ReviewDraftInput = {
      rating,
      selectedServices: mainServiceNames,
      mainServices: mainServiceNames,
      serviceNames: mainServiceNames,
      selectedWork: selectedWorkOptions,
      importantFeatures: selectedWorkOptions,
      experienceSelections: selectedExperiences,
      experiences: selectedExperiences,
      location: selectedLocation,
      customerNotes: customNote,
      customNote,
      variationIndex,
      tone
    };
    return generateReviewDraftOptions(draftInput);
  }, [
    rating,
    selectedServices,
    selectedWorkOptions,
    selectedExperiences,
    selectedLocation,
    customNote,
    variationIndex,
    tone
  ]);

  // Keep draft text synced with selected option
  useEffect(() => {
    const current = draftOptions.find((d) => d.id === selectedDraftId) || draftOptions[0];
    if (current) {
      setReviewDraft(current.text);
    }
  }, [draftOptions, selectedDraftId]);

  // Copy helper
  const handleCopyReview = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setIsCopied(true);
      showToast("Review copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast("Failed to copy. Please select and copy the text manually.");
    }
  };

  // Post to Google: copy review then open link
  const handlePostToGoogle = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setIsCopied(true);
    } catch {
      // Continue opening window even if clipboard write had restrictions
    }
    showToast("Review copied to clipboard! Opening Google...");
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  // Word count calculation
  const wordCount = useMemo(() => {
    const words = reviewDraft.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [reviewDraft]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 max-w-md w-11/12 bg-slate-900 border border-blue-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-3xl space-y-6">
        
        {/* Brand & Progress Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>MIINFOTECH • Hassan Tech Services</span>
          </div>

          {step > 1 && (
            <div className="pt-2 max-w-xs mx-auto">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
                <span>Step {step - 1} of 4</span>
                <span>
                  {step === 2 && "Select Services"}
                  {step === 3 && "Select Actual Work"}
                  {step === 4 && "Experience & Location"}
                  {step === 5 && "Review Draft"}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: WELCOME / START SCREEN */}
        {step === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-8 shadow-2xl">
            <div className="space-y-3 max-w-xl mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MessageSquarePlus className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Share Your Genuine Customer Experience
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Tell us about your real experience with MIINFOTECH. We'll help you create a review draft that you can edit before posting to Google.
              </p>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Takes ~1 minute</div>
                  <div className="text-[11px] text-slate-400">Quick 4-step selector</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center gap-3">
                <PenTool className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">100% Editable</div>
                  <div className="text-[11px] text-slate-400">You tweak every word</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">You're in Control</div>
                  <div className="text-[11px] text-slate-400">Posted only by you</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 max-w-md mx-auto pt-4">
              <button
                id="start-review-flow-btn"
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <span>Start Review</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="pt-2">
                <a
                  id="direct-google-review-btn"
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  <span>I'll write my own review on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SERVICES (MAX 2) */}
        {step === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What service did MIINFOTECH provide?
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Select up to 2 services that were performed for you.
                </p>
              </div>
              <div className="self-start sm:self-center px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                Selected: <span className="text-blue-400 font-bold">{selectedServiceIds.length}</span> / 2
              </div>
            </div>

            {/* 12 Service Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CUSTOMER_REVIEW_SERVICES.map((svc) => {
                const IconComponent = svc.icon;
                const isSelected = selectedServiceIds.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    id={`service-card-${svc.id}`}
                    onClick={() => toggleService(svc.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer min-h-[105px] relative ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 text-blue-400">
                        <CheckCircle2 className="w-4 h-4 fill-blue-500 text-slate-950" />
                      </span>
                    )}
                    <div className={`p-2.5 rounded-xl mb-2 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400"}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold leading-tight">
                      {svc.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium border border-slate-800 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="next-to-work-btn"
                disabled={selectedServiceIds.length === 0}
                onClick={() => setStep(3)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedServiceIds.length > 0
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Next: Select Actual Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Google link fallback */}
            <div className="text-center pt-2">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Skip assistant and write your own review directly on Google
              </a>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT ACTUAL WORK (MAX 3) */}
        {step === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  What specific work was completed?
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Select up to 3 options that best describe the work done.
                </p>
              </div>
              <div className="self-start sm:self-center px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                Selected: <span className="text-blue-400 font-bold">{selectedWorkOptions.length}</span> / 3
              </div>
            </div>

            {/* Service-Specific Work Options */}
            <div className="space-y-6">
              {selectedServices.map((svc) => (
                <div key={svc.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <svc.icon className="w-4 h-4 text-blue-400" />
                    <span>{svc.name} Work Options</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {svc.workOptions.map((opt) => {
                      const isSelected = selectedWorkOptions.includes(opt);
                      return (
                        <button
                          key={opt}
                          id={`work-opt-${opt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
                          onClick={() => toggleWorkOption(opt)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600/15 border-blue-500 text-white"
                              : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] shrink-0 ml-2 ${
                            isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-700"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium border border-slate-800 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="next-to-experience-btn"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
              >
                <span>Next: Service Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SERVICE EXPERIENCE & LOCATION */}
        {step === 4 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How was your experience with our team?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Choose the qualities that best describe the service you received.
              </p>
            </div>

            {/* Experience Chips (Max 3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Service Experience (Select up to 3)
                </label>
                <span className="text-xs text-slate-400">
                  Selected: <strong className="text-blue-400">{selectedExperiences.length}</strong> / 3
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const isSelected = selectedExperiences.includes(exp);
                  return (
                    <button
                      key={exp}
                      id={`experience-btn-${exp.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
                      onClick={() => toggleExperience(exp)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{exp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Service Location</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc.id}
                    id={`location-opt-${loc.id}`}
                    onClick={() => setSelectedLocation(loc.label)}
                    className={`px-4 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      selectedLocation === loc.label
                        ? "bg-blue-600/15 border-blue-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span>{loc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Custom Note */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Add Any Custom Note or Technician Name (Optional)
              </label>
              <input
                type="text"
                id="custom-note-input"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Ishtiaqh explained everything clearly, highly recommended"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium border border-slate-800 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="generate-review-draft-btn"
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Review Draft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW DRAFT & POST TO GOOGLE */}
        {step === 5 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Your Review Drafts are Ready!</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  We've prepared 3 draft options based on your selections. Choose one to edit or copy directly.
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                <span className="text-xs text-slate-400 mr-1 font-medium">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    id={`rating-star-${star}`}
                    onClick={() => setRating(star)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    title={`${star} Star`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Your Selections Summary Card */}
            <div id="your-selections-summary" className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your Selections</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium"
                >
                  Edit Selections
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block mb-1.5">Selected Services:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServices.length > 0 ? (
                      selectedServices.map((svc) => (
                        <span
                          key={svc.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/50 border border-blue-800/60 text-blue-200 font-medium"
                        >
                          <svc.icon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{svc.name}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">General IT Service</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1.5">Work Completed:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorkOptions.length > 0 ? (
                      selectedWorkOptions.map((work) => (
                        <span
                          key={work}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                        >
                          {work}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">General diagnostic & service</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Curated Draft Options Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Choose Your Preferred Review Draft (5 Variations)</span>
                </span>
                <button
                  type="button"
                  id="regenerate-variations-btn"
                  onClick={() => setVariationIndex((prev) => prev + 5)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Try New Variations</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {draftOptions.map((opt) => {
                  const isSelected = opt.id === selectedDraftId;
                  return (
                    <div
                      key={opt.id}
                      id={`draft-card-${opt.id}`}
                      onClick={() => {
                        setSelectedDraftId(opt.id);
                        setReviewDraft(opt.text);
                      }}
                      className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                          : "bg-slate-950/80 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{opt.title}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {opt.tag}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {opt.wordCount} words
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                          "{opt.text}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            isSelected ? "text-blue-400" : "text-slate-400"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Tap to Select</span>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setSelectedDraftId(opt.id);
                            setReviewDraft(opt.text);
                            try {
                              await navigator.clipboard.writeText(opt.text);
                              showToast(`Copied ${opt.title} to clipboard!`);
                            } catch {
                              showToast("Failed to copy. You can edit and copy below.");
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5">
              <span className="text-xs text-slate-400 font-medium px-1 flex items-center gap-1.5">
                <span>Tone Style:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "courteous", label: "Courteous" },
                  { id: "technical", label: "Technical" },
                  { id: "concise", label: "Concise" }
                ].map((t) => (
                  <button
                    key={t.id}
                    id={`tone-btn-${t.id}`}
                    type="button"
                    onClick={() => setTone(t.id as ReviewTone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      tone === t.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Review Draft Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-blue-400" />
                  <span>Selected Review Draft (Click to edit directly)</span>
                </span>
                <span className="text-slate-400">
                  {wordCount} words • <span className="text-emerald-400">40–70 words ideal</span>
                </span>
              </div>

              <textarea
                id="review-draft-textarea"
                rows={5}
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-blue-500 rounded-2xl p-4 text-sm sm:text-base text-slate-100 focus:outline-none leading-relaxed shadow-inner"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  id="reword-review-btn"
                  onClick={() => setVariationIndex((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 text-xs font-medium cursor-pointer transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Try Another Phrasing</span>
                </button>

                <button
                  id="copy-review-btn"
                  onClick={handleCopyReview}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
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

            {/* Primary Action Button: Post to Google */}
            <div className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-4 sm:p-5 space-y-4">
              <button
                id="post-to-google-btn"
                onClick={handlePostToGoogle}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Continue to Google</span>
                <ExternalLink className="w-5 h-5" />
              </button>

              {/* 3 Simple Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>Review or make any edits above</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span>Tap <strong>Continue to Google</strong> (text copies automatically)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span>Paste into Google's review box and submit!</span>
                </div>
              </div>
            </div>

            {/* Alternative & Restart Options */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <button
                onClick={() => setStep(2)}
                className="hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
              >
                ← Change service selections
              </button>

              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 underline underline-offset-2 transition-colors"
              >
                I'd prefer to write my own review directly on Google →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
