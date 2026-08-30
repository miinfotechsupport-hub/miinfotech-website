import React, { useState } from "react";
import { Star, MessageSquareQuote, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { GoogleReviewItem } from "../types/googleReviews";

interface GoogleReviewCardProps {
  review: GoogleReviewItem;
}

export const GoogleReviewCard: React.FC<GoogleReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = review.comment.length > 200;

  // Format date cleanly
  const formattedDate = (() => {
    try {
      const date = new Date(review.createTime);
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return "Recent";
    }
  })();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < rating;
      return (
        <Star
          key={i}
          className={`w-4 h-4 ${
            filled ? "text-amber-400 fill-amber-400" : "text-slate-600"
          }`}
        />
      );
    });
  };

  return (
    <div
      id={`google-review-${review.reviewId}`}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-emerald-950/20"
    >
      <div>
        {/* Header: Author & Google Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {review.reviewer.profilePhotoUrl ? (
              <img
                src={review.reviewer.profilePhotoUrl}
                alt={review.reviewer.displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                {review.reviewer.displayName ? review.reviewer.displayName.charAt(0).toUpperCase() : "G"}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-slate-100 text-sm leading-tight">
                {review.reviewer.displayName || "Google Customer"}
              </h4>
              <span className="text-xs text-slate-400">{formattedDate}</span>
            </div>
          </div>

          {/* Official Google Icon Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Google</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(review.starRating)}
        </div>

        {/* Authentic Customer Review Text */}
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {isLongText && !isExpanded
            ? `${review.comment.slice(0, 200)}...`
            : review.comment}
        </p>

        {isLongText && (
          <button
            id={`toggle-review-text-${review.reviewId}`}
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Read full review <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}

        {/* Business Response if present */}
        {review.reviewReply && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/40 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Response from MIINFOTECH</span>
            </div>
            <p className="text-slate-400 leading-relaxed italic">
              "{review.reviewReply.comment}"
            </p>
          </div>
        )}
      </div>

      {/* Footer link to original review if URL provided */}
      {review.reviewUrl && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
          <a
            id={`view-google-review-${review.reviewId}`}
            href={review.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            View on Google <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
