import { useEffect } from "react";
import { SITE_URL } from "../lib/config";

interface SEOPanelProps {
  activeTab?: string;
  selectedServiceId?: string | null;
  selectedBlogSlug?: string | null;
  selectedProjectSlug?: string | null;
}

// Static routes covered 100% by build-time pre-rendering (build-seo.js)
const STATIC_PROJECT_SLUGS = new Set([
  "commercial-cat6-cabling-server-rack-installation-hassan",
  "comprehensive-ip-cctv-surveillance-grid-installation-hassan",
  "15-station-college-computer-lab-setup-hassan",
  "long-range-4km-outdoor-p2p-wireless-bridge-hassan"
]);

export default function SEOPanel({
  activeTab = "home",
  selectedServiceId = null,
  selectedBlogSlug = null,
  selectedProjectSlug = null,
}: SEOPanelProps) {
  useEffect(() => {
    // 1. Clean up any existing client-injected JSON-LD script tags to avoid duplication
    const scriptIds = [
      "jsonld-localbusiness",
      "jsonld-organization",
      "jsonld-website",
      "jsonld-webpage",
      "jsonld-breadcrumb",
      "jsonld-imageobject",
      "jsonld-service",
      "jsonld-faq"
    ];

    scriptIds.forEach((id) => {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    });

    // 2. Fallback runtime JSON-LD injection ONLY for newly added post-build dynamic projects
    if (selectedProjectSlug && !STATIC_PROJECT_SLUGS.has(selectedProjectSlug)) {
      const currentPath = window.location.pathname;
      const currentUrl = `${SITE_URL}${currentPath === "/" ? "" : currentPath}`;

      const dynamicProjectSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": `Project ${selectedProjectSlug}`,
        "description": "Onsite IT & CCTV Installation Project in Hassan",
        "author": {
          "@type": "LocalBusiness",
          "name": "MIInfotech",
          "telephone": "+91-9964761624"
        },
        "contentLocation": {
          "@type": "Place",
          "name": "Hassan, Karnataka"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        }
      };

      const script = document.createElement("script");
      script.id = "jsonld-webpage";
      script.type = "application/ld+json";
      script.text = JSON.stringify(dynamicProjectSchema);
      document.head.appendChild(script);
    }

    return () => {
      scriptIds.forEach((id) => {
        const existing = document.getElementById(id);
        if (existing) {
          existing.remove();
        }
      });
    };
  }, [activeTab, selectedServiceId, selectedBlogSlug, selectedProjectSlug]);

  return null;
}
