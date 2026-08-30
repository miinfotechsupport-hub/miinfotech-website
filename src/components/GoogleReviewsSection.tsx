import React, { useState, useEffect } from "react";
import { Star, RefreshCw, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { GoogleReviewItem, GoogleReviewsApiResponse } from "../types/googleReviews";
import { GoogleReviewCard } from "./GoogleReviewCard";
import { GOOGLE_REVIEW_URL } from "../lib/reviewConfig";

const GOOGLE_PLACE_ID = "ChIJ4yWvawOvsk8RQZn4nX_0Wz0";

export const GoogleReviewsSection: React.FC = () => {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        const res = await fetch("/api/google-reviews");
        if (!res.ok) throw new Error("Failed to fetch Google reviews");
        const data: GoogleReviewsApiResponse = await res.json();
        if (isMounted) {
          setReviewsData(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setReviewsData({
            connected: false,
            configured: false,
            totalReviewCount: 0,
            averageRating: 5.0,
            reviews: [],
            error: "Unable to reach review service",
          });
          setLoading(false);
        }
      }
    }

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 5.0;
  const totalCount = reviewsData?.totalReviewCount || reviews.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, reviews.length - 1)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < reviews.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="google-customer-reviews-section"
      className="py-16 bg-slate-950/60 border-t border-b border-slate-800/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Google Reviews
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Customer Experiences in Hassan
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Authentic feedback and verified ratings from genuine clients across Hassan and Karnataka.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-lg shadow-black/20">
            <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-800">
              <span className="text-3xl font-extrabold text-white leading-none">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5 mt-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 font-medium">
                {totalCount > 0 ? `${totalCount} Google Reviews` : "5.0 on Google"}
              </span>
            </div>

            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span className="font-semibold text-slate-200">Google Business</span>
              </div>
              <a
                id="view-all-google-business-reviews-btn"
                href={`https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-24" />
                    <div className="h-3 bg-slate-800 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Content State: Reviews Available */}
        {!loading && reviews.length > 0 && (
          <div>
            {/* Desktop / Tablet Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, visibleCount).map((review) => (
                <GoogleReviewCard key={review.reviewId} review={review} />
              ))}
            </div>

            {/* Mobile Carousel View */}
            <div className="sm:hidden">
              <div className="relative">
                <GoogleReviewCard review={reviews[currentIndex]} />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400">
                    Review {currentIndex + 1} of {reviews.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id="prev-mobile-review-btn"
                      onClick={handlePrev}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="next-mobile-review-btn"
                      onClick={handleNext}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* "Load More" / "View on Google" Action Row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {visibleCount < reviews.length && (
                <button
                  id="load-more-google-reviews-btn"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-all"
                >
                  Show More Reviews ({reviews.length - visibleCount} remaining)
                </button>
              )}
              <a
                id="write-google-review-cta-btn"
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-md shadow-emerald-950/30"
              >
                Write a Review on Google <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* State: No reviews returned or API Access Pending */}
        {!loading && reviews.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 fill-emerald-400/20" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Verified Google Business Reviews
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Reviews are continuously synchronized from our official Google Business Profile in Hassan. Visit our Google profile directly to explore customer ratings or submit your feedback.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                id="empty-view-google-profile-btn"
                href={`https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                View Profile on Google <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                id="empty-write-google-review-btn"
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Write a Review <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
