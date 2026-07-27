import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SITE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://miinfotech.netlify.app";

/*
 * NOTE: SERVICES_DATA_SEO, BLOGS_DATA_SEO, and PROJECTS_DATA_SEO serve as the base static route catalog.
 * During build (`npm run build`), build-seo.js automatically queries Supabase for any newly published blog posts
 * and projects to dynamically merge them into pre-rendered static routes, sitemap.xml, and robots.txt.
 * If offline or unconfigured, build-seo.js safely falls back to these base arrays.
 */

// 1. Services SEO Data with Real Pricing and Verified FAQs
const SERVICES_DATA_SEO = [
  {
    id: "computer",
    path: "/computer-repair-hassan",
    title: "Onsite Desktop Computer Repair & Formatting in Hassan | MIInfotech",
    desc: "Doorstep PC repair, Windows formatting, power supply replacement, motherboard repair, and diagnostics in Hassan. Call +91 9964761624.",
    keywords: "computer repair hassan, pc repair hassan, desktop formatting hassan, motherboard repair hassan",
    price: "450.00",
    faqs: [
      {
        q: "How do I book Onsite Computer Repair in Hassan for doorstep service?",
        a: "Call or WhatsApp +91 9964761624. As an Onsite Service-Area Business, our certified technician will visit your home, office, or shop in Hassan with diagnostic equipment and spare parts."
      },
      {
        q: "What are your visiting charges for Computer Repair in Hassan?",
        a: "Our standard onsite visiting and diagnostic charge is ₹450 within Hassan city limits, and ₹1200 for outskirts regions."
      }
    ]
  },
  {
    id: "laptop",
    path: "/laptop-repair-hassan",
    title: "Doorstep Laptop Screen, Battery & SSD Upgrade in Hassan | MIInfotech",
    desc: "Laptop repair in Hassan: Screen replacement, battery replacement, keyboard repair, hinge repair, and NVMe SSD upgrades at your doorstep.",
    keywords: "laptop repair hassan, laptop screen replacement hassan, laptop battery replacement hassan, nvme ssd upgrade hassan",
    price: "750.00",
    faqs: [
      {
        q: "How long does a typical Laptop Screen Replacement in Hassan take?",
        a: "Laptop Screen Replacement in Hassan and keyboard replacements are typically completed onsite within 1 to 2 hours using genuine OEM-grade screens with warranty."
      }
    ]
  },
  {
    id: "cctv",
    path: "/cctv-installation-hassan",
    title: "CCTV Camera Installation & Maintenance in Hassan | Hikvision IP/AHD | MIInfotech",
    desc: "Expert CCTV camera installation in Hassan city. Hikvision AHD/IP cameras, DVR/NVR online configuration, and mobile remote live streaming.",
    keywords: "cctv installation hassan, cctv camera repair hassan, hikvision dvr setup hassan, ip camera setup hassan",
    price: "1500.00",
    faqs: [
      {
        q: "Do you offer Hikvision and CP Plus CCTV Camera Installation in Hassan with mobile live streaming?",
        a: "Yes! We specialize in Hikvision CCTV Installation and CP PLUS CCTV Installation in Hassan. We install 4MP/8MP IP cameras and configure secure mobile remote viewing on your phone."
      }
    ]
  },
  {
    id: "printer",
    path: "/printer-repair-hassan",
    title: "LaserJet & Ink Tank Printer Repair Service in Hassan | MIInfotech",
    desc: "Doorstep printer service in Hassan: Paper jam fixes, toner refills, Wi-Fi printer offline error troubleshooting, and head cleaning.",
    keywords: "printer repair hassan, laserjet printer repair hassan, ink tank printer service hassan, printer offline error hassan",
    price: "600.00",
    faqs: [
      {
        q: "Where can I get Printer Repair in Hassan or Printer Cartridge Refilling Near Me?",
        a: "MIInfotech provides expert onsite Printer Repair in Hassan for Epson EcoTank, HP Smart Tank, and Canon printers, alongside LaserJet toner cartridge refilling."
      }
    ]
  },
  {
    id: "networking",
    path: "/networking-services-hassan",
    title: "Structured Office Network Cabling & Wi-Fi Setup in Hassan | MIInfotech",
    desc: "Cat6 Ethernet LAN cabling, server rack setup, Gigabit switches, and high-speed Wi-Fi access point installation for offices in Hassan.",
    keywords: "network cabling hassan, office wifi setup hassan, cat6 lan cabling hassan, server rack installation hassan",
    price: "1200.00",
    faqs: [
      {
        q: "Can you handle structured LAN cabling and WiFi Network Installation in Hassan?",
        a: "Yes, we design complete structured CAT6/CAT6A networking grids, install server racks, configure gigabit switches, and perform WiFi Network Installation in Hassan."
      }
    ]
  },
  {
    id: "biometric",
    path: "/biometric-installation-hassan",
    title: "Biometric Attendance & Access Control Installation in Hassan | MIInfotech",
    desc: "Fingerprint & facial recognition attendance machine installation, door access locks, and payroll software sync in Hassan.",
    keywords: "biometric attendance hassan, access control system hassan, fingerprint machine setup hassan",
    price: "2500.00",
    faqs: []
  },
  {
    id: "windows",
    path: "/windows-installation-hassan",
    title: "Genuine Windows 10/11 OS & Antivirus Installation in Hassan | MIInfotech",
    desc: "Clean Windows 10/11 Pro operating system installation, driver updates, MS Office setup, and licensed antivirus installation in Hassan.",
    keywords: "windows installation hassan, os formatting hassan, antivirus installation hassan, ms office setup hassan",
    price: "850.00",
    faqs: []
  },
  {
    id: "data-recovery",
    path: "/data-recovery-hassan",
    title: "Hard Drive & Pen Drive Data Recovery Service in Hassan | MIInfotech",
    desc: "Professional data recovery in Hassan for crashed hard drives, formatted pen drives, corrupted memory cards, and accidentally deleted files.",
    keywords: "data recovery hassan, hard drive recovery hassan, pen drive recovery hassan, deleted file recovery hassan",
    price: "1500.00",
    faqs: []
  },
  {
    id: "ups",
    path: "/ups-installation-repair-hassan",
    title: "Online UPS & Inverter Power Backup Solutions in Hassan | MIInfotech",
    desc: "Online UPS backup installation, battery replacement, and power surge protection for desktop PCs, CCTV DVRs, and server racks in Hassan.",
    keywords: "ups repair hassan, online ups setup hassan, inverter battery replacement hassan",
    price: "950.00",
    faqs: []
  },
  {
    id: "intercom",
    path: "/intercom-systems-hassan",
    title: "EPABX Intercom & Multi-Line Office Phone Setup in Hassan | MIInfotech",
    desc: "Doorstep EPABX intercom installation, cabling, extension programming, and phone line repair for offices, hotels, and apartments in Hassan.",
    keywords: "epabx intercom setup hassan, office intercom cabling hassan, intercom repair hassan",
    price: "1800.00",
    faqs: []
  },
  {
    id: "firealarm",
    path: "/fire-alarm-systems-hassan",
    title: "Smoke Detector & Fire Alarm Security Installation in Hassan | MIInfotech",
    desc: "Addressable & conventional fire alarm panel installation, optical smoke detectors, and emergency sounders for commercial premises in Hassan.",
    keywords: "fire alarm system hassan, smoke detector installation hassan, fire panel wiring hassan",
    price: "3500.00",
    faqs: []
  },
  {
    id: "p2p",
    path: "/p2p-wireless-installation-hassan",
    title: "Long-Range P2P Wireless Antenna Bridge Setup in Hassan | MIInfotech",
    desc: "Point-to-Point (P2P) wireless outdoor network bridge setup connecting distant buildings, godowns, and remote CCTV cameras without wires.",
    keywords: "p2p wireless bridge hassan, outdoor wifi bridge hassan, long range wireless network hassan",
    price: "4500.00",
    faqs: []
  },
  {
    id: "amc",
    path: "/it-support-amc-hassan",
    title: "Corporate IT Support & Computer AMC Contracts in Hassan | MIInfotech",
    desc: "Annual Maintenance Contracts (AMC) for computers, printers, network switches, and CCTV systems in commercial offices, hospitals, and schools in Hassan.",
    keywords: "computer amc hassan, corporate it support hassan, office computer maintenance hassan, IT AMC contract hassan",
    price: "5000.00",
    faqs: [
      {
        q: "What is included in an Annual Maintenance Contract (AMC) for Office IT Support in Hassan?",
        a: "Monthly preventive maintenance, unlimited emergency breakdown visits within 2-4 hours, antivirus protection, database backups, and standby hardware replacements."
      }
    ]
  }
];

