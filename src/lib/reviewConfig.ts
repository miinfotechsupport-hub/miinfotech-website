import { 
  Video, 
  Monitor, 
  Laptop, 
  Printer, 
  Network, 
  BatteryCharging, 
  Fingerprint, 
  Building2,
  Wrench
} from "lucide-react";

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2";
export const REVIEW_PAGE_URL = "https://miinfotech.netlify.app/review";

export interface ServiceCategoryConfig {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  subcategories: string[];
  brands?: string[];
}

export const REVIEW_SERVICE_CATEGORIES: ServiceCategoryConfig[] = [
  {
    id: "cctv",
    name: "CCTV & Security",
    shortName: "CCTV",
    icon: Video,
    subcategories: [
      "CCTV Installation",
      "CCTV Repair",
      "CCTV Service / Maintenance",
      "Camera Replacement",
      "DVR / NVR Setup",
      "CCTV Cabling / Configuration",
      "Remote Viewing / Mobile App Setup",
      "Other CCTV Service"
    ],
    brands: ["Hikvision", "CP Plus", "Dahua", "EZVIZ", "Secureye", "Other / Mixed", "Not sure"]
  },
  {
    id: "computer",
    name: "Computer / Desktop",
    shortName: "Computer",
    icon: Monitor,
    subcategories: [
      "Desktop Assembly",
      "Computer Repair",
      "Computer Service / Maintenance",
      "Upgrade",
      "Windows Installation",
      "Other Computer Service"
    ],
    brands: ["Dell", "HP", "Lenovo", "Acer", "ASUS", "MSI", "Other / Mixed", "Not sure"]
  },
  {
    id: "laptop",
    name: "Laptop",
    shortName: "Laptop",
    icon: Laptop,
    subcategories: [
      "Laptop Repair",
      "Laptop Service / Maintenance",
      "Screen / Battery Service",
      "Upgrade",
      "Windows Installation",
      "Other Laptop Service"
    ],
    brands: ["Dell", "HP", "Lenovo", "Acer", "ASUS", "Apple", "Other / Mixed", "Not sure"]
  },
  {
    id: "printer",
    name: "Printer",
    shortName: "Printer",
    icon: Printer,
    subcategories: [
      "Printer Installation",
      "Printer Setup",
      "Printer Repair",
      "Printer Service",
      "Network / Wi-Fi Printer Setup",
      "Other Printer Service"
    ],
    brands: ["HP", "Canon", "Epson", "Brother", "Other / Mixed", "Not sure"]
  },
  {
    id: "networking",
    name: "Networking / Wi-Fi",
    shortName: "Networking",
    icon: Network,
    subcategories: [
      "Networking Installation",
      "LAN / CAT6 Cabling",
      "Wi-Fi Setup",
      "Router / Switch Setup",
      "Network Configuration",
      "Network Troubleshooting",
      "Other Networking Service"
    ],
    brands: ["TP-Link", "D-Link", "Ubiquiti", "Tenda", "Cisco", "Other / Mixed", "Not sure"]
  },
  {
    id: "ups",
    name: "UPS / Power Backup",
    shortName: "UPS",
    icon: BatteryCharging,
    subcategories: [
      "UPS Installation",
      "UPS Service",
      "UPS Repair",
      "Battery Replacement",
      "Other UPS Service"
    ],
    brands: ["APC", "Microtek", "Luminous", "Numeric", "Other / Mixed", "Not sure"]
  },
  {
    id: "biometric",
    name: "Biometric / Access Control",
    shortName: "Biometric",
    icon: Fingerprint,
    subcategories: [
      "Biometric Installation",
      "Attendance System Setup",
      "User / Employee Setup",
      "Network Configuration",
      "Biometric Repair / Service",
      "Other"
    ],
    brands: ["ZKTeco", "eSSL", "Hikvision", "Realtime", "Other / Mixed", "Not sure"]
  },
  {
    id: "other_it",
    name: "Other IT Service",
    shortName: "Other IT",
    icon: Building2,
    subcategories: [
      "School Computer Lab Setup",
      "Intercom Installation",
      "Fire Alarm Support",
      "P2P Device Installation",
      "General IT Support",
      "Custom Technical Service"
    ]
  }
];

export type CustomerRelationship = "new" | "existing" | "longterm";

export function generateTruthfulWhatsAppRequest(
  relationship: CustomerRelationship,
  serviceName: string,
  subservice?: string,
  brand?: string
): string {
  const serviceDetail = subservice ? `${subservice}` : serviceName;
  const brandDetail = brand && brand !== "Not sure" && brand !== "Other / Mixed" ? ` (${brand})` : "";

  if (relationship === "new") {
    return `Hi, thank you for choosing MIINFOTECH for your recent ${serviceDetail}${brandDetail} service.

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

  // default existing customer
  return `Hi, thank you for continuing to trust MIINFOTECH with your IT and security service and support.

We would really appreciate it if you could share your genuine experience with our service.

⭐ Share your service experience:
${REVIEW_PAGE_URL}

Thank you for your continued support.

MIINFOTECH
Hassan, Karnataka`;
}
