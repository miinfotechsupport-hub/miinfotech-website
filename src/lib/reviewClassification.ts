import { GoogleReviewItem } from "../types/googleReviews";
import { VERIFIED_GOOGLE_REVIEWS_MANUAL } from "./verifiedGoogleReviews";

export type ServiceReviewCategory =
  | "cctv"
  | "computer"
  | "laptop"
  | "printer"
  | "networking"
  | "ups"
  | "biometric"
  | "intercom"
  | "firealarm"
  | "p2p"
  | "amc"
  | "windows"
  | "data-recovery"
  | "general";

export type RelevanceLevel =
  | "level1_explicit"
  | "level2_context"
  | "level3_terminology"
  | "level4_semantic";

export interface EvidenceMatch {
  level: RelevanceLevel;
  terms: string[];
  score: number;
}

export interface CategoryDefinition {
  id: Exclude<ServiceReviewCategory, "general">;
  displayName: string;
  level1_explicit: string[];
  level2_context: string[];
  level3_terminology: string[];
  level4_semantic_patterns: RegExp[];
}

/**
 * Controlled multi-level dictionary for authentic service matching.
 * 
 * LEVEL HIERARCHY:
 * Level 1 — Explicit service mention (Highest confidence: CCTV, Camera, DVR, etc.)
 * Level 2 — Strong service context (Camera installation, CCTV repair, etc.)
 * Level 3 — Related technical terminology (Motherboard, Toner, Cat6, Inverter, etc.)
 * Level 4 — Semantic / context matching (Regex patterns detecting intent: "installed cameras at our office", etc.)
 * 
 * STRICT RULE: Never display a review under a service unless there is sufficient evidence that the review relates to that service.
 */
