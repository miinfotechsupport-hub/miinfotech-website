import { useEffect } from "react";
import { SITE_URL } from "../lib/config";

export default function SEOPanel() {
  const schemas: Record<string, any> = {
    LocalBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      "name": "MIInfotech",
      "alternateName": "MI Infotech Hassan Doorstep IT",
      "logo": `${SITE_URL}/images/miinfotech-logo.png`,
      "image": `${SITE_URL}/images/miinfotech-logo.png`,
      "telephone": "+91-9964761624",
      "email": "miinfotech.support@gmail.com",
      "url": SITE_URL,
      "priceRange": "₹₹",
      "hasMap": "https://www.google.com/maps?cid=e21256333bf9e86c",
      "sameAs": [
        "https://share.google/hnUk6Bt7LUOFrdL2g"
      ],
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
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Hassan" },
        { "@type": "AdministrativeArea", "name": "Belur" },
        { "@type": "AdministrativeArea", "name": "Sakleshpur" },
        { "@type": "AdministrativeArea", "name": "Arasikere" },
        { "@type": "AdministrativeArea", "name": "Channarayapatna" }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "4",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Kiran Gowda"
          },
          "datePublished": "2026-06-14",
          "reviewBody": "Mohammed Ishtiaqh and his team at MIInfotech did an outstanding job setting up our retail store's CCTV and billing system. Their onsite repair is super fast. Had a motherboard issue on our billing computer last week, they came onsite within 2 hours and replaced the power supply. Excellent computer repair in Hassan!",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Dr. Sumitha Hegde"
          },
          "datePublished": "2026-05-08",
          "reviewBody": "We signed an IT AMC with MIInfotech for our clinic's computers, printer, and Wi-Fi networks. Sourcing genuine parts and maintaining them is no longer our headache. They are highly professional, very cost-effective, and provide detailed diagnostic logs. Best onsite IT support in Hassan.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        }
      ]
    },
    Service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Onsite IT Support, Computer Repair & CCTV Installation",
      "provider": {
        "@type": "LocalBusiness",
        "name": "MIInfotech",
        "telephone": "+91-9964761624"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Hassan, Karnataka"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "IT & CCTV Services Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Computer Onsite Diagnosis",
              "description": "Onsite troubleshooting & hardware diagnostics for desktop systems in Hassan city limits."
            },
            "price": "450.00",
            "priceCurrency": "INR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Laptop Onsite Repair",
              "description": "Onsite screens, batteries, keyboards, and RAM/SSD component upgrades."
            },
            "price": "750.00",
            "priceCurrency": "INR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "CCTV Security Camera Setup",
              "description": "Expert analog AHD and IP security camera installation with mobile remote preview setup."
            },
            "price": "1500.00",
            "priceCurrency": "INR"
          }
        ]
      }
    },
    FAQ: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you have a physical computer repair shop in Hassan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, MIInfotech is an onsite service area business. There is no physical walk-in store. Just call or WhatsApp +91 9964761624, and our technician will visit your location in Hassan directly."
          }
        },
        {
          "@type": "Question",
          "name": "What locations in Hassan do you cover?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We serve Hassan city (Kuvempu Nagar, Vidya Nagar, Channapatna) and surrounding areas including Belur, Sakleshpur, and Arasikere."
          }
        }
      ]
    },
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "MIInfotech",
      "url": SITE_URL,
      "logo": `${SITE_URL}/images/miinfotech-logo.png`,
      "founder": {
        "@type": "Person",
        "name": "Mohammed Ishtiaqh"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9964761624",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Kannada", "Hindi"]
      }
    },
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": "MIInfotech",
      "url": SITE_URL,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/#services?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    WebPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": "MIInfotech | Onsite IT Services & CCTV Camera Installation in Hassan",
      "description": "MIInfotech by Mohammed Ishtiaqh provides professional doorstep computer repair, laptop service, CCTV installation, printer support, network cabling, and corporate AMC in Hassan, Karnataka.",
      "breadcrumb": {
        "@id": `${SITE_URL}/#breadcrumb`
      }
    },
    Breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": `${SITE_URL}/#services`
        }
      ]
    },
    ImageObject: {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "@id": `${SITE_URL}/images/miinfotech-logo.png`,
      "url": `${SITE_URL}/images/miinfotech-logo.png`,
      "width": "512",
      "height": "512",
      "caption": "MIInfotech Onsite IT & CCTV Solutions Logo"
    },
    VideoObject: {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "MIInfotech Doorstep IT Repair & CCTV Installation Service Walkthrough",
      "description": "See how Mohammed Ishtiaqh and the MIInfotech team perform professional diagnostics, laptop component upgrades, and CCTV camera wiring onsite in Hassan.",
      "thumbnailUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
      "uploadDate": "2026-07-15T09:00:00Z",
      "contentUrl": `${SITE_URL}/videos/service-walkthrough.mp4`,
      "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  };

  useEffect(() => {
    // Generate unique IDs for the script tags to prevent duplicate injections
    const scriptIds = Object.keys(schemas).map(key => `jsonld-${key.toLowerCase()}`);

    // Remove any stale copies of these JSON-LD tags
    scriptIds.forEach(id => {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    });

    // Inject the structured metadata tags silently into document head
    Object.entries(schemas).forEach(([key, schema]) => {
      const script = document.createElement("script");
      script.id = `jsonld-${key.toLowerCase()}`;
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Clean up on component unmount to prevent leaks
    return () => {
      scriptIds.forEach(id => {
        const existing = document.getElementById(id);
        if (existing) {
          existing.remove();
        }
      });
    };
  }, []);

  // Return null so no developer logs or XML/robots/sitemap code views appear on the page layout!
  return null;
}
