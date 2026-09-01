import { 
  Video, 
  Monitor, 
  Laptop, 
  Printer, 
  Network, 
  BatteryCharging, 
  Fingerprint, 
  Wrench 
} from "lucide-react";

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";
export const REVIEW_PAGE_URL = "https://miinfotech.netlify.app/review";

// ============================================================================
// TYPES
// ============================================================================

export type CustomerRelationship = "new" | "existing" | "longterm";

export interface ServiceCategoryOption {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  mainServices: string[];
  workOptions: string[]; // Aliased for Admin Panel / compatibility
  cameraTypes?: string[];
  featureOptions: Record<string, string[]>; // e.g. "installation": ["2MP", "5MP", ...], "default": [...]
}

export interface ReviewDraftInput {
  rating?: number;
  serviceCategoryIds?: string[];
  serviceNames?: string[];
  mainServices?: string[];
  cameraTypes?: string[];
  importantFeatures?: string[];
  experiences: string[];
  location?: string;
  customNote?: string;
  variationIndex?: number;
}

// ============================================================================
// SIMPLIFIED, PROGRESSIVE SERVICE CONFIGURATION (CUSTOMER-CENTRIC)
// ============================================================================

export const REVIEW_SERVICE_CATEGORIES: ServiceCategoryOption[] = [
  {
    id: "cctv",
    name: "CCTV Camera & Security",
    shortName: "CCTV",
    icon: Video,
    mainServices: [
      "CCTV Installation",
      "CCTV Repair / Service",
      "CCTV Upgrade / Replacement",
      "DVR / NVR Setup",
      "Remote Viewing / Mobile Setup",
      "CCTV Cabling",
      "CCTV Maintenance / Troubleshooting",
      "CCTV Configuration",
      "CCTV Camera Replacement",
      "Other CCTV Work"
    ],
    workOptions: [
      "Camera Installation",
      "Camera Replacement",
      "Camera Positioning / Adjustment",
      "DVR / NVR Installation",
      "DVR / NVR Configuration",
      "Hard Disk / Storage Setup",
      "CCTV Cabling",
      "Remote Viewing Setup",
      "Mobile App Configuration",
      "4G / SIM Connectivity Setup",
      "Solar Power Setup",
      "Audio / Microphone Setup",
      "Two-Way Audio Setup",
      "Camera Configuration",
      "Recording Configuration",
      "Playback Configuration",
      "Night Vision Configuration",
      "Network Configuration",
      "System Testing",
      "CCTV Troubleshooting",
      "Camera Issue Resolved",
      "DVR / NVR Issue Resolved"
    ],
    featureOptions: {
      "CCTV Installation": [
        "Camera Installation",
        "Camera Positioning / Adjustment",
        "DVR / NVR Installation",
        "DVR / NVR Configuration",
        "Hard Disk / Storage Setup",
        "CCTV Cabling",
        "Remote Viewing Setup",
        "Mobile App Configuration",
        "4G / SIM Connectivity Setup",
        "Solar Power Setup",
        "Audio / Microphone Setup",
        "Two-Way Audio Setup",
        "Night Vision Configuration",
        "System Testing"
      ],
      "CCTV Repair / Service": [
        "Camera Issue Resolved",
        "DVR / NVR Issue Resolved",
        "Remote Viewing Issue Resolved",
        "Cabling / Video Issue Resolved",
        "Camera Replacement",
        "Hard Disk / Storage Issue",
        "General CCTV Troubleshooting",
        "Camera Configuration",
        "DVR / NVR Configuration",
        "System Testing"
      ],
      "CCTV Upgrade / Replacement": [
        "Camera Replacement",
        "DVR / NVR Replacement",
        "Hard Disk / Storage Upgrade",
        "Camera Configuration",
        "DVR / NVR Configuration",
        "CCTV Cabling",
        "Remote Viewing Setup",
        "System Testing"
      ],
      "DVR / NVR Setup": [
        "DVR / NVR Installation",
        "DVR / NVR Configuration",
        "Hard Disk / Storage Setup",
        "Recording Configuration",
        "Playback Configuration",
        "Network Configuration",
        "Remote Viewing Setup",
        "Mobile App Configuration",
        "System Testing"
      ],
      "Remote Viewing / Mobile Setup": [
        "Remote Viewing Setup",
        "Mobile App Configuration",
        "4G / SIM Connectivity Setup",
        "Network Configuration",
        "Remote Playback Setup",
        "System Testing"
      ],
      "CCTV Cabling": [
        "CCTV Cabling",
        "Cable Testing",
        "Camera Connection",
        "DVR / NVR Connection",
        "Network Configuration",
        "System Testing"
      ],
      "CCTV Maintenance / Troubleshooting": [
        "CCTV Troubleshooting",
        "Camera Issue Resolved",
        "DVR / NVR Issue Resolved",
        "Cabling / Video Issue Resolved",
        "Camera Cleaning & Adjustment",
        "System Testing"
      ],
      "CCTV Configuration": [
        "Camera Configuration",
        "DVR / NVR Configuration",
        "Recording Configuration",
        "Playback Configuration",
        "Night Vision Configuration",
        "Mobile App Configuration",
        "Network Configuration",
        "System Testing"
      ],
      "CCTV Camera Replacement": [
        "Camera Replacement",
        "Camera Positioning / Adjustment",
        "Camera Configuration",
        "Cable Connection",
        "System Testing"
      ],
      "Other CCTV Work": [
        "Camera Installation",
        "Camera Replacement",
        "CCTV Cabling",
        "Remote Viewing Setup",
        "CCTV Troubleshooting",
        "System Testing",
        "Other"
      ],
      "default": [
        "Camera Installation",
        "Camera Replacement",
        "Camera Positioning / Adjustment",
        "DVR / NVR Installation",
        "DVR / NVR Configuration",
        "Hard Disk / Storage Setup",
        "CCTV Cabling",
        "Remote Viewing Setup",
        "Mobile App Configuration",
        "4G / SIM Connectivity Setup",
        "Solar Power Setup",
        "Audio / Microphone Setup",
        "Two-Way Audio Setup",
        "System Testing",
        "CCTV Troubleshooting"
      ]
    }
  },
  {
    id: "laptop",
    name: "Laptop Service & Support",
    shortName: "Laptop",
    icon: Laptop,
    mainServices: [
      "Laptop Repair",
      "Screen / Display Replacement",
      "SSD / RAM Speed Upgrade",
      "Battery / Keyboard Replacement",
      "OS & Windows Installation",
      "Motherboard / Power Repair",
      "Other Laptop Work"
    ],
    workOptions: [
      "Laptop Repair",
      "Screen / Display Replacement",
      "SSD / RAM Speed Upgrade",
      "Battery / Keyboard Replacement",
      "OS & Windows Installation",
      "Motherboard / Power Repair",
      "Other Laptop Work"
    ],
    featureOptions: {
      "default": [
        "SSD Upgrade",
        "RAM Upgrade",
        "Display / Screen",
        "New Battery",
        "Keyboard Replacement",
        "Thermal Cleaning",
        "Windows / OS Setup",
        "Other"
      ]
    }
  },
  {
    id: "computer",
    name: "Computer Service & Support",
    shortName: "Computer",
    icon: Monitor,
    mainServices: [
      "Computer Repair",
      "Desktop Hardware Service",
      "SSD / RAM Speed Upgrade",
      "Windows / Software Setup",
      "Power Supply / SMPS Replacement",
      "Other Computer Work"
    ],
    workOptions: [
      "Computer Repair",
      "Desktop Hardware Service",
      "SSD / RAM Speed Upgrade",
      "Windows / Software Setup",
      "Power Supply / SMPS Replacement",
      "Other Computer Work"
    ],
    featureOptions: {
      "default": [
        "SSD Upgrade",
        "RAM Upgrade",
        "Windows Installation",
        "SMPS / Power Supply",
        "Cabinet / Motherboard Service",
        "Software Troubleshooting",
        "Other"
      ]
    }
  },
  {
    id: "printer",
    name: "Printer Service & Support",
    shortName: "Printer",
    icon: Printer,
    mainServices: [
      "Printer Service",
      "Cartridge / Ink Tank Refill",
      "Paper Jam / Roller Repair",
      "Wi-Fi / Network Printer Setup",
      "Printhead Cleaning / Service",
      "Other Printer Work"
    ],
    workOptions: [
      "Printer Service",
      "Cartridge / Ink Tank Refill",
      "Paper Jam / Roller Repair",
      "Wi-Fi / Network Printer Setup",
      "Printhead Cleaning / Service",
      "Other Printer Work"
    ],
    featureOptions: {
      "default": [
        "Cartridge Refill / Service",
        "Paper Roller Repair",
        "Wi-Fi Wireless Printing",
        "Printhead Cleaning",
        "LaserJet Drum / Toner",
        "Scanner Troubleshooting",
        "Other"
      ]
    }
  },
  {
    id: "networking",
    name: "LAN Networking & Wi-Fi",
    shortName: "Networking",
    icon: Network,
    mainServices: [
      "LAN Networking",
      "Wi-Fi Setup",
      "Office / Commercial Network",
      "Router & Access Point Setup",
      "Internet Speed Troubleshooting",
      "Other Networking Work"
    ],
    workOptions: [
      "LAN Networking",
      "Wi-Fi Setup",
      "Office / Commercial Network",
      "Router & Access Point Setup",
      "Internet Speed Troubleshooting",
      "Other Networking Work"
    ],
    featureOptions: {
      "default": [
        "CAT6 LAN Cabling",
        "Wi-Fi Router / AP",
        "Range Extender Setup",
        "Switch & Patch Panel",
        "Internet Stability",
        "Other"
      ]
    }
  },
  {
    id: "ups",
    name: "UPS & Inverter Power",
    shortName: "UPS",
    icon: BatteryCharging,
    mainServices: [
      "UPS / Inverter Installation",
      "Battery Health Check / Replacement",
      "Power Backup Troubleshooting",
      "Inverter Wiring & Repair",
      "Other UPS Work"
    ],
    workOptions: [
      "UPS / Inverter Installation",
      "Battery Health Check / Replacement",
      "Power Backup Troubleshooting",
      "Inverter Wiring & Repair",
      "Other UPS Work"
    ],
    featureOptions: {
      "default": [
        "Tubular Battery Setup",
        "Battery Replacement",
        "Inverter Wiring",
        "Backup Time Testing",
        "Solar Inverter Link",
        "Other"
      ]
    }
  },
  {
    id: "biometric",
    name: "Biometric & Access Control",
    shortName: "Biometric",
    icon: Fingerprint,
    mainServices: [
      "Biometric Attendance Installation",
      "Fingerprint / Face Recognition Setup",
      "Access Control & Lock Installation",
      "Attendance Software & Reports",
      "Other Biometric Work"
    ],
    workOptions: [
      "Biometric Attendance Installation",
      "Fingerprint / Face Recognition Setup",
      "Access Control & Lock Installation",
      "Attendance Software & Reports",
      "Other Biometric Work"
    ],
    featureOptions: {
      "default": [
        "Fingerprint Scanner",
        "Facial Recognition",
        "EM Lock / Door Strike",
        "Attendance Software",
        "Staff Registration",
        "Other"
      ]
    }
  },
  {
    id: "other_it",
    name: "Other Technical Service",
    shortName: "Other IT",
    icon: Wrench,
    mainServices: [
      "On-Site Technical Support",
      "School / Lab Computer Setup",
      "Projector & AV Setup",
      "General IT Troubleshooting",
      "Other Work"
    ],
    workOptions: [
      "On-Site Technical Support",
      "School / Lab Computer Setup",
      "Projector & AV Setup",
      "General IT Troubleshooting",
      "Other Work"
    ],
    featureOptions: {
      "default": [
        "Computer Lab Setup",
        "Projector Setup",
        "Hardware Repair",
        "On-Site Troubleshooting",
        "Other"
      ]
    }
  }
];

