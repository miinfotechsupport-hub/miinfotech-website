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
  createTime: string; // ISO 8601 string
  updateTime?: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
  reviewUrl?: string;
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
