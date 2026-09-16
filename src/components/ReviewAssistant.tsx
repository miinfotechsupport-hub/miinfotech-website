import React, { useState, useMemo } from "react";
import { 
  Star, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquareQuote, 
  RotateCw, 
  Edit3,
  Building2,
  Lock
} from "lucide-react";
import { GOOGLE_REVIEW_URL, REVIEW_PAGE_URL } from "../lib/reviewConfig";
import { VERIFIED_GOOGLE_REVIEWS_MANUAL, GOOGLE_PROFILE_SUMMARY } from "../lib/verifiedGoogleReviews";
import { GoogleReviewItem } from "../types/googleReviews";

export { GOOGLE_REVIEW_URL, REVIEW_PAGE_URL };

type ReplyTone = "courteous" | "technical" | "concise";

/**
 * Generates an AI Draft Reply for business owners to respond to genuine customer reviews.
 * CRITICAL RULE: NEVER generates a customer review. Only generates owner reply drafts.
 * The draft is never automatically published.
 */
function generateOwnerReplyDraft(
  reviewerName: string,
  reviewText: string,
  rating: number,
  tone: ReplyTone,
  variation: number
): string {
  const cleanName = reviewerName.trim() || "Customer";
  const firstName = cleanName.split(" ")[0];
  const isHighRating = rating >= 4;

  if (!isHighRating) {
    return `Dear ${cleanName}, thank you for taking the time to share your feedback with MIINFOTECH. We take customer satisfaction very seriously. Please reach out to us directly at +91 9964761624 so our senior technician can address your concerns and resolve any pending issues promptly.`;
  }

  // Detect context clues from the original review text
  const lowerText = reviewText.toLowerCase();
  const isCctv = lowerText.includes("cctv") || lowerText.includes("camera");
  const isLaptop = lowerText.includes("laptop") || lowerText.includes("screen");
  const isUps = lowerText.includes("ups") || lowerText.includes("battery");
  const isComputer = lowerText.includes("computer") || lowerText.includes("desktop");

  let serviceMention = "doorstep IT services";
  if (isCctv) serviceMention = "CCTV installation and surveillance service";
  else if (isLaptop) serviceMention = "laptop diagnostics and repair service";
  else if (isUps) serviceMention = "UPS and power backup service";
  else if (isComputer) serviceMention = "computer repair and maintenance";

  if (tone === "concise") {
    const conciseTemplates = [
      `Thank you so much, ${firstName}, for choosing MIINFOTECH for your ${serviceMention} in Hassan! We are glad you were pleased with our service and look forward to assisting you again.`,
      `Hi ${firstName}, thank you for your kind 5-star rating and support for MIINFOTECH! We appreciate your trust in our technical team.`,
      `Thank you, ${firstName}! We are delighted that you had a great experience with our team at MIINFOTECH. Always happy to help with your IT and security needs.`
    ];
    return conciseTemplates[variation % conciseTemplates.length];
  }

  if (tone === "technical") {
    const techTemplates = [
      `Dear ${cleanName}, thank you for your positive review! At MIINFOTECH, our team is committed to high-quality workmanship, neat cabling, and thorough testing before handover for every ${serviceMention}. We truly appreciate your feedback and look forward to supporting your setup in Hassan.`,
      `Hi ${firstName}, we sincerely appreciate your detailed feedback. Ensuring clean hardware installation, proper diagnostics, and reliable long-term performance is always our top priority at MIINFOTECH. Thank you for trusting us with your ${serviceMention}!`,
      `Thank you, ${cleanName}, for recommending MIINFOTECH! We take pride in delivering precise troubleshooting and genuine component solutions for ${serviceMention}. Should you ever need any technical assistance, our doorstep team is always at your service.`
    ];
    return techTemplates[variation % techTemplates.length];
  }

  // Default: courteous
  const courteousTemplates = [
    `Dear ${cleanName}, thank you so much for taking the time to leave this wonderful review for MIINFOTECH in Hassan! We are thrilled to hear that you were satisfied with our ${serviceMention}. Customer trust and responsive support are what we strive for every single day.`,
    `Hi ${firstName}, thank you for your generous 5-star rating! The entire team at MIINFOTECH appreciates your support and recommendation. We are always here to provide dependable doorstep IT and security services whenever you need us.`,
    `Thank you, ${cleanName}, for choosing MIINFOTECH! It was our pleasure to assist you with your ${serviceMention}. We truly appreciate your kind words and look forward to serving you again in the future.`
  ];
  return courteousTemplates[variation % courteousTemplates.length];
}

