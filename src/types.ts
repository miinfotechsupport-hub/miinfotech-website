import { Laptop, Monitor, Printer, Eye, Network, BatteryCharging, PhoneCall, ShieldAlert, Wifi, Briefcase, HelpCircle, Fingerprint, Lock, Database } from "lucide-react";

export interface ServiceDetail {
  id: string;
  name: string;
  iconName: string; // Used to look up lucide icons
  tagline: string;
  description: string;
  seoKeywords: string[];
  features: string[];
  symptoms: string[]; // Common problems solved
  startingPrice: string;
  timeframe: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  clientType?: string; // Kept for backward compatibility
  customerType?: string; // Corporate, Retail, Residential, Institution, Other
  location: string; // Specific Hassan location
  description: string;
  challenge?: string; // Kept for backward compatibility
  solution?: string; // Kept for backward compatibility
  imageBefore?: string; // Kept for backward compatibility
  imageAfter?: string; // Kept for backward compatibility
  images: string[]; // Multiple images support
  tags?: string[]; // Kept for backward compatibility
  date?: string;
  equipmentUsed: string;
  brand: string;
  technicianNotes: string;
  featured: boolean;
  seoSlug: string;
  metaTitle: string;
  metaDescription: string;
  schema: string;
  status: "draft" | "published";
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ReviewItem {
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  keywords: string[];
}

// 1. Services Static Data
export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: "computer",
    name: "Computer Repair & Desktop Service",
    iconName: "Monitor",
    tagline: "Expert Computer Repair in Hassan & Onsite Desktop Service Near Me",
    description: "Professional Computer Repair in Hassan, Karnataka. We offer doorstep desktop diagnosis, SMPS power supply repairs, motherboard troubleshooting, high-speed SSD upgrades, and custom PC builds for homes and offices.",
    seoKeywords: ["Computer Repair in Hassan", "Computer Service Center in Hassan", "Desktop Repair in Hassan", "Computer Repair Near Me", "Custom PC Build Hassan"],
    features: [
      "Onsite Computer Repair in Hassan & Computer Service Center diagnostics",
      "High-Speed SSD Upgrades & RAM expansion to eliminate system lag",
      "Desktop Repair in Hassan for SMPS power supplies and motherboard chipsets",
      "Professional Software Troubleshooting & License deployment",
      "Deep Virus, Spyware & Ransomware clean-up with Premium Antivirus setup",
      "Desktop Custom PC Assembly (Gaming, Workstation, Billing)",
      "Secure Data Recovery & Hard Drive diagnostic health checks",
      "Desktop Annual Maintenance Contracts (AMC) with periodic preventive checkups"
    ],
    symptoms: [
      "Computer gets stuck on loading screen or Blue Screen of Death (BSOD)",
      "Loud grinding noise from CPU cabinet or overheating cabinet",
      "Slow boot times taking more than 5 minutes to reach the desktop",
      "Accidental deletion of files or unreadable storage partition"
    ],
    startingPrice: "₹450 (Onsite Diagnostics)",
    timeframe: "Same-Day Service"
  },
  {
    id: "laptop",
    name: "Laptop Repair & Screen Replacement",
    iconName: "Laptop",
    tagline: "Fast Doorstep Laptop Repair in Hassan & Laptop Repair Near Me",
    description: "Doorstep Laptop Repair in Hassan, Karnataka. Specialized screen replacement, OEM battery replacement, keyboard repair, thermal servicing, and power jack fixes for Dell, HP, Lenovo, ASUS, Acer, and Apple laptops.",
    seoKeywords: ["Laptop Repair in Hassan", "Laptop Repair Near Me", "Laptop Service Center in Hassan", "Laptop Screen Replacement in Hassan", "Laptop Battery Replacement in Hassan"],
    features: [
      "Doorstep Laptop Repair in Hassan with careful data handling",
      "Laptop Screen Replacement in Hassan (FHD, IPS, LED panels with warranty)",
      "OEM-Grade Laptop Battery Replacement in Hassan with manufacturer warranty",
      "Laptop Keyboard and Trackpad replacement",
      "Thermal Paste repasting & Cooling Fan servicing to eliminate overheating",
      "Hinge rebuilds & body fabrication (broken plastics repair)",
      "OS corruption repair, data backup, and ultra-fast NVMe SSD upgrades",
      "Power jack and charging port repair on laptop motherboards"
    ],
    symptoms: [
      "Laptop turns on but screen remains completely pitch black",
      "Battery drains from 100% to 0% in under 30 minutes",
      "Laptop becomes extremely hot to touch and shuts down abruptly",
      "Keys like Enter, Backspace, or Spacebar do not register"
    ],
    startingPrice: "₹750 (Onsite Service Charge)",
    timeframe: "1 - 3 Hours"
  },
  {
    id: "printer",
    name: "Printer Repair & Cartridge Refilling",
    iconName: "Printer",
    tagline: "Onsite Printer Repair in Hassan & Cartridge Refilling Near Me",
    description: "Onsite Printer Repair in Hassan, Karnataka. Fast service, cartridge refilling, and maintenance for Epson Ink Tank, HP LaserJet, Canon, and thermal billing printers in offices, homes, and schools.",
    seoKeywords: ["Printer Repair in Hassan", "Printer Repair Near Me", "Printer Service Center in Hassan", "Printer Cartridge Refilling Hassan", "LaserJet Printer Service Hassan"],
    features: [
      "Onsite Printer Repair in Hassan for Epson EcoTank, HP Smart Tank, and Canon G-Series",
      "LaserJet Printer troubleshooting (fuser replacement, logic board repair)",
      "Printer Cartridge Refilling Hassan with high-yield micro-fine toner powder",
      "Thermal & tabletop billing printers setup, cleaning, and parts replacement",
      "New Printer sales, delivery, setup, and driver integration",
      "Network Printer Configuration (Wi-Fi & LAN sharing across offices)",
      "Printer spooler fixes, driver installation, and offline error fixes",
      "Dedicated Printer AMC maintenance plans for commercial businesses"
    ],
    symptoms: [
      "Paper jam errors even when there is no paper stuck inside",
      "Printouts have white horizontal lines or blank patches",
      "Printer making high-pitched clicking sounds and failing to pull paper",
      "Computers showing 'Printer Offline' error over the local network"
    ],
    startingPrice: "₹750 (Onsite Troubleshooting)",
    timeframe: "Same-Day Service"
  },
  {
    id: "cctv",
    name: "CCTV Installation & Camera Repair",
    iconName: "Eye",
    tagline: "CCTV Installation in Hassan & CCTV Security Setup Near Me",
    description: "Professional CCTV Installation in Hassan, Karnataka. Authorized dealer & setup for Hikvision, CP PLUS, and Dahua cameras. Expert CCTV Camera Repair, IP camera setup, 4G SIM cameras, solar cameras, and smartphone live stream configuration.",
    seoKeywords: ["CCTV Installation in Hassan", "CCTV Camera Installation in Hassan", "CCTV Repair in Hassan", "CCTV Service in Hassan", "CCTV Installation Near Me", "IP Camera Installation", "Hikvision CCTV Installation", "CP PLUS CCTV Installation", "CCTV AMC in Hassan"],
    features: [
      "CCTV Installation in Hassan & CCTV Camera Installation in Hassan for homes and shops",
      "CCTV Repair in Hassan for blank screens, night vision failure, and DVR/NVR hard drive errors",
      "Hikvision CCTV Installation & CP PLUS CCTV Installation with genuine brand warranty",
      "IP Camera Installation grids with PoE switches, NVR recorders, and structured Cat6 wiring",
      "4G SIM CAMERA setups for remote farms, plots, and layout monitoring",
      "WIFI CAMERA & Solar CCTV Camera installations for wireless security",
      "360 Degree PTZ Dome Cameras for continuous panoramic coverage",
      "Mobile Remote Viewing configuration (Hik-Connect, gDMSS) for live view anywhere",
      "CCTV AMC in Hassan for regular maintenance and security checkups"
    ],
    symptoms: [
      "Camera display says 'No Video' or shows blank black panels at night",
      "Recorded video footage skips frames, stutters, or hard disk fails to record",
      "Smartphone application fails to show live stream when outside home network",
      "Camera footage is blurry due to dust/moisture inside the dome cover"
    ],
    startingPrice: "₹1,500 (Basic Setup) / Custom Quote",
    timeframe: "1 - 2 Days (Depending on cabling scale)"
  },
  {
    id: "networking",
    name: "WiFi Network Installation & Office IT",
    iconName: "Network",
    tagline: "WiFi Network Installation in Hassan & Office IT Support",
    description: "Complete WiFi Network Installation in Hassan, Karnataka. Structured CAT6 LAN cabling, server rack installations, mesh WiFi access points, and office IT networking setups for commercial enterprises and schools.",
    seoKeywords: ["WiFi Network Installation in Hassan", "Office IT Support in Hassan", "Structured LAN Cabling Hassan", "Server Rack Setup Hassan", "Company Networking Hassan"],
    features: [
      "WiFi Network Installation in Hassan & office network planning",
      "Structured CAT6 / CAT6A copper cable routing with clean label tagging",
      "Server Rack Setup Hassan including 4U, 6U, 9U, 12U, and 42U server cabinets",
      "Patch panel punching, I/O network box terminations, and cable dressing",
      "Gigabit Switch & Router configuration (TP-Link, D-Link, Cisco, Ubiquiti)",
      "Multi-device Wi-Fi Access Point (AP) mesh setup to eliminate local dead spots",
      "School computer lab and office workstation networking setup",
      "Onsite Office IT Support in Hassan for network speed optimization"
    ],
    symptoms: [
      "Wi-Fi signal drops completely when moving to the adjacent room",
      "Internet slows down to a crawl when more than 5 users connect",
      "Network devices frequently report 'IP Address Conflict' errors",
      "Messy cables in server closet causing port tracing nightmare"
    ],
    startingPrice: "Custom Quote (Onsite Site Survey Free)",
    timeframe: "Flexible (Scheduled)"
  },
  {
    id: "ups",
    name: "UPS Installation & Battery Setup",
    iconName: "BatteryCharging",
    tagline: "UPS Installation in Hassan & Power Backup Service Near Me",
    description: "Reliable UPS Installation in Hassan, Karnataka. Power backup solutions for home PCs, office servers, and CCTV systems. New tubular battery setup, UPS card repair, and load balancing.",
    seoKeywords: ["UPS Installation in Hassan", "UPS Repair in Hassan", "UPS Battery Setup Hassan", "Computer backup power solutions"],
    features: [
      "UPS Installation in Hassan for homes, offices, schools, and factories",
      "UPS Repair in Hassan, circuit card servicing, and load testing",
      "New UPS battery setups with brand warranty (Luminous, Exide, Amaron)",
      "Home & Office Offline UPS sales and setups (600VA to 1.5KVA)",
      "Enterprise Online UPS arrays (3KVA, 5KVA, 10KVA+) for servers",
      "Deep-Cycle Tubular battery acid top-up, terminal cleaning, and health checks",
      "Onsite doorstep power backup calculation and load distribution",
      "UPS Annual Maintenance Contracts (AMC) for uninterrupted power"
    ],
    symptoms: [
      "Computer instantly shuts down when mains power cuts (zero backup time)",
      "UPS makes a continuous screeching alarm sound and shows red overload light",
      "Physical battery casing looks bulged, swollen, or smells of acidic residue",
      "UPS fails to turn on or does not charge from main utility line"
    ],
    startingPrice: "₹500 (Service) / Custom Battery Quote",
    timeframe: "Same-Day Delivery"
  },
  {
    id: "intercom",
    name: "Intercom & EPABX Systems",
    iconName: "PhoneCall",
    tagline: "Intercom Installation in Hassan & EPABX System Setup",
    description: "Professional Intercom Installation in Hassan, Karnataka. Multi-extension EPABX system sales, internal telephone copper wiring, and IP intercom setups for offices, apartments, and institutions.",
    seoKeywords: ["Intercom Installation in Hassan", "EPABX Setup in Hassan", "Telephone cabling Hassan", "Apartment Intercom systems"],
    features: [
      "Intercom Installation in Hassan for offices, apartments, and hospitals",
      "EPABX Setup in Hassan with multi-extension copper wiring",
      "IP Intercom setup with advanced features (Grandstream, Matrix, Panasonic)",
      "Apartment intercom wiring connecting 10 to 100+ flats with crystal clear voice",
      "Office intercom programming (one-touch speed dials, call transfers)",
      "Video doorbell intercom integrations for smart home security",
      "Multi-core telephone cable laying, MDF tag allocation, and tag cabinets",
      "Onsite diagnosis for static cross-talk noise and dead extensions"
    ],
    symptoms: [
      "Severe static noise, hum, or cross-talk overhead during intercom calls",
      "Dialing a specific department extension rings the wrong desk or fails completely",
      "Main EPABX board smells of burn or does not light up during power mains swap",
      "Apartment resident cannot trigger main gate lobby lock release button"
    ],
    startingPrice: "Custom Quote",
    timeframe: "1 - 3 Days"
  },
  {
    id: "firealarm",
    name: "Fire Alarm Systems",
    iconName: "ShieldAlert",
    tagline: "Fire Alarm System Installation in Hassan & Safety Panels",
    description: "Professional Fire Alarm System Installation in Hassan, Karnataka. Conventional and addressable fire alarm panels, optical smoke detectors, thermal heat sensors, and FRLS cabling for commercial buildings.",
    seoKeywords: ["Fire Alarm System Installation in Hassan", "Smoke Detector Setup Hassan", "Fire Alarm Panel Installation Hassan"],
    features: [
      "Fire Alarm System Installation in Hassan compliant with standard safety codes",
      "Conventional Fire Alarm Panel installation (2, 4, 8, and 16+ Zones)",
      "Smart Addressable Fire Alarm systems with exact sensor locator maps",
      "Optical Smoke Detectors and Thermal Heat Detectors mounting and looping",
      "Manual Call Points (MCP glass break triggers) and High-Decibel hooter alarms",
      "Heavy-duty Fire-Retardant Low-Smoke (FRLS) conduit cable routing",
      "Onsite troubleshooting of panel zone faults, line shorts, and false triggers",
      "Fire Alarm Annual Maintenance Contracts (AMC) with testing reports"
    ],
    symptoms: [
      "System control panel continuously displays a 'Zone Fault' or 'Loop open' status",
      "Fire alarm panel sounds alert chimes randomly in the absence of smoke",
      "Backup batteries are drained, causing panel shut down during short outages",
      "Sensors fail to trigger alarm indicator even when tested manually"
    ],
    startingPrice: "Custom Quote",
    timeframe: "2 - 5 Days"
  },
  {
    id: "p2p",
    name: "P2P Wireless Solutions",
    iconName: "Wifi",
    tagline: "P2P Wireless Solutions in Hassan & Long Range Network Links",
    description: "High-performance P2P Wireless Solutions in Hassan, Karnataka. Outdoor wireless bridges connecting offices, distant factories, warehouses, and remote CCTV camera clusters up to 15km+.",
    seoKeywords: ["P2P Wireless Solutions in Hassan", "Outdoor Wireless Bridge Hassan", "P2P Device Setup Hassan"],
    features: [
      "P2P Wireless Solutions in Hassan for high-speed long distance connectivity",
      "Point-to-Multipoint (PtMP) setups to share internet with multiple structures",
      "Line-of-Sight (LoS) calculations, frequency planning, and antenna tuning",
      "High-gain directional outdoor wireless antenna mounting on roof masts",
      "Configuration of Ubiquiti AirMax, MikroTik, or TP-Link Pharos outdoor devices",
      "High-throughput wireless bandwidth distribution (100Mbps to 1Gbps+)",
      "Secured, encrypted wireless bridging for corporate intranet data transfers",
      "Weatherproof cabling and surge protection installation"
    ],
    symptoms: [
      "Wireless link frequently drops or experiences high latency during heavy rains",
      "Data transmission speed between main plant and godown has drastically dropped",
      "Remote CCTV camera feeds connected via P2P link appear frozen or offline",
      "Mounting poles shifted due to strong winds, misaligning the narrow beam path"
    ],
    startingPrice: "Custom Quote (LoS Survey Included)",
    timeframe: "1 - 2 Days"
  },
  {
    id: "amc",
    name: "Office IT Support & AMC",
    iconName: "Briefcase",
    tagline: "Office IT Support in Hassan & Annual Maintenance Contracts",
    description: "Comprehensive Office IT Support in Hassan, Karnataka. Custom IT and CCTV AMCs covering breakdown visits, preventive computer cleanups, backup audits, and priority emergency response.",
    seoKeywords: ["Office IT Support in Hassan", "CCTV AMC in Hassan", "Annual Maintenance Contract Hassan", "Computer AMC Service Hassan"],
    features: [
      "Office IT Support in Hassan & custom IT AMC packages for businesses",
      "CCTV AMC in Hassan for regular camera health checks and recording audits",
      "Scheduled monthly preventive maintenance visits (deep dusting, OS cleaning)",
      "Breakdown emergency visits within 2-4 hours response priority",
      "Complete inventory asset tracking and health logging of all IT hardware",
      "Proactive software updates, backup verifications, and antivirus management",
      "Standby hardware replacements (desktops, printers, switches)",
      "Transparent flat-rate pricing with clear upfront quotes"
    ],
    symptoms: [
      "Frequent hardware failures causing costly employee downtime and lost sales",
      "No track of software licenses, leading to legal compliance or renewal gaps",
      "Critical data backups are silently failing without anyone realizing",
      "Emergency repair fees and replacement parts draining monthly business budget"
    ],
    startingPrice: "₹1,500/Year (Per Desktop basis) / Custom Package",
    timeframe: "Yearly Contract"
  },
  {
    id: "biometric",
    name: "Biometric Attendance & Access Control",
    iconName: "Fingerprint",
    tagline: "Biometric Attendance System in Hassan & Door Access Control",
    description: "High-precision Biometric Attendance System in Hassan, Karnataka. Fingerprint scanners, face recognition machines, RFID card locks, and electromagnetic (EM) door access control for offices and schools.",
    seoKeywords: ["Biometric Attendance System in Hassan", "Biometric Installation in Hassan", "Access Control System Hassan", "Fingerprint Scanner Hassan"],
    features: [
      "Biometric Attendance System in Hassan setup for offices, schools, and retail",
      "Face Recognition and Fingerprint scanners for secure door entry",
      "RFID Card and PIN door lock systems for restricted office zones",
      "Centralized Time & Attendance software integration for automated payroll",
      "Electromagnetic (EM) lock installation on glass, wooden, and metal doors",
      "Multi-location device synchronization over cloud servers",
      "Battery backup configuration for uninterrupted security during power cuts",
      "Onsite support, repair, software reinstallations, and AMC contracts"
    ],
    symptoms: [
      "Attendance machine fails to sync logs with the payroll software",
      "EM lock does not release the door when credential is authenticated",
      "Biometric sensor lens is scratched and cannot scan fingerprints",
      "Time attendance clock displays incorrect time after power fluctuation"
    ],
    startingPrice: "₹2,500 (Installation Setup)",
    timeframe: "Same-Day or Next-Day Service"
  },
  {
    id: "windows",
    name: "Windows Installation & OS Licensing",
    iconName: "Monitor",
    tagline: "Windows Installation in Hassan & Genuine OS License Activation",
    description: "Professional Windows Installation in Hassan, Karnataka. Genuine Windows 10 and Windows 11 installation, license activation, system optimization, and boot error fixes with careful data preservation.",
    seoKeywords: ["Windows Installation in Hassan", "Windows 11 Upgrade Hassan", "Genuine Windows License Hassan", "OS Installation Hassan"],
    features: [
      "Windows Installation in Hassan (Genuine Windows 10 & Windows 11)",
      "Official digital license key activation and registration",
      "Upgrading older Windows 7/8 PCs to modern Windows 10/11 safely",
      "Dual-boot and secondary operating system configuration",
      "Advanced disk partitioning and formatting without losing existing files",
      "Full installation of latest graphics, motherboard, and printer drivers",
      "Critical Windows security patches, hotfixes, and system updates",
      "System registry optimization and bloatware removal for ultra-fast performance"
    ],
    symptoms: [
      "Computer stuck in endless 'Automatic Repair' boot loop screen",
      "System showing 'Windows License Will Expire Soon' warning watermarks",
      "Extremely slow performance with CPU or disk usage showing 100% in Task Manager",
      "Frequent Blue Screen of Death (BSOD) crashes and sudden restarts"
    ],
    startingPrice: "₹750 (Onsite Installation)",
    timeframe: "1 - 2 Hours"
  },
  {
    id: "data-recovery",
    name: "Data Recovery Services",
    iconName: "Database",
    tagline: "Confidential Data Recovery in Hassan From Hard Drives & SSDs",
    description: "Confidential Data Recovery in Hassan, Karnataka. Recovery of lost documents, Tally accounting databases, photos, and files from damaged hard disk drives (HDD), SSDs, USB drives, and memory cards.",
    seoKeywords: ["Data Recovery in Hassan", "Hard Disk Recovery Hassan", "Corrupted SSD Data Recovery", "Recover Deleted Files Hassan"],
    features: [
      "Confidential Data Recovery in Hassan from corrupted and raw partitions",
      "Restoring files after accidental deletion, shift-delete, or recycling bin empty",
      "Hard Disk Recovery Hassan from unrecognized or dead HDDs and SSDs",
      "Retrieving lost photos, videos, and documents from formatted micro-SD cards",
      "Reconstructing files from corrupted or damaged USB flash drives",
      "Database recovery for accounting software (Tally, billing software, etc.)",
      "Secure data backup transfers to external hard drives or secure cloud storage",
      "Onsite storage diagnostics and bad-sector analysis using expert software"
    ],
    symptoms: [
      "External hard drive asks to be formatted before it can be used",
      "Accidental deletion of vital financial records or family memories",
      "Storage device shows as raw partition with zero bytes capacity",
      "Drive makes clicking, ticking, or buzzing sounds and is unrecognized"
    ],
    startingPrice: "₹1,500 (Depending on recovery complexity)",
    timeframe: "1 - 3 Days (Depending on drive capacity & health)"
  }
];

