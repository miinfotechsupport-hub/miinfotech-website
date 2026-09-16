import { 
  Video, 
  Monitor, 
  Laptop, 
  Printer, 
  Network, 
  BatteryCharging, 
  Fingerprint, 
  Wrench,
  GraduationCap,
  PhoneCall,
  ShieldAlert,
  Wifi
} from "lucide-react";

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";
export const REVIEW_PAGE_URL = "https://miinfotech.netlify.app/review";

// ============================================================================
// TYPES
// ============================================================================

export type CustomerRelationship = "new" | "existing" | "longterm";

export interface CustomerServiceItem {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  workOptions: string[];
}

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

export type ReviewTone = "courteous" | "technical" | "concise";

export interface ReviewGenerationContext {
  selectedServices: string[];
  selectedWork: string[];
  experienceSelections: string[];
  customerNotes?: string;
  tone?: ReviewTone;
  location?: string;
  rating?: number;
  variationIndex?: number;
}

export type ReviewDraftStyle = "natural" | "short" | "detailed" | "professional" | "simple";

export interface ReviewDraftInput extends Partial<ReviewGenerationContext> {
  rating?: number;
  serviceCategoryIds?: string[];
  serviceNames?: string[];
  mainServices?: string[];
  cameraTypes?: string[];
  importantFeatures?: string[];
  experiences?: string[];
  location?: string;
  customNote?: string;
  variationIndex?: number;
  tone?: ReviewTone;
  draftStyle?: ReviewDraftStyle;
}

// ============================================================================
// 12 CANONICAL CUSTOMER REVIEW SERVICES & WORK OPTIONS
// ============================================================================

export const CUSTOMER_REVIEW_SERVICES: CustomerServiceItem[] = [
  {
    id: "cctv",
    name: "CCTV",
    shortName: "CCTV",
    icon: Video,
    workOptions: [
      "CCTV Installation",
      "CCTV Camera Repair",
      "DVR/NVR Setup",
      "Camera Replacement",
      "Remote Viewing / Mobile Setup",
      "CCTV Maintenance",
      "Camera Configuration",
      "Other"
    ]
  },
  {
    id: "computer",
    name: "Computer",
    shortName: "Computer",
    icon: Monitor,
    workOptions: [
      "Computer Repair",
      "Windows Installation",
      "Software Installation",
      "Hardware Repair",
      "Formatting",
      "System Upgrade",
      "Virus / Performance Troubleshooting",
      "Other"
    ]
  },
  {
    id: "laptop",
    name: "Laptop",
    shortName: "Laptop",
    icon: Laptop,
    workOptions: [
      "Laptop Repair",
      "Windows Installation",
      "SSD Upgrade",
      "RAM Upgrade",
      "Laptop Cleaning",
      "Software Installation",
      "Hardware Troubleshooting",
      "Other"
    ]
  },
  {
    id: "printer",
    name: "Printer",
    shortName: "Printer",
    icon: Printer,
    workOptions: [
      "Printer Repair",
      "Printer Installation",
      "Printer Setup",
      "Ink/Cartridge Related Service",
      "Network Printer Setup",
      "Printer Maintenance",
      "Other"
    ]
  },
  {
    id: "networking",
    name: "Networking",
    shortName: "Networking",
    icon: Network,
    workOptions: [
      "LAN Installation",
      "Wi-Fi Setup",
      "Network Troubleshooting",
      "Router Configuration",
      "Switch Installation",
      "Office Networking",
      "Other"
    ]
  },
  {
    id: "ups",
    name: "UPS",
    shortName: "UPS",
    icon: BatteryCharging,
    workOptions: [
      "UPS Service",
      "UPS Battery Replacement",
      "UPS Installation",
      "UPS Troubleshooting",
      "Other"
    ]
  },
  {
    id: "biometric",
    name: "Biometric",
    shortName: "Biometric",
    icon: Fingerprint,
    workOptions: [
      "Biometric Installation",
      "Attendance Setup",
      "Software & Reports",
      "Fingerprint / Face Setup",
      "Access Control & Lock",
      "Other"
    ]
  },
  {
    id: "school_it",
    name: "School IT",
    shortName: "School IT",
    icon: GraduationCap,
    workOptions: [
      "School Computer Lab Setup",
      "Lab Networking & Wi-Fi",
      "Projector & Audio Setup",
      "System Maintenance & Troubleshooting",
      "Other"
    ]
  },
  {
    id: "intercom",
    name: "Intercom / EPABX",
    shortName: "Intercom / EPABX",
    icon: PhoneCall,
    workOptions: [
      "EPABX Intercom Installation",
      "Cabling & Extensions",
      "Phone Line Troubleshooting",
      "Intercom Programming & Setup",
      "Other"
    ]
  },
  {
    id: "fire_alarm",
    name: "Fire Alarm",
    shortName: "Fire Alarm",
    icon: ShieldAlert,
    workOptions: [
      "Fire Alarm System Installation",
      "Smoke Detector Setup & Testing",
      "Control Panel Wiring",
      "Alarm System Maintenance",
      "Other"
    ]
  },
  {
    id: "p2p_wireless",
    name: "P2P Wireless",
    shortName: "P2P Wireless",
    icon: Wifi,
    workOptions: [
      "Long-Range Wireless Bridge Setup",
      "Point-to-Point Antenna Alignment",
      "Outdoor Wireless Link Configuration",
      "Wireless Network Troubleshooting",
      "Other"
    ]
  },
  {
    id: "other",
    name: "Other",
    shortName: "Other",
    icon: Wrench,
    workOptions: [
      "General Technical Service",
      "On-Site Troubleshooting",
      "Hardware Repair",
      "Other Work"
    ]
  }
];

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