export default function ReviewAssistant() {
  // Selected review for reply drafting
  const [selectedReviewId, setSelectedReviewId] = useState<string>(
    VERIFIED_GOOGLE_REVIEWS_MANUAL[0]?.reviewId || ""
  );
  const [customReviewer, setCustomReviewer] = useState<string>("");
  const [customComment, setCustomComment] = useState<string>("");
  const [customRating, setCustomRating] = useState<number>(5);
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);

  // Reply generator options
  const [tone, setTone] = useState<ReplyTone>("courteous");
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [editedDraft, setEditedDraft] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Active original review
  const activeReview = useMemo<GoogleReviewItem>(() => {
    if (useCustomInput) {
      return {
        reviewId: "custom-input",
        reviewer: {
          displayName: customReviewer.trim() || "Customer",
        },
        starRating: customRating,
        comment: customComment,
        createTime: new Date().toISOString(),
      };
    }
    return (
      VERIFIED_GOOGLE_REVIEWS_MANUAL.find((r) => r.reviewId === selectedReviewId) ||
      VERIFIED_GOOGLE_REVIEWS_MANUAL[0]
    );
  }, [selectedReviewId, useCustomInput, customReviewer, customComment, customRating]);

  // Generate reply draft
  const generatedReply = useMemo(() => {
    return generateOwnerReplyDraft(
      activeReview.reviewer.displayName,
      activeReview.comment,
      activeReview.starRating,
      tone,
      variationIndex
    );
  }, [activeReview, tone, variationIndex]);

  // Keep editedDraft in sync when not manually editing
  const currentDraftText = isEditingDraft ? editedDraft : generatedReply;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cycleVariation = () => {
    setIsEditingDraft(false);
    setVariationIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Business Profile Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            MIINFOTECH Review Hub & Reply Assistant
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Direct access for customers to submit authentic Google reviews, and an AI-powered draft reply tool for business owners to respond professionally on Google Business Profile.
          </p>
        </div>

        {/* SECTION 1: CUSTOMER DIRECT REVIEW (AUTHENTIC CUSTOMERS ONLY) */}
        <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold">5.0 Star Rated on Google</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Share Your Genuine Customer Experience
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Had our technician install CCTV cameras, service a laptop, or configure your network? Google reviews help other families and businesses in Hassan find dependable local IT care. We never pre-write customer reviews — write your own honest words directly on Google.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                id="write-google-review-direct-btn"
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Write a Review on Google</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 2: OWNER REVIEW REPLY ASSISTANT (AUDITED RULES COMPLIANCE) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-2xl">
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Owner Management Tool</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              AI Draft Reply Generator for Google Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Draft professional, courteous owner replies to genuine customer reviews. The original customer review remains 100% untouched. Drafts are never automatically published.
            </p>
          </div>

          {/* Review Selection Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Customer Review to Respond To
              </label>
              <button
                onClick={() => setUseCustomInput(!useCustomInput)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer"
              >
                {useCustomInput ? "Choose from verified reviews" : "+ Paste a custom review"}
              </button>
            </div>

            {!useCustomInput ? (
              <select
                id="select-customer-review"
                value={selectedReviewId}
                onChange={(e) => {
                  setSelectedReviewId(e.target.value);
                  setIsEditingDraft(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {VERIFIED_GOOGLE_REVIEWS_MANUAL.map((r) => (
                  <option key={r.reviewId} value={r.reviewId}>
                    {r.reviewer.displayName} ({r.starRating}★) — "{r.comment.slice(0, 60)}..."
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={customReviewer}
                      onChange={(e) => setCustomReviewer(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Rating</label>
                    <select
                      value={customRating}
                      onChange={(e) => setCustomRating(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                      <option value={2}>2 Stars ★★☆☆☆</option>
                      <option value={1}>1 Star ★☆☆☆☆</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Original Review Comment</label>
                  <textarea
                    rows={3}
                    placeholder="Paste the customer's exact review text here..."
                    value={customComment}
                    onChange={(e) => setCustomComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 1. ORIGINAL CUSTOMER REVIEW DISPLAY (LOCKED & UNTOUCHED) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {activeReview.reviewer.displayName}
                </span>
                <div className="flex text-amber-400">
                  {Array.from({ length: activeReview.starRating }, (_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
                <Lock className="w-3 h-3" />
                Original Review Untouched
              </span>
            </div>
            <p className="text-slate-300 text-sm italic whitespace-pre-line leading-relaxed border-l-2 border-slate-700 pl-3">
              "{activeReview.comment || "(Rating submitted without comment)"}"
            </p>
          </div>

          {/* 2. AI DRAFT REPLY CONTROLS & DISPLAY */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Reply Tone:
                </span>
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      setTone("courteous");
                      setIsEditingDraft(false);
                    }}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      tone === "courteous" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Courteous
                  </button>
                  <button
                    onClick={() => {
                      setTone("technical");
                      setIsEditingDraft(false);
                    }}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      tone === "technical" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Technical
                  </button>
                  <button
                    onClick={() => {
                      setTone("concise");
                      setIsEditingDraft(false);
                    }}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      tone === "concise" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Concise
                  </button>
                </div>
              </div>

              <button
                onClick={cycleVariation}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Try Another Phrasing</span>
              </button>
            </div>

            {/* AI Draft Reply Card */}
            <div className="bg-blue-950/20 border border-blue-900/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Suggested AI Draft Reply (Response from MIINFOTECH)</span>
                </div>
                <button
                  onClick={() => {
                    if (!isEditingDraft) {
                      setEditedDraft(generatedReply);
                    }
                    setIsEditingDraft(!isEditingDraft);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingDraft ? "Done Editing" : "Edit Draft"}</span>
                </button>
              </div>

              {isEditingDraft ? (
                <textarea
                  rows={4}
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                  className="w-full bg-slate-950 border border-blue-500 rounded-xl p-3 text-sm text-slate-200 focus:outline-none leading-relaxed"
                />
              ) : (
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  {currentDraftText}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  id="copy-owner-reply-btn"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Draft Reply</span>
                    </>
                  )}
                </button>

                <a
                  href={GOOGLE_PROFILE_SUMMARY.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 transition-colors"
                >
                  <span>Open Google Business Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 text-slate-400 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Compliance Notice:</strong> AI Draft Replies are generated solely to assist the business owner in crafting professional responses to authentic customer reviews. Drafts are <strong>never automatically published</strong> to Google.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
