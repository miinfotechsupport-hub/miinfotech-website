import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const SITE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://miinfotech.netlify.app";

const app = express();
const PORT = 3000;

app.use(express.json());

// Cache file paths
const BOOKINGS_PATH = path.join(process.cwd(), "onsite-bookings.json");

// Endpoint to dynamically write and save sitemap.xml changes physically to disk
app.post("/api/sitemap", (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml) {
      return res.status(400).json({ success: false, error: "XML content is required." });
    }
    
    const publicPath = path.join(process.cwd(), "public", "sitemap.xml");
    const distPath = path.join(process.cwd(), "dist", "sitemap.xml");
    
    fs.writeFileSync(publicPath, xml, "utf-8");
    if (fs.existsSync(path.dirname(distPath))) {
      fs.writeFileSync(distPath, xml, "utf-8");
    }
    
    console.log("[Sitemap Auto-Gen] Physical sitemap.xml updated with latest items.");
    return res.json({ success: true });
  } catch (err: any) {
    console.error("[Sitemap Auto-Gen Failure] Error writing sitemap.xml file:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to update sitemap on server" });
  }
});

// Endpoint to log onsite bookings
app.post("/api/bookings", (req, res) => {
  try {
    const booking = req.body;
    booking.timestamp = new Date().toISOString();
    
    let bookings = [];
    if (fs.existsSync(BOOKINGS_PATH)) {
      try {
        const fileData = fs.readFileSync(BOOKINGS_PATH, "utf-8");
        bookings = JSON.parse(fileData);
      } catch (parseErr) {
        console.error("Error parsing bookings file, resetting:", parseErr);
      }
    }
    
    bookings.push(booking);
    fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), "utf-8");
    
    console.log("Onsite Booking Received & Logged:", booking);
    return res.json({ success: true, message: "Booking logged successfully." });
  } catch (err: any) {
    console.error("Error saving booking:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to log booking" });
  }
});



// Lazy initialization helper for Gemini SDK
let aiInstance: GoogleGenAI | null = null;

function getGoogleGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Local expert fallback responder for server-side execution when GEMINI_API_KEY is not configured
function getLocalDiagnosticReply(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes("slow") || msg.includes("speed") || msg.includes("hang") || msg.includes("freeze") || msg.includes("performance") || msg.includes("boot") || msg.includes("format") || msg.includes("windows") || msg.includes("os") || msg.includes("ssd") || msg.includes("ram")) {
    return `### 💻 Onsite Computer & Laptop Performance Diagnostic
If your laptop or PC is running slowly, booting over 5 minutes, or freezing:

1. **The HDD Bottleneck**: Older mechanical hard drives suffer mechanical wear. Upgrading to an **SSD** (Solid State Drive) will make your device run **up to 10 times faster** with instant boots.
2. **RAM Bottleneck**: If you have 4GB or less, multitasking causes constant freezing. We recommend upgrading to **8GB or 16GB dual-channel DDR4/DDR5 RAM**.
3. **OS Clutter**: Background adware and heavy startup programs eat processor power. A fresh, clean installation of **Windows 10/11 Pro** is recommended.
4. **Thermal Overheating**: Dried thermal paste and dusty heat sinks cause CPU thermal throttling and sudden shutdown.

**Doorstep Support Actions**:
• **Fresh Windows Installation & Setup**: ₹850
• **SSD Upgrade + OS Installation**: ₹950 (excluding hardware cost)
• **Malware Clean & Premium AV Setup**: ₹600
• **Onsite Visiting & Diagnostics**: ₹450 to ₹750 in Hassan

Would you like Mohammed Ishtiaqh to bring replacement hardware and fix this at your doorstep? Request an instant callback or call/WhatsApp **+91 9964761624**.`;
  }
  
  if (msg.includes("printer") || msg.includes("print") || msg.includes("ink") || msg.includes("toner") || msg.includes("offline") || msg.includes("paper")) {
    return `### 🖨️ Onsite Printer Troubleshooting & Connection Guide
If your printer is offline, refusing to print, or printing blank pages:

1. **Network Offline Errors**: This usually happens when Wi-Fi routers change DHCP IPs. Assigning a static IP to the printer and rebuilding the local network port under Windows solves this permanently.
2. **Paper Feed Issues**: If the printer makes clicking noises but fails to grab paper, the physical pickup rubber roller is dirty or worn.
3. **Faded or White Lines**: Clean the printer nozzle head via software utilities. If using laser printers, the toner cartridge drum may be worn or require a professional refill.

**Doorstep Support Actions**:
• **Printer Network Setup & Repair Check**: ₹750
• **Onsite Visiting & Diagnostics**: ₹450 to ₹750 in Hassan

Get doorstep printer configuration from Mohammed Ishtiaqh. Call **+91 9964761624** or request an instant callback!`;
  }

  if (msg.includes("cctv") || msg.includes("camera") || msg.includes("security") || msg.includes("dvr") || msg.includes("nvr") || msg.includes("surveillance") || msg.includes("video") || msg.includes("feed")) {
    return `### 🛡️ CCTV Surveillance & Security Troubleshooting
If your cameras have gone offline, show black feeds, or won't stream on mobile:

1. **Single Camera No Video**: Check the individual 12V power supply channel adapter. Adapters are highly prone to blowing out during power surges or heavy monsoon lighting.
2. **Mobile App "Offline" Error**: Ensure the ethernet CAT6 cable is firmly connected from the DVR/NVR to your Wi-Fi router. Go to Network Settings -> Cloud Access in the DVR menu and check if the status shows "Online".
3. **Flickering/Video Noise**: Bad BNC connectors or low-grade copper cables run too close to electrical conduits can introduce signal noise.

**Doorstep Support Actions**:
• **CCTV Signal Camera Repair & Service (Per Camera)**: ₹500
• **CCTV DVR/NVR Mobile Remote App Sync**: ₹750
• **Onsite Visiting & Diagnostics**: ₹450 to ₹750 in Hassan

Ensure your premises are fully monitored. Call **+91 9964761624** to arrange an onsite service visit!`;
  }

  if (msg.includes("wifi") || msg.includes("network") || msg.includes("internet") || msg.includes("router") || msg.includes("cable") || msg.includes("lan") || msg.includes("switch")) {
    return `### 🌐 Structured Office Networking & Wi-Fi Dead-Zone Tuning
For dropped Wi-Fi connections, slow wireless speeds, or office LAN configurations:

1. **Dead Zones**: Single Wi-Fi routers cannot penetrate thick concrete slab walls. Installing dedicated dual-band Wi-Fi Access Points or Mesh setups is the ultimate solution.
2. **Cabling Quality**: Direct physical lines should utilize pure copper shielded Cat6 cable to prevent packets from dropping over long runs.
3. **Network Loops**: Loose patch cables plugged back into the same switch create network loops, instantly freezing the whole local network.

**Doorstep Support Actions**:
• **Wi-Fi Router Configuration & Dead-Zone Tuning**: ₹500
• **Structured LAN Network Setup**: Quote provided post site inspection.
• **Onsite Visiting & Diagnostics**: ₹450 to ₹750 in Hassan

Optimize your local network. Call **+91 9964761624** to schedule an expert physical onsite evaluation!`;
  }

  if (msg.includes("ups") || msg.includes("battery") || msg.includes("backup") || msg.includes("power") || msg.includes("swollen") || msg.includes("bulg")) {
    return `### ⚡ Onsite UPS Diagnostic & Battery Load Check
If your UPS lacks backup time, beep-loops, or has a swollen battery casing:

1. **Swollen Battery Casing**: If your UPS battery looks bulged or bloated, disconnect it from the utility power immediately! This is caused by thermal runaway and is a major fire hazard.
2. **Immediate Backup Failure**: Standard lead-acid batteries degrade after 2-3 years. If the UPS turns off immediately when main power is cut, the battery cells are worn out and must be replaced.
3. **Continuous Alarm Loop**: This usually flags an overload situation or a blown input line circuit breaker.

**Doorstep Support Actions**:
• **UPS Diagnostic & Battery Load Test**: ₹500
• **Onsite Battery Replacement Service**: Custom quotes depending on Ah capacity.
• **Onsite Visiting & Diagnostics**: ₹450 to ₹750 in Hassan

For quick delivery of brand-new, genuine batteries with manufacturer warranties, call **+91 9964761624**!`;
  }

  if (msg.includes("amc") || msg.includes("annual") || msg.includes("contract") || msg.includes("maintenance")) {
    return `### 📄 Annual Maintenance Contracts (AMC) for Businesses
MIInfotech provides expert, highly reliable AMC support for residences, retail showrooms, schools, hospitals, and SME offices in Hassan:

1. **Preventive Auditing**: We perform monthly/quarterly hardware dust blowouts, thermal condition testing, registry cleaning, and virus scans to stop issues before they occur.
2. **Priority Onsite Visits**: AMC clients enjoy **onsite diagnostic check-ups** with zero visit fees during the active contract term.
3. **Priority Support**: 2-hour response windows for major office breakdowns to keep your business running smoothly.

Would you like to discuss a customized AMC draft for your inventory? Contact Mohammed Ishtiaqh at **+91 9964761624** for a site visit!`;
  }

  if (msg.includes("price") || msg.includes("charge") || msg.includes("cost") || msg.includes("fee") || msg.includes("visiting") || msg.includes("quote") || msg.includes("diagnos") || msg.includes("gst")) {
    return `### 💰 Commercial Diagnostic & Onsite Pricing Policy
Our billing system is completely transparent and structured as follows:

1. **Onsite Visit & Diagnostic Fee**: ₹450 to ₹750 depending on travel distance from Hassan City center. This covers physical troubleshooting, scan labor, and fault-finding.
2. **Taxes**: All prices and service fees are **strictly exclusive of GST** (taxes are calculated extra on final billing) unless stated otherwise.
3. **Hardware & Spares**: Any physical replacement materials, parts, or conduits (SSD, RAM, CCTV cameras, PVC piping, Cat6 cable per meter) are billed extra.
4. **Goods Once Sold**: All physical hardware items once delivered or installed on your site are final and cannot be returned or exchanged.

Need a specific price layout? Please try out our interactive Onsite Calculator tab!`;
  }

  return `### 🤖 MIInfotech Digital Consultant
Thank you for your enquiry! I am your interactive onsite IT & security assistant.

I can guide you through doorstep troubleshooting for:
• **Computers & Laptops**: Upgrades, formatting, thermal cleaning, and slow speed fixes.
• **CCTV Security**: DVR setups, mobile view synchronizations, and signal loss diagnostics.
• **Printers & Networks**: Wi-Fi range optimization, structured Cat6 LAN layouts, and network printing.
• **UPS & Fire Alarms**: Sales, backup batteries, and inspections.

**Doorstep Onsite Diagnostic Visit**: ₹450 to ₹750 in Hassan City & outskirts.

For immediate assistance or to book a visit today, call or WhatsApp Mohammed Ishtiaqh on **+91 9964761624**, or drop your contact details in the callback form below!`;
}