export const MULTI_LEVEL_DEFINITIONS: Record<Exclude<ServiceReviewCategory, "general">, CategoryDefinition> = {
  cctv: {
    id: "cctv",
    displayName: "CCTV & Security Cameras",
    level1_explicit: [
      "cctv",
      "camera",
      "cameras",
      "surveillance",
      "security camera",
      "security cameras",
      "dvr",
      "nvr",
      "hikvision",
      "cp plus",
      "dahua",
      "ptz",
      "ip camera",
      "wifi camera",
      "4g camera",
      "solar camera",
      "dome camera",
      "bullet camera",
    ],
    level2_context: [
      "camera installation",
      "camera setup",
      "camera repair",
      "cctv installation",
      "cctv service",
      "cctv repair",
      "surveillance installation",
      "security system installation",
      "camera positioning",
      "remote viewing",
      "cctv cabling",
      "hotel cctv",
      "shop cctv",
    ],
    level3_terminology: [
      "5mp",
      "5mp camera",
      "4k camera",
      "night vision",
      "bnc connector",
      "smps power supply",
      "hard drive for dvr",
      "surveillance hdd",
    ],
    level4_semantic_patterns: [
      /\b(?:installed|install|setup|placed)\s+(?:the\s+)?cameras?\b/i,
      /\bcameras?\s+(?:were|was)\s+(?:installed|configured|tested)\b/i,
      /\b(?:hotel|shop|office|home|store)\s+cctv\b/i,
      /\bcctv\s+in\s+our\s+(?:hotel|shop|office|home|school)\b/i,
    ],
  },
  computer: {
    id: "computer",
    displayName: "Computer Repair & Diagnostics",
    level1_explicit: [
      "computer",
      "desktop",
      "pc",
      "personal computer",
    ],
    level2_context: [
      "computer repair",
      "computer service",
      "desktop repair",
      "desktop service",
      "pc repair",
      "pc service",
      "cpu repair",
      "system assembly",
    ],
    level3_terminology: [
      "motherboard",
      "smps",
      "ram",
      "ram upgrade",
      "hard disk",
      "ssd",
      "ssd upgrade",
      "cabinet",
      "graphics card",
      "cpu fan",
      "hardware problem",
    ],
    level4_semantic_patterns: [
      /\b(?:computer|pc|desktop)\s+(?:problem|issue)\s+(?:was|got)\s+(?:fixed|resolved)\b/i,
      /\bfixed\s+(?:my|our)\s+(?:computer|pc|desktop)\b/i,
      /\b(?:computer|pc|desktop)\s+service\s+provider\b/i,
    ],
  },
  laptop: {
    id: "laptop",
    displayName: "Laptop Repair & Services",
    level1_explicit: [
      "laptop",
      "notebook",
      "macbook",
      "thinkpad",
    ],
    level2_context: [
      "laptop repair",
      "laptop service",
      "screen replacement",
      "display replacement",
      "laptop screen",
      "keyboard replacement",
      "hinge repair",
      "laptop overheating",
    ],
    level3_terminology: [
      "display",
      "screen",
      "thermal paste",
      "laptop adapter",
      "laptop battery",
      "touchpad",
      "dc jack",
      "diagnostics",
    ],
    level4_semantic_patterns: [
      /\blaptop\s+service\s*\([^)]*\)/i,
      /\blaptop\s+(?:problem|issue)\s+(?:was|got)\s+(?:fixed|resolved)\b/i,
      /\breplaced\s+(?:the\s+)?laptop\s+(?:screen|display|battery|hinge)\b/i,
    ],
  },
  printer: {
    id: "printer",
    displayName: "Printer Repair & Cartridge Service",
    level1_explicit: [
      "printer",
      "printing",
      "cartridge",
      "toner",
    ],
    level2_context: [
      "printer repair",
      "printer service",
      "cartridge refilling",
      "toner refilling",
      "paper jam",
      "head cleaning",
    ],
    level3_terminology: [
      "ink",
      "laserjet",
      "inkjet",
      "ecotank",
      "ink tank",
      "pickup roller",
      "teflon",
      "formatter board",
    ],
    level4_semantic_patterns: [
      /\bprinter\s+(?:problem|issue)\s+(?:was|got)\s+(?:fixed|resolved)\b/i,
      /\bfixed\s+(?:my|our)\s+printer\b/i,
      /\b(?:refilled|replaced)\s+(?:the\s+)?(?:toner|cartridge|ink)\b/i,
    ],
  },
  networking: {
    id: "networking",
    displayName: "LAN & Wi-Fi Networking",
    level1_explicit: [
      "networking",
      "network",
      "lan",
      "wifi",
      "wi-fi",
      "ethernet",
    ],
    level2_context: [
      "lan cabling",
      "wifi setup",
      "wi-fi setup",
      "network setup",
      "router configuration",
      "structured cabling",
      "cabling work",
    ],
    level3_terminology: [
      "cat6",
      "switch",
      "router",
      "server rack",
      "patch panel",
      "access point",
      "rj45",
      "crimping",
      "poe switch",
    ],
    level4_semantic_patterns: [
      /\b(?:configured|setup|installed)\s+(?:the\s+)?(?:wifi|wi-fi|lan|network|router)\b/i,
      /\bnetwork\s+(?:cabling|wiring|connection)\b/i,
    ],
  },
  ups: {
    id: "ups",
    displayName: "UPS & Inverter Power Backup",
    level1_explicit: [
      "ups",
      "inverter",
      "power backup",
    ],
    level2_context: [
      "ups service",
      "ups repair",
      "ups battery",
      "battery setup",
      "battery replacement",
      "inverter service",
      "inverter battery",
    ],
    level3_terminology: [
      "tubular battery",
      "exide",
      "amaron",
      "backup time",
      "wiring was done neatly",
      "lead acid",
      "sine wave",
    ],
    level4_semantic_patterns: [
      /\bups\s+battery\s+setup\b/i,
      /\b(?:ups|inverter)\s+(?:service|setup|repair|installation)\b/i,
      /\bbattery\s+(?:setup|replacement|setup\/replacement)\b/i,
    ],
  },
  biometric: {
    id: "biometric",
    displayName: "Biometric Attendance & Access Control",
    level1_explicit: [
      "biometric",
      "fingerprint",
      "access control",
      "time attendance",
    ],
    level2_context: [
      "biometric installation",
      "attendance machine",
      "fingerprint scanner",
      "face attendance",
      "access control installation",
    ],
    level3_terminology: [
      "rfid card",
      "punch machine",
      "zkteco",
      "essl",
      "door lock",
      "magnetic lock",
    ],
    level4_semantic_patterns: [
      /\b(?:biometric|attendance)\s+(?:machine|system|device)\b/i,
      /\bfingerprint\s+attendance\b/i,
    ],
  },
  intercom: {
    id: "intercom",
    displayName: "Intercom & EPABX Systems",
    level1_explicit: [
      "intercom",
      "epabx",
      "pbx",
    ],
    level2_context: [
      "intercom installation",
      "epabx installation",
      "intercom wiring",
      "intercom service",
    ],
    level3_terminology: [
      "telephone cable",
      "extension line",
      "caller id phone",
      "intercom phone",
    ],
    level4_semantic_patterns: [
      /\b(?:intercom|epabx)\s+(?:setup|wiring|installation|repair)\b/i,
    ],
  },
  firealarm: {
    id: "firealarm",
    displayName: "Fire Alarm & Smoke Detectors",
    level1_explicit: [
      "fire alarm",
      "smoke detector",
    ],
    level2_context: [
      "fire alarm installation",
      "smoke detector setup",
      "fire sensor setup",
    ],
    level3_terminology: [
      "alarm panel",
      "hooter",
      "manual call point",
      "heat detector",
    ],
    level4_semantic_patterns: [
      /\b(?:fire\s+alarm|smoke\s+detector)\s+(?:installation|setup|system)\b/i,
    ],
  },
  p2p: {
    id: "p2p",
    displayName: "Wireless Point-to-Point Bridge",
    level1_explicit: [
      "p2p",
      "wireless bridge",
      "point to point",
    ],
    level2_context: [
      "p2p installation",
      "wireless bridge setup",
      "long range wifi",
    ],
    level3_terminology: [
      "ubiquiti",
      "airmax",
      "nanostation",
      "gigabeam",
      "dish antenna",
    ],
    level4_semantic_patterns: [
      /\b(?:wireless\s+bridge|point\s+to\s+point|p2p\s+link)\b/i,
    ],
  },
  amc: {
    id: "amc",
    displayName: "Annual Maintenance Contract (AMC)",
    level1_explicit: [
      "amc",
      "annual maintenance",
      "maintenance contract",
    ],
    level2_context: [
      "it amc",
      "cctv amc",
      "computer amc",
      "annual support contract",
      "service contract",
    ],
    level3_terminology: [
      "preventive maintenance",
      "quarterly inspection",
      "scheduled visits",
    ],
    level4_semantic_patterns: [
      /\b(?:annual\s+maintenance|maintenance\s+contract|service\s+contract)\b/i,
    ],
  },
  windows: {
    id: "windows",
    displayName: "Windows & OS Installation",
    level1_explicit: [
      "windows",
      "windows 10",
      "windows 11",
      "os installation",
    ],
    level2_context: [
      "windows installation",
      "windows formatting",
      "os formatting",
      "system formatting",
    ],
    level3_terminology: [
      "operating system",
      "boot error",
      "blue screen",
      "bsod",
      "driver installation",
    ],
    level4_semantic_patterns: [
      /\b(?:windows|os)\s+(?:installation|formatting|reinstalled)\b/i,
    ],
  },
  "data-recovery": {
    id: "data-recovery",
    displayName: "Data Recovery Services",
    level1_explicit: [
      "data recovery",
      "file recovery",
    ],
    level2_context: [
      "hard drive recovery",
      "lost data recovery",
      "deleted files recovery",
    ],
    level3_terminology: [
      "disk recovery",
      "corrupted hard disk",
      "dead hdd",
      "unreadable pen drive",
    ],
    level4_semantic_patterns: [
      /\b(?:recover|recovered)\s+(?:lost\s+)?(?:data|files|photos)\b/i,
    ],
  },
};

