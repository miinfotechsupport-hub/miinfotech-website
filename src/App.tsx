import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServiceExplorer from "./components/ServiceExplorer";
import ProjectsGallery from "./components/ProjectsGallery";
import ReviewsFAQ from "./components/ReviewsFAQ";
import ContactSection from "./components/ContactSection";
import SEOPanel from "./components/SEOPanel";
import FloatingCTABar from "./components/FloatingCTABar";
import TermsConditions from "./components/TermsConditions";
import ProductsShowcase from "./components/ProductsShowcase";
import LogoIcon from "./components/LogoIcon";
import ServiceLandingPage from "./components/ServiceLandingPage";
import ReviewAssistant from "./components/ReviewAssistant";
import { GoogleReviewsSection } from "./components/GoogleReviewsSection";

const AdminPanel = lazy(() => import("./components/AdminPanel"));
import { supabase, useSettings } from "./lib/supabase";
import { SITE_URL } from "./lib/config";
import { BLOG_DATA, BlogItem, SERVICES_DATA } from "./types";
import { Cpu, Mail, MapPin, Phone, MessageSquare, Facebook, Instagram, ShieldCheck, HeartHandshake, BookOpen, Clock, ArrowLeft, ArrowRight, CornerDownRight } from "lucide-react";

const STATIC_PROJECT_SLUGS = new Set([
  "commercial-cat6-cabling-server-rack-installation-hassan",
  "comprehensive-ip-cctv-surveillance-grid-installation-hassan",
  "15-station-college-computer-lab-setup-hassan",
  "long-range-4km-outdoor-p2p-wireless-bridge-hassan"
]);