// ============================================================================
// STEP 3: SERVICE EXPERIENCE (ONLY THE 7 CLEAN CUSTOMER CHOICES)
// ============================================================================
export const CUSTOMER_EXPERIENCE_OPTIONS = [
  "Professional Work",
  "Good Communication",
  "Quick Response",
  "Neat Installation",
  "Problem Solved",
  "Good Explanation",
  "Good Service"
];

// ============================================================================
// STEP 4: LOCATION OPTIONS
// ============================================================================
export const LOCATION_OPTIONS = [
  "Hassan",
  "Nearby / Outskirts",
  "Other"
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatListNatural(items: string[]): string {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  const allButLast = filtered.slice(0, -1).join(", ");
  return `${allButLast}, and ${filtered[filtered.length - 1]}`;
}

function formatCustomNote(note?: string): string {
  if (!note || !note.trim()) return "";
  let clean = note.trim();
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  if (!/[.!?]$/.test(clean)) {
    clean += ".";
  }
  return clean;
}

// ============================================================================
// SEO-OPTIMIZED DETERMINISTIC REVIEW GENERATOR FOR MIINFOTECH
// Uses genuine customer selections to naturally build SEO-rich reviews.
// Follows the 40–70 word standard (60–90 words for multi-service).
// ============================================================================

export function generateDeterministicReview(input: ReviewDraftInput): string {
  const rating = input.rating ?? 5;
  const variationIndex = Math.abs(input.variationIndex || 0);

  const mainServices = input.mainServices || [];
  const workPerformed = input.importantFeatures || [];
  const experiences = input.experiences || [];
  const customNote = formatCustomNote(input.customNote);

  // 1. Determine Location Mention (0–1 time, strictly natural)
  const isHassan = (input.location || "").toLowerCase().includes("hassan");
  const isOutskirts = (input.location || "").toLowerCase().includes("outskirts") || (input.location || "").toLowerCase().includes("nearby");
  const locPhrase = isHassan ? "in Hassan" : isOutskirts ? "in the Hassan area" : "";

  // 2. Identify Primary Service Headline (Fact-locked based on Step 1 selection)
  let primaryServiceSEO = "CCTV installation";
  if (mainServices.length > 0) {
    const firstMain = mainServices[0].toLowerCase();
    if (firstMain.includes("installation")) primaryServiceSEO = "CCTV installation";
    else if (firstMain.includes("repair") || firstMain.includes("service")) {
      if (firstMain.includes("laptop")) primaryServiceSEO = "laptop repair";
      else if (firstMain.includes("printer")) primaryServiceSEO = "printer service";
      else if (firstMain.includes("computer")) primaryServiceSEO = "computer repair";
      else primaryServiceSEO = "CCTV repair and maintenance";
    }
    else if (firstMain.includes("replacement") && firstMain.includes("camera")) primaryServiceSEO = "CCTV camera replacement";
    else if (firstMain.includes("upgrade") || firstMain.includes("replacement")) primaryServiceSEO = "CCTV upgrade and replacement";
    else if (firstMain.includes("dvr") || firstMain.includes("nvr")) primaryServiceSEO = "DVR/NVR setup";
    else if (firstMain.includes("remote") || firstMain.includes("mobile")) primaryServiceSEO = "remote CCTV viewing setup";
    else if (firstMain.includes("cabling")) primaryServiceSEO = "CCTV cabling";
    else if (firstMain.includes("troubleshooting") || firstMain.includes("maintenance")) primaryServiceSEO = "CCTV maintenance and troubleshooting";
    else if (firstMain.includes("configuration")) primaryServiceSEO = "CCTV configuration";
    else if (firstMain.includes("laptop")) primaryServiceSEO = "laptop service";
    else if (firstMain.includes("computer")) primaryServiceSEO = "computer service";
    else if (firstMain.includes("printer")) primaryServiceSEO = "printer service";
    else if (firstMain.includes("lan") || firstMain.includes("networking")) primaryServiceSEO = "LAN networking";
    else if (firstMain.includes("wi-fi") || firstMain.includes("wifi")) primaryServiceSEO = "Wi-Fi setup";
    else if (firstMain.includes("ups") || firstMain.includes("inverter")) primaryServiceSEO = "UPS/inverter service";
    else if (firstMain.includes("biometric") || firstMain.includes("attendance")) primaryServiceSEO = "biometric attendance system installation";
    else if (firstMain.includes("access control")) primaryServiceSEO = "access control installation";
    else primaryServiceSEO = mainServices[0];
  } else if (input.serviceNames && input.serviceNames.length > 0) {
    const sName = input.serviceNames[0].toLowerCase();
    if (sName.includes("cctv")) primaryServiceSEO = "CCTV service";
    else if (sName.includes("laptop")) primaryServiceSEO = "laptop repair";
    else if (sName.includes("computer")) primaryServiceSEO = "computer repair";
    else if (sName.includes("printer")) primaryServiceSEO = "printer service";
    else if (sName.includes("networking")) primaryServiceSEO = "LAN networking";
    else if (sName.includes("ups")) primaryServiceSEO = "UPS/inverter service";
    else if (sName.includes("biometric")) primaryServiceSEO = "biometric attendance system installation";
  }

  // 3. Extract Work Done Keywords (Fact-locked directly from Step 2 selections, strictly no invented details)
  const workPhrases: string[] = [];
  workPerformed.forEach(work => {
    const wLow = work.toLowerCase();
    if (wLow.includes("camera installation")) {
      if (!workPhrases.includes("camera installation")) workPhrases.push("camera installation");
    } else if (wLow.includes("camera replacement")) {
      if (!workPhrases.includes("camera replacement")) workPhrases.push("camera replacement");
    } else if (wLow.includes("positioning") || wLow.includes("adjustment")) {
      if (!workPhrases.includes("camera positioning and alignment")) workPhrases.push("camera positioning and alignment");
    } else if (wLow.includes("dvr / nvr installation") || wLow.includes("dvr / nvr setup")) {
      if (!workPhrases.includes("DVR/NVR installation")) workPhrases.push("DVR/NVR installation");
    } else if (wLow.includes("dvr / nvr configuration")) {
      if (!workPhrases.includes("DVR/NVR configuration")) workPhrases.push("DVR/NVR configuration");
    } else if (wLow.includes("hard disk") || wLow.includes("storage")) {
      if (!workPhrases.includes("storage setup")) workPhrases.push("storage setup");
    } else if (wLow.includes("cabling") || wLow.includes("cable")) {
      if (!workPhrases.includes("cabling")) workPhrases.push("cabling");
    } else if (wLow.includes("remote viewing") || wLow.includes("remote playback")) {
      if (!workPhrases.includes("remote viewing setup")) workPhrases.push("remote viewing setup");
    } else if (wLow.includes("mobile app")) {
      if (!workPhrases.includes("mobile app configuration")) workPhrases.push("mobile app configuration");
    } else if (wLow.includes("4g") || wLow.includes("sim")) {
      if (!workPhrases.includes("4G connectivity")) workPhrases.push("4G connectivity");
    } else if (wLow.includes("solar")) {
      if (!workPhrases.includes("solar power setup")) workPhrases.push("solar power setup");
    } else if (wLow.includes("two-way audio")) {
      if (!workPhrases.includes("two-way audio configuration")) workPhrases.push("two-way audio configuration");
    } else if (wLow.includes("audio") || wLow.includes("mic")) {
      if (!workPhrases.includes("audio setup")) workPhrases.push("audio setup");
    } else if (wLow.includes("camera configuration")) {
      if (!workPhrases.includes("camera configuration")) workPhrases.push("camera configuration");
    } else if (wLow.includes("recording configuration")) {
      if (!workPhrases.includes("recording configuration")) workPhrases.push("recording configuration");
    } else if (wLow.includes("night vision")) {
      if (!workPhrases.includes("night vision configuration")) workPhrases.push("night vision configuration");
    } else if (wLow.includes("network configuration") || wLow.includes("router")) {
      if (!workPhrases.includes("network configuration")) workPhrases.push("network configuration");
    } else if (wLow.includes("system testing") || wLow.includes("testing")) {
      if (!workPhrases.includes("system testing")) workPhrases.push("system testing");
    } else if (wLow.includes("camera issue resolved")) {
      if (!workPhrases.includes("resolving camera issues")) workPhrases.push("resolving camera issues");
    } else if (wLow.includes("dvr / nvr issue resolved")) {
      if (!workPhrases.includes("resolving DVR/NVR issues")) workPhrases.push("resolving DVR/NVR issues");
    } else if (wLow.includes("troubleshooting")) {
      if (!workPhrases.includes("system troubleshooting")) workPhrases.push("system troubleshooting");
    } else if (wLow.includes("ssd")) {
      if (!workPhrases.includes("SSD upgrade")) workPhrases.push("SSD upgrade");
    } else if (wLow.includes("ram")) {
      if (!workPhrases.includes("RAM upgrade")) workPhrases.push("RAM upgrade");
    } else if (wLow.includes("screen") || wLow.includes("display")) {
      if (!workPhrases.includes("display replacement")) workPhrases.push("display replacement");
    } else if (wLow.includes("battery")) {
      if (!workPhrases.includes("battery replacement")) workPhrases.push("battery replacement");
    } else if (wLow.includes("keyboard")) {
      if (!workPhrases.includes("keyboard replacement")) workPhrases.push("keyboard replacement");
    } else if (wLow.includes("windows") || wLow.includes("os")) {
      if (!workPhrases.includes("OS installation")) workPhrases.push("OS installation");
    } else if (wLow.includes("cartridge") || wLow.includes("refill")) {
      if (!workPhrases.includes("cartridge service")) workPhrases.push("cartridge service");
    } else if (wLow.includes("roller") || wLow.includes("paper jam")) {
      if (!workPhrases.includes("roller repair")) workPhrases.push("roller repair");
    } else if (wLow.includes("biometric") || wLow.includes("fingerprint")) {
      if (!workPhrases.includes("biometric scanner setup")) workPhrases.push("biometric scanner setup");
    } else if (wLow.includes("lock") || wLow.includes("access control")) {
      if (!workPhrases.includes("access control lock setup")) workPhrases.push("access control lock setup");
    }
  });

  // Group work phrases naturally (select up to 3 for natural sentence balance)
  let workClause = "";
  const selectedWorkTop = workPhrases.slice(0, 3);
  if (selectedWorkTop.length === 1) {
    workClause = selectedWorkTop[0];
  } else if (selectedWorkTop.length === 2) {
    workClause = `${selectedWorkTop[0]} and ${selectedWorkTop[1]}`;
  } else if (selectedWorkTop.length >= 3) {
    workClause = `${selectedWorkTop[0]}, ${selectedWorkTop[1]} and ${selectedWorkTop[2]}`;
  }

  // 4. Handle Experience Clauses
  const hasNeat = experiences.some(e => e.toLowerCase().includes("neat"));
  const hasProblemSolved = experiences.some(e => e.toLowerCase().includes("solved") || e.toLowerCase().includes("quick"));
  const hasExplanation = experiences.some(e => e.toLowerCase().includes("explanation") || e.toLowerCase().includes("communication"));

  let workmanshipSentence = "The work was completed neatly and the system was tested properly.";
  if (hasNeat && hasExplanation) {
    workmanshipSentence = "The installation was neat and the team explained the setup clearly.";
  } else if (hasProblemSolved) {
    workmanshipSentence = "The issue was diagnosed accurately and resolved quickly.";
  } else if (hasExplanation) {
    workmanshipSentence = "The team explained everything clearly and verified full functionality before leaving.";
  } else if (hasNeat) {
    workmanshipSentence = "The cabling and mounting were done very neatly.";
  }

  let closingSentence = "Professional service and good communication throughout.";
  if (experiences.includes("Professional Work") && experiences.includes("Good Communication")) {
    closingSentence = "Professional service and good communication throughout.";
  } else if (experiences.includes("Quick Response")) {
    closingSentence = "Quick response and dependable technical support.";
  } else if (experiences.includes("Good Service")) {
    closingSentence = "Very satisfied with the service and quality of work.";
  } else if (experiences.includes("Problem Solved")) {
    closingSentence = "Problem was solved completely without any hassle.";
  }

  // 5. Low Rating Fallback (1-2 Stars)
  if (rating <= 2) {
    const p1 = `I contacted MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
    const p2 = "The service did not meet expectations and needs improvement.";
    return [p1, p2, customNote].filter(Boolean).join(" ");
  }

  // 6. 3-Star Rating
  if (rating === 3) {
    const p1 = `Used MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
    const p2 = "The work was completed and basic testing was done.";
    return [p1, p2, customNote].filter(Boolean).join(" ");
  }

  // 7. Multi-Service Check (Step 1 has 2 services)
  const isMultiService = mainServices.length >= 2;
  if (isMultiService) {
    const s1 = mainServices[0].toLowerCase();
    const s2 = mainServices[1].toLowerCase();
    const p1 = `MI INFOTECH handled our ${s1} and ${s2} ${locPhrase}.`;
    const p2 = workClause 
      ? `The work included ${workClause}, with everything tested before handover.` 
      : "The work was completed neatly and all systems were tested properly.";
    const p3 = "Professional service and clear communication.";
    return [p1, p2, customNote, p3].filter(Boolean).join(" ");
  }

  // 8. Dynamic 7-Style Rotation Engine (21 Variations)
  // Ensures variety across multiple customers with identical selections
  const cycleIndex = variationIndex % 21;
  let reviewText = "";

  switch (cycleIndex) {
    // Style 1: Service-focused
    case 0: {
      const p1 = `MI INFOTECH completed our ${primaryServiceSEO} ${locPhrase} professionally.`;
      const p2 = workClause ? `The team handled the ${workClause} and verified everything properly.` : workmanshipSentence;
      const p3 = closingSentence;
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 7: {
      const p1 = `Had our ${primaryServiceSEO} completed by MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `They handled the ${workClause} smoothly and tested the setup thoroughly.` : "Everything was completed neatly and tested before completion.";
      const p3 = "Very satisfied with the service and support.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 14: {
      const p1 = `Contacted MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
      const p2 = workClause ? `The technician completed the ${workClause} systematically and verified everything before leaving.` : "The technician arrived on time, completed the work systematically, and verified everything before leaving.";
      const p3 = "Dependable local service.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }

    // Style 2: Technical-focused
    case 1: {
      const p1 = `Got our ${primaryServiceSEO} done from MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `The ${workClause} was handled properly and the system was tested before handover.` : workmanshipSentence;
      const p3 = "Reliable technical workmanship.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 8: {
      const p1 = `Very good technical work by MI INFOTECH ${locPhrase} for our ${primaryServiceSEO}.`;
      const p2 = workClause ? `The ${workClause} was completed cleanly and tested thoroughly.` : "Neat wiring and clean mounting throughout.";
      const p3 = "Appreciate the methodical work and clear demonstration.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 15: {
      const p1 = `Engaged MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
      const p2 = workClause ? `The ${workClause} was carried out cleanly with proper cable management and testing.` : "The work was carried out cleanly with proper cable management and thorough testing.";
      const p3 = "Great technical expertise and smooth execution.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }

    // Style 3: Experience-focused
    case 2: {
      const p1 = `Had our ${primaryServiceSEO} done by MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `The team explained the setup clearly, handled the ${workClause} neatly, and checked the system before leaving.` : "The team explained the setup clearly, completed the work neatly, and checked the system before leaving.";
      const p3 = "Good service and helpful technicians.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 9: {
      const p1 = `Called MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
      const p2 = workClause ? `The team was very responsive, completed the ${workClause}, and walked us through the system.` : "The team was very responsive, walked us through the settings, and ensured everything was running smoothly.";
      const p3 = "Very happy with the overall service experience.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 16: {
      const p1 = `Great customer experience with MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `They attended to our ${primaryServiceSEO} promptly, completed the ${workClause}, and guided us through how it works.` : `They attended to our ${primaryServiceSEO} promptly and guided us through how the system works.`;
      const p3 = "Highly recommended for reliable on-site service.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }

    // Style 4: Local-service-focused
    case 3: {
      const p1 = `Reliable doorstep service by MI INFOTECH ${locPhrase} for ${primaryServiceSEO}.`;
      const p2 = workClause ? `They completed the ${workClause} cleanly and verified the system.` : "The setup was completed quickly with clean wiring and testing.";
      const p3 = "Good local tech support.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 10: {
      const p1 = `Used MI INFOTECH for ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The technician came over promptly, completed the ${workClause}, and checked full functionality.` : "The technician came over promptly, identified the requirement, and completed the job without delay.";
      const p3 = "Dependable local support.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 17: {
      const p1 = `For technical service ${locPhrase}, MI INFOTECH did a solid job with our ${primaryServiceSEO}.`;
      const p2 = workClause ? `Neat execution on ${workClause}, on-time visit, and proper verification before handover.` : "Neat execution, on-time visit, and proper verification before handover.";
      reviewText = [p1, p2, customNote].filter(Boolean).join(" ");
      break;
    }

    // Style 5: Multi-service / Integrated
    case 4: {
      const p1 = `MI INFOTECH completed our ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The ${workClause} was carried out neatly and the system was tested properly.` : "The work was completed neatly and the system was tested properly.";
      const p3 = "Professional CCTV service and good communication throughout.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 11: {
      const p1 = `MI INFOTECH handled our ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The ${workClause} was configured properly, with everything tested before completion.` : "The setup and cabling were configured properly, with everything tested before completion.";
      const p3 = "Clear communication and good workmanship.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 18: {
      const p1 = `MI INFOTECH took care of our ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The ${workClause} was completed neatly, tested thoroughly, and handed over with clear guidance.` : "Everything was installed neatly, tested thoroughly, and handed over with clear guidance.";
      const p3 = "Great all-around support.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }

    // Style 6: Very short natural review
    case 5: {
      const p1 = `Professional ${primaryServiceSEO} by MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `Neat execution of ${workClause}, proper testing and good support.` : "Neat setup, proper testing and good support.";
      reviewText = [p1, p2, customNote].filter(Boolean).join(" ");
      break;
    }
    case 12: {
      const p1 = `Quick and reliable ${primaryServiceSEO} from MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `The technician did clean work on ${workClause} and verified everything before leaving.` : "The technician was punctual, did clean work, and verified everything before leaving.";
      reviewText = [p1, p2, customNote].filter(Boolean).join(" ");
      break;
    }
    case 19: {
      const p1 = `Got our ${primaryServiceSEO} done by MI INFOTECH ${locPhrase}.`;
      const p2 = workClause ? `Clean workmanship on ${workClause}, tested on-site, and hassle-free service.` : "Clean workmanship, tested on-site, and hassle-free service.";
      reviewText = [p1, p2, customNote].filter(Boolean).join(" ");
      break;
    }

    // Style 7: Detailed natural review
    case 6: {
      const p1 = `MI INFOTECH completed our ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The team handled the ${workClause} neatly and verified the system carefully.` : "The installation was neat, all connections were secure, and the team explained the setup clearly.";
      const p3 = "Very professional service and great support throughout.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 13: {
      const p1 = `I am very pleased with the ${primaryServiceSEO} provided by MI INFOTECH ${locPhrase}.`;
      const p2 = workClause 
        ? `They handled the ${workClause} smoothly and ensured everything was tidy and secure.` 
        : "The installation was neat, connections were secure, and all settings were verified properly.";
      const p3 = "The team took the time to verify full functionality and answered all our questions.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
    case 20:
    default: {
      const p1 = `MI INFOTECH completed our ${primaryServiceSEO} ${locPhrase}.`;
      const p2 = workClause ? `The work included ${workClause}, completed with proper attention to detail and thorough testing before handover.` : "The work was completed on time, with proper attention to neat installation and thorough testing before handover.";
      const p3 = "Great communication and dependable doorstep technical support.";
      reviewText = [p1, p2, customNote, p3].filter(Boolean).join(" ");
      break;
    }
  }

  return reviewText.replace(/\s+/g, " ").trim();
}

/**
 * WhatsApp Review solicitation generator
 */
export function generateTruthfulWhatsAppRequest(
  relationship: CustomerRelationship,
  serviceName: string,
  subservice?: string
): string {
  const serviceDetail = subservice ? `${subservice}` : serviceName;

  if (relationship === "new") {
    return `Hi, thank you for choosing MIINFOTECH for your recent ${serviceDetail} service.

We would really appreciate it if you could share your genuine experience with our service.

Your feedback helps us improve our service and helps other customers understand our work.

⭐ Share your service experience:
${REVIEW_PAGE_URL}

Thank you for your valuable feedback.

MIINFOTECH
Hassan, Karnataka`;
  }

  if (relationship === "longterm") {
    return `Hi, thank you for trusting MIINFOTECH with your IT and security requirements over the years.

We would really appreciate it if you could share your genuine experience with our service.

⭐ Share your service experience:
${REVIEW_PAGE_URL}

Thank you for your continued trust and support.

MIINFOTECH
Hassan, Karnataka`;
  }

  return `Hi, thank you for continuing to trust MIINFOTECH with your IT and security service and support.

We would really appreciate it if you could share your genuine experience with our service.

⭐ Share your service experience:
${REVIEW_PAGE_URL}

Thank you for your continued support.

MIINFOTECH
Hassan, Karnataka`;
}

