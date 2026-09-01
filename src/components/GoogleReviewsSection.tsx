import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";
import { GoogleReviewItem, GoogleReviewsApiResponse } from "../types/googleReviews";
import { GoogleReviewCard } from "./GoogleReviewCard";
import { GOOGLE_REVIEW_URL } from "../lib/reviewConfig";
import { VERIFIED_GOOGLE_REVIEWS_MANUAL, GOOGLE_PROFILE_SUMMARY } from "../lib/verifiedGoogleReviews";

const GOOGLE_PLACE_ID = GOOGLE_PROFILE_SUMMARY.placeId;
const GOOGLE_PROFILE_REVIEWS_URL = GOOGLE_PROFILE_SUMMARY.profileUrl;

export const GoogleReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(VERIFIED_GOOGLE_REVIEWS_MANUAL);
  const [averageRating, setAverageRating] = useState<number>(GOOGLE_PROFILE_SUMMARY.averageRating);
  const [totalReviewCount, setTotalReviewCount] = useState<number>(GOOGLE_PROFILE_SUMMARY.totalReviewCount);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // Responsive items per view: 1 on mobile (<640px), 2 on tablet (<1024px), 3 on desktop (>=1024px)
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Handle responsive viewport sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newCount = 3;
      if (width < 640) {
        newCount = 1;
      } else if (width < 1024) {
        newCount = 2;
      }
      setItemsPerPage(newCount);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch live reviews from backend proxy if available, else keep verified manual dataset
  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        const res = await fetch("/api/google-reviews");
        if (!res.ok) throw new Error("Failed to fetch Google reviews");
        const data: GoogleReviewsApiResponse = await res.json();
        
        if (isMounted && data.connected && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          if (data.averageRating) setAverageRating(data.averageRating);
          if (data.totalReviewCount) setTotalReviewCount(data.totalReviewCount);
          setIsLiveApi(true);
        }
      } catch (err) {
        // Graceful fallback to verified manual dataset
        console.info("[Google Reviews] Using verified local customer review dataset.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate total pages for carousel
  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

  // Ensure current page is valid when resizing
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  // Autoplay slideshow timer (every 5.5s, paused on interaction/hover)
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, totalPages, handleNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Get current page slice of reviews
  const currentReviews = reviews.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section
      id="customer-reviews-section"
      className="py-16 sm:py-20 bg-slate-950/80 border-t border-b border-slate-800/80 relative overflow-hidden"
      aria-label="Customer Reviews"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Customer Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Genuine reviews from our customers on Google across Hassan and Karnataka.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-xl shadow-black/30">
            <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-800">
              <span className="text-3xl font-extrabold text-white leading-none">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5 mt-1.5" aria-label={`${averageRating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 font-semibold">
                {totalReviewCount} Google Reviews
              </span>
            </div>

            <div className="flex flex-col justify-center gap-1.5 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-bold text-slate-200">Google Business</span>
              </div>
              <a
                id="view-all-google-business-reviews-btn"
                href={GOOGLE_PROFILE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Review Cards Grid */}
          <div
            className={`grid gap-6 transition-opacity duration-300 ${
              itemsPerPage === 1
                ? "grid-cols-1"
                : itemsPerPage === 2
                ? "grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {currentReviews.map((review) => (
              <div key={review.reviewId} className="h-full">
                <GoogleReviewCard review={review} />
              </div>
            ))}
          </div>

          {/* Carousel Navigation Bar (Prev / Next & Pagination Dots) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-800/60">
            {/* Slide Index Counter */}
            <div className="text-xs text-slate-400 font-medium order-2 sm:order-1">
              Page <span className="text-white font-semibold">{currentPage + 1}</span> of{" "}
              <span className="text-white font-semibold">{totalPages}</span>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 order-1 sm:order-2" role="tablist" aria-label="Review pagination">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  id={`review-page-dot-${idx}`}
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Go to review page ${idx + 1}`}
                  aria-selected={currentPage === idx}
                  role="tab"
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentPage === idx
                      ? "w-8 bg-blue-500"
                      : "w-2.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            {/* Previous & Next Buttons */}
            <div className="flex items-center gap-2 order-3">
              <button
                id="prev-customer-review-btn"
                onClick={handlePrev}
                aria-label="Previous customer review"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                id="next-customer-review-btn"
                onClick={handleNext}
                aria-label="Next customer review"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Read All on Google & Write a Review */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            id="read-all-google-reviews-btn"
            href={GOOGLE_PROFILE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold inline-flex items-center gap-2 transition-all hover:border-slate-600 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Read all reviews on Google <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            id="write-google-review-cta-btn"
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