/**
 * Direct 1:1 mapping from serviceId to category.
 * Strictly prevents cross-service leakage.
 */
export const SERVICE_ID_TO_REVIEW_CATEGORY: Record<string, ServiceReviewCategory> = {
  cctv: "cctv",
  computer: "computer",
  laptop: "laptop",
  printer: "printer",
  networking: "networking",
  ups: "ups",
  biometric: "biometric",
  intercom: "intercom",
  firealarm: "firealarm",
  p2p: "p2p",
  amc: "amc",
  windows: "windows",
  "data-recovery": "data-recovery",
};

/**
 * Checks if a string contains a keyword, enforcing word boundaries for short acronyms.
 */
export function textMatchesKeyword(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerKw = keyword.toLowerCase();

  // Short words (3 chars or fewer) require word boundaries to prevent false substring matches
  if (lowerKw.length <= 3) {
    const escaped = lowerKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
    return regex.test(lowerText);
  }

  return lowerText.includes(lowerKw);
}

/**
 * Evaluates a single review against a specific category across all 4 levels.
 * Returns null if there is insufficient evidence.
 */
export function evaluateReviewForCategory(
  reviewText: string,
  categoryDef: CategoryDefinition
): EvidenceMatch | null {
  const cleanText = reviewText.trim();
  if (!cleanText) return null;

  // Level 1: Explicit service mention
  const level1Matches = categoryDef.level1_explicit.filter((kw) => textMatchesKeyword(cleanText, kw));
  if (level1Matches.length > 0) {
    return {
      level: "level1_explicit",
      terms: level1Matches,
      score: level1Matches.length * 3,
    };
  }

  // Level 2: Strong service context
  const level2Matches = categoryDef.level2_context.filter((kw) => textMatchesKeyword(cleanText, kw));
  if (level2Matches.length > 0) {
    return {
      level: "level2_context",
      terms: level2Matches,
      score: level2Matches.length * 2,
    };
  }

  // Level 4: Semantic / context patterns (checked before terminology for stronger context)
  const patternMatches: string[] = [];
  for (const pattern of categoryDef.level4_semantic_patterns) {
    const m = cleanText.match(pattern);
    if (m) {
      patternMatches.push(m[0]);
    }
  }
  if (patternMatches.length > 0) {
    return {
      level: "level4_semantic",
      terms: patternMatches,
      score: 2,
    };
  }

  // Level 3: Related terminology
  const level3Matches = categoryDef.level3_terminology.filter((kw) => textMatchesKeyword(cleanText, kw));
  if (level3Matches.length > 0) {
    return {
      level: "level3_terminology",
      terms: level3Matches,
      score: level3Matches.length,
    };
  }

  return null;
}