// ============================================================================
// CANONICAL SERVICE RECOGNITION & DETECTION PATTERNS
// ============================================================================

export interface ReviewGenerationContext {
  services: string[];
  workCompleted: string[];
  experience: string[];
  location?: string;
  customerNotes?: string;
  rating?: number;
  tone?: ReviewTone;
  variationIndex?: number;
}

export const SERVICE_KEYWORD_PATTERNS: Record<string, RegExp[]> = {
  cctv: [/cctv/i, /camera/i, /surveillance/i, /dvr/i, /nvr/i],
  computer: [/computer/i, /\bpc\b/i, /desktop/i, /windows/i, /software/i, /formatting/i],
  laptop: [/laptop/i, /\bssd\b/i, /\bram\b/i],
  printer: [/printer/i, /cartridge/i, /\bink\b/i],
  networking: [/network/i, /networking/i, /\blan\b/i, /wi-fi/i, /wifi/i, /router/i, /switch/i],
  ups: [/\bups\b/i, /inverter/i, /battery/i],
  biometric: [/biometric/i, /attendance/i, /fingerprint/i, /access control/i],
  school_it: [/school/i, /computer lab/i, /projector/i],
  intercom: [/intercom/i, /epabx/i, /phone line/i],
  fire_alarm: [/fire alarm/i, /smoke detector/i, /alarm panel/i],
  p2p_wireless: [/wireless bridge/i, /p2p/i, /wireless link/i, /antenna/i],
  other: [/technical service/i, /troubleshooting/i]
};

// Canonical service key extractor
export function getServiceKey(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (s.includes("cctv") || s.includes("camera") || s.includes("surveillance")) return "cctv";
  if (s.includes("laptop")) return "laptop";
  if (s.includes("computer") || s.includes("desktop") || s.includes("pc")) return "computer";
  if (s.includes("printer") || s.includes("cartridge")) return "printer";
  if (s.includes("networking") || s.includes("lan") || s.includes("wifi") || s.includes("wi-fi") || s.includes("router")) return "networking";
  if (s.includes("ups") || s.includes("inverter") || s.includes("battery")) return "ups";
  if (s.includes("biometric") || s.includes("attendance")) return "biometric";
  if (s.includes("school") || s.includes("lab")) return "school_it";
  if (s.includes("intercom") || s.includes("epabx")) return "intercom";
  if (s.includes("fire") || s.includes("alarm") || s.includes("smoke")) return "fire_alarm";
  if (s.includes("p2p") || s.includes("wireless") || s.includes("bridge")) return "p2p_wireless";
  return "other";
}

function getSingleServicePhrase(key: string): string {
  switch (key) {
    case "cctv": return "CCTV installation";
    case "computer": return "computer repair and service";
    case "laptop": return "laptop repair and service";
    case "printer": return "printer service";
    case "networking": return "LAN networking and Wi-Fi setup";
    case "ups": return "UPS and inverter service";
    case "biometric": return "biometric attendance system installation";
    case "school_it": return "school computer lab and IT setup";
    case "intercom": return "intercom and EPABX installation";
    case "fire_alarm": return "fire alarm system installation";
    case "p2p_wireless": return "P2P wireless bridge setup";
    default: return "technical service";
  }
}

function getServiceNaturalLabel(key: string): string {
  switch (key) {
    case "cctv": return "CCTV installation";
    case "computer": return "computer repair";
    case "laptop": return "laptop repair";
    case "printer": return "printer service";
    case "networking": return "LAN networking";
    case "ups": return "UPS service";
    case "biometric": return "biometric attendance";
    case "school_it": return "school IT lab";
    case "intercom": return "intercom installation";
    case "fire_alarm": return "fire alarm setup";
    case "p2p_wireless": return "P2P wireless bridge";
    default: return "technical service";
  }
}