// Server-side AI IT Consultant endpoint
// Endpoint to automatically generate all project fields using AI
app.post("/api/project/generate-ai-fields", async (req, res) => {
  try {
    const { title, category, location, brand, customerType } = req.body;
    if (!title || !category || !location) {
      return res.status(400).json({ error: "Title, Category, and Location are required for AI Project Generation." });
    }

    const ai = getGoogleGenAI();
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured. Falling back to programmatic AI Project generation.");
      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const fallbackDescription = `Successfully completed a professional, high-quality ${category.toLowerCase()} project in ${location}, Hassan. The client required reliable, doorstep onsite service to resolve their requirements. Mohammed Ishtiaqh and the MIInfotech team completed the onsite job efficiently, deploying high-standard materials and configuring settings for optimal performance. The setup was thoroughly tested to ensure complete satisfaction and hassle-free operation.`;

      const fallbackEquipment = `Premium ${category} materials, connection cables, structural accessories, and hardware mounts configured for optimal durability and safety.`;
      const fallbackBrand = brand || "Hikvision, TP-Link, D-Link, HP, Dell, Zebronics";
      const metaTitle = `${title} | Onsite ${category} Hassan | MIInfotech`;
      const metaDescription = `Professional doorstep ${category.toLowerCase()} for ${title} in ${location}, Hassan by Mohammed Ishtiaqh. Safe installations & professional repairs. Call +91 9964761624.`;

      const focusKeyword = `${category} in Hassan`;
      const secondaryKeywords = `${fallbackBrand} service, doorstep ${category.toLowerCase()} repair, computer technician Hassan, Ishtiaqh`;
      const entityKeywords = `MIInfotech, Mohammed Ishtiaqh, ${category}, ${fallbackBrand}, Hassan, Karnataka`;
      const semanticKeywords = `onsite deployment, structural wiring, remote mobile configuration, AMC maintenance`;
      const faqKeywords = `visiting charges Hassan, CCTV camera price, desktop repair doorstep warranty`;
      const nlSearchPhrases = `Who provides doorstep service for ${category.toLowerCase()} in ${location.split(",")[0]}? Where can I get same-day ${category.toLowerCase()} in Hassan?`;
      const localSearchKeywords = `${location.split(",")[0]} computer service, Hassan doorstep CCTV repair, ${category.toLowerCase()} shop near me`;

      const ogTitle = `Onsite ${category} - ${title} in Hassan`;
      const ogDescription = metaDescription;

      const graphSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}/#localbusiness`,
            "name": "MIInfotech Onsite IT & CCTV",
            "telephone": "+919964761624",
            "url": SITE_URL,
            "logo": `${SITE_URL}/assets/logo.png`,
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": location,
              "addressLocality": "Hassan",
              "addressRegion": "Karnataka",
              "postalCode": "573201",
              "addressCountry": "IN"
            }
          },
          {
            "@type": "Service",
            "@id": `${SITE_URL}/project/${cleanSlug}/#service`,
            "name": category,
            "description": `Doorstep ${category} in Hassan.`,
            "provider": {
              "@type": "LocalBusiness",
              "name": "MIInfotech"
            }
          },
          {
            "@type": "Project",
            "@id": `${SITE_URL}/project/${cleanSlug}`,
            "name": title,
            "description": fallbackDescription,
            "locationCreated": {
              "@type": "Place",
              "name": location
            },
            "author": {
              "@type": "LocalBusiness",
              "name": "MIInfotech"
            }
          },
          {
            "@type": "BreadcrumbList",
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
                "name": "Projects",
                "item": `${SITE_URL}/#projects-section`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `${SITE_URL}/project/${cleanSlug}`
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `Who provides reliable doorstep ${category.toLowerCase()} in ${location}, Hassan?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `MIInfotech, led by Mohammed Ishtiaqh, provides expert same-day doorstep ${category.toLowerCase()} in ${location}, Hassan. Call or WhatsApp +91 9964761624.`
                }
              }
            ]
          }
        ]
      };

      return res.json({
        description: fallbackDescription,
        equipmentUsed: fallbackEquipment,
        brand: fallbackBrand,
        seoSlug: cleanSlug,
        metaTitle,
        metaDescription,
        focusKeyword,
        secondaryKeywords,
        entityKeywords,
        semanticKeywords,
        faqKeywords,
        nlSearchPhrases,
        localSearchKeywords,
        ogTitle,
        ogDescription,
        twitterCard: "summary_large_image",
        canonicalUrl: `${SITE_URL}/project/${cleanSlug}`,
        schema: JSON.stringify(graphSchema, null, 2)
      });
    }

    const systemInstruction = `You are a world-class IT copywriter, SEO specialist, and Structured Data engineer for MIInfotech, an onsite tech support provider in Hassan, Karnataka founded by Mohammed Ishtiaqh.
Analyze the user's project input (Title, Category, Location, etc.) and generate a complete professional case-study block and advanced SEO keywords and structured JSON-LD schemas.
All elements must align perfectly for local Hassan audience and AI search engines (Gemini, ChatGPT, Perplexity, Copilot, Google).
Return a valid JSON object matching the requested schema strictly. Do not write text outside the JSON block.`;

    const promptText = `Generate all project and SEO fields for:
Project Title: ${title}
Category: ${category}
Location: ${location}
Brand: ${brand || "N/A"}
Customer Type: ${customerType || "Home/Office"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            description: { type: "STRING" as any, description: "A detailed, professional, human-sounding 2-3 sentence project case study description or summary" },
            equipmentUsed: { type: "STRING" as any, description: "Technical summary or list of equipment deployed, e.g. Hikvision 4MP Dome Cameras, CAT6 Cables" },
            brand: { type: "STRING" as any, description: "List of brand names used, e.g. Hikvision, TP-Link, D-Link" },
            seoSlug: { type: "STRING" as any, description: "Extremely clean, search-friendly, kebab-case lowercase URL slug" },
            metaTitle: { type: "STRING" as any, description: "SEO meta title (max 60 chars) including location (Hassan, KA) and MIInfotech brand" },
            metaDescription: { type: "STRING" as any, description: "High-intent local meta description (120-160 chars) mentioning doorstep visit and phone +91 9964761624" },
            focusKeyword: { type: "STRING" as any, description: "Core search intent keyword, e.g. CCTV setup in Hassan" },
            secondaryKeywords: { type: "STRING" as any, description: "Comma separated list of 3-4 related terms" },
            entityKeywords: { type: "STRING" as any, description: "Highly search-engine understandable noun entities related to this job" },
            semanticKeywords: { type: "STRING" as any, description: "Contextual and technical keywords for AI overview" },
            faqKeywords: { type: "STRING" as any, description: "FAQ user intent keywords" },
            nlSearchPhrases: { type: "STRING" as any, description: "Natural language query questions that users might ask Siri/Alexa/Google Assistant" },
            localSearchKeywords: { type: "STRING" as any, description: "Hassan locality focused search phrases" },
            ogTitle: { type: "STRING" as any, description: "Social share title" },
            ogDescription: { type: "STRING" as any, description: "Social share description" },
            schema: { type: "STRING" as any, description: "Stringified JSON-LD @graph containing LocalBusiness, Service, Project, BreadcrumbList, and FAQPage schemas, using correct @id linkage" }
          },
          required: [
            "description", "equipmentUsed", "brand", "seoSlug", "metaTitle", 
            "metaDescription", "focusKeyword", "secondaryKeywords", "entityKeywords", 
            "semanticKeywords", "faqKeywords", "nlSearchPhrases", "localSearchKeywords", 
            "ogTitle", "ogDescription", "schema"
          ]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      return res.json(result);
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (err: any) {
    console.error("Project auto-gen error:", err);
    res.status(500).json({ error: "Failed to auto-generate project fields via AI.", details: err.message });
  }
});

