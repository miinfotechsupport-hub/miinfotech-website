export interface GoogleReviewAuthor {
  displayName: string;
  profilePhotoUrl?: string;
  isAnonymous?: boolean;
}

export type GoogleStarRating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | 1 | 2 | 3 | 4 | 5;

export interface GoogleReviewItem {
  reviewId: string;
  reviewer: GoogleReviewAuthor;
  starRating: number; // Normalized 1 to 5
  comment: string; // Original, unaltered review text
  createTime: string | null; // ISO 8601 string or null if unavailable
  updateTime?: string | null;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
  reviewUrl?: string;
  source?: "google";
  verified?: boolean;
}

export interface GoogleReviewsApiResponse {
  connected: boolean;
  configured: boolean;
  totalReviewCount: number;
  averageRating: number;
  lastSyncedAt?: string;
  reviews: GoogleReviewItem[];
  error?: string;
}

export interface GoogleReviewsSyncStatus {
  connected: boolean;
  accountConfigured: boolean;
  locationConfigured: boolean;
  oauthConfigured: boolean;
  lastSyncAttempt?: string;
  lastSuccessfulSync?: string;
  totalReviewsFetched: number;
  lastError?: string;
}
