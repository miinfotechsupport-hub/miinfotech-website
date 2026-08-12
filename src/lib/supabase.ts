import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { SERVICES_DATA, BLOG_DATA, ProjectItem, PROJECTS_DATA } from "../types";
import { SITE_URL } from "./config";

// Helper to detect local development environment vs production hostnames
export const isLocalhost = typeof window !== "undefined" && Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.endsWith(".localhost")
);

// Read environment variables using a type-safe reference compatible with all bundlers
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Is there a valid Supabase configuration?
export const isRealSupabase = supabaseUrl && supabaseKey && !supabaseUrl.includes("PLACEHOLDER") && !supabaseKey.includes("PLACEHOLDER");

// Base data templates for initial seeding of local database fallback
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Hikvision 2MP Full HD Indoor Dome CCTV Camera",
    brand: "Hikvision",
    category: "CCTV",
    description: "High performance CMOS sensor camera with up to 1080P resolution, smart IR night vision up to 20m, and weatherproof construction.",
    specifications: "Resolution: 1080p Full HD; Connection: BNC; Night Vision: Up to 20 meters; Sensor: High Performance CMOS",
    rating: 4.8,
    price: 1850,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
    affiliateLink: "https://amazon.in",
    featured: true,
    enabled: true,
    order: 1
  },
  {
    id: "prod-2",
    name: "Crucial MX500 500GB SATA 2.5-inch Internal SSD",
    brand: "Crucial",
    category: "Computer Spares",
    description: "Supercharge your laptop or desktop speed. Features sequential reads up to 560MB/s and sequential writes up to 510MB/s for instant booting and fast loading.",
    specifications: "Interface: SATA 6.0Gb/s; Capacity: 500 GB; Form Factor: 2.5-inch; MTBF: 1.8 Million Hours",
    rating: 4.9,
    price: 3200,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    affiliateLink: "https://amazon.in",
    featured: true,
    enabled: true,
    order: 2
  },
  {
    id: "prod-3",
    name: "CP Plus 4 Channel Full HD Smart DVR",
    brand: "CP Plus",
    category: "CCTV",
    description: "Compact and powerful digital video recorder supporting 4 AHD/IP/CVBS camera channels, automatic cloud sync, and remote mobile app preview via gDMSS.",
    specifications: "Channels: 4; Video Output: HDMI, VGA; Compression: H.265+; Mobile App: gDMSS / iDMSS",
    rating: 4.6,
    price: 2950,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    affiliateLink: "https://amazon.in",
    featured: false,
    enabled: true,
    order: 3
  }
];

const DEFAULT_FAQS = [
  { id: "faq-1", question: "What are your onsite diagnostic charges in Hassan?", answer: "Our standard onsite visiting and diagnostic charges range between ₹450 to ₹750, depending on your exact distance from the center of Hassan. This fee covers complete troubleshooting and fault isolation by our technician.", category: "General" },
  { id: "faq-2", question: "How fast can you repair my laptop or computer?", answer: "Most software diagnostics, system cleanups, and hardware replacements (such as SSD and RAM upgrades) are completed within 1 to 3 hours directly at your doorstep on the same day. Motherboard level repairs may take 1-2 working days.", category: "Computer & Laptop" },
  { id: "faq-3", question: "Do you install CCTV cameras in residential areas?", answer: "Yes, we handle CCTV installations for individual residences, apartment complexes, retail showrooms, schools, hospitals, and warehouses. We design custom layouts matching your exact security needs.", category: "CCTV Surveillance" },
  { id: "faq-4", question: "Can I view my security cameras on my phone when away?", answer: "Absolutely. We configure high-security mobile applications (like Hik-Connect or gDMSS) on your smartphone with proper cloud network port configurations, enabling 100% remote monitoring from anywhere in the world.", category: "CCTV Surveillance" }
];

const DEFAULT_TESTIMONIALS: any[] = [];

