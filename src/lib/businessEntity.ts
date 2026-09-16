/**
 * BUSINESS_ENTITY - Single Source of Truth for MIINFOTECH
 * 
 * Rules:
 * - Real business owned by Mohammed Ishtiaqh
 * - On-site / doorstep technical service based in Hassan, Karnataka, India
 * - Genuine services: Computer, Laptop, Printer, CCTV / Security, Networking, UPS, Biometric, Intercom, Fire Alarm, P2P Wireless
 * - NO invented branches, fake certifications, fake statistics, or unverified social profiles.
 */

export interface SocialProfileEntity {
  id: string;
  platform: string;
  name: string;
  url: string;
  handle: string;
  isConfigured: boolean;
  status: "PASS" | "WARNING" | "NOT_VERIFIED" | "MISSING";
  notes?: string;
  iconName: string;
}

export interface BusinessEntity {
  name: string;
  brandName: string;
  brand: {
    name: string;
  };
  founder: {
    name: string;
  };
  legalName: string;
  owner: string;
  url: string;
  logo: string;
  telephone: string;
  telephoneCanonical: string;
  whatsapp: string;
  whatsappCanonical: string;
  email: string;
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    whatsappLink: string;
    email: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    countryCode: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  googleMaps: {
    cid: string;
    cidUrl: string;
    shareUrl: string;
    embedUrl: string;
    reviewUrl: string;
  };
  googleBusinessProfile: {
    cid: string;
    profileUrl: string;
    shareUrl: string;
    reviewUrl: string;
  };
  openingHoursText: {
    monSat: string;
    sun: string;
  };
  openingHoursSpecification: Array<{
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange: string;
  businessModel: string;
  primaryServiceArea: string;
  serviceAreaList: string[];
  description: string;
  shortDescription: string;
  services: {
    computer: string[];
    laptop: string[];
    printer: string[];
    cctv: string[];
    networking: string[];
    other: string[];
  };
  socialProfiles: Record<string, SocialProfileEntity>;
  sameAs: string[];
}

export const BUSINESS_ENTITY: BusinessEntity = {
  name: "MIINFOTECH",
  brandName: "MIINFOTECH",
  brand: {
    name: "MIINFOTECH",
  },
  founder: {
    name: "Mohammed Ishtiaqh",
  },
  legalName: "MIINFOTECH Onsite IT & Security Solutions",
  owner: "Mohammed Ishtiaqh",
  url: "https://miinfotech.netlify.app",
  logo: "https://miinfotech.netlify.app/images/miinfotech-logo.png",
  telephone: "+91 9964761624",
  telephoneCanonical: "+91-9964761624",
  whatsapp: "+91 9964761624",
  whatsappCanonical: "+919964761624",
  email: "miinfotech.support@gmail.com",
  contact: {
    phone: "+91 99647 61624",
    phoneRaw: "+919964761624",
    whatsapp: "+91 99647 61624",
    whatsappLink: "https://wa.me/919964761624",
    email: "miinfotech.support@gmail.com",
  },
  address: {
    streetAddress: "Onsite Doorstep Technical Service",
    addressLocality: "Hassan",
    addressRegion: "Karnataka",
    postalCode: "573201",
    addressCountry: "India",
    countryCode: "IN"
  },
  geo: {
    latitude: 13.0072,
    longitude: 76.1026
  },
  googleMaps: {
    cid: "0xe21256333bf9e86c",
    cidUrl: "https://www.google.com/maps?cid=16290076249457617004",
    shareUrl: "https://share.google/26j3KMLobkBNnH89a",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15584.093414902175!2d76.0894528!3d13.0071853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba53df0a28f7223%3A0xe21256333bf9e86c!2sHassan%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2"
  },
  googleBusinessProfile: {
    cid: "16290076249457617004",
    profileUrl: "https://share.google/26j3KMLobkBNnH89a",
    shareUrl: "https://share.google/26j3KMLobkBNnH89a",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ4yWvawOvsk8RQZn4nX_0Wz0&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2"
  },
  openingHoursText: {
    monSat: "09:30 AM - 08:00 PM",
    sun: "10:00 AM - 03:00 PM"
  },
  openingHoursSpecification: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "20:00"
    },
    {
      dayOfWeek: ["Sunday"],
      opens: "10:00",
      closes: "15:00"
    }
  ],
  priceRange: "₹₹ (Economical Onsite Technical Service)",
  businessModel: "On-site / doorstep technical service",
  primaryServiceArea: "Hassan, Karnataka, India",
  serviceAreaList: [
    "Hassan",
    "Belur",
    "Sakleshpur",
    "Arasikere",
    "Channarayapatna",
    "Alur",
    "Holenarasipura"
  ],
  description: "MIINFOTECH provides professional doorstep technical services in Hassan, Karnataka, specializing in desktop computer repair, laptop servicing, printer repair, CCTV camera installation, LAN networking, UPS battery setup, and biometric attendance systems.",
  shortDescription: "Doorstep Computer Repair, Laptop Service, Printer Repair & CCTV Camera Installation in Hassan by Mohammed Ishtiaqh.",
  services: {
    computer: [
      "Computer sales",
      "Computer service",
      "Computer repair",
      "Computer installation",
      "Computer troubleshooting",
      "Computer upgrades"
    ],
    laptop: [
      "Laptop sales",
      "Laptop service",
      "Laptop repair",
      "Laptop troubleshooting",
      "Laptop upgrades"
    ],
    printer: [
      "Printer sales",
      "Printer service",
      "Printer repair",
      "Printer installation",
      "Ink-tank printer service",
      "Laser printer service"
    ],
    cctv: [
      "CCTV sales",
      "CCTV installation",
      "CCTV repair",
      "CCTV maintenance",
      "AHD CCTV",
      "IP CCTV",
      "Wi-Fi cameras",
      "4G cameras",
      "Solar cameras",
      "360 cameras",
      "PTZ cameras",
      "DVR/NVR",
      "CCTV configuration"
    ],
    networking: [
      "LAN networking",
      "CAT6 networking",
      "Office networking",
      "Network installation",
      "Network troubleshooting",
      "Rack setup",
      "Computer lab networking"
    ],
    other: [
      "UPS service",
      "UPS battery setup",
      "Intercom",
      "Fire alarm systems",
      "Biometric installation",
      "P2P device installation",
      "Technical support"
    ]
  },
  // Only genuine, configured social profiles. Unconfigured platforms are flagged NOT_VERIFIED or MISSING without fake links.
  socialProfiles: {
    google: {
      id: "google",
      platform: "Google Business Profile",
      name: "MIINFOTECH on Google Maps",
      url: "https://share.google/26j3KMLobkBNnH89a",
      handle: "MIINFOTECH Hassan",
      isConfigured: true,
      status: "PASS",
      notes: "Official verified Google Business Profile for Hassan",
      iconName: "Globe"
    },
    facebook: {
      id: "facebook",
      platform: "Facebook",
      name: "MIINFOTECH Facebook Page",
      url: "https://www.facebook.com/share/18nFLrKJ1a/",
      handle: "miinfotech.hassan",
      isConfigured: true,
      status: "PASS",
      notes: "Official active Facebook business share URL",
      iconName: "Facebook"
    },
    instagram: {
      id: "instagram",
      platform: "Instagram",
      name: "MIINFOTECH Instagram Profile",
      url: "https://www.instagram.com/miinfotech.in",
      handle: "@miinfotech.in",
      isConfigured: true,
      status: "PASS",
      notes: "Official active Instagram business handle",
      iconName: "Instagram"
    },
    linkedin: {
      id: "linkedin",
      platform: "LinkedIn",
      name: "MIINFOTECH LinkedIn Company",
      url: "https://linkedin.com/company/miinfotech",
      handle: "company/miinfotech",
      isConfigured: true,
      status: "PASS",
      notes: "Official company presence on LinkedIn",
      iconName: "Linkedin"
    },
    youtube: {
      id: "youtube",
      platform: "YouTube",
      name: "MIINFOTECH YouTube Channel",
      url: "",
      handle: "Not configured",
      isConfigured: false,
      status: "NOT_VERIFIED",
      notes: "No official public YouTube channel configured yet. Do NOT invent fake URLs.",
      iconName: "Youtube"
    },
    twitter: {
      id: "twitter",
      platform: "X / Twitter",
      name: "MIINFOTECH X Profile",
      url: "",
      handle: "Not configured",
      isConfigured: false,
      status: "NOT_VERIFIED",
      notes: "No official public X/Twitter handle configured yet. Do NOT invent fake URLs.",
      iconName: "Twitter"
    }
  },
  // sameAs array contains ONLY genuinely configured official URLs
  sameAs: [
    "https://share.google/26j3KMLobkBNnH89a",
    "https://www.facebook.com/share/18nFLrKJ1a/",
    "https://www.instagram.com/miinfotech.in",
    "https://linkedin.com/company/miinfotech"
  ]
};

