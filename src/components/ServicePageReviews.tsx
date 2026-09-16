import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink, MessageSquareQuote, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getReviewsForCategory, getCategoryDisplayName } from "../lib/reviewClassification";
import { VERIFIED_GOOGLE_REVIEWS_MANUAL, GOOGLE_PROFILE_SUMMARY } from "../lib/verifiedGoogleReviews";
import { GoogleReviewItem } from "../types/googleReviews";
import { GoogleReviewCard } from "./GoogleReviewCard";

interface ServicePageReviewsProps {
  serviceId: string;
  serviceName: string;
}

export const ServicePageReviews: React.FC<ServicePageReviewsProps> = ({ serviceId, serviceName }) => {
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(VERIFIED_GOOGLE_REVIEWS_MANUAL);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch from /api/google-reviews if available, otherwise use VERIFIED_GOOGLE_REVIEWS_MANUAL
  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch("/api/google-reviews");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.connected && Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Fallback already set to VERIFIED_GOOGLE_REVIEWS_MANUAL
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter deterministically using reviewClassification (NO unrelated fallbacks)
  const matchingReviews = useMemo(() => {
    return getReviewsForCategory(serviceId, reviews);
  }, [serviceId, reviews]);

  // Responsive cards per view: 1 on mobile (<640px), 2 on tablet (<1024px), 3 on desktop (>=1024px)
  const [cardsPerPage, setCardsPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(matchingReviews.length / cardsPerPage));

  // Reset pagination if category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [serviceId, matchingReviews.length]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalPages <= 1) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPages, handlePrev, handleNext]);

  // Touch Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Autoplay only when multiple pages and not paused and not reduced motion
  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;

    const prefersReducedMotion = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [totalPages, isPaused, handleNext]);

  const categoryLabel = getCategoryDisplayName(serviceId);
  const visibleCards = matchingReviews.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  return (
    <section 
      id="service-reviews-section" 
      className="space-y-6 pt-4"
      aria-label="Customer Reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header & Overview Badges */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">
              Google Customer Reviews
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3 h-3" />
              100% Genuine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Customer Reviews for {serviceName}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {matchingReviews.length > 0 ? (
              <>
                <strong className="text-white font-semibold">{matchingReviews.length} Google {matchingReviews.length === 1 ? "review" : "reviews"}</strong> mentioning or clearly relating to {serviceName.toLowerCase()} services.
              </>
            ) : (
              "No Google reviews specifically matching this service yet."
            )}
          </p>
        </div>

        {/* Aggregate Ratings & Mentions Badge */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-white font-bold">{GOOGLE_PROFILE_SUMMARY.averageRating.toFixed(1)}</span>
            <span className="text-slate-400 font-mono text-[11px]">(21 on Google Profile)</span>
          </div>

          {matchingReviews.length > 0 ? (
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              {matchingReviews.length} {matchingReviews.length === 1 ? "review relates to" : "reviews relate to"} {categoryLabel}
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold">
              0 specific reviews
            </span>
          )}
        </div>
      </div>

      {/* Review Content Area */}
      {matchingReviews.length > 0 ? (
        <div className="space-y-4">
          {/* Card Grid / Carousel Viewport (Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards) */}
          <div className={`grid gap-4 ${
            visibleCards.length === 1
              ? "grid-cols-1 max-w-xl mx-auto"
              : visibleCards.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}>
            {visibleCards.map((rev) => (
              <GoogleReviewCard key={rev.reviewId} review={rev} />
            ))}
          </div>

          {/* Carousel Controls when multiple pages exist */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Showing <span className="text-white font-bold">{currentPage * cardsPerPage + 1}–{Math.min((currentPage + 1) * cardsPerPage, matchingReviews.length)}</span> of{" "}
                <span className="text-white font-bold">{matchingReviews.length}</span> authentic reviews
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous reviews"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      aria-label={`Go to review page ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentPage === idx ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  aria-label="Next reviews"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ZERO MATCH BEHAVIOUR - STRICT COMPLIANCE */
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-300">
            <MessageSquareQuote className="w-6 h-6 text-blue-400" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              No Google reviews specifically matching this service yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We only display authentic Google customer reviews that clearly relate to this service. You can read all customer reviews directly on our Google Business Profile.
            </p>
          </div>

          <div className="pt-2">
            <a
              id="zero-match-read-all-reviews-btn"
              href={GOOGLE_PROFILE_SUMMARY.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <span>See all customer reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Footer Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          Reviews reflect genuine customer experiences for MIINFOTECH in Hassan.
        </span>

        <a
          href={GOOGLE_PROFILE_SUMMARY.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <span>Read all Google reviews</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
};