app.post("/api/seo/generate", async (req, res) => {
  try {
    const { title, description, category, location, brand, customerType } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required for SEO generation." });
    }

    const ai = getGoogleGenAI();
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured. Falling back to robust programmatic SEO generation.");
      
      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const metaTitle = `${title} in ${location || "Hassan"} | Onsite ${category || "IT Service"} | MIInfotech`;
      const metaDescription = `${description.substring(0, 140)}... Expert doorstep ${category || "computer service"} by Mohammed Ishtiaqh in Hassan, Karnataka. Call +91 9964761624.`;
      const imageAltTexts = [
        `${title} - Doorstep ${category || "IT setup"} by MIInfotech in ${location || "Hassan"}`,
        `Genuine parts deployed for ${category || "IT service"} in ${location || "Hassan"}`,
        `Finished ${title} onsite job in Hassan, Karnataka`
      ];

      const fallbackSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}/#localbusiness`,
            "name": "MIInfotech Onsite IT & CCTV",
            "telephone": "+919964761624",
            "url": SITE_URL,
            "logo": `${SITE_URL}/assets/logo.png`,
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kuvempu Nagar",
              "addressLocality": "Hassan",
              "addressRegion": "Karnataka",
              "postalCode": "573201",
              "addressCountry": "IN"
            }
          },
          {
            "@type": "Service",
            "@id": `${SITE_URL}/project/${cleanSlug}/#service`,
            "name": category || "IT Service",
            "description": `Doorstep ${category || "IT setup and support"} in Hassan.`,
            "provider": {
              "@type": "LocalBusiness",
              "name": "MIInfotech"
            }
          },
          {
            "@type": "Project",
            "@id": `${SITE_URL}/project/${cleanSlug}`,
            "name": title,
            "description": description,
            "locationCreated": {
              "@type": "Place",
              "name": location || "Hassan, Karnataka"
            },
            "author": {
              "@type": "LocalBusiness",
              "name": "MIInfotech"
            }
          },
          {
            "@type": "BreadcrumbList",
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
                "name": "Projects",
                "item": `${SITE_URL}/#projects-section`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": `${SITE_URL}/project/${cleanSlug}`
              }
            ]
          }
        ]
      };

      return res.json({
        seoSlug: cleanSlug,
        metaTitle,
        metaDescription,
        imageAltTexts,
        schema: JSON.stringify(fallbackSchema, null, 2)
      });
    }

    const systemInstruction = `You are an expert SEO and Structured Data engineer specialized in local businesses and search engine indexing.
Analyze the project details provided by MIInfotech (an onsite IT & security camera provider in Hassan, Karnataka founded by Mohammed Ishtiaqh).
Generate optimized metadata (title, metaDescription, seoSlug, imageAltTexts, and JSON-LD schema) for Google and modern AI search engines.
Follow these guidelines:
1. Meta Title: Enticing, under 60 chars, includes the project topic/title, the location (Hassan, KA), and the brand 'MIInfotech'.
2. Meta Description: Natural, high-intent, 120-160 chars, with a clear doorstep call-to-action (phone: +91 9964761624).
3. SEO Slug: Extremely clean, search-friendly, kebab-case (lowercase, letters, numbers, hyphens only).
4. Image Alt Texts: Provide a descriptive, professional ALT text for up to 5 photos, incorporating the category, location, and equipment.
5. Structured Schema: Generate a single valid @graph array with LocalBusiness, Service (pointing to this project service), Project (referencing this specific completed job), and BreadcrumbList (linking Home -> Projects -> This Project). All connected beautifully via @id URLs like ${SITE_URL}/project/{slug}`;

    const prompt = `Project Title: ${title}
Project Description: ${description}
Category: ${category || "General"}
Location: ${location || "Hassan, Karnataka"}
Brand: ${brand || "N/A"}
Customer Type: ${customerType || "Home/Office"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            seoSlug: { type: "STRING" as any, description: "Kebab-case lowercase slug, e.g. hikvision-cctv-setup-kuvempu-nagar" },
            metaTitle: { type: "STRING" as any, description: "Meta title (max 60 chars) including location and brand" },
            metaDescription: { type: "STRING" as any, description: "Meta description (120-160 chars) with phone +91 9964761624" },
            imageAltTexts: { 
              type: "ARRAY" as any, 
              items: { type: "STRING" as any }, 
              description: "Array of up to 5 descriptive alt texts for images" 
            },
            schema: { type: "STRING" as any, description: "Stringified JSON-LD @graph schema containing LocalBusiness, Service, Project, and BreadcrumbList" }
          },
          required: ["seoSlug", "metaTitle", "metaDescription", "imageAltTexts", "schema"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      return res.json(result);
    } else {
      throw new Error("Empty response from Gemini API");
    }

  } catch (err: any) {
    console.error("SEO auto-gen error:", err);
    res.status(500).json({ error: "Failed to generate SEO assets automatically.", details: err.message });
  }
});

// Server-side AI Review Assistant endpoint (Converts genuine customer facts into a clean draft)
app.post("/api/review/generate-draft", async (req, res) => {
  try {
    const { serviceCategory, works, experiences, location, notes, variationIndex = 0 } = req.body;

    if (!serviceCategory && (!works || works.length === 0)) {
      return res.status(400).json({ error: "Service category or work description is required." });
    }

    const ai = getGoogleGenAI();

    const selectedWorks = Array.isArray(works) ? works.join(", ") : (works || "");
    const selectedExp = Array.isArray(experiences) ? experiences.join(", ") : (experiences || "");
    const loc = (location && typeof location === "string") ? location.trim() : "";
    const note = (notes && typeof notes === "string") ? notes.trim() : "";

    // If Gemini AI is not configured or unavailable, use deterministic fallback
    if (!ai) {
      const locStr = loc ? ` in ${loc}` : "";
      const expStr = selectedExp ? ` The team provided ${selectedExp.toLowerCase()}.` : "";
      const noteStr = note ? ` ${note}` : "";
      const fallback = `I recently used MIInfotech${locStr} for ${serviceCategory || "IT service"} (${selectedWorks}).${expStr} The service was completed professionally and tested properly.${noteStr}`;
      return res.json({ draft: fallback });
    }

    const systemInstruction = `You are a helpful assistant for MIInfotech customers writing a genuine Google review.