export interface DetailedReviewAudit {
  reviewId: string;
  reviewerName: string;
  starRating: number;
  comment: string;
  categories: ServiceReviewCategory[];
  evidenceMap: Partial<Record<ServiceReviewCategory, EvidenceMatch>>;
  relevanceScore: number;
}

/**
 * Classifies a review into one or more categories based on multi-level evidence.
 * If no service has evidence, returns ['general'].
 */
export function classifyReview(review: GoogleReviewItem): ServiceReviewCategory[] {
  const comment = review.comment || "";
  if (!comment.trim()) {
    return ["general"];
  }

  const matched: ServiceReviewCategory[] = [];

  for (const [catKey, def] of Object.entries(MULTI_LEVEL_DEFINITIONS)) {
    const evidence = evaluateReviewForCategory(comment, def);
    if (evidence) {
      matched.push(catKey as ServiceReviewCategory);
    }
  }

  return matched.length > 0 ? matched : ["general"];
}

/**
 * Full audit inspection of a review with detailed evidence.
 */
export function auditReview(review: GoogleReviewItem): DetailedReviewAudit {
  const comment = review.comment || "";
  const evidenceMap: Partial<Record<ServiceReviewCategory, EvidenceMatch>> = {};
  let totalScore = 0;
  const categories: ServiceReviewCategory[] = [];

  for (const [catKey, def] of Object.entries(MULTI_LEVEL_DEFINITIONS)) {
    const evidence = evaluateReviewForCategory(comment, def);
    if (evidence) {
      const cat = catKey as ServiceReviewCategory;
      categories.push(cat);
      evidenceMap[cat] = evidence;
      totalScore += evidence.score;
    }
  }

  if (categories.length === 0) {
    categories.push("general");
  }

  return {
    reviewId: review.reviewId,
    reviewerName: review.reviewer.displayName,
    starRating: review.starRating,
    comment,
    categories,
    evidenceMap,
    relevanceScore: totalScore,
  };
}

/**
 * Returns all genuine reviews classified under a specific category.
 */
export function getReviewsForCategory(
  categoryOrServiceId: string,
  reviewsList: GoogleReviewItem[] = VERIFIED_GOOGLE_REVIEWS_MANUAL
): GoogleReviewItem[] {
  const normalizedCategory: ServiceReviewCategory =
    SERVICE_ID_TO_REVIEW_CATEGORY[categoryOrServiceId] ||
    (categoryOrServiceId as ServiceReviewCategory);

  return reviewsList.filter((review) => {
    const categories = classifyReview(review);
    return categories.includes(normalizedCategory);
  });
}

/**
 * Formats user-friendly category display names.
 */
export function getCategoryDisplayName(categoryOrServiceId: string): string {
  const normalizedCategory: ServiceReviewCategory =
    SERVICE_ID_TO_REVIEW_CATEGORY[categoryOrServiceId] ||
    (categoryOrServiceId as ServiceReviewCategory);

  if (normalizedCategory === "general") {
    return "General Customer Feedback";
  }

  return MULTI_LEVEL_DEFINITIONS[normalizedCategory]?.displayName || "Service";
}