// 2. Real Projects Static Data
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Commercial CAT6 Cabling & Server Rack Installation",
    category: "Networking",
    clientType: "Corporate",
    customerType: "Corporate",
    location: "Hassan Industrial Area, Hassan",
    description: "Complete structured networking overhaul for a 3-floor manufacturing facility, wiring up over 85 workstations and clean cable dressing in the server closet.",
    challenge: "The existing setup had chaotic cat5 cables hanging from ceiling tiles, resulting in intermittent signal drops, duplicated local IP ranges, and a complete lack of port identification.",
    solution: "Laid over 2.4 kilometers of high-grade CAT6 cables within heavy-duty fire-retardant PVC conduits, mounted a central 12U Wall-Mount Server Rack, terminated lines into a neat 48-port Patch Panel, and systematically indexed each node.",
    imageBefore: "https://images.unsplash.com/photo-1551703599-6b3e8379aa81?auto=format&fit=crop&q=80&w=800",
    imageAfter: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551703599-6b3e8379aa81?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["CAT6 Structured Cabling", "12U Server Rack", "TP-Link Managed Switch", "Port Tagging"],
    date: "2026-06-15",
    equipmentUsed: "TP-Link 24-Port Gigabit Switch, D-Link 9U Server Rack, CAT6 Structured Cabling, Patch Panel",
    brand: "TP-Link",
    technicianNotes: "Structured office network cabling and server rack installation completed in Hassan Industrial Area. Tested gigabit performance verified.",
    featured: true,
    seoSlug: "commercial-cat6-cabling-server-rack-installation-hassan",
    metaTitle: "Structured LAN Cabling & Server Rack Setup Hassan | MIInfotech",
    metaDescription: "Structured office network cabling and server rack installation completed in Hassan Industrial Area by MIInfotech. Tested gigabit performance verified.",
    schema: "{}",
    status: "published"
  },
  {
    id: "proj-2",
    title: "Comprehensive IP CCTV Surveillance Grid Installation",
    category: "CCTV Installation",
    clientType: "Hospital",
    customerType: "Institution",
    location: "Kuvempu Nagar, Hassan",
    description: "Designed and deployed a state-of-the-art 32-camera IP CCTV network with unified storage and high-security smartphone stream access for management.",
    challenge: "High-security coverage was needed for ICU zones, entrances, and medical storage wards. Minimal disruption to patients was critical during physical mounting, and night vision had to be crystal clear.",
    solution: "Installed 32 Hikvision 4MP IP Dome & Bullet cameras with built-in POE. Sourced a 32-Channel NVR with dual 8TB surveillance-grade hard drives (RAID-1 configuration). Wired with secure CAT6 cable and set up secure mobile streaming via Hik-Connect app.",
    imageBefore: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    imageAfter: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["4MP IP Dome Cameras", "32-Channel NVR", "POE Switches", "Mobile Remote Streaming"],
    date: "2026-07-01",
    equipmentUsed: "Hikvision 4MP IP Dome & Bullet cameras, Hikvision 32-Channel NVR, POE Switches, High-grade CAT6 cables",
    brand: "Hikvision",
    technicianNotes: "Conduit piping laid neatly across wards. Weatherproof junction boxes used. Mobile remote monitoring configured for 3 devices via Hik-Connect.",
    featured: true,
    seoSlug: "comprehensive-ip-cctv-surveillance-grid-installation-hassan",
    metaTitle: "CCTV Security Installation in Kuvempu Nagar | MIInfotech",
    metaDescription: "Professional 16-camera IP CCTV installation completed by MIInfotech in Kuvempu Nagar, Hassan. Featuring 4MP resolution and remote smartphone live view.",
    schema: "{}",
    status: "published"
  },
  {
    id: "proj-3",
    title: "15-Station College Computer Lab Setup & Server configuration",
    category: "School Computer Lab",
    clientType: "Institution",
    customerType: "Institution",
    location: "Vidya Nagar, Hassan",
    description: "Delivered, assembled, and networked a brand new 15-station IT laboratory with centralized printer sharing and administrative controls for teachers.",
    challenge: "Tight budget constraints and strict deadlines. The lab needed to be completely ready for practical exams starting in one week.",
    solution: "Sourced and supplied 15 premium Intel i5 systems with 512GB NVMe SSDs and 16GB RAM. Completed hardware assembly onsite, wired a centralized gigabit switch network, set up shared LaserJet printers, and installed administrative monitoring software.",
    imageBefore: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    imageAfter: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["Desktop Assembly", "Gigabit LAN Setup", "LaserJet Printer Sharing", "Classroom Controls"],
    date: "2026-05-12",
    equipmentUsed: "Intel i5 Workstations, Genuine Windows 10, TP-Link 16-Port Gigabit Switch, Epson L3210 Ink Tank Printer",
    brand: "Intel / Epson",
    technicianNotes: "Assembled 15 customer systems with genuine Windows licenses. Installed student-monitoring tools. Shared Ink Tank printer configured across local LAN.",
    featured: true,
    seoSlug: "15-station-college-computer-lab-setup-hassan",
    metaTitle: "School Computer Lab Setup & Networking Hassan | MIInfotech",
    metaDescription: "Complete school computer lab assembly and LAN sharing completed in Vidya Nagar, Hassan by MIInfotech. High-speed setups with administrative controls.",
    schema: "{}",
    status: "published"
  },
  {
    id: "proj-4",
    title: "Long-Range 4km Outdoor P2P Wireless Bridge",
    category: "WiFi Setup",
    clientType: "Corporate",
    customerType: "Corporate",
    location: "Hassan Bypass Road to Outskirts Factory",
    description: "Established a robust, high-bandwidth point-to-point wireless link between the main administrative office and a remote warehouse located 4 kilometers away.",
    challenge: "Laying optical fiber was impossible due to highway crossing regulations, and 4G internet dongles inside the metal godown had zero cell reception.",
    solution: "Installed 10-meter structural masts on both roofs, mounted Ubiquiti PowerBeam 5AC Gen2 high-gain antennas, aligned them precisely using spectrum analyzers, and bridged the network to provide 300+ Mbps bandwidth.",
    imageBefore: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    imageAfter: "https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
    ],
    tags: ["Ubiquiti PowerBeam", "Point-to-Point Wireless", "4km Link", "Monsoon-Proof Masts"],
    date: "2026-04-18",
    equipmentUsed: "Ubiquiti PowerBeam 5AC Gen2, 10-meter structural masts, outdoor surge protectors",
    brand: "Ubiquiti",
    technicianNotes: "Precision narrow beam paths aligned. Solid 320Mbps stable link. Fully weatherized cables.",
    featured: false,
    seoSlug: "long-range-4km-outdoor-p2p-wireless-bridge-hassan",
    metaTitle: "Long-Range P2P Wireless Bridge Hassan | MIInfotech",
    metaDescription: "Point-to-point wireless installation between main office and outskirts warehouse by MIInfotech. High-speed 4km LoS connection.",
    schema: "{}",
    status: "published"
  }
];