const DEFAULT_GALLERY = [
  { id: "gal-1", title: "Corporate Networking Rack Setup", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600", album: "Projects", isProject: true },
  { id: "gal-2", title: "Commercial 4K CCTV Installation", url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600", album: "CCTV Setups", isProject: true },
  { id: "gal-3", title: "Structured Copper Cat6 Cabling", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600", album: "Projects", isProject: true }
];

const DEFAULT_PROJECTS: ProjectItem[] = PROJECTS_DATA;

const DEFAULT_SETTINGS = {
  business_name: "MIINFOTECH",
  logo_url: "",
  phone_primary: "+91 9964761624",
  phone_secondary: "",
  whatsapp_number: "+91 9964761624",
  email_support: "miinfotech.support@gmail.com",
  address_physical: "Hassan, Karnataka, India",
  opening_hours_mon_sat: "09:30 AM - 08:00 PM",
  opening_hours_sun: "10:00 AM - 03:00 PM",
  social_facebook: "https://www.facebook.com/share/18nFLrKJ1a/",
  social_instagram: "https://www.instagram.com/miinfotech.in",
  social_linkedin: "https://linkedin.com/company/miinfotech",
  social_youtube: "",
  google_maps_iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15584.093414902175!2d76.0894528!3d13.0071853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba53df0a28f7223%3A0xe21256333bf9e86c!2sHassan%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
  footer_about: "MIInfotech is Hassan's premier doorstep IT service provider, specializing in expert computer repairs, high-resolution CCTV camera installations, and structured office networking support.",
  copyright_text: "© 2026 MIInfotech. All Rights Reserved."
};

const DEFAULT_SEO = {
  homepage_title: "CCTV Installation & Computer Repair in Hassan | MIInfotech",
  homepage_description: "Doorstep Computer Repair in Hassan & CCTV Installation in Hassan. Fast doorstep Laptop Repair, Printer Repair, & IT support by Mohammed Ishtiaqh. Call +91 9964761624.",
  homepage_keywords: "Computer Repair in Hassan, CCTV Installation in Hassan, CCTV Camera Installation in Hassan, Laptop Repair in Hassan, Printer Repair in Hassan, Computer Repair Near Me, Laptop Repair Near Me, CCTV Repair in Hassan, Computer Service Center in Hassan",
  og_image: `${SITE_URL}/images/miinfotech-logo.png`,
  twitter_card: "summary_large_image"
};

// Simulated Local Storage Database Engine
class LocalDBEngine {
  private getStorageKey(table: string): string {
    return `mi_db_${table}`;
  }

  private getData<T>(table: string, defaults: T[]): T[] {
    const key = this.getStorageKey(table);
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(data);
    } catch {
      return defaults;
    }
  }

  private saveData<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
  }

  // Auth Operations
  getAdminUser() {
    if (!isLocalhost) return null; // Never restore local mock sessions in production
    const sessionStr = customAuthStorage.getItem("mi_admin_session");
    if (!sessionStr) return null;
    try {
      const parsed = JSON.parse(sessionStr);
      return parsed.user || parsed;
    } catch {
      return null;
    }
  }

  async setAdminPassword(newPass: string) {
    if (!isLocalhost) return;
    const hash = await hashPassword(newPass);
    localStorage.setItem("mi_admin_password_hash", hash);
    this.logActivity("Password Change", "Administrator password updated successfully");
  }

  async signIn(email: string, pass: string) {
    if (!isLocalhost) {
      return {
        data: { user: null, session: null },
        error: { message: "Local Sandbox authentication is disabled in production environments. Please authenticate using Supabase Auth." }
      };
    }

    const storedHash = localStorage.getItem("mi_admin_password_hash");
    if (!storedHash) {
      return {
        data: { user: null, session: null },
        error: { message: "No local password set. Please authenticate via Supabase Cloud." }
      };
    }

    const inputHash = await hashPassword(pass);
    if (inputHash === storedHash) {
      const cleanEmail = email.trim().toLowerCase();
      const user = { id: "admin-uid", email: cleanEmail, role: "administrator" };
      const token = "secure-session-token-" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const sessionObj = {
        user,
        access_token: token,
        created_at: Date.now()
      };

      customAuthStorage.setItem("mi_admin_session", JSON.stringify(sessionObj));

      const nowStr = Date.now().toString();
      sessionStorage.setItem("mi_admin_last_active", nowStr);
      localStorage.setItem("mi_admin_last_active", nowStr);

      this.logActivity("Admin Login", "Administrator logged into backend panel successfully");
      return { data: { user, session: sessionObj }, error: null };
    }
    return { data: { user: null, session: null }, error: { message: "Invalid email or password combination." } };
  }

  signOut() {
    customAuthStorage.removeItem("mi_admin_session");
    sessionStorage.removeItem("mi_admin_last_active");
    localStorage.removeItem("mi_admin_last_active");
    this.logActivity("Admin Logout", "Administrator logged out of backend panel");
    return { error: null };
  }

  // CRUD table accessors
  getServices() {
    // Pre-populate with SERVICES_DATA types mapping to rich objects
    const initial = SERVICES_DATA.map(s => ({
      id: s.id,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      iconName: s.iconName,
      startingPrice: s.startingPrice,
      timeframe: s.timeframe,
      seoKeywords: s.seoKeywords || [],
      features: s.features || [],
      symptoms: s.symptoms || [],
      enabled: true,
      order: 1
    }));
    return this.getData("services", initial);
  }

  saveServices(data: any[]) {
    this.saveData("services", data);
  }

  getBlogs() {
    const initial = BLOG_DATA.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      category: b.category,
      date: b.date,
      readTime: b.readTime,
      keywords: b.keywords || [],
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
      status: "published",
      featured: b.id === "1"
    }));
    return this.getData("blogs", initial);
  }

  saveBlogs(data: any[]) {
    this.saveData("blogs", data);
  }

  getProducts() {
    return this.getData("products", DEFAULT_PRODUCTS);
  }

  saveProducts(data: any[]) {
    this.saveData("products", data);
  }

  getGallery() {
    return this.getData("gallery", DEFAULT_GALLERY);
  }

  saveGallery(data: any[]) {
    this.saveData("gallery", data);
  }

  getProjects() {
    return this.getData("projects", DEFAULT_PROJECTS);
  }

  saveProjects(data: any[]) {
    this.saveData("projects", data);
  }

  getTestimonials() {
    return this.getData("testimonials", DEFAULT_TESTIMONIALS);
  }

  saveTestimonials(data: any[]) {
    this.saveData("testimonials", data);
  }

  getEnquiries() {
    return this.getData("enquiries", []);
  }

  saveEnquiries(data: any[]) {
    this.saveData("enquiries", data);
  }

  getFaqs() {
    return this.getData("faqs", DEFAULT_FAQS);
  }

  saveFaqs(data: any[]) {
    this.saveData("faqs", data);
  }

  getSettings() {
    const key = this.getStorageKey("settings");
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(data: any) {
    localStorage.setItem(this.getStorageKey("settings"), JSON.stringify(data));
  }

  getSEO() {
    const key = this.getStorageKey("seo");
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_SEO));
      return DEFAULT_SEO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_SEO;
    }
  }

  saveSEO(data: any) {
    localStorage.setItem(this.getStorageKey("seo"), JSON.stringify(data));
  }

  getAnalytics() {
    const key = this.getStorageKey("analytics");
    const clicks = localStorage.getItem(key);
    const initial = {
      visitors: 1450,
      whatsappClicks: 324,
      phoneClicks: 218,
      recentActivities: [
        { id: "act-1", action: "Lead Created", details: "Onsite Computer Repair request from Kiran, Hassan", time: "2 hours ago" },
        { id: "act-2", action: "CCTV Inquiry", details: "Quote request from Prestige Layout, Hassan", time: "5 hours ago" },
        { id: "act-3", action: "Google Sync", details: "Google Reviews cache refreshed successfully", time: "12 hours ago" }
      ]
    };
    if (!clicks) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(clicks);
    } catch {
      return initial;
    }
  }

  logClick(type: "whatsapp" | "phone") {
    const analytics = this.getAnalytics();
    if (type === "whatsapp") analytics.whatsappClicks += 1;
    if (type === "phone") analytics.phoneClicks += 1;
    analytics.recentActivities.unshift({
      id: "act-" + Date.now(),
      action: type === "whatsapp" ? "WhatsApp Click" : "Phone Call Triggered",
      details: type === "whatsapp" ? "Visitor clicked the green WhatsApp chat widget" : "Visitor triggered phone dialer support link",
      time: "Just now"
    });
    // Trim activities to max 10
    if (analytics.recentActivities.length > 10) analytics.recentActivities.length = 10;
    localStorage.setItem(this.getStorageKey("analytics"), JSON.stringify(analytics));
  }

  logActivity(action: string, details: string) {
    const analytics = this.getAnalytics();
    analytics.recentActivities.unshift({
      id: "act-" + Date.now(),
      action,
      details,
      time: "Just now"
    });
    if (analytics.recentActivities.length > 10) analytics.recentActivities.length = 10;
    localStorage.setItem(this.getStorageKey("analytics"), JSON.stringify(analytics));
  }
}

