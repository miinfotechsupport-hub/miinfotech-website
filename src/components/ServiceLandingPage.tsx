import React, { useState, useEffect } from "react";
import { SITE_URL } from "../lib/config";
import { SERVICES_DATA, FAQS_DATA, REVIEWS_DATA, SUPPORTED_BRANDS, HASSAN_AREAS } from "../types";
import { 
  Check, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  HelpCircle, 
  CornerDownRight, 
  Activity, 
  IndianRupee, 
  ArrowLeft,
  Star,
  ExternalLink,
  Flame,
  BatteryCharging,
  Eye,
  Monitor,
  Laptop,
  Printer,
  Network,
  PhoneCall,
  ShieldAlert,
  Wifi,
  Briefcase
} from "lucide-react";
import { supabase } from "../lib/supabase";

const SERVICE_ID_TO_PATH: { [key: string]: string } = {
  "computer": "/computer-repair-hassan",
  "laptop": "/laptop-repair-hassan",
  "cctv": "/cctv-installation-hassan",
  "printer": "/printer-repair-hassan",
  "networking": "/networking-services-hassan",
  "biometric": "/biometric-installation-hassan",
  "windows": "/windows-installation-hassan",
  "data-recovery": "/data-recovery-hassan",
  "ups": "/ups-installation-repair-hassan",
  "intercom": "/intercom-systems-hassan",
  "firealarm": "/fire-alarm-systems-hassan",
  "p2p": "/p2p-wireless-installation-hassan",
  "amc": "/it-support-amc-hassan",
};

interface ServiceLandingPageProps {
  serviceId: string;
  onBackClick: () => void;
  onBookClick: (serviceName: string) => void;
  onNavigateToService: (id: string) => void;
}