const SERVICE_PATH_MAP: { [key: string]: string } = {
  "/computer-repair-hassan": "computer",
  "/laptop-repair-hassan": "laptop",
  "/cctv-installation-hassan": "cctv",
  "/printer-repair-hassan": "printer",
  "/networking-services-hassan": "networking",
  "/biometric-installation-hassan": "biometric",
  "/windows-installation-hassan": "windows",
  "/data-recovery-hassan": "data-recovery",
  "/ups-installation-repair-hassan": "ups",
  "/intercom-systems-hassan": "intercom",
  "/fire-alarm-systems-hassan": "firealarm",
  "/p2p-wireless-installation-hassan": "p2p",
  "/it-support-amc-hassan": "amc",
};

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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const settings = useSettings();

  const [blogsList, setBlogsList] = useState<any[]>(BLOG_DATA);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase.from("products").select("*").eq("enabled", true).order("order", { ascending: true });
        if (data && data.length > 0) {
          setProductsList(data);
        }
      } catch (err) {
        console.error("Failed to fetch products in App.tsx:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setBlogsList(data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs from database:", err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase.from("projects").select("*").eq("status", "published");
        if (data) {
          setProjectsList(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects in App.tsx:", err);
      }
    };
    fetchProjects();

    const handleProjectsChange = () => {
      fetchProjects();
    };
    window.addEventListener("mi_projects_change", handleProjectsChange);
    return () => {
      window.removeEventListener("mi_projects_change", handleProjectsChange);
    };
  }, []);

  // Synchronize path and hash routing with state for premium SEO deep-linking
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // 1. Check if the current pathname is a clean SEO-friendly service route
      if (SERVICE_PATH_MAP[path]) {
        setSelectedServiceId(SERVICE_PATH_MAP[path]);
        setSelectedBlogSlug(null);
        setActiveTab("services");
        return;
      }

      // 1b. Check if the current pathname is a clean SEO-friendly blog route
      if (path.startsWith("/blog/")) {
        const slug = path.replace("/blog/", "");
        setSelectedBlogSlug(slug);
        setSelectedServiceId(null);
        setActiveTab("blog");
        return;
      }

      // 1c. Check if the current pathname is a clean SEO-friendly project route
      if (path.startsWith("/project/")) {
        setSelectedBlogSlug(null);
        setSelectedServiceId(null);
        setActiveTab("projects");
        return;
      }

      // 2. Fallback to hash-based routing
      if (hash.startsWith("#service/")) {
        const id = hash.replace("#service/", "");
        setSelectedServiceId(id);
        setSelectedBlogSlug(null);
      } else {
        setSelectedServiceId(null);
        if (hash === "#services" || path === "/services") {
          setActiveTab("services");
        } else if (hash === "#projects" || path === "/projects") {
          setActiveTab("projects");
        } else if (hash === "#blog" || path === "/blog") {
          setActiveTab("blog");
        } else if (hash === "#faqs" || path === "/faqs") {
          setActiveTab("faqs");
        } else if (hash === "#contact" || path === "/contact") {
          setActiveTab("contact");
        } else if (hash === "#terms" || path === "/terms") {
          setActiveTab("terms");
        } else if (hash === "#gallery" || path === "/gallery") {
          setActiveTab("gallery");
        } else if (hash === "#products" || path === "/products") {
          setActiveTab("products");
        } else if (hash === "#review" || path === "/review") {
          setActiveTab("review");
        } else if (hash === "#admin" || hash.startsWith("#admin") || path === "/admin") {
          setActiveTab("admin");
        } else {
          setActiveTab("home");
        }
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Comprehensive, Dynamic SEO & Meta Manager
  useEffect(() => {
    let title = "CCTV Installation & Computer Repair in Hassan | MIInfotech";
    let description = "Doorstep Computer Repair in Hassan & CCTV Installation in Hassan. Doorstep Laptop Repair, Printer Service, & IT support by Mohammed Ishtiaqh. Call +91 9964761624.";
    let keywords = "CCTV Installation in Hassan, CCTV Camera Installation in Hassan, CCTV Repair in Hassan, Computer Repair in Hassan, Computer Service Center in Hassan, Laptop Repair in Hassan, Printer Repair in Hassan, Computer Repair Near Me, Laptop Repair Near Me, Printer Repair Near Me, CCTV Installation Near Me";
    let canonicalUrl = SITE_URL;
    const imageUrl = `${SITE_URL}/images/miinfotech-logo.png`;

    // Extract potential project slug from path
    const currentPath = window.location.pathname;
    let selectedProjectSlug: string | null = null;
    if (currentPath.startsWith("/project/")) {
      selectedProjectSlug = currentPath.replace("/project/", "");
    }

    // 1. Check if specific Service Landing Page is active
    if (selectedServiceId) {
      const serviceObj = SERVICES_DATA.find(s => s.id === selectedServiceId);
      if (serviceObj) {
        title = `${serviceObj.name} in Hassan | ${serviceObj.tagline} | MIInfotech`;
        description = `${serviceObj.description} Diagnostic visits in Hassan start at ₹450 with quality warrantied parts.`;
        keywords = `${serviceObj.seoKeywords?.join(", ")}, Computer Repair in Hassan, CCTV Installation in Hassan, Laptop Repair in Hassan`;
        const path = SERVICE_ID_TO_PATH[selectedServiceId];
        if (path) {
          canonicalUrl = `${SITE_URL}${path}`;
        }
      }
    }
    // 2. Check if specific Blog article is active
    else if (selectedBlogSlug) {
      const activeBlog = blogsList.find(b => b.slug === selectedBlogSlug);
      if (activeBlog) {
        title = `${activeBlog.title} | Tech Guide by MIInfotech Hassan`;
        description = `${activeBlog.excerpt || "Read our technical diagnostics and IT advice."} Authored by Mohammed Ishtiaqh at MIInfotech Hassan.`;
        keywords = `MIInfotech Blog, IT Tips Hassan, ${activeBlog.category} Hassan, ${activeBlog.title}`;
        canonicalUrl = `${SITE_URL}/blog/${activeBlog.slug}`;
      }
    }
    // 2b. Check if specific Project is active
    else if (selectedProjectSlug) {
      const activeProject = projectsList.find(p => p.seoSlug === selectedProjectSlug || (p.id && p.id.toString() === selectedProjectSlug));
      if (activeProject) {
        title = activeProject.metaTitle || `${activeProject.title} in Hassan | MIInfotech`;
        description = activeProject.metaDescription || `${activeProject.description?.substring(0, 150)}... Doorstep ${activeProject.category || "IT Service"} by MIInfotech in Hassan.`;
        keywords = `${activeProject.title}, ${activeProject.category} Hassan, doorstep ${activeProject.category || "service"}, MIInfotech hassan`;
        canonicalUrl = `${SITE_URL}/project/${activeProject.seoSlug}`;
      }
    }
    // 3. Fallback to active tab
    else {
      if (activeTab === "services") {
        title = "IT Services & CCTV Setup Catalog in Hassan | MIInfotech";
        description = "Browse our full catalog of onsite IT and security services in Hassan, Karnataka: Laptop repairs, WiFi setup, desktop formatting, network cabling, and biometric installations.";
        keywords = "Onsite IT services Hassan, computer service catalog, CCTV services Hassan, laptop repairs";
        canonicalUrl = `${SITE_URL}/services`;
      } else if (activeTab === "projects") {
        title = "Real Completed Works & CCTV Projects in Hassan | MIInfotech";
        description = "Browse our portfolio of real completed onsite IT support, network cabling, and Hikvision CCTV camera installations in Hassan city and surrounding areas.";
        keywords = "completed projects, CCTV portfolio Hassan, IT case studies Hassan, real onsite work";
        canonicalUrl = `${SITE_URL}/projects`;
      } else if (activeTab === "blog") {
        title = "MIInfotech Knowledge Hub | IT Diagnostics & Tech Guides";
        description = "Expert guides, local SEO tech resources, and computer diagnostics written by founder Mohammed Ishtiaqh for businesses and residents in Hassan, Karnataka.";
        keywords = "tech blog Hassan, computer repair tips, IT guide Hassan, diagnostic tips";
        canonicalUrl = `${SITE_URL}/blog`;
      } else if (activeTab === "faqs") {
        title = "Help & Frequently Asked Questions | MIInfotech Hassan";
        description = "Find answers to frequently asked questions about doorstep PC repair pricing, service locations, turnaround time, and warranties in Hassan, Karnataka.";
        keywords = "IT FAQs Hassan, computer repair pricing Hassan, CCTV warranty";
        canonicalUrl = `${SITE_URL}/faqs`;
      } else if (activeTab === "contact") {
        title = "Get a Free Onsite Estimate & Callout | MIInfotech Hassan";
        description = "Book a doorstep diagnostics visit or CCTV quote in Hassan, Karnataka. Call +91 99647 61624 or fill out our quick estimate calculator.";
        keywords = "contact MIInfotech, book computer repair Hassan, request CCTV quote";
        canonicalUrl = `${SITE_URL}/contact`;
      } else if (activeTab === "terms") {
        title = "Terms of Service & Onsite Warranty Policy | MIInfotech";
        description = "Read the Terms and Conditions and warranty service guidelines for doorstep repairs and CCTV installation services provided by MIInfotech in Hassan.";
        keywords = "terms and conditions, MIInfotech warranty, service agreement";
        canonicalUrl = `${SITE_URL}/terms`;
      } else if (activeTab === "gallery") {
        title = "Onsite Project Gallery | MIInfotech Hassan";
        description = "Visual gallery of doorstep IT support, server rack installations, and CCTV camera projects completed in Hassan, Karnataka.";
        keywords = "IT project gallery Hassan, CCTV installation photos Hassan, server rack setup photos";
        canonicalUrl = `${SITE_URL}/gallery`;
      } else if (activeTab === "products") {
        title = "IT Hardware & CCTV Products Catalog | MIInfotech Hassan";
        description = "Browse CCTV cameras, Wi-Fi routers, SSDs, and IT hardware available for doorstep installation in Hassan, Karnataka.";
        keywords = "CCTV camera price Hassan, Wi-Fi router Hassan, SSD upgrade price Hassan, IT hardware catalog";
        canonicalUrl = `${SITE_URL}/products`;
      } else if (activeTab === "review") {
        title = "Share Your Service Experience | MIInfotech Google Review Assistant";
        description = "Share your genuine technical service experience with MIInfotech on Google.";
        keywords = "MIInfotech review, customer feedback, Google review";
        canonicalUrl = `${SITE_URL}/review`;
      }
    }

    // Update document title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attrType: "name" | "property", attrVal: string, contentStr: string) => {
      const selector = attrType === "property" ? `meta[property='${attrVal}']` : `meta[name='${attrVal}']`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrType, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", contentStr);
    };

    // Set Meta Description, Keywords, Robots, Author
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", activeTab === "review" ? "noindex, follow" : "index, follow");
    setMetaTag("name", "author", "Mohammed Ishtiaqh (MIInfotech)");

    // Set Open Graph tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");

    // Set Twitter Card tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);

    // Set Canonical URL
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // Dynamic JSON-LD Structured Data Schema Ingestion
    const prevSchema = document.getElementById("dynamic-seo-schema");
    if (prevSchema) {
      prevSchema.remove();
    }

    let schemaObject: any = null;

    if (selectedProjectSlug && !STATIC_PROJECT_SLUGS.has(selectedProjectSlug)) {
      const activeProject = projectsList.find(p => p.seoSlug === selectedProjectSlug || (p.id && p.id.toString() === selectedProjectSlug));
      if (activeProject && activeProject.schema) {
        try {
          schemaObject = JSON.parse(activeProject.schema);
        } catch (e) {
          console.error("Failed to parse project schema JSON:", e);
        }
      }
    }

    if (schemaObject) {
      const script = document.createElement("script");
      script.id = "dynamic-seo-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaObject);
      document.head.appendChild(script);
    }

  }, [selectedServiceId, selectedBlogSlug, activeTab, blogsList, projectsList]);

  // Triggered when clicking "Book Onsite Support" or "Request Visit"
  const handleRequestOnsiteVisit = (serviceCategoryName?: string) => {
    setActiveTab("contact");
    setTimeout(() => {
      const targetElement = document.getElementById("quote-calculator") || document.getElementById("contact-section");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleExploreServices = () => {
    setActiveTab("services");
    setTimeout(() => {
      const element = document.getElementById("services-section");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Find currently opened blog article
  const activeBlog = blogsList.find((b) => b.slug === selectedBlogSlug);

  if (activeTab === "admin") {
    return (
      <Suspense fallback={
        <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <p className="text-sm text-slate-400 font-mono tracking-wider animate-pulse">Initializing Secure Admin Workspace...</p>
        </div>
      }>
        <AdminPanel onClose={() => { setActiveTab("home"); window.location.hash = ""; }} />
      </Suspense>
    );
  }

  if (activeTab === "review") {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <ReviewAssistant />
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <SEOPanel
        activeTab={activeTab}
        selectedServiceId={selectedServiceId}
        selectedBlogSlug={selectedBlogSlug}
      />
      {/* Sticky responsive Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedBlogSlug(null); // Reset blog read state on nav swap
      }} />

      {/* Main Dynamic View switcher */}
      <main className="flex-grow">
        {selectedServiceId ? (
          <ServiceLandingPage
            serviceId={selectedServiceId}
            onBackClick={() => {
              setSelectedServiceId(null);
              window.history.pushState(null, "", "/");
              window.dispatchEvent(new Event("popstate"));
            }}
            onBookClick={handleRequestOnsiteVisit}
            onNavigateToService={(id) => {
              setSelectedServiceId(id);
              const path = SERVICE_ID_TO_PATH[id];
              if (path) {
                window.history.pushState(null, "", path);
                window.dispatchEvent(new Event("popstate"));
              } else {
                window.location.hash = `service/${id}`;
              }
            }}
          />
        ) : (
          <>
            {/* VIEW 1: HOME PAGE (Exhaustive, rich lead funnel) */}
            {activeTab === "home" && (
          <div className="animate-fadeIn">
            {/* 1. High-Impact Hero with Live Stats */}
            <Hero 
              onQuoteClick={() => handleRequestOnsiteVisit()} 
              onExploreServicesClick={handleExploreServices}
            />

            {/* 2. Services Directory */}
            <ServiceExplorer 
              onBookClick={handleRequestOnsiteVisit} 
              onViewFullPage={(id) => {
                const path = SERVICE_ID_TO_PATH[id];
                if (path) {
                  window.history.pushState(null, "", path);
                  window.dispatchEvent(new Event("popstate"));
                } else {
                  window.location.hash = `service/${id}`;
                }
              }}
            />

            {/* 3. Why Choose MIInfotech & Trust indicators */}
            <section id="why-choose-section" className="py-16 bg-slate-900/40 border-b border-slate-900 text-left">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12 animate-fadeIn">
                  <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Unmatched Local Service</span>
                  <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white mt-1 tracking-tight">Why Choose MIInfotech</h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">Hassan's trusted doorstep computer repair, custom networking, and CCTV surveillance specialist.</p>
                </div>

                {/* Trust Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fadeIn">
                  <div className="flex gap-4">
                    <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20 h-fit">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg">Hassan Area Experts</h3>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                        Deep local understanding of power grids, internet dead spots, and monsoon humidity patterns. Serving Kuvempu Nagar, Vidya Nagar, Channapatna, and outskirts.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20 h-fit">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg">SAB Doorstep Model</h3>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                        No carrying heavy desktops or systems. We perform diagnostic scans and component level swap-outs right in front of you with zero transport risk.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20 h-fit">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg">Premium Spares Only</h3>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                        We never compromise on cheap duplicate components. Sourcing genuine Dell, HP, Hikvision, and Brother spares with firm replacement warranties.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Industries we serve nested */}
                <div className="border-t border-slate-900 pt-16">
                  <div className="text-center max-w-2xl mx-auto mb-10 animate-fadeIn">
                    <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Comprehensive Domain Experience</span>
                    <h3 className="font-sans text-xl sm:text-2xl font-extrabold text-white mt-1">Industries We Protect & Service</h3>
                    <p className="text-slate-400 text-xs leading-normal mt-1">Providing professional network wiring, CCTV layouts, printer backup configurations, and computer help desks.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {[
                      { name: "Homes & Residential", desc: "Doorstep PC/laptop repairs and smart Wi-Fi cameras." },
                      { name: "Offices & SMEs", desc: "Active network wiring, EPABX, and desktop monthly AMCs." },
                      { name: "Schools & Labs", desc: "Structured LAN lab setups, system upgrades, and shared printers." },
                      { name: "Hospitals & Clinics", desc: "Secure patient file servers, network optimization, and CCTV monitoring." },
                      { name: "Shops & Supermarkets", desc: "Billing desktop support, barcode printer setups, and visual surveillance." },
                      { name: "Hotels & Lodges", desc: "Mesh Wi-Fi coverage across floors and robust fire alarms panels." },
                      { name: "Warehouses & Godowns", desc: "Long-distance wireless P2P bridges and heavy metal enclosures." },
                      { name: "Industries & Factories", desc: "High-capacity online UPS back-ups and fiber conversions." }
                    ].map((ind, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors">
                        <span className="text-white font-bold text-sm tracking-tight">{ind.name}</span>
                        <p className="text-[11px] text-slate-400 leading-normal mt-2">{ind.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Our Onsite Doorstep Process timeline */}
            <ReviewsFAQ showOnly="process" />

            {/* 4. Latest Completed Projects */}
            <ProjectsGallery limit={6} onViewAllClick={() => {
              setActiveTab("projects");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} />

            {/* 5. Verified Google Business Profile Reviews */}
            <GoogleReviewsSection />

            {/* 6. Brands We Support */}
            <ContactSection showOnly="brands" />

            {/* 7. Service Areas */}
            <section id="service-areas-section" className="py-16 bg-slate-950 text-left border-b border-slate-900">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10 animate-fadeIn">
                  <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Local Reach</span>
                  <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                    Doorstep Service Across Hassan & Nearby Areas
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    No need to visit a physical shop. Mohammed Ishtiaqh provides rapid doorstep diagnostics, installations, and repairs in these key locations:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Kuvempu Nagar", landmark: "Founder's Base" },
                    { name: "Vidya Nagar", landmark: "Premium Coverage" },
                    { name: "Channapatna", landmark: "Rapid Doorstep Visit" },
                    { name: "Hemavathi Nagar", landmark: "CCTV & IT Setup" },
                    { name: "KR Puram", landmark: "Same-Day Diagnostics" },
                    { name: "Salagame Road", landmark: "Network Installations" },
                    { name: "Arasikere", landmark: "Nearby Town (Scheduled)" },
                    { name: "Channarayapatna", landmark: "Nearby Town (Scheduled)" },
                    { name: "Sakleshpur", landmark: "Nearby Town (Scheduled)" },
                    { name: "Belur", landmark: "Nearby Town (Scheduled)" },
                    { name: "Holenarasipura", landmark: "Nearby Town (Scheduled)" },
                    { name: "Alur", landmark: "Nearby Town (Scheduled)" }
                  ].map((area, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-start gap-3 hover:border-blue-500/40 transition-colors animate-fadeIn"
                    >
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-bold text-xs sm:text-sm block">{area.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{area.landmark}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. Frequently Asked Questions */}
            <ReviewsFAQ showOnly="faqs" />

            {/* 9. Conversion Lead Contact forms */}
            <ContactSection showOnly="contact" />

            {/* Semantic SEO & Schema copies (script injection only) */}
            <SEOPanel />
          </div>
        )}

        {/* VIEW 2: DEDICATED SERVICES VIEW */}
        {activeTab === "services" && (
          <div className="animate-fadeIn pt-16">
            <ServiceExplorer 
              onBookClick={handleRequestOnsiteVisit} 
              onViewFullPage={(id) => {
                const path = SERVICE_ID_TO_PATH[id];
                if (path) {
                  window.history.pushState(null, "", path);
                  window.dispatchEvent(new Event("popstate"));
                } else {
                  window.location.hash = `service/${id}`;
                }
              }}
            />
            <section className="py-16 bg-slate-950 border-t border-slate-900">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Hassan Doorstep IT Care</span>
                <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">Need Onsite Hardware Setup or Repair?</h3>
                <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
                  Get professional help with computers, laptops, CCTV installations, network cabling, or EPABX systems. Our senior tech engineer will visit your premises anywhere in Hassan for complete diagnosis and setup.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleRequestOnsiteVisit()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request Onsite Doorstep Visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="tel:+919964761624"
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Call +91 99647 61624</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 3: DEDICATED PROJECTS VIEW */}
        {activeTab === "projects" && (
          <div className="animate-fadeIn pt-16">
            <ProjectsGallery />
          </div>
        )}

        {/* VIEW 4: LOCAL SEO BLOG SECTION (Expandable tips) */}
        {activeTab === "blog" && (
          <section className="py-24 md:py-32 bg-slate-950 text-left min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
              
              {!selectedBlogSlug ? (
                // Blog Listing
                <div className="space-y-12">
                  <div className="border-b border-slate-800 pb-6">
                    <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Tech Tips & Expert Guides</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">MIInfotech Knowledge Center</h1>
                    <p className="text-slate-400 text-sm mt-2">
                      Practical diagnostic guides and tech insights authored by **Mohammed Ishtiaqh** to help Hassan businesses make informed IT decisions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {blogsList.map((article) => (
                      <div 
                        key={article.id}
                        className="bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-3xl p-6 sm:p-8 transition-all flex flex-col justify-between gap-4 shadow-lg cursor-pointer"
                        onClick={() => {
                          setSelectedBlogSlug(article.slug);
                          window.history.pushState(null, "", `/blog/${article.slug}`);
                          window.dispatchEvent(new Event("popstate"));
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                            <span className="bg-blue-600/10 border border-blue-500/20 px-2 rounded text-blue-400 font-bold uppercase tracking-wider text-[10px]">
                              {article.category}
                            </span>
                            <span>•</span>
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors">
                            {article.title}
                          </h2>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-mono font-bold pt-2">
                          <span>Read Full Diagnostic Guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Article Detail Reader
                <div className="space-y-8 animate-fadeIn">
                  <button
                    onClick={() => {
                      setSelectedBlogSlug(null);
                      window.history.pushState(null, "", "/blog");
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors font-mono"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Knowledge Hub</span>
                  </button>

                  {activeBlog ? (
                    <article className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
                      <div className="space-y-3 border-b border-slate-800 pb-6">
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          <span className="bg-blue-500/10 border border-blue-500/10 px-2.5 py-0.5 rounded text-blue-400 font-bold uppercase text-[9px]">
                            {activeBlog.category}
                          </span>
                          <span>•</span>
                          <span>{activeBlog.date}</span>
                          <span>•</span>
                          <span>{activeBlog.readTime}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight">
                          {activeBlog.title}
                        </h1>
                        <div className="flex items-center gap-2 pt-2">
                          <div className="p-1 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[10px]">
                            Author:
                          </div>
                          <span className="text-xs text-white font-bold">Mohammed Ishtiaqh (Founder, MIInfotech)</span>
                        </div>
                      </div>

                      {/* Diagnostic Markdown Rich Render Container */}
                      <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
                        {activeBlog.content.split("\n\n").map((para, pIdx) => {
                          if (para.trim().startsWith("###")) {
                            return <h3 key={pIdx} className="text-white font-extrabold text-base sm:text-lg pt-4 pb-1 font-sans">{para.replace("### ", "")}</h3>;
                          }
                          if (para.trim().startsWith("-") || para.trim().startsWith("*")) {
                            return (
                              <ul key={pIdx} className="space-y-2.5 pl-4">
                                {para.split("\n").map((li, lidx) => (
                                  <li key={lidx} className="flex items-start gap-2.5">
                                    <span className="text-blue-400 select-none mt-1">•</span>
                                    <span>{li.replace(/^[-*]\s+/, "")}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={pIdx} className="my-3 text-slate-300 leading-relaxed">{para}</p>;
                        })}
                      </div>

                      {/* Contextual CTA on reading blog */}
                      <div className="border-t border-slate-800 pt-6 mt-10 bg-slate-950/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <h4 className="text-white font-bold text-sm">Need a direct physical audit or repair?</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Book Mohammed's doorstep diagnostics call in Hassan today.</p>
                        </div>
                        <button
                          onClick={() => handleRequestOnsiteVisit(activeBlog.category)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer transition-colors"
                        >
                          Request Doorstep Diagnostics
                        </button>
                      </div>
                    </article>
                  ) : (
                    <p className="text-slate-400">Diagnostic article not found.</p>
                  )}
                </div>
              )}

            </div>
          </section>
        )}

        {/* VIEW 5: DEDICATED FAQS VIEW */}
        {activeTab === "faqs" && (
          <div className="animate-fadeIn pt-16">
            <ReviewsFAQ />
          </div>
        )}

        {/* VIEW 6: DEDICATED CONTACT VIEW */}
        {activeTab === "contact" && (
          <div className="animate-fadeIn pt-16">
            <ContactSection />
          </div>
        )}

        {/* VIEW 7: TERMS & CONDITIONS VIEW */}
        {activeTab === "terms" && (
          <div className="animate-fadeIn pt-16">
            <TermsConditions />
          </div>
        )}

        {/* VIEW 8: GALLERY VIEW */}
        {activeTab === "gallery" && (
          <div className="animate-fadeIn pt-16">
            <ProjectsGallery />
          </div>
        )}

        {/* VIEW 9: PRODUCTS CATALOG VIEW */}
        {activeTab === "products" && (
          <div className="animate-fadeIn pt-16">
            <ProductsShowcase products={productsList} onRequestInstallation={handleRequestOnsiteVisit} />
          </div>
        )}
          </>
        )}
      </main>

      {/* FOOTER AREA - Multi-column, Corporate Technology design */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 text-xs pt-4 pb-14 md:pt-16 md:pb-16 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
            
            {/* Brand details col */}
            <div className="md:col-span-4 space-y-2 md:space-y-4">
              <div className="flex items-center gap-2.5">
                {settings?.logo_url ? (
                  <div className="bg-white p-1 rounded-xl shadow-md border border-slate-200 w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-105 overflow-hidden shrink-0">
                    <img 
                      src={settings.logo_url} 
                      alt={settings?.business_name || "Logo"} 
                      loading="lazy"
                      className="h-full w-full object-contain rounded-lg" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-blue-500 shadow-md shrink-0">
                    <LogoIcon className="w-8 h-8 text-blue-500" />
                  </div>
                )}
                <div>
                  <span className="font-sans font-bold text-lg text-white tracking-tight">
                    {settings?.business_name || "MIINFOTECH"}
                  </span>
                  <p className="text-[9px] text-blue-400 font-bold font-mono tracking-wider uppercase mt-0.5">
                    Computer • Laptop • CCTV • Networking
                  </p>
                </div>
              </div>
              
              <p className="text-slate-400 leading-relaxed text-xs">
                {settings?.footer_about || "Professional Onsite IT Infrastructure & Security Solutions in Hassan, Karnataka. Founded by Mohammed Ishtiaqh, we carry diagnostics toolkits and diagnostic replacement components straight to you."}
              </p>

              <div className="text-[10px] text-slate-500 space-y-1 italic">
                <p>● Service Model: Service-Area Business (SAB)</p>
                <p>● Physical Walk-in Address: No walk-in retail store</p>
                <p>● Service Dispatch limits: {settings?.address_physical || "Hassan, Karnataka"} & outskirts</p>
              </div>
            </div>

            {/* Quick Links col */}
            <div className="md:col-span-3 space-y-2 md:space-y-4 text-left">
              <h4 className="text-white font-mono uppercase tracking-wider text-[11px] font-bold">Quick Navigation</h4>
              <ul className="space-y-1.5 md:space-y-2 font-medium">
                {[
                  { id: "home", label: "Home Base" },
                  { id: "services", label: "Service Catalog" },
                  { id: "projects", label: "Real Work Portfolio" },
                  { id: "products", label: "Hardware & CCTV Catalog" },
                  { id: "gallery", label: "Onsite Photo Gallery" },
                  { id: "blog", label: "Diagnostic Tips (Blog)" },
                  { id: "faqs", label: "Help & FAQs" },
                  { id: "review", label: "⭐ Share Service Review" },
                  { id: "contact", label: "Contact & Quote Form" },
                  { id: "terms", label: "Terms & Conditions" }
                ].map((l) => (
                  <li key={l.id}>
                    <button 
                      onClick={() => {
                        setActiveTab(l.id);
                        setSelectedBlogSlug(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} 
                      className="hover:text-blue-400 transition-colors cursor-pointer text-slate-400 text-left"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Contacts col */}
            <div className="md:col-span-5 space-y-2 md:space-y-4">
              <h4 className="text-white font-mono uppercase tracking-wider text-[11px] font-bold">Direct Inquiries</h4>
              
              <div className="space-y-1.5 md:space-y-2 text-slate-400">
                <p className="flex items-center gap-2">
                  <span className="text-blue-500">📍</span>
                  <span>Onsite Dispatch: {settings?.address_physical || "Hassan City, Karnataka, India"}</span>
                </p>
                <p className="flex items-center gap-2 font-semibold">
                  <span className="text-blue-500">📞</span>
                  <a href={`tel:${settings?.phone_primary?.replace(/\s+/g, "") || "+919964761624"}`} className="hover:text-white transition-colors">
                    {settings?.phone_primary || "+91 99647 61624"}
                  </a>
                </p>
                <p className="flex items-center gap-2 font-semibold text-emerald-400">
                  <span className="text-emerald-500">💬</span>
                  <a 
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, "") || "919964761624"}?text=Hi%20${encodeURIComponent(settings?.business_name || "MIInfotech")}%2C%20I%20would%20like%20to%20enquire%20about%20your%20doorstep%20IT%20services.%20Thanks!`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-emerald-300 transition-colors"
                  >
                    WhatsApp Chat (Pre-filled Inquiry)
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-500">✉️</span>
                  <a href={`mailto:${settings?.email_support || "miinfotech.support@gmail.com"}`} className="hover:text-white transition-colors">
                    {settings?.email_support || "miinfotech.support@gmail.com"}
                  </a>
                </p>
              </div>

              {/* Conversion Badges */}
              <div className="flex gap-2 pt-2 border-t border-slate-900 flex-wrap">
                <a 
                  href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, "") || "919964761624"}?text=Hi%20${encodeURIComponent(settings?.business_name || "MIInfotech")}%2C%20I%20would%20like%20to%20enquire%20about%20your%20doorstep%20IT%20services.%20Thanks!`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-emerald-950/30 border border-emerald-900/80 text-[10px] text-emerald-400 font-mono py-1.5 px-3 rounded hover:border-emerald-500 hover:bg-emerald-950/60 transition-all flex items-center gap-1 cursor-pointer"
                >
                  💬 Chat on WhatsApp
                </a>
                <a 
                  href="/review"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("review");
                    window.history.pushState(null, "", "/review");
                    window.dispatchEvent(new Event("popstate"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-blue-950/40 border border-blue-850 text-[10px] text-blue-400 font-mono py-1.5 px-3 rounded hover:border-blue-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  ⭐ Share Service Review
                </a>
                <a 
                  href="https://share.google/26j3KMLobkBNnH89a" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono py-1.5 px-3 rounded hover:border-blue-500 transition-all flex items-center gap-1 cursor-pointer"
                >
                  🌐 Google Business Profile
                </a>
                <a 
                  href="https://www.instagram.com/miinfotech.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono py-1.5 px-3 rounded hover:border-purple-500 transition-all flex items-center gap-1 cursor-pointer"
                >
                  📷 Instagram
                </a>
                <a 
                  href="https://www.facebook.com/share/18nFLrKJ1a/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono py-1.5 px-3 rounded hover:border-blue-600 transition-all flex items-center gap-1 cursor-pointer"
                >
                  👍 Facebook
                </a>
              </div>
            </div>

          </div>

          {/* Legal copyrights section */}
          <div className="border-t border-slate-900 pt-3 mt-4 md:pt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} MIInfotech. All rights reserved.
              <span className="text-slate-600 font-mono ml-2">Built for Mohammed Ishtiaqh.</span>
            </div>
            
            <div className="flex gap-4 items-center flex-wrap text-slate-500">
              <button
                onClick={() => {
                  setActiveTab("terms");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-blue-500 transition-colors cursor-pointer text-slate-400 font-medium"
              >
                Terms & Conditions
              </button>
              <span className="text-slate-700">•</span>
              <span>Hassan, KA Local SEO Authority</span>
              <span className="text-slate-700">•</span>
              <span>Onsite IT & CCTV</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Dialers & Quick WhatsApp trigger HUD */}
      <FloatingCTABar />
    </div>
  );
}