// 2. Blog Posts SEO Data (Real Published Dates where present in data)
const BLOGS_DATA_SEO = [
  {
    slug: "laptop-maintenance-monsoon-hassan",
    path: "/blog/laptop-maintenance-monsoon-hassan",
    title: "5 Critical Laptop Maintenance Tips for Hassan's Monsoon Season | MIInfotech",
    desc: "Hassan experiences high humidity during monsoons. Learn how to protect your laptop from moisture damage, keyboard corrosion, and short circuits.",
    datePublished: "2026-07-12",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "ip-cctv-vs-analog-hassan-businesses",
    path: "/blog/ip-cctv-vs-analog-hassan-businesses",
    title: "Why IP CCTV Cameras are Superior to Old Analog CCTV for Hassan Businesses | MIInfotech",
    desc: "Discover why modern IP security systems with POE deliver superior safety, remote smartphone viewing, and long-term cost benefits for Hassan businesses.",
    datePublished: "2026-06-28",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "it-amc-guide-hassan-businesses",
    path: "/blog/it-amc-guide-hassan-businesses",
    title: "Demystifying IT AMCs: How Annual Contracts Save Hassan Businesses from Costly Downtime | MIInfotech",
    desc: "Read how a professional Annual Maintenance Contract (AMC) keeps your IT healthy and eliminates costly computer and network breakdown downtime.",
    datePublished: "2026-05-15",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "cctv-camera-buying-guide-hassan",
    path: "/blog/cctv-camera-buying-guide-hassan",
    title: "CCTV Camera Buying Guide 2026: IP vs Analog AHD for Homes in Hassan",
    desc: "Learn whether IP or Analog AHD CCTV cameras are right for your home or shop in Hassan. Compare video clarity, cabling costs, and mobile viewing setup.",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "slow-laptop-ssd-upgrade-hassan",
    path: "/blog/slow-laptop-ssd-upgrade-hassan",
    title: "Is Your Laptop Running Slow? Why NVMe SSD Upgrade is 10x Faster Than HDD",
    desc: "Discover how upgrading your slow laptop hard drive to an M.2 NVMe SSD dramatically boosts boot speeds in under 15 minutes at doorstep in Hassan.",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "how-to-fix-printer-offline-error-windows",
    path: "/blog/how-to-fix-printer-offline-error-windows",
    title: "How to Fix Printer Offline Errors on Windows 10/11: Step-by-Step Guide",
    desc: "Follow this easy step-by-step diagnostic guide to solve printer offline errors on HP, Canon, Epson, and Brother printers in Hassan.",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "choosing-right-wifi-router-small-office",
    path: "/blog/choosing-right-wifi-router-small-office",
    title: "Choosing the Right Wi-Fi Router & Mesh System for Small Offices in Hassan",
    desc: "Eliminate Wi-Fi dead zones in multi-room offices and shops in Hassan with high-speed Wi-Fi 6 access points and dual-band mesh routers.",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "importance-of-regular-computer-formatting",
    path: "/blog/importance-of-regular-computer-formatting",
    title: "Why Regular OS Formatting & Thermal Servicing Prevents Motherboard Failure",
    desc: "Understand how dust accumulation and thermal paste degradation cause overheating and motherboard failure in desktop PCs and laptops.",
    author: "Mohammed Ishtiaqh"
  },
  {
    slug: "biometric-attendance-system-installation-guide",
    path: "/blog/biometric-attendance-system-installation-guide",
    title: "Biometric Attendance & Access Control Guide for Shops and Clinics in Hassan",
    desc: "Streamline employee attendance tracking, prevent buddy punching, and automate payroll with fingerprint and face recognition machines.",
    author: "Mohammed Ishtiaqh"
  }
];