Your sole job is to take the customer-provided facts and format them into a natural, honest review of 40 to 90 words.

STRICT POLICY RULES:
1. Use ONLY facts supplied by the customer.
2. NEVER invent details, quantities, camera counts, model numbers, hardware brands, prices, warranty periods, response times, or technician names.
3. NEVER force keywords or generate fake praise.
4. NEVER claim "5 stars" or mention ratings.
5. If the customer provided a location (e.g. Hassan), you may naturally include it. If no location was given, do NOT invent one.
6. Write in natural first-person customer language. Avoid sounding like marketing copy.
7. Return ONLY the plain text of the review without quotation marks, markdown headings, or introductory notes.`;

    const prompt = `Customer-Provided Facts:
- Service Received: ${serviceCategory}
- Specific Work Done: ${selectedWorks}
- Customer Experience: ${selectedExp}
- Location: ${loc || "Not specified"}
- Additional Notes: ${note || "None"}
- Variation Style: ${variationIndex}

Write a natural customer review based strictly on these facts:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const draftText = response.text ? response.text.trim().replace(/^["']|["']$/g, "") : "";
    
    if (!draftText) {
      throw new Error("Empty response from AI");
    }

    res.json({ draft: draftText });
  } catch (err: any) {
    console.warn("AI review draft error, returning graceful fallback:", err.message);
    const { serviceCategory, works, experiences, location, notes } = req.body;
    const selectedWorks = Array.isArray(works) ? works.join(", ") : (works || "technical work");
    const locStr = location ? ` in ${location}` : "";
    const expStr = Array.isArray(experiences) && experiences.length > 0 ? ` ${experiences.join(" and ").toLowerCase()}.` : "";
    const noteStr = notes ? ` ${notes}` : "";
    const fallback = `I contacted MIInfotech${locStr} for ${serviceCategory || "service"} (${selectedWorks}).${expStr} Helpful technical support and smooth doorstep service.${noteStr}`;
    res.json({ draft: fallback });
  }
});