export const localDB = new LocalDBEngine();

// Create elegant QueryBuilder matching Supabase syntax to handle database transactions cleanly
class LocalQueryBuilder {
  private tableName: string;
  private filters: any[] = [];
  private orderCol: string | null = null;
  private orderAsc = true;
  private action: "select" | "insert" | "update" | "delete" = "select";
  private payload: any = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getTableData() {
    switch (this.tableName) {
      case "services": return localDB.getServices();
      case "blogs": return localDB.getBlogs();
      case "products": return localDB.getProducts();
      case "gallery": return localDB.getGallery();
      case "projects": return localDB.getProjects();
      case "testimonials": return localDB.getTestimonials();
      case "contact_enquiries": return localDB.getEnquiries();
      case "faqs": return localDB.getFaqs();
      case "website_settings": return [localDB.getSettings()];
      case "seo_settings": return [localDB.getSEO()];
      default: return [];
    }
  }

  private saveTableData(data: any[]) {
    switch (this.tableName) {
      case "services": localDB.saveServices(data); break;
      case "blogs": localDB.saveBlogs(data); break;
      case "products": localDB.saveProducts(data); break;
      case "gallery": localDB.saveGallery(data); break;
      case "projects": localDB.saveProjects(data); break;
      case "testimonials": localDB.saveTestimonials(data); break;
      case "contact_enquiries": localDB.saveEnquiries(data); break;
      case "faqs": localDB.saveFaqs(data); break;
      case "website_settings": if (data[0]) localDB.saveSettings(data[0]); break;
      case "seo_settings": if (data[0]) localDB.saveSEO(data[0]); break;
    }
  }