export function getServicePhrase(keys: string[], rawNames: string[]): string {
  if (keys.length === 0) {
    return "doorstep IT service";
  }

  if (keys.length === 1) {
    return getSingleServicePhrase(keys[0]);
  }

  if (keys.length === 2) {
    const k1 = keys[0];
    const k2 = keys[1];

    if ((k1 === "computer" && k2 === "printer") || (k1 === "printer" && k2 === "computer")) {
      return "computer and printer service";
    }
    if ((k1 === "cctv" && k2 === "computer") || (k1 === "computer" && k2 === "cctv")) {
      return "CCTV installation and computer service";
    }
    if ((k1 === "cctv" && k2 === "printer") || (k1 === "printer" && k2 === "cctv")) {
      return "CCTV installation and printer service";
    }
    if ((k1 === "laptop" && k2 === "printer") || (k1 === "printer" && k2 === "laptop")) {
      return "laptop and printer repair";
    }
    if ((k1 === "networking" && k2 === "cctv") || (k1 === "cctv" && k2 === "networking")) {
      return "networking and CCTV installation";
    }
    if ((k1 === "ups" && k2 === "computer") || (k1 === "computer" && k2 === "ups")) {
      return "UPS setup and computer service";
    }
    if ((k1 === "biometric" && k2 === "computer") || (k1 === "computer" && k2 === "biometric")) {
      return "biometric attendance and computer systems";
    }
    if ((k1 === "laptop" && k2 === "computer") || (k1 === "computer" && k2 === "laptop")) {
      return "computer and laptop service";
    }
    if ((k1 === "school_it" && k2 === "cctv") || (k1 === "cctv" && k2 === "school_it")) {
      return "school IT lab and CCTV setup";
    }
    if ((k1 === "intercom" && k2 === "cctv") || (k1 === "cctv" && k2 === "intercom")) {
      return "intercom and CCTV installation";
    }
    if ((k1 === "fire_alarm" && k2 === "cctv") || (k1 === "cctv" && k2 === "fire_alarm")) {
      return "fire alarm and CCTV installation";
    }

    const label1 = getServiceNaturalLabel(k1);
    const label2 = getServiceNaturalLabel(k2);
    return `${label1} and ${label2}`;
  }

  // 3 Services: Combine naturally with commas and 'and'
  if (keys.length === 3) {
    const hasCctv = keys.includes("cctv");
    const hasComp = keys.includes("computer");
    const hasPrint = keys.includes("printer");
    const hasNet = keys.includes("networking");
    const hasUps = keys.includes("ups");

    if (hasCctv && hasComp && hasPrint) {
      return "CCTV installation, computer repair and printer service";
    }
    if (hasNet && hasCctv && hasUps) {
      return "LAN networking, CCTV installation and UPS service";
    }

    const l1 = getServiceNaturalLabel(keys[0]);
    const l2 = getServiceNaturalLabel(keys[1]);
    const l3 = getServiceNaturalLabel(keys[2]);
    return `${l1}, ${l2} and ${l3}`;
  }

  // 4+ Services
  const labels = keys.map(getServiceNaturalLabel);
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

export function formatWorkItem(item: string): string {
  const s = item.trim();
  const low = s.toLowerCase();

  // Computer options
  if (low === "computer repair" || low.includes("computer repair")) return "computer repair";
  if (low === "windows installation" || low.includes("windows installation")) return "Windows installation";
  if (low === "software installation" || low.includes("software installation")) return "software installation";
  if (low === "hardware repair" || low.includes("hardware repair")) return "hardware repair";
  if (low === "formatting" || low.includes("formatting")) return "system formatting";
  if (low === "system upgrade" || low.includes("system upgrade")) return "system upgrade";
  if (low.includes("virus") || low.includes("performance")) return "virus and performance troubleshooting";

  // Laptop options
  if (low === "laptop repair" || low.includes("laptop repair")) return "laptop repair";
  if (low === "ssd upgrade" || low.includes("ssd")) return "SSD upgrade";
  if (low === "ram upgrade" || low.includes("ram")) return "RAM upgrade";
  if (low === "laptop cleaning" || low.includes("cleaning")) return "laptop cleaning";
  if (low === "hardware troubleshooting" || low.includes("hardware troubleshooting")) return "hardware troubleshooting";

  // Printer options
  if (low.includes("network printer")) return "network printer setup";
  if (low === "printer repair" || low.includes("printer repair")) return "printer repair";
  if (low === "printer installation" || low.includes("printer installation")) return "printer installation";
  if (low === "printer setup" || low.includes("printer setup")) return "printer setup";
  if (low.includes("cartridge") || low.includes("ink")) return "cartridge and ink service";
  if (low === "printer maintenance" || low.includes("printer maintenance")) return "printer maintenance";

  // CCTV options
  if (low === "cctv installation" || low.includes("cctv installation")) return "CCTV camera installation";
  if (low.includes("camera repair") || low.includes("cctv repair")) return "CCTV camera repair";
  if (low.includes("dvr") || low.includes("nvr")) return "DVR/NVR setup";
  if (low.includes("camera replacement")) return "camera replacement";
  if (low.includes("remote viewing") || low.includes("mobile setup")) return "remote mobile viewing setup";
  if (low.includes("cctv maintenance")) return "CCTV maintenance";
  if (low.includes("camera configuration") || low.includes("positioning")) return "camera configuration";

  // Networking options
  if (low === "lan installation" || low.includes("lan")) return "LAN cabling and installation";
  if (low === "wi-fi setup" || low.includes("wi-fi") || low.includes("wifi")) return "Wi-Fi setup";
  if (low.includes("network troubleshooting")) return "network troubleshooting";
  if (low.includes("router")) return "router configuration";
  if (low.includes("switch")) return "switch installation";
  if (low.includes("office networking")) return "office networking";

  // UPS options
  if (low.includes("battery replacement") || low.includes("battery")) return "UPS battery replacement";
  if (low === "ups installation" || low.includes("ups installation")) return "UPS installation";
  if (low.includes("ups troubleshooting")) return "UPS troubleshooting";
  if (low === "ups service" || low.includes("ups")) return "UPS service";

  // Biometric options
  if (low.includes("biometric installation")) return "biometric attendance system installation";
  if (low === "attendance setup" || low.includes("attendance")) return "attendance setup";
  if (low.includes("software & reports") || low.includes("reports")) return "attendance software setup";
  if (low.includes("fingerprint") || low.includes("face")) return "fingerprint and face registration";
  if (low.includes("access control") || low.includes("lock")) return "access control lock setup";

  // School IT options
  if (low.includes("school computer lab") || low.includes("lab setup")) return "school computer lab setup";
  if (low.includes("lab networking")) return "lab networking and Wi-Fi";
  if (low.includes("projector")) return "projector and audio setup";
  if (low.includes("system maintenance")) return "lab system maintenance";

  // Intercom options
  if (low.includes("epabx") || low.includes("intercom installation")) return "EPABX intercom installation";
  if (low.includes("cabling & extensions") || low.includes("extensions")) return "cabling and extensions";
  if (low.includes("phone line")) return "phone line troubleshooting";
  if (low.includes("intercom programming")) return "intercom programming";

  // Fire Alarm options
  if (low.includes("fire alarm")) return "fire alarm system installation";
  if (low.includes("smoke detector")) return "smoke detector testing";
  if (low.includes("control panel")) return "alarm panel wiring";
  if (low.includes("alarm system maintenance")) return "alarm system maintenance";

  // P2P Wireless options
  if (low.includes("wireless bridge") || low.includes("long-range")) return "long-range wireless bridge setup";
  if (low.includes("antenna alignment") || low.includes("p2p")) return "P2P antenna alignment";
  if (low.includes("outdoor wireless")) return "outdoor wireless link configuration";
  if (low.includes("wireless network troubleshooting")) return "wireless link troubleshooting";

  // Other options
  if (low === "other" || low === "other work" || low === "other camera") return "";
  if (low.includes("troubleshooting") || low.includes("on-site")) return "on-site troubleshooting";
  if (low.includes("technical service")) return "technical service";

  return s.toLowerCase();
}

/**
 * Strictly factual customer experience statement generator.
 * Rule 15: NEVER invents claims (no "affordable prices", "best service", "100% satisfaction", "same-day service", "highly recommended").
 */
function getFactualExperienceClause(
  rawExperiences: string[],
  tone: ReviewTone,
  variationIndex: number
): string {
  const hasPrompt = rawExperiences.some(e => /quick|prompt|fast|timely/i.test(e));
  const hasNeat = rawExperiences.some(e => /neat|clean|tidy|cable/i.test(e));
  const hasCommunication = rawExperiences.some(e => /communication|explained|clear/i.test(e));
  const hasResolved = rawExperiences.some(e => /resolved|solved|diagnosis|fixed/i.test(e));
  const hasCourteous = rawExperiences.some(e => /helpful|courteous|polite|friendly/i.test(e));
  const hasProfessional = rawExperiences.some(e => /professional/i.test(e));

  const remarks: string[] = [];

  if (hasNeat) {
    remarks.push("neat installation and tidy setup");
  }
  if (hasCommunication) {
    remarks.push("clear communication");
  }
  if (hasCourteous) {
    remarks.push("polite and courteous service");
  }
  if (hasPrompt) {
    remarks.push("prompt response and timely service");
  }
  if (hasProfessional) {
    remarks.push("professional workmanship");
  }

  if (remarks.length > 0) {
    if (remarks.length === 1) {
      return `Appreciate their ${remarks[0]}.`;
    }
    return `Appreciate their ${remarks[0]} and ${remarks[1]}.`;
  }

  if (hasResolved) {
    return "The reported issues were diagnosed and resolved properly.";
  }

  // Factual neutral closes that do NOT invent claims
  if (tone === "technical") {
    const opts = [
      "Reliable technical expertise and dependable on-site assistance.",
      "Methodical configuration and structured technical support.",
      "Clear technical explanation and dependable local service."
    ];
    return opts[variationIndex % opts.length];
  } else if (tone === "concise") {
    const opts = [
      "Dependable local service and clear handover.",
      "Prompt and professional service throughout.",
      "Good communication and dependable local support."
    ];
    return opts[variationIndex % opts.length];
  } else {
    const opts = [
      "Clear communication and courteous service throughout.",
      "Professional team and dependable local service.",
      "Helpful guidance and reliable on-site support."
    ];
    return opts[variationIndex % opts.length];
  }
}

/**
 * Validation Guard
 * Validates that all selected services have corresponding representation in the text,
 * AND verifies that unselected major service categories are NOT mentioned.
 */
export function validateReviewText(
  reviewText: string,
  selectedServices: string[]
): { isValid: boolean; missingServices: string[]; forbiddenServices: string[] } {
  if (!selectedServices || selectedServices.length === 0) {
    return { isValid: true, missingServices: [], forbiddenServices: [] };
  }

  const missing: string[] = [];
  const forbidden: string[] = [];
  const text = reviewText.toLowerCase();

  const selectedKeys = selectedServices.map(getServiceKey);

  for (const rawService of selectedServices) {
    const key = getServiceKey(rawService);
    const patterns = SERVICE_KEYWORD_PATTERNS[key] || [new RegExp(rawService.toLowerCase(), "i")];
    const isMatched = patterns.some((p) => p.test(text));
    if (!isMatched) {
      missing.push(rawService);
    }
  }

  // Cross-category exclusion guard: ensure unselected categories are not hallucinated
  const allMajorCategories: Record<string, RegExp[]> = {
    cctv: [/cctv/i, /\bcameras?\b/i, /\bdvr\b/i, /\bnvr\b/i, /surveillance/i],
    printer: [/\bprinters?\b/i, /cartridge/i, /printhead/i, /toner/i],
    laptop: [/\blaptops?\b/i],
    computer: [/\bdesktop\b/i, /windows installation/i, /system formatting/i],
    networking: [/lan cabling/i, /cat6/i, /router configuration/i, /office networking/i],
    ups: [/ups battery/i, /inverter/i, /power backup/i],
    biometric: [/biometric/i, /fingerprint attendance/i, /attendance software/i],
    intercom: [/intercom/i, /epabx/i],
    fire_alarm: [/fire alarm/i, /smoke detector/i],
    p2p_wireless: [/p2p wireless/i, /wireless bridge/i],
    school_it: [/computer lab setup/i, /school it/i]
  };

  for (const [catKey, patterns] of Object.entries(allMajorCategories)) {
    if (!selectedKeys.includes(catKey)) {
      if (patterns.some(p => p.test(text))) {
        forbidden.push(catKey);
      }
    }
  }

  return {
    isValid: missing.length === 0 && forbidden.length === 0,
    missingServices: missing,
    forbiddenServices: forbidden
  };
}

function getWorkForServiceKey(key: string, rawWork: string[]): string {
  // Find items in rawWork that match this service key
  const matching = rawWork.filter(w => {
    const low = w.toLowerCase();
    switch (key) {
      case "cctv": return low.includes("cctv") || low.includes("camera") || low.includes("dvr") || low.includes("nvr") || low.includes("viewing");
      case "computer": return low.includes("computer") || low.includes("windows") || low.includes("software") || low.includes("formatting") || low.includes("hardware") || low.includes("desktop");
      case "laptop": return low.includes("laptop") || low.includes("ssd") || low.includes("ram") || low.includes("cleaning");
      case "printer": return low.includes("printer") || low.includes("cartridge") || low.includes("ink") || low.includes("toner");
      case "networking": return low.includes("lan") || low.includes("wi-fi") || low.includes("wifi") || low.includes("router") || low.includes("switch") || low.includes("network");
      case "ups": return low.includes("ups") || low.includes("inverter") || low.includes("battery");
      case "biometric": return low.includes("biometric") || low.includes("attendance") || low.includes("fingerprint") || low.includes("face") || low.includes("access");
      case "school_it": return low.includes("school") || low.includes("lab") || low.includes("projector");
      case "intercom": return low.includes("intercom") || low.includes("epabx") || low.includes("phone");
      case "fire_alarm": return low.includes("fire") || low.includes("smoke") || low.includes("alarm");
      case "p2p_wireless": return low.includes("wireless") || low.includes("p2p") || low.includes("bridge");
      default: return false;
    }
  });

  if (matching.length > 0) {
    const formatted = matching.map(formatWorkItem).filter(Boolean);
    if (formatted.length === 1) return formatted[0];
    return `${formatted[0]} and ${formatted[1]}`;
  }

  // Natural fallback action when no specific sub-work was selected
  switch (key) {
    case "cctv": return "CCTV camera setup and configuration";
    case "computer": return "computer diagnosis and repair";
    case "laptop": return "laptop repair and service";
    case "printer": return "printer servicing and test prints";
    case "networking": return "Wi-Fi setup and network cabling";
    case "ups": return "UPS service and battery check";
    case "biometric": return "biometric attendance system installation";
    case "school_it": return "school computer lab setup";
    case "intercom": return "intercom system and extension cabling";
    case "fire_alarm": return "fire alarm and detector setup";
    case "p2p_wireless": return "P2P wireless bridge configuration";
    default: return "technical troubleshooting";
  }
}

/**
 * Multi-Service Review Generator
 * Handles 2, 3, or more services naturally, generating 5 distinct styles.
 * Ensures ALL selected services are represented without keyword stuffing or omitting categories.
 */
function generateMultiServiceReviewNarrative(params: {
  serviceKeys: string[];
  rawServices: string[];
  servicePhrase: string;
  locPhrase: string;
  rawWork: string[];
  tone: ReviewTone;
  draftStyle?: ReviewDraftStyle;
  variationIndex: number;
  rawExperiences: string[];
  customNote?: string;
}): string {
  const { serviceKeys, servicePhrase, locPhrase, rawWork, tone, draftStyle, variationIndex, rawExperiences, customNote } = params;
  const experienceClause = getFactualExperienceClause(rawExperiences, tone, variationIndex);

  // Map each selected service key to its specific work phrase
  const workMap: Record<string, string> = {};
  serviceKeys.forEach(k => {
    workMap[k] = getWorkForServiceKey(k, rawWork);
  });

  const k1 = serviceKeys[0];
  const k2 = serviceKeys[1];
  const k3 = serviceKeys[2];
  const work1 = workMap[k1] || "technical service";
  const work2 = workMap[k2] || "equipment maintenance";
  const work3 = k3 ? (workMap[k3] || "system setup") : "";

  const isThreePlus = serviceKeys.length >= 3;
  const cycle = variationIndex % 4;
  const style = draftStyle || (tone === "concise" ? "short" : tone === "technical" ? "detailed" : "natural");

  // 1. Short & Crisp Style (35-50 words)
  if (style === "short") {
    if (isThreePlus) {
      const p1 = `Dependable ${servicePhrase} by MIINFOTECH ${locPhrase}.`;
      const p2 = `Prompt execution on ${work1}, ${work2} and ${work3} with complete testing before handover.`;
      return [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
    }
    switch (cycle) {
      case 0: {
        const p1 = `Dependable ${servicePhrase} by MIINFOTECH ${locPhrase}.`;
        const p2 = `Prompt execution on ${work1} and ${work2}, with complete verification before leaving.`;
        return [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
      }
      case 1: {
        const p1 = `Got our ${servicePhrase} completed from MIINFOTECH ${locPhrase}.`;
        const p2 = `The technician handled the ${work1} and ${work2} cleanly, and both are running smoothly.`;
        return [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
      }
      case 2: {
        const p1 = `MIINFOTECH completed our ${servicePhrase} ${locPhrase} on time.`;
        const p2 = `Handled the ${work1} along with ${work2}, and tested everything before handover.`;
        return [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
      }
      default: {
        const p1 = `Quick and neat ${servicePhrase} by MIINFOTECH ${locPhrase}.`;
        const p2 = `Took care of ${work1} and ${work2} efficiently with proper testing.`;
        return [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
      }
    }
  }

  // 2. Detailed & Technical Style (50-70 words)
  if (style === "detailed") {
    if (isThreePlus) {
      const p1 = `MIINFOTECH completed our ${servicePhrase} ${locPhrase} systematically.`;
      const p2 = `The technician executed the ${work1}, handled ${work2}, and verified ${work3}.`;
      const p3 = `All systems were configured cleanly and tested on-site for stable performance before sign-off.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    switch (cycle) {
      case 0: {
        const p1 = `MIINFOTECH completed our ${servicePhrase} ${locPhrase} systematically.`;
        const p2 = `The technician executed the ${work1} and carried out full ${work2}.`;
        const p3 = `Both systems were configured cleanly and verified on-site before sign-off.`;
        return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
      }
      case 1: {
        const p1 = `Engaged MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
        const p2 = `They handled the ${work1} followed by complete ${work2} with thorough diagnosis.`;
        const p3 = `All hardware and software settings were checked before handover.`;
        return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
      }
      case 2: {
        const p1 = `Thorough technical work by MIINFOTECH ${locPhrase} on our ${servicePhrase}.`;
        const p2 = `The team completed ${work1} as well as ${work2} with methodical configuration.`;
        const p3 = `Everything was tested on-site for stable performance.`;
        return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
      }
      default: {
        const p1 = `Had our ${servicePhrase} attended to by MIINFOTECH ${locPhrase}.`;
        const p2 = `The technician completed the ${work1} and properly configured the ${work2}.`;
        const p3 = `Full testing was done before leaving, with clear technical explanation.`;
        return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
      }
    }
  }

  // 3. Professional & Timely Style (45-65 words)
  if (style === "professional") {
    if (isThreePlus) {
      const p1 = `Very pleased with the doorstep ${servicePhrase} from MIINFOTECH ${locPhrase}.`;
      const p2 = `The technician arrived on schedule, attended to the ${work1}, ${work2} and ${work3} with great care, and explained everything clearly.`;
      const p3 = `All equipment was checked and confirmed working before leaving.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    const p1 = `Very pleased with the doorstep ${servicePhrase} from MIINFOTECH ${locPhrase}.`;
    const p2 = `The technician arrived on schedule, handled the ${work1} and ${work2} with great care, and explained the setup clearly.`;
    const p3 = `Both systems were verified before leaving.`;
    return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
  }

  // 4. Simple & Direct Style (35-50 words)
  if (style === "simple") {
    if (isThreePlus) {
      const p1 = `Got our ${servicePhrase} attended to by MIINFOTECH ${locPhrase}.`;
      const p2 = `The technician completed the ${work1}, ${work2} and ${work3} cleanly in one doorstep visit.`;
      const p3 = `Dependable local service and clear handover.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    const p1 = `Got our ${servicePhrase} done through MIINFOTECH ${locPhrase}.`;
    const p2 = `The work on ${work1} and ${work2} was completed cleanly without delay.`;
    const p3 = `Dependable local service and clear handover.`;
    return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
  }

  // 5. Natural & Balanced Style (Default, 45-65 words)
  if (isThreePlus) {
    const p1 = `MIINFOTECH handled our ${servicePhrase} ${locPhrase}.`;
    const p2 = `The technician took care of our ${work1}, ${work2} and ${work3} cleanly in a single visit.`;
    const p3 = `All three systems were tested thoroughly and are working smoothly.`;
    return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
  }

  switch (cycle) {
    case 0: {
      const p1 = `MIINFOTECH handled our ${servicePhrase} ${locPhrase}.`;
      const p2 = `The technician took care of our ${work1} and also completed the ${work2} neatly.`;
      const p3 = `Both were tested thoroughly and are working properly.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    case 1: {
      const p1 = `Had a very good experience with MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
      const p2 = `They attended to the ${work1} and resolved the ${work2} without any delay.`;
      const p3 = `Everything was explained clearly and tested before handover.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    case 2: {
      const p1 = `Contacted MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
      const p2 = `The team completed the ${work1} and sorted out our ${work2} in a single visit.`;
      const p3 = `Both systems were checked and confirmed working before they left.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
    default: {
      const p1 = `Very pleased with the ${servicePhrase} provided by MIINFOTECH ${locPhrase}.`;
      const p2 = `The technician handled our ${work1} with care and configured the ${work2} properly.`;
      const p3 = `Everything was tested before sign-off, and the team was polite throughout.`;
      return [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
    }
  }
}

/**
 * Guaranteed multi-service draft builder used when a variation needs complete representation
 */
function generateGuaranteedMultiServiceReview(params: {
  servicePhrase: string;
  locPhrase: string;
  workClause: string;
  tone: ReviewTone;
  variationIndex: number;
  rawExperiences: string[];
  customNote?: string;
}): string {
  const { servicePhrase, locPhrase, workClause, tone, variationIndex, rawExperiences, customNote } = params;
  const p1 = `MIINFOTECH completed our ${servicePhrase} ${locPhrase}.`;
  const p2 = workClause ? `They handled ${workClause} with great care.` : "The work was completed cleanly.";
  const p3 = tone === "technical"
    ? "All equipment and settings were tested thoroughly before handover."
    : "Everything was tested and verified before leaving.";
  const p4 = getFactualExperienceClause(rawExperiences, tone, variationIndex);

  return [p1, p2, customNote, p3, p4].filter(Boolean).join(" ");
}

export interface ReviewDraftOption {
  id: string;
  title: string;
  tone: ReviewTone;
  tag: string;
  text: string;
  wordCount: number;
}

export function generateReviewDraftOptions(input: ReviewDraftInput): ReviewDraftOption[] {
  const baseIndex = Math.abs(input.variationIndex || 0);

  // Draft 1 — Natural & Balanced (Courteous, 45-65 words)
  const draft1Text = generateDeterministicReview({
    ...input,
    tone: "courteous",
    draftStyle: "natural",
    variationIndex: baseIndex
  });

  // Draft 2 — Short & Crisp (Concise, 35-50 words)
  const draft2Text = generateDeterministicReview({
    ...input,
    tone: "concise",
    draftStyle: "short",
    variationIndex: baseIndex + 1
  });

  // Draft 3 — Detailed & Technical (Technical, 50-70 words)
  const draft3Text = generateDeterministicReview({
    ...input,
    tone: "technical",
    draftStyle: "detailed",
    variationIndex: baseIndex + 2
  });

  // Draft 4 — Professional & Timely (Courteous, 45-65 words)
  const draft4Text = generateDeterministicReview({
    ...input,
    tone: "courteous",
    draftStyle: "professional",
    variationIndex: baseIndex + 3
  });

  // Draft 5 — Simple & Direct (Concise, 35-50 words)
  const draft5Text = generateDeterministicReview({
    ...input,
    tone: "concise",
    draftStyle: "simple",
    variationIndex: baseIndex + 4
  });

  return [
    {
      id: "draft-balanced",
      title: "Draft 1: Recommended",
      tone: "courteous",
      tag: "Natural & Balanced",
      text: draft1Text,
      wordCount: draft1Text.trim().split(/\s+/).filter(Boolean).length
    },
    {
      id: "draft-crisp",
      title: "Draft 2: Short",
      tone: "concise",
      tag: "Short & Crisp",
      text: draft2Text,
      wordCount: draft2Text.trim().split(/\s+/).filter(Boolean).length
    },
    {
      id: "draft-technical",
      title: "Draft 3: Detailed",
      tone: "technical",
      tag: "Detailed & Technical",
      text: draft3Text,
      wordCount: draft3Text.trim().split(/\s+/).filter(Boolean).length
    },
    {
      id: "draft-professional",
      title: "Draft 4: Professional",
      tone: "courteous",
      tag: "Professional & Timely",
      text: draft4Text,
      wordCount: draft4Text.trim().split(/\s+/).filter(Boolean).length
    },
    {
      id: "draft-simple",
      title: "Draft 5: Simple",
      tone: "concise",
      tag: "Simple & Direct",
      text: draft5Text,
      wordCount: draft5Text.trim().split(/\s+/).filter(Boolean).length
    }
  ];
}

export function generateDeterministicReview(input: ReviewDraftInput): string {
  const rating = input.rating ?? 5;
  const variationIndex = Math.abs(input.variationIndex || 0);

  // 1. Normalize Inputs
  const rawServices: string[] = (input.selectedServices && input.selectedServices.length > 0)
    ? input.selectedServices
    : (input.mainServices && input.mainServices.length > 0)
    ? input.mainServices
    : (input.serviceNames || []);

  const rawWork: string[] = (input.selectedWork && input.selectedWork.length > 0)
    ? input.selectedWork
    : (input.importantFeatures || []);

  const rawExperiences: string[] = (input.experienceSelections && input.experienceSelections.length > 0)
    ? input.experienceSelections
    : (input.experiences || []);

  const tone: ReviewTone = input.tone || "courteous";
  const customNote = formatCustomNote(input.customerNotes || input.customNote);

  // 2. Determine Location Mention (0–1 time, strictly natural)
  const isHassan = (input.location || "").toLowerCase().includes("hassan");
  const isOutskirts = (input.location || "").toLowerCase().includes("outskirts") || (input.location || "").toLowerCase().includes("nearby");
  const locPhrase = isHassan ? "in Hassan" : isOutskirts ? "in the Hassan area" : "";

  // 3. Normalize Services & Build Natural Combined Phrase (Preserves ALL services)
  const serviceKeys: string[] = [];
  rawServices.forEach(s => {
    const key = getServiceKey(s);
    if (!serviceKeys.includes(key)) {
      serviceKeys.push(key);
    }
  });

  const servicePhrase = getServicePhrase(serviceKeys, rawServices);

  // 4. Format Work Performed (Preserving ALL selected work from all selected services up to 4)
  const formattedWorkList: string[] = [];
  rawWork.forEach(w => {
    const formatted = formatWorkItem(w);
    if (formatted && !formattedWorkList.includes(formatted)) {
      formattedWorkList.push(formatted);
    }
  });

  const topWork = formattedWorkList.slice(0, 4);
  let workClause = "";
  if (topWork.length === 1) {
    workClause = topWork[0];
  } else if (topWork.length === 2) {
    workClause = `${topWork[0]} and ${topWork[1]}`;
  } else if (topWork.length === 3) {
    workClause = `${topWork[0]}, ${topWork[1]} and ${topWork[2]}`;
  } else if (topWork.length >= 4) {
    workClause = `${topWork[0]}, ${topWork[1]}, ${topWork[2]} and ${topWork[3]}`;
  }

  // 5. Handle Low Rating Fallbacks (1-3 Stars)
  if (rating <= 2) {
    const p1 = `I contacted MIINFOTECH ${locPhrase} for ${servicePhrase}.`;
    const p2 = "The service did not meet expectations and needs improvement.";
    return [p1, p2, customNote].filter(Boolean).join(" ");
  }

  if (rating === 3) {
    const p1 = `Used MIINFOTECH ${locPhrase} for ${servicePhrase}.`;
    const p2 = workClause ? `The team handled ${workClause}.` : "The work was completed.";
    const p3 = "Basic testing was carried out before handover.";
    return [p1, p2, customNote, p3].filter(Boolean).join(" ");
  }

  // 6. Experience Clause (Factual only, no invented claims)
  const experienceClause = getFactualExperienceClause(rawExperiences, tone, variationIndex);

  // Special multi-service branch: If 2 or more services were chosen, use the dedicated multi-service narrative
  if (serviceKeys.length >= 2) {
    const multiReview = generateMultiServiceReviewNarrative({
      serviceKeys,
      rawServices,
      servicePhrase,
      locPhrase,
      rawWork,
      tone,
      draftStyle: input.draftStyle,
      variationIndex,
      rawExperiences,
      customNote
    });
    return multiReview.replace(/\s+/g, " ").trim();
  }

  // 7. Tone-Aware & Variation-Aware Review Generation (Single Service)
  let reviewText = "";
  const singleStyle = input.draftStyle || (tone === "concise" ? "short" : tone === "technical" ? "detailed" : "natural");

  if (singleStyle === "short") {
    // Concise Tone: 35–50 words, direct, punchy
    const cycle = variationIndex % 4;
    switch (cycle) {
      case 0: {
        const p1 = `MIINFOTECH handled our ${servicePhrase} ${locPhrase}.`;
        const p2 = workClause ? `They completed ${workClause} smoothly.` : "All work was completed cleanly.";
        const p3 = "Everything was tested and verified properly before handover.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 1: {
        const p1 = `Quick and dependable ${servicePhrase} by MIINFOTECH ${locPhrase}.`;
        const p2 = workClause ? `Neat execution on ${workClause}, with full verification before handover.` : "Clean work with full verification before handover.";
        reviewText = [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 2: {
        const p1 = `Got our ${servicePhrase} done from MIINFOTECH ${locPhrase}.`;
        const p2 = workClause ? `The technician took care of ${workClause} efficiently.` : "The work was handled efficiently.";
        const p3 = "Everything was checked and confirmed working before leaving.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 3:
      default: {
        const p1 = `Dependable ${servicePhrase} from MIINFOTECH ${locPhrase}.`;
        const p2 = workClause ? `They handled ${workClause} without delay and tested the setup thoroughly.` : "Everything was installed neatly and tested thoroughly.";
        reviewText = [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
        break;
      }
    }
  } else if (singleStyle === "detailed") {
    // Technical Tone: 45–65 words, methodical, setup & verification focused
    const cycle = variationIndex % 4;
    switch (cycle) {
      case 0: {
        const p1 = `MIINFOTECH completed our ${servicePhrase} ${locPhrase} systematically.`;
        const p2 = workClause ? `The technician carried out ${workClause} with great attention to detail.` : "The technical setup was configured cleanly.";
        const p3 = "All connections and settings were tested thoroughly before handover.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 1: {
        const p1 = `Engaged MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
        const p2 = workClause ? `They completed ${workClause} properly, followed by complete diagnosis and testing.` : "The installation was completed properly with full diagnostic testing.";
        const p3 = "Everything was configured methodically.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 2: {
        const p1 = `Very thorough technical work by MIINFOTECH ${locPhrase} on our ${servicePhrase}.`;
        const p2 = workClause ? `The team handled ${workClause} and verified full functionality on-site.` : "The system was configured and verified on-site.";
        const p3 = "Appreciate the structured testing and solid technical support.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 3:
      default: {
        const p1 = `Had our ${servicePhrase} attended to by MIINFOTECH ${locPhrase}.`;
        const p2 = workClause ? `The technician executed ${workClause} cleanly, checking all hardware and software configurations.` : "The setup was carried out cleanly with careful verification.";
        const p3 = "All equipment was tested before sign-off.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
    }
  } else if (singleStyle === "professional") {
    // Professional Style: 45–65 words, punctuality & courteous doorstep demeanor
    const p1 = `Very pleased with the doorstep ${servicePhrase} from MIINFOTECH ${locPhrase}.`;
    const p2 = workClause ? `The technician arrived on schedule, handled ${workClause} with great care, and explained everything clearly.` : "The technician arrived on schedule, completed the work with great care, and explained everything clearly.";
    const p3 = "All systems were tested before sign-off.";
    reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
  } else if (singleStyle === "simple") {
    // Simple Style: 35–50 words, straightforward, hassle-free
    const p1 = `Got our ${servicePhrase} done from MIINFOTECH ${locPhrase}.`;
    const p2 = workClause ? `The work on ${workClause} was completed cleanly without delay.` : "The work was completed cleanly without delay.";
    const p3 = "Dependable local technical service and clear handover.";
    reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
  } else {
    // Courteous / Natural Tone (Default): 45–65 words, warm, polite, customer-centric
    const cycle = variationIndex % 4;
    switch (cycle) {
      case 0: {
        const p1 = `MIINFOTECH helped us with our ${servicePhrase} ${locPhrase}.`;
        const p2 = workClause ? `They handled ${workClause} professionally.` : "The service was carried out professionally.";
        const p3 = "The service was clear and efficient, and everything was tested before leaving.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 1: {
        const p1 = `Had a very good experience with MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
        const p2 = workClause ? `The team took care of ${workClause} with great care.` : "The work was completed on time with great care.";
        const p3 = "The team arrived on time and explained the setup clearly.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 2: {
        const p1 = `Contacted MIINFOTECH ${locPhrase} for our ${servicePhrase}.`;
        const p2 = workClause ? `They completed ${workClause} neatly and verified everything before leaving.` : "The technician completed the job neatly and verified everything before leaving.";
        reviewText = [p1, p2, customNote, experienceClause].filter(Boolean).join(" ");
        break;
      }
      case 3:
      default: {
        const p1 = `Very pleased with the ${servicePhrase} provided by MIINFOTECH ${locPhrase}.`;
        const p2 = workClause ? `They handled ${workClause} smoothly and answered all our questions patiently.` : "The team completed the work smoothly and answered all our questions.";
        const p3 = "Everything was tested and verified before handover.";
        reviewText = [p1, p2, customNote, p3, experienceClause].filter(Boolean).join(" ");
        break;
      }
    }
  }

  // 8. VALIDATION GUARD: Ensure all selected services are represented and no forbidden categories appear
  const validation = validateReviewText(reviewText, rawServices);
  if (!validation.isValid) {
    // Auto-recover with guaranteed multi-service structure
    reviewText = generateGuaranteedMultiServiceReview({
      servicePhrase,
      locPhrase,
      workClause,
      tone,
      variationIndex,
      rawExperiences,
      customNote
    });
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