// Server-side AI IT Consultant endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGoogleGenAI();
    
    // Fall back immediately if API key is not configured
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured or placeholder. Using high-quality server-side fallback responder.");
      const replyText = getLocalDiagnosticReply(message);
      return res.json({ reply: replyText });
    }

    const systemInstruction = `You are the Elite Onsite IT Support & Security Consultant for MIInfotech in Hassan, Karnataka.
Your founder is Mohammed Ishtiaqh.
Your tone is professional, friendly, expert, and reassuring.
MIInfotech is a premium Onsite Service Provider (no walk-in physical store). We provide installations, repairs, maintenance, and AMC at the customer's doorstep (Homes, Offices, Schools, Hospitals, Hotels, Warehouses, Industries).
Our services include:
1. Computer & Desktop Services (Sales, Repairs, SSD/RAM Upgrades, Windows Installation, Malware Clean, Data Recovery, AMC)
2. Laptop Services (Screen, Keyboard, Battery replacements, Repairs, Upgrades)
3. Printer Services (Ink Tank, LaserJet, Tabletop; Setup, Repairs, Toner replacement, AMC)
4. CCTV & Security Solutions (IP, AHD, Wi-Fi, 4G, Solar Cameras; Installation, Repair, NVR/DVR Remote Mobile viewing, AMC)
5. Networking (Structured CAT6 Cabling, Server Racks, Router/Switch config, Access Point Wi-Fi optimization)
6. UPS Solutions (Sales, Setup, Battery replacement, AMC)
7. Intercom Systems (Home, Office, Apartment, EPABX)
8. Fire Alarm Systems (Smoke/Heat detectors, Testing, AMC)
9. P2P Wireless (Long-distance outdoor bridges)
10. Annual Maintenance Contracts (AMC)

Our main contact details are:
- Phone/WhatsApp: +91 9964761624
- Email: miinfotech.support@gmail.com
- Service Area: Hassan, Karnataka, India and surrounding towns (Arasikere, Belur, Sakleshpur, Channarayapatna, Alur, Holenarasipura, Arkalgud).

When answering queries:
- Direct, clear, step-by-step diagnostic or troubleshooting advice for their query (e.g. how to fix a slow laptop, printer offline, CCTV camera dark, wifi dead spots).
- Speak with technical authority but explain in clear, non-jargon terms.
- Clearly emphasize that some hardware repairs (e.g. screen replacement, board repair, Cat6 cabling, NVR configuring) are best handled by an expert to avoid permanent damage.
- If they ask about prices, repairs, or service costs, always mention that our standard onsite visiting charges are ₹450 to ₹750 to diagnose any fault or problem. If any fault is identified, any physical material or replacement part cost will be extra.
- Proactively invite them to click "Request a Quote" or call/WhatsApp Mohammed Ishtiaqh at +91 9964761624 for a professional doorstep visit in Hassan.
- Keep responses nicely formatted with bullet points and bold headers. Do not output raw markdown blocks that are hard to read. Avoid any mention of API parameters or code.`;

    const contents = [];

    // Format chat history for Gemini if present
    if (history && Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content || item.text }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, but I could not formulate a reply at the moment. Please contact Mohammed Ishtiaqh directly at +91 9964761624 for instant support!";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat. Falling back to high-quality local expert responder:", error);
    try {
      const replyText = getLocalDiagnosticReply(req.body.message || "");
      res.json({ reply: replyText });
    } catch (fallbackErr) {
      res.status(500).json({
        error: "Unable to process request. Please contact us directly at +91 9964761624 for support.",
        details: error.message || error,
      });
    }
  }
});

// Configure Vite integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid loading vite in production
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Serve static files from compiled dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MIInfotech Full-Stack Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