  select(columns = "*") {
    this.action = "select";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: "eq", column, value });
    return this;
  }

  match(query: Record<string, any>) {
    if (query) {
      Object.entries(query).forEach(([column, value]) => {
        this.eq(column, value);
      });
    }
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orderCol = column;
    this.orderAsc = ascending;
    return this;
  }

  insert(recordOrRecords: any) {
    this.action = "insert";
    this.payload = recordOrRecords;
    return this;
  }

  update(updates: any) {
    this.action = "update";
    this.payload = updates;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  // Executes query and returns results using a standard promise wrapper
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return Promise.resolve()
      .then(async () => {
        let resultData: any = null;
        let resultError: any = null;

        try {
          if (this.action === "insert") {
            const data = this.getTableData();
            const isArray = Array.isArray(this.payload);
            const records = isArray ? this.payload : [this.payload];

            const recordsWithId = records.map(rec => ({
              id: rec.id || `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: rec.timestamp || new Date().toISOString(),
              created_at: new Date().toISOString(),
              ...rec
            }));

            const updated = [...data, ...recordsWithId];
            this.saveTableData(updated);

            localDB.logActivity("Insert Record", `Added entry inside ${this.tableName} table`);
            resultData = isArray ? recordsWithId : recordsWithId[0];
          } else if (this.action === "update") {
            const data = this.getTableData();
            const updates = this.payload;
            const updated = data.map((item: any) => {
              let matches = true;
              for (const filter of this.filters) {
                if (filter.type === "eq" && String(item[filter.column]) !== String(filter.value)) {
                  matches = false;
                }
              }
              if (matches) {
                return { ...item, ...updates, updated_at: new Date().toISOString() };
              }
              return item;
            });

            this.saveTableData(updated);
            localDB.logActivity("Update Record", `Modified entries inside ${this.tableName} table`);
            resultData = updates;
          } else if (this.action === "delete") {
            const data = this.getTableData();
            const remaining = data.filter((item: any) => {
              let matches = true;
              for (const filter of this.filters) {
                if (filter.type === "eq" && String(item[filter.column]) !== String(filter.value)) {
                  matches = false;
                }
              }
              return !matches; // Keep those that do not match filters (meaning we delete matching ones)
            });

            this.saveTableData(remaining);
            localDB.logActivity("Delete Record", `Removed entries from ${this.tableName} table`);
            resultData = null;
          } else {
            // default "select"
            let data = this.getTableData();

            // Apply filters
            for (const filter of this.filters) {
              if (filter.type === "eq") {
                data = data.filter((item: any) => String(item[filter.column]) === String(filter.value));
              }
            }

            // Apply order
            if (this.orderCol) {
              const col = this.orderCol;
              const asc = this.orderAsc;
              data.sort((a: any, b: any) => {
                const valA = a[col];
                const valB = b[col];
                if (valA === valB) return 0;
                if (valA == null) return 1;
                if (valB == null) return -1;
                return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
              });
            }
            resultData = data;
          }
        } catch (err: any) {
          resultError = { message: err.message || "Query failed" };
        }

        return { data: resultData, error: resultError };
      })
      .then(onfulfilled, onrejected);
  }
}

// Helper to determine if we should currently use local fallback database
export function getUseLocalDatabase(): boolean {
  // Production hosts MUST NEVER use local database or sandbox mode
  if (!isLocalhost) return false;
  if (!isRealSupabase) return true;
  if (typeof window === "undefined") return false;
  return localStorage.getItem("mi_force_local_db") === "true";
}

/**
 * Hashes a string using standard SHA-256 via Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // Basic fallback hash for environment without crypto support
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return "fallback-" + hash.toString(16);
  }
}

// Custom browser session storage that persists across page refreshes but can be completely cleared on sign out
export const customAuthStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key) || localStorage.getItem(key) || null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, value);
    // Persist to localStorage if rememberMe is enabled
    if (localStorage.getItem("mi_admin_remember_me") === "true") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    localStorage.removeItem("mi_admin_session_expires");
    // Scan and clean up any other potential Supabase keys to ensure absolute destruction of leftovers
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("sb-") || k.includes("auth-token"))) {
          localStorage.removeItem(k);
        }
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && (k.startsWith("sb-") || k.includes("auth-token"))) {
          sessionStorage.removeItem(k);
        }
      }
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }
  }
};

const realSupabaseClient = isRealSupabase ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: customAuthStorage,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : null;

const mockSupabaseClient = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      return localDB.signIn(email, password);
    },
    signOut: async () => {
      return localDB.signOut();
    },
    getSession: async () => {
      const user = localDB.getAdminUser();
      const sessionStr = customAuthStorage.getItem("mi_admin_session");
      if (user && sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          return { data: { session }, error: null };
        } catch {
          return { data: { session: null }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    },
    getUser: async () => {
      const user = localDB.getAdminUser();
      if (user) {
        return { data: { user }, error: null };
      }
      return { data: { user: null }, error: { message: "No active session" } };
    },
    onAuthStateChange: (callback: any) => {
      // Listen to session changes
      const handler = () => {
        const user = localDB.getAdminUser();
        const sessionStr = customAuthStorage.getItem("mi_admin_session");
        let session = null;
        if (user && sessionStr) {
          try {
            session = JSON.parse(sessionStr);
          } catch {}
        }
        callback(user ? "SIGNED_IN" : "SIGNED_OUT", session);
      };
      window.addEventListener("mi_auth_change", handler);
      // Initial trigger
      handler();
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener("mi_auth_change", handler);
            }
          }
        }
      };
    },
    updateUser: async ({ password }: any) => {
      if (password) {
        await localDB.setAdminPassword(password);
      }
      return { data: { user: localDB.getAdminUser() }, error: null };
    }
  },
  from: (tableName: string) => {
    return new LocalQueryBuilder(tableName);
  },
  storage: {
    from: (bucketName: string) => ({
      upload: async (filePath: string, file: any, options?: any) => {
        return { data: { path: filePath }, error: null };
      },
      getPublicUrl: (filePath: string) => {
        return { data: { publicUrl: filePath } };
      }
    })
  }
} as any;

// Explicit delegate wrapper instead of dynamic Proxy to guarantee 100% stable function binding and type correctness in any runtime
export const supabase = {
  get auth() {
    const useLocal = getUseLocalDatabase();
    const client = useLocal ? mockSupabaseClient : (realSupabaseClient || mockSupabaseClient);
    return client.auth;
  },
  get storage() {
    const useLocal = getUseLocalDatabase();
    const client = useLocal ? mockSupabaseClient : (realSupabaseClient || mockSupabaseClient);
    return client.storage;
  },
  from(tableName: string) {
    const useLocal = getUseLocalDatabase();
    const client = useLocal ? mockSupabaseClient : (realSupabaseClient || mockSupabaseClient);
    return client.from(tableName);
  }
};

// Export utility to notify auth change in fallback state
export const triggerAuthChange = () => {
  window.dispatchEvent(new Event("mi_auth_change"));
};

/**
 * Updates the administrator password for both production Supabase Auth and local storage fallback
 */
export async function updateAdminPassword(newPassword: string): Promise<{ error: any }> {
  if (isRealSupabase) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  } else {
    await localDB.setAdminPassword(newPassword);
    return { error: null };
  }
}

/**
 * Automatically compresses an image file on the client-side and converts it to WebP format
 */
export async function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas compression failed"));
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads a file (with optional auto-compression for images) to a Supabase bucket
 * Or falls back to local Base64 storage if mock client or bucket doesn't exist
 */
export async function uploadFile(
  bucket: "logos" | "gallery" | "blog-images" | "service-images" | "testimonials" | "products" | "favicons",
  file: File,
  compress = true
): Promise<string> {
  // Disable compression for branding/logos/favicons to preserve original format, transparency, and exact color profiles
  const shouldCompress = compress && bucket !== "logos" && bucket !== "favicons";

  let finalFile: Blob | File = file;
  let fileExt = "webp";
  let contentType = "image/webp";

  if (shouldCompress && file.type.startsWith("image/")) {
    try {
      finalFile = await compressImage(file);
      fileExt = "webp";
      contentType = "image/webp";
    } catch (e) {
      console.warn("Failed to compress image, using original:", e);
      const parts = file.name.split(".");
      fileExt = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "png";
      contentType = file.type || `image/${fileExt}`;
    }
  } else {
    const parts = file.name.split(".");
    fileExt = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "png";
    contentType = file.type || `image/${fileExt}`;
  }

  // If mock mode is active
  if (!isRealSupabase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(finalFile);
    });
  }

  // Real Supabase storage upload with original or webp extension
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, finalFile, {
      contentType: contentType,
      upsert: true,
    });

    if (error) {
      console.warn(`Bucket '${bucket}' upload failed. Falling back to local Base64 storage:`, error);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(finalFile);
      });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn(`Storage upload caught error, falling back to Base64:`, err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(finalFile);
    });
  }
}

// Global reactive hook for settings
export function useSettings() {
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from("website_settings").select("*");
        if (data && data[0]) {
          setSettings(data[0]);
        } else {
          setSettings(localDB.getSettings());
        }
      } catch (err) {
        console.error("Failed to load settings in hook:", err);
        setSettings(localDB.getSettings());
      }
    };

    fetchSettings();

    const handler = () => {
      fetchSettings();
    };

    window.addEventListener("mi_settings_change", handler);
    return () => {
      window.removeEventListener("mi_settings_change", handler);
    };
  }, []);

  useEffect(() => {
    // Dynamic Favicon Update if provided
    if (settings?.favicon_url && typeof document !== "undefined") {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings?.favicon_url]);

  return settings;
}

export const triggerSettingsChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("mi_settings_change"));
  }
};