// 3. Static Projects SEO Data (Option B: Build-time static pre-rendering for all static projects)
const PROJECTS_DATA_SEO = [
  {
    seoSlug: "commercial-cat6-cabling-server-rack-installation-hassan",
    path: "/project/commercial-cat6-cabling-server-rack-installation-hassan",
    title: "Structured LAN Cabling & Server Rack Setup Hassan | MIInfotech",
    desc: "Structured office network cabling and server rack installation completed in Hassan Industrial Area by MIInfotech. 100% gigabit performance guaranteed.",
    keywords: "structured cabling hassan, server rack installation hassan, cat6 networking hassan",
    location: "Hassan Industrial Area, Hassan",
    dateCreated: "2026-06-15",
    category: "Networking"
  },
  {
    seoSlug: "comprehensive-ip-cctv-surveillance-grid-installation-hassan",
    path: "/project/comprehensive-ip-cctv-surveillance-grid-installation-hassan",
    title: "CCTV Security Installation in Kuvempu Nagar | MIInfotech",
    desc: "Professional 16-camera IP CCTV installation completed by MIInfotech in Kuvempu Nagar, Hassan. Featuring 4MP resolution and remote smartphone live view.",
    keywords: "cctv installation kuvempu nagar, ip camera setup hassan, remote mobile streaming hassan",
    location: "Kuvempu Nagar, Hassan",
    dateCreated: "2026-07-01",
    category: "CCTV Installation"
  },
  {
    seoSlug: "15-station-college-computer-lab-setup-hassan",
    path: "/project/15-station-college-computer-lab-setup-hassan",
    title: "School Computer Lab Setup & Networking Hassan | MIInfotech",
    desc: "Complete school computer lab assembly and LAN sharing completed in Vidya Nagar, Hassan by MIInfotech. High-speed setups with administrative controls.",
    keywords: "computer lab setup hassan, desktop assembly hassan, lan printer sharing hassan",
    location: "Vidya Nagar, Hassan",
    dateCreated: "2026-05-12",
    category: "School Computer Lab"
  },
  {
    seoSlug: "long-range-4km-outdoor-p2p-wireless-bridge-hassan",
    path: "/project/long-range-4km-outdoor-p2p-wireless-bridge-hassan",
    title: "Long-Range P2P Wireless Bridge Hassan | MIInfotech",
    desc: "Point-to-point wireless installation between main office and outskirts warehouse by MIInfotech. High-speed 4km LoS connection.",
    keywords: "p2p wireless bridge hassan, long range wifi bridge, ubiquiti powerbeam hassan",
    location: "Hassan Bypass Road, Hassan",
    dateCreated: "2026-04-18",
    category: "WiFi Setup"
  }
];