// 3. Local Customer Reviews Data (Real customer reviews are managed dynamically via Supabase testimonials table)
export const REVIEWS_DATA: ReviewItem[] = [];

// 4. FAQs Data
export const FAQS_DATA: FAQItem[] = [
  {
    question: "How do I book Computer Repair in Hassan or Laptop Repair Near Me for doorstep service?",
    answer: "Booking Computer Repair in Hassan or Laptop Repair Near Me with MIInfotech is fast and simple! Simply call or WhatsApp us at +91 9964761624. As an Onsite Service-Area Business, our experienced technician will visit your home, office, or shop in Hassan with diagnostic equipment and spare parts to fix your computer or laptop on the spot.",
    category: "General"
  },
  {
    question: "Which locations in and around Hassan do you cover for doorstep CCTV and IT service?",
    answer: "We cover all major neighborhoods in Hassan including Kuvempu Nagar, Vidya Nagar, Channapatna, Hemavathi Nagar, Hassan Bypass Road, Hassan Industrial Area, Old Town, and Dairy Circle. For CCTV Camera Installation in Hassan and network cabling projects, we also serve neighboring areas like Belur, Sakleshpur, Arasikere, Channarayapatna, Alur, Arkalgud, and Holenarasipura.",
    category: "General"
  },
  {
    question: "What are your visiting charges for Computer Repair and CCTV Repair in Hassan?",
    answer: "Our standard onsite visiting and diagnostic charge is ₹450 within Hassan city limits, and ₹1200 for outskirts regions (₹450 diagnostic fee + ₹750 travel charge). This includes thorough physical inspection and diagnostic checks. Any required hardware replacement or cabling materials are billed separately with full upfront transparency.",
    category: "Pricing"
  },
  {
    question: "Do you offer Hikvision and CP Plus CCTV Camera Installation in Hassan with mobile live streaming?",
    answer: "Yes! We specialize in Hikvision CCTV Installation and CP PLUS CCTV Installation in Hassan. We install 4MP/8MP IP cameras, AHD cameras, 4G SIM cameras, and WiFi cameras. We configure secure mobile remote viewing on your iOS or Android phone so you can monitor live video feeds of your shop or home from anywhere.",
    category: "CCTV"
  },
  {
    question: "Where can I get Printer Repair in Hassan or Printer Cartridge Refilling Near Me?",
    answer: "MIInfotech provides expert onsite Printer Repair in Hassan for Epson EcoTank, HP Smart Tank, and Canon printers. We also offer fast Printer Cartridge Refilling in Hassan with premium micro-fine toner powder for LaserJet printers directly at your office or billing counter.",
    category: "Hardware"
  },
  {
    question: "How long does a typical Laptop Screen Replacement in Hassan take?",
    answer: "Laptop Screen Replacement in Hassan and keyboard replacements are typically completed onsite within 1 to 2 hours using quality replacement screens with warranty. We service Dell, HP, Lenovo, ASUS, and Acer laptops directly at your table.",
    category: "Laptop"
  },
  {
    question: "What is included in an Annual Maintenance Contract (AMC) for Office IT Support in Hassan?",
    answer: "Our AMC packages for Office IT Support in Hassan include: 1) Monthly preventive computer maintenance & hardware cleaning. 2) Unlimited emergency breakdown visits within 2-4 hours. 3) Proactive database backups and antivirus protection. 4) Standby hardware replacements during repairs. 5) Complete CCTV AMC in Hassan for camera grid reliability.",
    category: "AMC"
  },
  {
    question: "Can you handle structured LAN cabling and WiFi Network Installation in Hassan?",
    answer: "Yes, we design complete structured CAT6/CAT6A networking grids, install server racks, configure gigabit switches, and perform WiFi Network Installation in Hassan for corporate offices, schools, and commercial properties.",
    category: "Networking"
  }
];