/**
 * Returns only configured, genuine social profile objects
 */
export function getActiveSocialProfiles(): SocialProfileEntity[] {
  return Object.values(BUSINESS_ENTITY.socialProfiles).filter(p => p.isConfigured && p.url.trim().length > 0);
}

/**
 * Generates valid Schema.org LocalBusiness structured data
 */
export function generateLocalBusinessJsonLd(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BUSINESS_ENTITY.url}/#localbusiness`,
    "name": BUSINESS_ENTITY.name,
    "legalName": BUSINESS_ENTITY.legalName,
    "url": BUSINESS_ENTITY.url,
    "logo": BUSINESS_ENTITY.logo,
    "image": `${BUSINESS_ENTITY.url}/miinfotech-review-qr-1200px.png`,
    "telephone": BUSINESS_ENTITY.telephoneCanonical,
    "email": BUSINESS_ENTITY.email,
    "priceRange": BUSINESS_ENTITY.priceRange,
    "hasMap": BUSINESS_ENTITY.googleMaps.cidUrl,
    "founder": {
      "@type": "Person",
      "name": BUSINESS_ENTITY.owner
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_ENTITY.address.streetAddress,
      "addressLocality": BUSINESS_ENTITY.address.addressLocality,
      "addressRegion": BUSINESS_ENTITY.address.addressRegion,
      "postalCode": BUSINESS_ENTITY.address.postalCode,
      "addressCountry": BUSINESS_ENTITY.address.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_ENTITY.geo.latitude.toString(),
      "longitude": BUSINESS_ENTITY.geo.longitude.toString()
    },
    "openingHoursSpecification": BUSINESS_ENTITY.openingHoursSpecification.map(spec => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": spec.dayOfWeek,
      "opens": spec.opens,
      "closes": spec.closes
    })),
    "areaServed": BUSINESS_ENTITY.serviceAreaList.map(area => ({
      "@type": "AdministrativeArea",
      "name": area
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "MIINFOTECH Technical & Onsite Security Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Computer Service & Repair in Hassan",
            "description": "Doorstep desktop repair, motherboard diagnostics, and Windows installation."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Laptop Repair & Upgrades in Hassan",
            "description": "Onsite laptop screen repair, keyboard replacement, and SSD performance upgrades."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Printer Repair & Service in Hassan",
            "description": "Doorstep ink-tank and laser printer repair, printhead cleaning, and cartridge service."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CCTV Camera Installation & Maintenance in Hassan",
            "description": "HD, IP, Wi-Fi, 4G, and solar CCTV camera installation with remote phone viewing."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "LAN & Office Networking in Hassan",
            "description": "CAT6 structured cabling, Wi-Fi router setup, and computer lab networking."
          }
        }
      ]
    },
    "sameAs": BUSINESS_ENTITY.sameAs
  };
}

/**
 * Generates Schema.org Organization structured data
 */
export function generateOrganizationJsonLd(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BUSINESS_ENTITY.url}/#organization`,
    "name": BUSINESS_ENTITY.name,
    "url": BUSINESS_ENTITY.url,
    "logo": BUSINESS_ENTITY.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": BUSINESS_ENTITY.telephoneCanonical,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "kn", "hi"]
    },
    "sameAs": BUSINESS_ENTITY.sameAs
  };
}