// 4. Static Hub Routes
const STATIC_ROUTES = [
  {
    path: "/",
    title: "MIInfotech | Onsite IT Services & CCTV Camera Installation in Hassan",
    desc: "MIInfotech by Mohammed Ishtiaqh provides professional doorstep computer repair, laptop service, CCTV installation, printer support, network cabling, and corporate AMC in Hassan, Karnataka.",
    keywords: "CCTV Installation in Hassan, Computer Repair in Hassan, Laptop Repair in Hassan, Printer Repair in Hassan, Onsite IT Support Hassan"
  },
  {
    path: "/services",
    title: "IT Services & CCTV Setup Catalog in Hassan | MIInfotech",
    desc: "Browse our full catalog of onsite IT and security services in Hassan, Karnataka: Laptop repairs, WiFi setup, desktop formatting, network cabling, and biometric installations.",
    keywords: "IT services catalog hassan, computer repair catalog, cctv services list hassan"
  },
  {
    path: "/projects",
    title: "Real Completed Works & CCTV Projects in Hassan | MIInfotech",
    desc: "Browse our portfolio of real completed onsite IT support, network cabling, and Hikvision CCTV camera installations in Hassan city and surrounding areas.",
    keywords: "completed CCTV projects hassan, IT portfolio hassan, network cabling case studies"
  },
  {
    path: "/blog",
    title: "MIInfotech Knowledge Hub | IT Diagnostics & Tech Guides",
    desc: "Expert guides, local SEO tech resources, and computer diagnostics written by founder Mohammed Ishtiaqh for businesses and residents in Hassan, Karnataka.",
    keywords: "tech blog hassan, computer repair guide, cctv installation tips hassan"
  },
  {
    path: "/faqs",
    title: "Help & Frequently Asked Questions | MIInfotech Hassan",
    desc: "Find answers to frequently asked questions about doorstep PC repair pricing, service locations, turnaround time, and warranties in Hassan, Karnataka.",
    keywords: "computer repair faqs hassan, cctv warranty hassan, doorstep service charges"
  },
  {
    path: "/contact",
    title: "Get a Free Onsite Estimate & Callout | MIInfotech Hassan",
    desc: "Book a doorstep diagnostics visit or CCTV quote in Hassan, Karnataka. Call +91 99647 61624 or fill out our quick estimate calculator.",
    keywords: "contact miinfotech, book pc repair hassan, cctv estimate hassan"
  },
  {
    path: "/terms",
    title: "Terms of Service & Onsite Warranty Policy | MIInfotech",
    desc: "Read the Terms and Conditions and warranty service guidelines for doorstep repairs and CCTV installation services provided by MIInfotech in Hassan.",
    keywords: "terms and conditions, miinfotech warranty policy, onsite service agreement"
  }
];