// 5. Blog Posts Data (Local SEO Clusters)
export const BLOG_DATA: BlogItem[] = [
  {
    id: "blog-1",
    title: "5 Critical Laptop Maintenance Tips for Hassan's Monsoon Season",
    slug: "laptop-maintenance-monsoon-hassan",
    excerpt: "Hassan experiences high humidity during the monsoons. Learn how to protect your expensive laptop from moisture damage, keyboard corrosion, and sudden short circuits.",
    category: "Laptop Care",
    date: "July 12, 2026",
    readTime: "4 mins read",
    keywords: ["Laptop Repair in Hassan", "laptop maintenance", "moisture damage", "onsite IT support"],
    content: `
Hassan, with its beautiful green landscape, experiences heavy rains and high humidity levels during the monsoon season. While the weather is pleasant, it poses a significant threat to electronic devices—especially laptops. High humidity and moisture are the leading hidden causes of sudden motherboard short circuits and key failures in laptops.

Here are 5 vital tips from **Mohammed Ishtiaqh**, founder of **MIInfotech**, to keep your laptop running smoothly during the rainy season:

### 1. Avoid placing laptops directly on damp floors or near windows
Even when windows are closed, cold drafts and rain spray can cause moisture to condense on cold laptop surfaces. Always store your laptop on an elevated wooden desk.

### 2. Never power on a laptop immediately after traveling in rain
If you have commuted in the rain and your laptop bag got damp, do not immediately press the power button! Cold air inside the bag and warm air outside can create micro-droplets of water on internal circuits. Let the laptop dry completely in a well-ventilated room for at least 2-3 hours first.

### 3. Use Silica Gel packets in your laptop bag
Silica gel is an excellent desiccant. Toss 3-4 small packets of silica gel into your laptop sleeve or bag. They will actively absorb ambient moisture, keeping the internal keyboard contacts bone dry.

### 4. Keep your laptop active!
Electrical current generates natural heat. If you leave a laptop shut down and unused for weeks during a highly humid period, moisture can accumulate. Powering it on for at least 30-45 minutes every day helps dissipate trapped moisture through natural component warmth.

### 5. Schedule professional internal cleaning
Over time, your laptop's cooling fan accumulates dust, which behaves like a wet sponge when it absorbs moisture from the air. This damp dust sits on motherboard components, leading to corrosion. 

*Need professional help?* Our **onsite laptop service in Hassan** covers deep internal cleaning, thermal paste replacement, and moisture extraction right at your doorstep. Contact **MIInfotech** on **+91 9964761624** today to schedule a checkup!
    `
  },
  {
    id: "blog-2",
    title: "Why IP CCTV Cameras are Superior to Old Analog CCTV for Hassan Businesses",
    slug: "ip-cctv-vs-analog-hassan-businesses",
    excerpt: "Thinking of installing security cameras in Hassan? Discover why modern IP security systems with POE deliver superior safety, remote viewing, and long-term cost benefits.",
    category: "CCTV & Security",
    date: "June 28, 2026",
    readTime: "5 mins read",
    keywords: ["CCTV Installation in Hassan", "IP Camera Installation in Hassan", "CCTV Camera Repair in Hassan"],
    content: `
Securing your assets is the first step toward business peace of mind. Whether you run a retail shop in **Channapatna**, a medical clinic in **Kuvempu Nagar**, or a factory in the **Hassan Industrial Area**, choosing the right security camera technology is vital.

Traditionally, businesses relied on older analog (AHD/coaxial) CCTV setups. Today, modern **IP (Internet Protocol) CCTV cameras** have become the industry gold standard. Here is why you should choose IP systems for your next security installation:

### 1. Unmatched Resolution & Detail (Zoom Without Blurring)
Analog cameras struggle with resolutions beyond 1080p, often producing blurry license plates or unrecognizable faces when zoomed. IP cameras easily output 4MP, 8MP (4K), and higher. This allows you to zoom in on recorded footage to inspect cash counter transactions or face features with absolute clarity.

### 2. Single-Cable POE Installation (No Power Cable Mess)
Analog systems require two thick cables per camera: a coaxial video cable and a separate 12V power wire. Modern IP cameras use **Power over Ethernet (POE)**. A single thin CAT6 network cable carries both high-definition video signals and electrical power from a central POE switch. This makes installation clean, fast, and eliminates wire clutter.

### 3. Advanced Smart Analytics
IP cameras are essentially small computers. They offer smart features like:
- **Intrusion Detection:** Draws virtual boundary lines that trigger smartphone alerts if crossed after hours.
- **Human & Vehicle Classification:** Prevents false alarms caused by stray animals or wind-blown tree leaves.
- **Smart Night Vision:** Active IR or full-color night vision chips that illuminate dark areas with daylight clarity.

### 4. Seamless Scalability
Adding cameras to an analog DVR is painful; if your 8-channel DVR is full, you must buy a brand new 16-channel DVR to add a 9th camera. With IP cameras, you can easily plug new cameras into any local network switch and quickly register them to your Network Video Recorder (NVR) over the network.

At **MIInfotech**, we plan, mount, and configure custom IP surveillance grids for homes and industries. We configure secure **mobile remote viewing** so you can monitor your property in Hassan from anywhere in the world. 

Contact Mohammed Ishtiaqh at **+91 9964761624** for a free onsite survey and a customized security quote.
    `
  },
  {
    id: "blog-3",
    title: "Demystifying IT AMCs: How Annual Contracts Save Hassan Businesses from Costly Downtime",
    slug: "it-amc-guide-hassan-businesses",
    excerpt: "Frequent computer crashes, printer jams, and network drops disrupt office productivity. Read how a professional Annual Maintenance Contract (AMC) keeps your IT healthy and predictable.",
    category: "IT Support & AMC",
    date: "May 15, 2026",
    readTime: "5 mins read",
    keywords: ["Annual Maintenance Contract in Hassan", "Onsite IT Support in Hassan", "Office Networking in Hassan"],
    content: `
For small offices, schools, and hospitals in Hassan, IT hardware is the backbone of daily operations. When a billing desktop fails, a printer stops printing receipts, or the Wi-Fi router crashes, your business stops. Employees sit idle, customers get frustrated, and you lose valuable sales.

Relying on ad-hoc emergency repair technicians when things break is highly risky. This 'break-fix' model is slow, expensive, and results in unpredictable downtime. 

The professional solution is an **Annual Maintenance Contract (AMC)**. Here is how a custom IT AMC with **MIInfotech** protects your business:

### 1. Proactive Maintenance Over Emergency Panic
Most computer failures are preventable. Under an AMC, we conduct scheduled monthly visits to perform essential system hygiene: deep vacuuming internal dust, replacing dried thermal paste, scanning for malware, clearing temporary cache files, and verifying hard drive health indicators. We resolve bottlenecks *before* they crash your system.

### 2. Direct Cost Predictability
With an AMC, you pay a fixed annual rate per device. There are zero surprise labor costs or surge diagnostic fees. If a computer fails, our emergency troubleshooting visits are completely covered. This makes your annual IT budget fully transparent and predictable.

### 3. Rapid Response Guarantee
When a critical server or network switch drops, you cannot wait days for a technician. Under our AMC terms, we guarantee priority onsite response times between **2 to 4 hours** within Hassan city limits, ensuring your work resumes as quickly as possible.

### 4. Automated Backup Safeguards
Many businesses lose critical accounting and client records because backups were never verified. Our AMC services check and manage scheduled automated backups to safe local drives or secure cloud storage, guarding you against hardware failures or ransomware attacks.

Our customized **IT AMCs in Hassan** cover desktops, laptops, printers, networking switches, UPS backups, and CCTV systems under a single contract. Let **Mohammed Ishtiaqh** and the MIInfotech team handle your technical worries while you focus on growing your business.

Call us on **+91 9964761624** or write to us at **miinfotech.support@gmail.com** to discuss a customized IT maintenance plan for your office today!
    `
  }
];