export default function ServiceLandingPage({ 
  serviceId, 
  onBackClick, 
  onBookClick,
  onNavigateToService
}: ServiceLandingPageProps) {
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  const [servicesList, setServicesList] = useState<any[]>(SERVICES_DATA);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from("services").select("*").order("order", { ascending: true });
        if (data && data.length > 0) {
          setServicesList(data.map((s: any) => ({
            id: s.id,
            name: s.name,
            iconName: s.iconName || "Monitor",
            tagline: s.tagline || "",
            description: s.description || "",
            seoKeywords: s.seoKeywords || [],
            features: s.features || [],
            symptoms: s.symptoms || [],
            startingPrice: s.startingPrice || "₹450",
            timeframe: s.timeframe || "Same-Day Service"
          })));
        }
      } catch (err) {
        console.error("Failed to load services in Landing Page:", err);
      }
    };
    fetchServices();
  }, []);

  // Find the active service configuration
  const service = servicesList.find((s) => s.id === serviceId) || servicesList[0] || SERVICES_DATA[0];

  const renderDeepDive = (id: string) => {
    switch (id) {
      case "computer":
      case "windows":
      case "data-recovery":
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Onsite Computer & Desktop Repair Guide in Hassan: Maximizing Lifespan and Security
            </h2>
            <p>
              In today's fast-paced digital ecosystem, having a sluggish or malfunctioning computer can halt your business operations or affect personal productivity instantly. At MIInfotech, we specialize in high-efficiency doorstep <strong>Computer Repair in Hassan, Karnataka</strong>. Under the direct leadership of <strong>Mohammed Ishtiaqh</strong>, our onsite diagnostic experts are equipped to isolate motherboards, power supplies, memory modules, and operating systems without requiring you to transport heavy systems to a local store.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Component-Level Diagnostic & Troubleshooting Workflows</h3>
            <p>
              When our senior technician arrives at your doorstep in Hassan (whether in Kuvempu Nagar, Hemavathi Nagar, or Channapatna), they follow a strict, professional multi-point diagnostic checklist to identify the precise failure mode:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Power Supply Unit (SMPS) Check:</strong> We measure output voltages (12V, 5V, 3.3V rails) using dedicated testers to isolate startup failures and unstable power distribution.</li>
              <li><strong>Memory & Storage Scan:</strong> Memory bit-checks and SMART status analysis are run to isolate slow boot times, random freeze-ups, or Blue Screen of Death (BSOD) crashes.</li>
              <li><strong>Processor & Thermal Assessment:</strong> High temperature levels are a primary cause of computer shutdown. We perform thermal compound repasting and heatsink purification onsite.</li>
              <li><strong>Motherboard Diagnostics:</strong> High humidity levels in Hassan can cause micro-corrosion. We check capacitors and diagnostic chip rails for failure.</li>
            </ul>

            <h3 className="text-base sm:text-lg font-bold text-white">2. Genuine Windows 10 & 11 Operating System Deployments</h3>
            <p>
              Running an unactivated or corrupted operating system leaves you vulnerable to cyber security threats and crashes. Our team handles fully licensed <strong>Windows Installation in Hassan</strong>. We configure official Microsoft ISO updates, deploy secure drivers, configure hardware acceleration, and install essential utilities. We also optimize background service footprints to reduce CPU and memory consumption.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Professional Data Recovery from Damaged Media</h3>
            <p>
              Accidentally formatted a drive or faced partition loss? Our doorstep <strong>Data Recovery Services in Hassan</strong> utilize advanced logical sector scanners to recover critical records, business spreadsheets, accounts, and valuable personal memories. We retrieve lost data from damaged SSDs, mechanical hard disks, and corrupt USB memory drives. We also advise on setting up real-time automatic backup schedules (local & cloud-based) to ensure you never experience catastrophic loss again.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. Preventative AMC Contracts for Offices & Schools</h3>
            <p>
              For businesses, schools, and offices in Hassan, computer failure means downtime. Our computer Annual Maintenance Contracts (AMC) offer proactive maintenance, dust cleaning, software auditing, and local network diagnostics to prevent failures before they occur. We ensure that your computer lab, classroom systems, or office computers run smoothly with priority support dispatch.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">5. Local Expertise & Google EEAT Standards</h3>
            <p>
              MIInfotech is built on trust, transparency, and certified experience. By performing all diagnoses and repairs right in front of you, we guarantee 100% data safety and eliminate any parts-swap concerns. We are dedicated to providing the highest quality <strong>doorstep computer repair service in Hassan</strong>.
            </p>
          </div>
        );

      case "laptop":
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Premium Doorstep Laptop Repair & Screen Replacement in Hassan
            </h2>
            <p>
              Laptops are complex, tightly-packed machines that require precision handling. A single drop can crack a delicate LED display, tear a keyboard ribbon, or damage a charging socket. At MIInfotech, we offer comprehensive <strong>Laptop Repair in Hassan, Karnataka</strong>. Our certified engineer, <strong>Mohammed Ishtiaqh</strong>, brings specialized tools and ESD-safe workspaces directly to your home or office.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Expert Laptop Screen Replacement Solutions</h3>
            <p>
              A flickering screen or colored horizontal lines indicate a damaged display matrix or loose LCD cable. We provide doorstep <strong>Laptop Screen Replacement in Hassan</strong>, utilizing high-quality IPS, FHD, and LED replacement panels with manufacturer-backed warranties. Our technician carefully disassembles the bezel, checks the eDP cable connections, installs the new panel, and verifies correct color reproduction and brightness levels in front of you.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">2. Professional Keyboard, Trackpad & Charging Port Fixes</h3>
            <p>
              Individual keys failing or battery refusing to charge? We replace damaged keyboard membranes and faulty trackpads. We also perform onsite repairs for DC power jacks, loose charging sockets, and damaged motherboard connectors to restore perfect power delivery.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Thermal Repasting & Fan Overhaul to Prevent Overheating</h3>
            <p>
              Laptops suck in dust over time, causing cooling fans to clog. This results in extreme heat, loud fan noise, and performance throttling. We disassemble the cooling assembly, clean out the dust, replace dry thermal paste with premium compound, and test thermal stability under heavy workloads.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. OEM-Grade Battery & Performance Hardware Upgrades</h3>
            <p>
              If your laptop drains quickly, a certified battery replacement is necessary. We source OEM batteries with solid replacement warranties. Additionally, we upgrade legacy mechanical hard drives to ultra-fast NVMe/SATA SSDs and double your RAM capacity, giving your older laptop a massive speed boost that outperforms many newer models.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">5. Why Choose Our Safe Doorstep Model?</h3>
            <p>
              We believe in transparency. Carrying your laptop to a crowded workshop risks scratches, data leaks, or diagnostic delays. With MIInfotech, your laptop is serviced directly on your table, allowing you to monitor the entire process. This is the ultimate, premium <strong>doorstep laptop service in Hassan</strong>.
            </p>
          </div>
        );

      case "cctv":
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Professional CCTV Camera Installation & Surveillance Solutions in Hassan
            </h2>
            <p>
              Securing your family, business, or inventory is non-negotiable. Modern security requires high-resolution, reliable, and neatly wired camera systems. MIInfotech is the leading provider of expert <strong>CCTV Installation in Hassan, Karnataka</strong>. Founded by <strong>Mohammed Ishtiaqh</strong>, we engineer complete security layouts using top-tier brands like Hikvision, CP PLUS, and Dahua to deliver uncompromised surveillance.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Analog High-Definition (AHD) vs. Advanced IP Camera Systems</h3>
            <p>
              Choosing the right security architecture is critical. We analyze your premises to design a custom layout:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Analog HD Cameras (1080p to 5MP):</strong> Cost-effective, reliable, and perfect for residential homes or small retail shops. We install coaxial cabling, secure BNC connectors, and configure high-capacity DVR storage.</li>
              <li><strong>IP Security Cameras (up to 4K):</strong> Ideal for corporate offices, schools, and larger commercial properties. We run structured Cat6 networking cables, set up PoE switches, configure NVR recorders, and implement high-security encryptions.</li>
              <li><strong>Smart Wireless / 4G SIM Cameras:</strong> Perfect for isolated corners, solar-powered installations, or locations without active broadband. We set up pan-tilt-zoom (PTZ) dome cameras that record locally on micro-SD cards and alert your phone instantly.</li>
            </ul>

            <h3 className="text-base sm:text-lg font-bold text-white">2. Mobile Remote Preview & Real-Time Security Alerts</h3>
            <p>
              A surveillance system is only useful if you can access it anywhere. We configure port forwarding and DDNS setups to stream live CCTV feeds directly to your Android or iOS smartphone. Get real-time push alerts on motion detection, line crossing, or suspicious activity, keeping you connected to your home or shop in Hassan even when traveling.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Expert CCTV Repair & Maintenance Services</h3>
            <p>
              Is your camera showing a black screen, fuzzy lines, or failing to record night-vision feeds? We perform component-level diagnostic audits, replace damaged video baluns, upgrade failing SMPS power boxes, swap out worn-out surveillance hard disks, and repair physical wiring damaged by monsoon humidity or pests.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. Structured Cable Routing & Weatherproofing</h3>
            <p>
              Poor wiring is the leading cause of CCTV failure. Our team ensures that all outdoor connections are housed in weatherproof junction boxes. Coaxial and Cat6 cables are routed neatly inside PVC conduits or casings, preventing physical damage and ensuring clean video signals for years to come.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">5. Trust, Experience, and Local Dedication</h3>
            <p>
              Under Mohammed Ishtiaqh's direct guidance, MIInfotech delivers clean installations, prompt diagnostic visits, and reliable after-sales support. Secure your premises today with the highest quality <strong>security camera setup in Hassan</strong>.
            </p>
          </div>
        );

      case "printer":
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Onsite Printer Repair & Cartridge Refilling Services in Hassan
            </h2>
            <p>
              Printers are indispensable for offices, billing counters, and schools. A clogged ink nozzle, a paper jam error, or a dry toner cartridge can halt critical workflows. MIInfotech offers expert, doorstep <strong>Printer Repair in Hassan, Karnataka</strong>. Managed by <strong>Mohammed Ishtiaqh</strong>, our onsite technicians service Ink Tank, LaserJet, and thermal billing printers quickly and professionally.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Comprehensive Ink Tank Printer Maintenance</h3>
            <p>
              Modern Ink Tank printers (Epson EcoTank, HP Smart Tank, Canon Pixma) are highly efficient but prone to airlocks, printhead clogging, and waste ink pad saturation. We perform onsite printhead deep cleaning, air purging, printhead alignments, and physical waste ink pad replacement with counter resets to restore crisp color prints.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">2. High-Performance LaserJet Troubleshooting & Parts Repair</h3>
            <p>
              LaserJet printers are workhorses but contain parts that wear out, such as fusers, pressure rollers, paper pickup rollers, and separation pads. If your printouts are faded, smeared with black toner, or repeatedly jamming, our technician disassembles the fuser unit onsite, cleans the paper path, replaces worn parts, and tests print stability.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Professional Cartridge Refilling & High-Quality Toners</h3>
            <p>
              Buying original cartridges every time is incredibly expensive. We offer cost-effective, high-quality <strong>Printer Cartridge Refilling in Hassan</strong>. We use premium, micro-fine black toner powder, replace worn developer drums and doctor blades, and reset toner chips to deliver dark, high-yield prints that match original quality at a fraction of the cost.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. Local Network Sharing & Driver Installations</h3>
            <p>
              Struggling to print from your laptop or phone? We configure wireless network printers, set up wired print servers, share billing printers across multiple systems, and troubleshoot offline connection errors. We ensure smooth printing from any device in your home, school lab, or retail store.
            </p>
          </div>
        );

      case "networking":
      case "p2p":
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Structured Network Cabling, WiFi Setup & Wireless P2P Bridges in Hassan
            </h2>
            <p>
              A robust network is the backbone of any modern enterprise or home. Dead spots, slow speeds, and messy cables cause daily frustration. MIInfotech is Hassan's premier provider of professional <strong>Networking Services and WiFi Installation</strong>. Under the expert leadership of <strong>Mohammed Ishtiaqh</strong>, we deploy high-speed local networks and long-distance wireless links tailored to your premises.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Structured LAN Cabling & Cat6/Cat5e Cable Routing</h3>
            <p>
              Messy patch cords lead to packet loss and network failures. We design neatly structured LAN setups for office desks, billing counters, schools, and hospitals. Our services include wall-mounted network racks, clean patch panels, Cat6 crimping, wall I/O faceplates, and thorough continuity testing. This ensures gigabit speeds and zero signal degradation.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">2. Seamless WiFi Mesh Systems & Wireless Access Points</h3>
            <p>
              Standard routers struggle to penetrate concrete walls. We install high-performance dual-band wireless access points and smart mesh WiFi networks (TP-Link, Ubiquiti, D-Link). This creates a seamless network that covers your entire home or multi-floor hotel with a single SSID, ensuring smooth roaming and fast speeds.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Long-Distance Point-to-Point (P2P) Wireless Bridges</h3>
            <p>
              Need to share internet or CCTV feeds between buildings kilometers apart? Running physical cables over such distances is costly and complex. We install outdoor P2P wireless bridges (Ubiquiti NanoStation, TP-Link CPE) to create high-speed, secure wireless data links over distances up to 5 kilometers, saving you significant cabling costs.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. Switch Setup, Router Configuration & IP Subnets</h3>
            <p>
              We configure managed and unmanaged switches, setup secure firewalls, isolate guest WiFi networks, manage bandwidth limits, and configure port forwarding for CCTV and local servers. We design clean IP subnets that prevent IP conflicts and optimize network performance.
            </p>
          </div>
        );

      default:
        return (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Onsite IT Infrastructure & Electronic Security Support in Hassan
            </h2>
            <p>
              MIInfotech is dedicated to providing high-quality technical support, security systems, and infrastructure maintenance in Hassan, Karnataka. Founded and managed by <strong>Mohammed Ishtiaqh</strong>, we deliver certified doorstep diagnostics, hardware repairs, and complete IT setups.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">1. Expert Biometric Attendance & Access Control Installations</h3>
            <p>
              We install and configure secure biometric attendance systems (eSSL, Matrix, ZKTeco) for offices, schools, and shops in Hassan. We set up magnetic locks, card readers, and configure desktop software to track employee check-in and checkout data cleanly.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">2. Industrial UPS Service & Backup Battery Replacement</h3>
            <p>
              Frequent power fluctuations in Hassan can damage critical servers and billing systems. We service online and offline UPS systems, verify charge circuits, replace worn backup batteries (Exide, Amaron), and clean interior boards to ensure uninterrupted power backups.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">3. Clean Intercom, EPABX & Fire Alarm Panel Deployments</h3>
            <p>
              We run neat telephone wiring, configure multi-extension EPABX voice switchboards, and install security fire alarm panels with smoke detectors. This ensures efficient internal communication and safety compliance for your hotel, clinic, or office.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white">4. Comprehensive Annual Maintenance Contracts (AMC)</h3>
            <p>
              Our customized AMC plans provide commercial properties and schools with routine preventive checkups, thermal cleaning, virus scanning, printer drum cleaning, and priority support dispatch to keep your entire IT infrastructure running flawlessly.
            </p>
          </div>
        );
    }
  };

  // Dynamic meta update and scroll to top on mount/change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // SEO Page Titles & Meta Descriptions depending on active landing page
    const originalTitle = document.title;
    const pageTitle = `${service.name} Repair & Installation in Hassan | Onsite Support`;
    document.title = pageTitle;

    // Dynamically update the meta description if we can find it
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `Professional doorstep ${service.name.toLowerCase()} and setup in Hassan, Karnataka by MIInfotech. ${service.tagline}. Same-day diagnostic visit starting at ₹450 inside Hassan.`
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
    };
  }, [serviceId]);

  // Render correct category icon dynamically
  const renderCategoryIcon = (iconName: string, className: string = "w-6 h-6") => {
    const icons: Record<string, React.ComponentType<any>> = {
      Monitor: Monitor,
      Laptop: Laptop,
      Printer: Printer,
      Eye: Eye,
      Network: Network,
      BatteryCharging: BatteryCharging,
      PhoneCall: PhoneCall,
      ShieldAlert: ShieldAlert,
      Wifi: Wifi,
      Briefcase: Briefcase,
    };
    const IconComponent = icons[iconName] || Monitor;
    return <IconComponent className={className} />;
  };

  // Helper to filter FAQs relevant to the current service category
  const getRelevantFaqs = () => {
    // Map service id to FAQ categories
    const categoryMapping: Record<string, string[]> = {
      computer: ["General", "Hardware", "Pricing"],
      laptop: ["Laptop", "Hardware", "Pricing"],
      printer: ["Printer", "Pricing"],
      cctv: ["CCTV", "Pricing"],
      networking: ["Networking", "Pricing"],
      ups: ["Pricing"],
      intercom: ["Pricing"],
      firealarm: ["Pricing"],
      p2p: ["Networking", "Pricing"],
      amc: ["AMC", "Pricing"]
    };

    const targetCats = categoryMapping[service.id] || ["General"];
    const filtered = FAQS_DATA.filter((faq) => targetCats.includes(faq.category));
    
    // If we don't have enough, append general ones
    if (filtered.length < 3) {
      return [...filtered, ...FAQS_DATA.filter((faq) => faq.category === "General")].slice(0, 5);
    }
    return filtered;
  };

  const relevantFaqs = getRelevantFaqs();

  // Filter reviews matching or mentioning keywords
  const getRelevantReviews = () => {
    const keywords: Record<string, string[]> = {
      computer: ["computer", "desktop", "motherboard", "windows"],
      laptop: ["laptop", "keyboard", "screen", "hp", "dell"],
      printer: ["printer", "laserjet", "ink", "cartridge"],
      cctv: ["cctv", "camera", "surveillance", "hikvision"],
      networking: ["cabling", "lan", "network", "router", "switch"],
      ups: ["ups", "battery", "backup"],
      intercom: ["intercom", "epabx", "telephone"],
      firealarm: ["fire", "alarm", "smoke"],
      p2p: ["wireless", "bridge", "p2p", "ubiquiti"],
      amc: ["amc", "annual", "contract"]
    };

    const searchWords = keywords[service.id] || [];
    const matched = REVIEWS_DATA.filter((review) => {
      const text = review.comment.toLowerCase();
      return searchWords.some((word) => text.includes(word));
    });

    return matched.length > 0 ? matched : REVIEWS_DATA;
  };

  const relevantReviews = getRelevantReviews();

  // Internal linking: list other services excluding current
  const getRelatedServices = () => {
    return servicesList.filter((s) => s.id !== serviceId).slice(0, 3);
  };

  const relatedServices = getRelatedServices();

  // WhatsApp query builder with specific pre-filled message
  const getWhatsAppLink = () => {
    const text = `Hi MIInfotech, I would like to enquire about your doorstep ${service.name} services in Hassan. Please let me know your availability for a setup or repair visit. Details: [Service ID: ${service.id}]. Thanks!`;
    return `https://wa.me/919964761624?text=${encodeURIComponent(text)}`;
  };

  const servicePath = SERVICE_ID_TO_PATH[service.id] || `/${service.id}`;

  // Structured Schema.org markup (JSON-LD)
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        "name": "MIInfotech",
        "logo": `${SITE_URL}/images/miinfotech-logo.png`,
        "image": `${SITE_URL}/images/miinfotech-logo.png`,
        "telephone": "+91 9964761624",
        "email": "miinfotech.support@gmail.com",
        "url": SITE_URL,
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hassan",
          "addressRegion": "Karnataka",
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
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
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
        "areaServed": HASSAN_AREAS.map(area => ({
          "@type": "AdministrativeArea",
          "name": area
        }))
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service-${service.id}`,
        "name": service.name,
        "description": service.description,
        "provider": {
          "@id": `${SITE_URL}/#localbusiness`
        },
        "areaServed": "Hassan, Karnataka",
        "offers": {
          "@type": "Offer",
          "price": service.startingPrice.replace(/[^0-9]/g, "") || "450",
          "priceCurrency": "INR",
          "eligibleRegion": {
            "@type": "AdministrativeArea",
            "name": "Hassan"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb-${service.id}`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${SITE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": `${SITE_URL}/#services`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.name,
            "item": `${SITE_URL}${servicePath}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq-${service.id}`,
        "mainEntity": relevantFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen text-left pb-12 animate-fadeIn">
      
      {/* Schema Injection */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdSchema)}
      </script>

      {/* Hero Header Area */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-850 pt-28 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-75 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          {/* Breadcrumb Navigation - SEO Compliant */}
          <nav className="flex items-center gap-2 text-slate-500 text-[11px] font-mono mb-6 uppercase tracking-wider">
            <button onClick={onBackClick} className="hover:text-blue-400 transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-400">Services</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-400 font-semibold">{service.name}</span>
          </nav>

          {/* Back Button */}
          <button 
            onClick={onBackClick}
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Main Page</span>
          </button>

          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2.5 bg-blue-600/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Certified Onsite Care • Hassan Area
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {service.name} in Hassan, Karnataka
              </h1>
              
              <p className="text-blue-400 text-base sm:text-lg font-medium italic mt-1 font-sans">
                {service.tagline}
              </p>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mt-3">
                {service.description} MIInfotech is founded and managed by <strong>Mohammed Ishtiaqh</strong>, providing professional desktop level, chip level diagnostic and wiring configurations right at your home, office, shop, or factory.
              </p>

              {/* Bullet Quick Trust Icons */}
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-3">
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  🛡️ 100% Genuine Components
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  ⚙️ Onsite Repair Verification
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  🕒 Same-Day Dispatch SLA
                </span>
              </div>
            </div>

            {/* Quick Conversion Card */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -z-10" />
              
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Estimated Onsite Rate:</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white font-extrabold text-3xl sm:text-4xl tracking-tight">
                    {service.startingPrice.split(" ")[0]}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ base visiting diagnostic</span>
                </div>
                
                {/* SLA detail */}
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-300 bg-slate-950/60 border border-slate-850 px-3 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Turnaround: <strong className="text-white">{service.timeframe}</strong> inside Hassan</span>
                </div>

                {/* Local Area Verification */}
                <div className="flex items-start gap-2 mt-3 text-[11px] text-slate-400 bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Dispatching to Kuvempu Nagar, Vidya Nagar, Channapatna, Hemavathi Nagar, Industrial Area, and nearby outskirts.</span>
                </div>
              </div>

              {/* Fast Calling CTA Buttons */}
              <div className="space-y-3 mt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20"
                >
                  <MessageSquare className="w-4 h-4 fill-current animate-pulse" />
                  <span>WhatsApp Enquire Now</span>
                </a>

                <a
                  href="tel:+919964761624"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer border border-blue-500/20"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call +91 99647 61624</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Core Columns */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Visiting Diagnostic Cost Alert Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-12 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h3 className="text-white font-bold text-sm sm:text-base mb-1">Standard Doorstep Troubleshooting Fee Structure</h3>
            <p className="text-slate-300 leading-relaxed">
              To diagnose hardware or network failures, our onsite standard visiting fee is <strong>₹450 inside Hassan city</strong>. For distant outskirts or neighboring taluks, a visiting fee of <strong>₹1200 (₹450 minimum diagnostic charge + ₹750 travel allowance)</strong> applies. Please note that if any components require replacement, the hardware material cost is extra and will be quoted upfront before work starts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Main Content Pane */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Features list */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="p-1.5 bg-blue-600/10 rounded-lg text-blue-400 border border-blue-500/20">
                  {renderCategoryIcon(service.iconName, "w-5 h-5")}
                </span>
                Onsite Services & Technical Solutions Available
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We handle the following technical operations directly at your site with high professional care and neat execution:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950 border border-slate-850 p-4 rounded-xl hover:border-slate-800 transition-colors">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1200+ Words Google E-E-A-T Deep Dive Article */}
            {renderDeepDive(service.id)}

            {/* Our 5-Step Doorstep Work Process (E-E-A-T Signal) */}
            <div className="space-y-6">
              <div className="text-left">
                <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Streamlined Diagnostics</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Our Onsite Technical Execution Process</h2>
                <p className="text-slate-400 text-xs mt-1">Providing safe diagnostics and structured execution without transport risk.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: "01", title: "Enquiry", desc: "Contact via call or WhatsApp to share issues." },
                  { step: "02", title: "Diagnostic", desc: "Technician visits for onsite test and fault isolation." },
                  { step: "03", title: "Quotation", desc: "Upfront pricing with spares cost explained." },
                  { step: "04", title: "Repair", desc: "Component replacement or configuration done on-the-spot." },
                  { step: "05", title: "Warranty", desc: "Full performance testing and replacement warranty." }
                ].map((p, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between relative">
                    <span className="text-blue-500 font-mono font-extrabold text-xl tracking-wider block mb-2">{p.step}</span>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{p.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-1.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Brands */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Brands & hardware Vendors We Support
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Sourcing original equipment, firmware configurations, and authorized spares for all major hardware brands:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SUPPORTED_BRANDS.map((brand, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-300 border border-slate-850 px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans">
                    {brand.name} Authorized Support
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div id="service-faqs" className="space-y-6">
              <div className="text-left">
                <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Expert Help & Advice</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Frequently Asked Questions</h2>
                <p className="text-slate-400 text-xs mt-1">Find answers to common pricing, replacement, and warranty questions.</p>
              </div>

              <div className="space-y-3">
                {relevantFaqs.map((faq, idx) => {
                  const isOpen = expandedFaqIdx === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedFaqIdx(isOpen ? null : idx)}
                        className="w-full px-5 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-blue-400 cursor-pointer"
                      >
                        <span className="leading-snug">{faq.question}</span>
                        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-transform text-blue-500 ${isOpen ? "rotate-180 text-blue-400" : ""}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-850/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contextual Reviews (Social Proof / E-E-A-T) */}
            <div className="space-y-6">
              <div className="text-left">
                <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Genuine Feedbacks</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Verified Hassan Customer Reviews</h2>
                <p className="text-slate-400 text-xs mt-1">Read what local homeowners, clinics, and retail shop owners say about our {service.name.toLowerCase()} work.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relevantReviews.map((rev, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-850/50 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="text-white font-bold block">{rev.name}</span>
                        <span>{rev.role}</span>
                      </div>
                      <span className="bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-blue-400">
                        {rev.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Widget Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Failures Symptoms We Fix Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Symptoms We Repair
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact us if your installation experiences any of these common warning symptoms:
              </p>
              
              <ul className="space-y-2.5">
                {service.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                    <span className="text-amber-500 select-none mt-0.5">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Service Area List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Coverage Area Limit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We provide physical dispatch to these local residential blocks and outlying townships across Hassan:
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                {HASSAN_AREAS.map((area, idx) => (
                  <span key={idx} className="bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded flex items-center gap-1">
                    <span className="w-1 h-1 bg-blue-500 rounded-full" />
                    {area.replace(" (Outskirts)", "")}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 italic mt-2 text-center">
                * Outskirts (e.g., Belur, Sakleshpur) incur a travel fee.
              </p>
            </div>

            {/* Embedded Google Maps Widget (Hassan, Karnataka, India) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold block px-1">
                📍 Hassan Coverage Map
              </h3>
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-850">
                <iframe
                  title="MIInfotech Hassan Service Coverage Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62228.05831649232!2d76.06263590000001!3d13.00720455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba54b9f62c0695d%3A0x868cfa890e0c83a7!2sHassan%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-none"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="text-[10px] text-slate-500 block px-1 text-center">
                Operating strictly as a Service-Area Business (SAB) dispatching from Hassan city. No drop-offs or walk-in stores.
              </div>
            </div>

            {/* Internal Linking Related Services */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Related Onsite Solutions
              </h3>
              <div className="space-y-3">
                {relatedServices.map((rs) => (
                  <button
                    key={rs.id}
                    onClick={() => onNavigateToService(rs.id)}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-750 px-4 py-3.5 rounded-xl text-left hover:bg-slate-900 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="text-white font-bold text-xs sm:text-sm block group-hover:text-blue-400 transition-colors">
                        {rs.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        Starts {rs.startingPrice}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