// Site-wide FAQs for Homepage & /faqs
const SITE_WIDE_FAQS = [
  {
    q: "How do I book Computer Repair in Hassan or Laptop Repair Near Me for doorstep service?",
    a: "Booking Computer Repair in Hassan or Laptop Repair Near Me with MIInfotech is fast and simple! Simply call or WhatsApp us at +91 9964761624. As an Onsite Service-Area Business, our certified technician will visit your home, office, or shop in Hassan with diagnostic equipment and spare parts to fix your computer or laptop on the spot."
  },
  {
    q: "Which locations in and around Hassan do you cover for doorstep CCTV and IT service?",
    a: "We cover all major neighborhoods in Hassan including Kuvempu Nagar, Vidya Nagar, Channapatna, Hemavathi Nagar, Hassan Bypass Road, Hassan Industrial Area, Old Town, and Dairy Circle. For CCTV Camera Installation in Hassan and network cabling projects, we also serve neighboring areas like Belur, Sakleshpur, Arasikere, Channarayapatna, Alur, Arkalgud, and Holenarasipura."
  },
  {
    q: "What are your visiting charges for Computer Repair and CCTV Repair in Hassan?",
    a: "Our standard onsite visiting and diagnostic charge is ₹450 within Hassan city limits, and ₹1200 for outskirts regions (₹450 diagnostic fee + ₹750 travel charge). This includes thorough physical inspection and diagnostic checks. Any required hardware replacement or cabling materials are billed separately with full upfront transparency."
  },
  {
    q: "Do you offer Hikvision and CP Plus CCTV Camera Installation in Hassan with mobile live streaming?",
    a: "Yes! We specialize in Hikvision CCTV Installation and CP PLUS CCTV Installation in Hassan. We install 4MP/8MP IP cameras, AHD cameras, 4G SIM cameras, and WiFi cameras. We configure secure mobile remote viewing on your iOS or Android phone so you can monitor live video feeds of your shop or home from anywhere."
  },
  {
    q: "Where can I get Printer Repair in Hassan or Printer Cartridge Refilling Near Me?",
    a: "MIInfotech provides expert onsite Printer Repair in Hassan for Epson EcoTank, HP Smart Tank, and Canon printers. We also offer fast Printer Cartridge Refilling in Hassan with premium micro-fine toner powder for LaserJet printers directly at your office or billing counter."
  },
  {
    q: "How long does a typical Laptop Screen Replacement in Hassan take?",
    a: "Laptop Screen Replacement in Hassan and keyboard replacements are typically completed onsite within 1 to 2 hours using genuine OEM-grade screens with warranty. We service Dell, HP, Lenovo, ASUS, and Acer laptops directly at your table."
  }
];