// 6. Supported Brands list
export const SUPPORTED_BRANDS = [
  { name: "Dell", logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=150" },
  { name: "HP", logo: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=150" },
  { name: "Lenovo", logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=150" },
  { name: "Hikvision", logo: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=150" },
  { name: "CP Plus", logo: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=150" },
  { name: "Epson", logo: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=150" },
  { name: "Canon", logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150" },
  { name: "TP-Link", logo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=150" },
  { name: "APC", logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=150" },
  { name: "Panasonic", logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150" }
];

// 7. Hassan Areas list for Onsite Calculator
export const HASSAN_AREAS = [
  "Kuvempu Nagar",
  "Vidya Nagar",
  "Channapatna",
  "Hemavathi Nagar",
  "Hassan Old Town",
  "Hassan Bypass Road",
  "Dairy Circle",
  "Hassan Industrial Area",
  "Arasikere (Outskirts)",
  "Belur (Outskirts)",
  "Sakleshpur (Outskirts)",
  "Channarayapatna (Outskirts)",
  "Alur (Outskirts)",
  "Holenarasipura (Outskirts)",
  "Arkalgud (Outskirts)"
];

// 8. Service types for Onsite Calculator
export const CALCULATOR_SERVICES = [
  { id: "comp-diag", name: "Computer Onsite Diagnosis", basePrice: 450, category: "computer" },
  { id: "laptop-diag", name: "Laptop Onsite Diagnosis", basePrice: 750, category: "laptop" },
  { id: "win-install", name: "Windows Installation & Setup (Fresh)", basePrice: 850, category: "computer" },
  { id: "ssd-install", name: "SSD Upgrade + OS Installation", basePrice: 950, category: "laptop" },
  { id: "virus-clean", name: "Malware Cleaning & Premium AV Setup", basePrice: 600, category: "computer" },
  { id: "printer-diag", name: "Printer Network Setup / Repair Check", basePrice: 750, category: "printer" },
  { id: "cctv-install", name: "CCTV Signal Camera Repair & Service (Per Camera)", basePrice: 500, category: "cctv" },
  { id: "cctv-remote", name: "CCTV DVR/NVR Mobile Remote App Sync", basePrice: 750, category: "cctv" },
  { id: "net-trouble", name: "Wi-Fi Router Config & Dead-zone Tuning", basePrice: 500, category: "networking" },
  { id: "ups-service", name: "UPS Diagnostic & Battery Load Test", basePrice: 500, category: "ups" }
];