function generateSitemapXML(allRoutes) {
  const dateStr = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  allRoutes.forEach((r) => {
    const fullUrl = `${SITE_URL}${r.path === "/" ? "" : r.path}`;
    const priority = r.path === "/" ? "1.0" : r.path.startsWith("/blog/") ? "0.7" : r.path.startsWith("/project/") ? "0.8" : "0.9";
    const changefreq = r.path === "/" ? "daily" : "weekly";

    xml += `  <url>\n`;
    xml += `    <loc>${fullUrl}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

function generatePageHtml(templateHtml, routeInfo) {
  const fullUrl = `${SITE_URL}${routeInfo.path === "/" ? "" : routeInfo.path}`;
  const logoUrl = `${SITE_URL}/images/miinfotech-logo.png`;

  let html = templateHtml;

  // 1. Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${routeInfo.title}</title>`);

  // 2. Meta Description (Check and Replace)
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content=".*?"\s*\/?>/gi, `<meta name="description" content="${routeInfo.desc}" />`);
  } else {
    html = html.replace("</head>", `  <meta name="description" content="${routeInfo.desc}" />\n</head>`);
  }

  // 3. Meta Keywords (Check and Replace)
  if (routeInfo.keywords) {
    if (html.includes('<meta name="keywords"')) {
      html = html.replace(/<meta name="keywords" content=".*?"\s*\/?>/gi, `<meta name="keywords" content="${routeInfo.keywords}" />`);
    } else {
      html = html.replace("</head>", `  <meta name="keywords" content="${routeInfo.keywords}" />\n</head>`);
    }
  }

  // 4. Canonical URL (Check and Replace)
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${fullUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${fullUrl}" />\n</head>`);
  }

  // 5. OpenGraph & Twitter Tags (Check and Replace)
  const ogType = routeInfo.path.startsWith("/blog/") ? "article" : "website";

  const setOrReplaceMeta = (h, propAttr, propVal, contentVal) => {
    const pattern = new RegExp(`<meta\\s+${propAttr}="${propVal}"\\s+content=".*?"\\s*\\/?>`, "gi");
    if (pattern.test(h)) {
      return h.replace(pattern, `<meta ${propAttr}="${propVal}" content="${contentVal}" />`);
    } else {
      return h.replace("</head>", `  <meta ${propAttr}="${propVal}" content="${contentVal}" />\n</head>`);
    }
  };

  html = setOrReplaceMeta(html, "property", "og:title", routeInfo.title);
  html = setOrReplaceMeta(html, "property", "og:description", routeInfo.desc);
  html = setOrReplaceMeta(html, "property", "og:url", fullUrl);
  html = setOrReplaceMeta(html, "property", "og:type", ogType);
  html = setOrReplaceMeta(html, "property", "og:site_name", "MIInfotech");
  html = setOrReplaceMeta(html, "property", "og:image", logoUrl);

  html = setOrReplaceMeta(html, "name", "twitter:card", "summary_large_image");
  html = setOrReplaceMeta(html, "name", "twitter:title", routeInfo.title);
  html = setOrReplaceMeta(html, "name", "twitter:description", routeInfo.desc);
  html = setOrReplaceMeta(html, "name", "twitter:image", logoUrl);

  // 6. JSON-LD Structured Data Schema Construction
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    "name": "MIInfotech",
    "alternateName": "MI Infotech Hassan Doorstep IT",
    "logo": logoUrl,
    "image": logoUrl,
    "telephone": "+91-9964761624",
    "email": "miinfotech.support@gmail.com",
    "url": SITE_URL,
    "priceRange": "₹₹",
    "hasMap": "https://www.google.com/maps?cid=e21256333bf9e86c",
    "sameAs": ["https://share.google/hnUk6Bt7LUOFrdL2g"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Onsite Doorstep Services",
      "addressLocality": "Hassan",
      "addressRegion": "Karnataka",
      "postalCode": "573201",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.0072",
      "longitude": "76.1026"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:30",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "15:00"
      }
    ],
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Hassan" },
      { "@type": "AdministrativeArea", "name": "Belur" },
      { "@type": "AdministrativeArea", "name": "Sakleshpur" },
      { "@type": "AdministrativeArea", "name": "Arasikere" },
      { "@type": "AdministrativeArea", "name": "Channarayapatna" }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${fullUrl}#webpage`,
    "url": fullUrl,
    "name": routeInfo.title,
    "description": routeInfo.desc,
    "breadcrumb": {
      "@id": `${fullUrl}#breadcrumb`
    }
  };

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": SITE_URL
    }
  ];

  if (routeInfo.path.startsWith("/blog/")) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": `${SITE_URL}/blog`
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 3,
      "name": routeInfo.title,
      "item": fullUrl
    });
  } else if (routeInfo.path.startsWith("/project/")) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": `${SITE_URL}/projects`
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 3,
      "name": routeInfo.title,
      "item": fullUrl
    });
  } else if (routeInfo.price) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": `${SITE_URL}/services`
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 3,
      "name": routeInfo.title,
      "item": fullUrl
    });
  } else if (routeInfo.path !== "/") {
    const label = routeInfo.path.replace("/", "").toUpperCase();
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": label,
      "item": fullUrl
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${fullUrl}#breadcrumb`,
    "itemListElement": breadcrumbItems
  };

  let jsonLdScripts = `
  <script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  `;

  // Service Schema + FAQ Schema
  if (routeInfo.price) {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": routeInfo.title,
      "serviceType": routeInfo.title,
      "description": routeInfo.desc,
      "provider": {
        "@type": "LocalBusiness",
        "name": "MIInfotech",
        "telephone": "+91-9964761624",
        "url": SITE_URL
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Hassan, Karnataka"
      },
      "offers": {
        "@type": "Offer",
        "price": routeInfo.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    };
    jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>`;

    if (routeInfo.faqs && routeInfo.faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": routeInfo.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      };
      jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    }
  }

  // BlogPosting Schema
  if (routeInfo.path.startsWith("/blog/")) {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": routeInfo.title,
      "description": routeInfo.desc,
      "author": {
        "@type": "Person",
        "name": routeInfo.author || "Mohammed Ishtiaqh"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MIInfotech",
        "logo": {
          "@type": "ImageObject",
          "url": logoUrl
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      }
    };
    if (routeInfo.datePublished) {
      blogSchema.datePublished = routeInfo.datePublished;
    }
    jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(blogSchema)}</script>`;
  }

  // Project Schema (CreativeWork / Project)
  if (routeInfo.path.startsWith("/project/")) {
    const projectSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": routeInfo.title,
      "description": routeInfo.desc,
      "author": {
        "@type": "LocalBusiness",
        "name": "MIInfotech",
        "telephone": "+91-9964761624"
      },
      "contentLocation": {
        "@type": "Place",
        "name": routeInfo.location || "Hassan, Karnataka"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      }
    };
    if (routeInfo.dateCreated) {
      projectSchema.dateCreated = routeInfo.dateCreated;
    }
    jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(projectSchema)}</script>`;
  }

  // Site-wide FAQ Schema for Homepage and /faqs
  if (routeInfo.path === "/" || routeInfo.path === "/faqs") {
    const siteFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": SITE_WIDE_FAQS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    jsonLdScripts += `\n  <script type="application/ld+json">${JSON.stringify(siteFaqSchema)}</script>`;
  }

  html = html.replace("</head>", `${jsonLdScripts}\n</head>`);

  return html;
}

async function fetchSupabaseDynamicRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("ℹ️ Supabase credentials not set in build environment. Using base static route catalog.");
    return { dynamicBlogs: [], dynamicProjects: [] };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: dbBlogs, error: blogErr } = await supabase.from("blogs").select("*");
    const { data: dbProjects, error: projErr } = await supabase.from("projects").select("*").eq("status", "published");

    if (blogErr) console.warn("Notice: Could not fetch blogs from Supabase at build time:", blogErr.message);
    if (projErr) console.warn("Notice: Could not fetch projects from Supabase at build time:", projErr.message);

    const dynamicBlogs = (dbBlogs || []).map((b) => ({
      slug: b.slug,
      path: `/blog/${b.slug}`,
      title: `${b.title} | Tech Guide by MIInfotech Hassan`,
      desc: b.excerpt || `${b.title} - Onsite IT support & tech guide by MIInfotech in Hassan.`,
      datePublished: b.created_at ? new Date(b.created_at).toISOString().split("T")[0] : undefined,
      author: "Mohammed Ishtiaqh"
    }));

    const dynamicProjects = (dbProjects || []).map((p) => ({
      seoSlug: p.seoSlug || p.id,
      path: `/project/${p.seoSlug || p.id}`,
      title: p.metaTitle || `${p.title} in Hassan | MIInfotech`,
      desc: p.metaDescription || `${p.description ? p.description.substring(0, 150) : p.title}... Doorstep ${p.category || "IT Service"} by MIInfotech in Hassan.`,
      category: p.category || "IT Project",
      location: p.location || "Hassan, Karnataka",
      dateCreated: p.date || (p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : undefined)
    }));

    return { dynamicBlogs, dynamicProjects };
  } catch (err) {
    console.warn("Notice: Supabase route query skipped at build time:", err.message);
    return { dynamicBlogs: [], dynamicProjects: [] };
  }
}

async function runBuildSEO() {
  console.log("🚀 Starting Build-Time Pre-Rendering & Dynamic Sitemap Generation...");

  const distDir = path.join(process.cwd(), "dist");
  const templatePath = path.join(distDir, "index.html");

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Error: dist/index.html not found. Run 'vite build' before executing this script.");
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, "utf-8");

  const { dynamicBlogs, dynamicProjects } = await fetchSupabaseDynamicRoutes();

  // Merge dynamic routes into static lists avoiding duplicate paths
  const existingBlogPaths = new Set(BLOGS_DATA_SEO.map((b) => b.path));
  const additionalBlogs = dynamicBlogs.filter((b) => !existingBlogPaths.has(b.path));

  const existingProjectPaths = new Set(PROJECTS_DATA_SEO.map((p) => p.path));
  const additionalProjects = dynamicProjects.filter((p) => !existingProjectPaths.has(p.path));

  const allRoutes = [
    ...STATIC_ROUTES,
    ...SERVICES_DATA_SEO,
    ...BLOGS_DATA_SEO,
    ...additionalBlogs,
    ...PROJECTS_DATA_SEO,
    ...additionalProjects
  ];

  let pagesProcessed = 0;

  allRoutes.forEach((route) => {
    const pageHtml = generatePageHtml(templateHtml, route);

    if (route.path === "/") {
      fs.writeFileSync(templatePath, pageHtml, "utf-8");
    } else {
      const targetDir = path.join(distDir, route.path.replace(/^\//, ""));
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, "index.html"), pageHtml, "utf-8");
    }
    pagesProcessed++;
  });

  console.log(`✅ Successfully pre-rendered static HTML for ${pagesProcessed} routes in dist/`);

  // Generate Sitemap XML
  const sitemapXml = generateSitemapXML(allRoutes);

  // Write to public/ and dist/
  const publicSitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  const distSitemapPath = path.join(distDir, "sitemap.xml");

  fs.writeFileSync(publicSitemapPath, sitemapXml, "utf-8");
  fs.writeFileSync(distSitemapPath, sitemapXml, "utf-8");

  console.log("✅ Successfully generated dynamic sitemap.xml in public/ and dist/");

  // Generate & Write robots.txt using dynamic SITE_URL
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  const publicRobotsPath = path.join(process.cwd(), "public", "robots.txt");
  const distRobotsPath = path.join(distDir, "robots.txt");

  fs.writeFileSync(publicRobotsPath, robotsTxt, "utf-8");
  fs.writeFileSync(distRobotsPath, robotsTxt, "utf-8");

  console.log(`✅ Successfully updated robots.txt in public/ and dist/ using SITE_URL: ${SITE_URL}`);
}

runBuildSEO();
