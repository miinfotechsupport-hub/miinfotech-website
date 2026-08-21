import React, { useState, useEffect } from "react";
import { supabase, localDB, triggerAuthChange, triggerSettingsChange, updateAdminPassword, isRealSupabase, getUseLocalDatabase, customAuthStorage, isLocalhost } from "../lib/supabase";
import { SITE_URL } from "../lib/config";
import * as LucideIcons from "lucide-react";
import MediaUploadZone from "./MediaUploadZone";
import MediaGridSection from "./MediaGridSection";
import QRCodeDisplay from "./QRCodeDisplay";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Auth form state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [localDatabaseFallback, setLocalDatabaseFallback] = useState<boolean>(getUseLocalDatabase);

  // Security Fix states
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem("mi_admin_remember_me") === "true";
  });
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotSubmitting, setForgotSubmitting] = useState<boolean>(false);

  const handleToggleLocalMode = (val: boolean) => {
    if (!isLocalhost && val) {
      addToast("Local Sandbox mode is disabled on production hosts.", "error");
      return;
    }
    setLocalDatabaseFallback(val);
    localStorage.setItem("mi_force_local_db", val ? "true" : "false");
    triggerAuthChange();
  };

  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: "success" | "error" }>>([]);

  // Data states for CMS managers
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [seo, setSeo] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>({});

  // Search & Filter state for Contacts
  const [enquirySearch, setEnquirySearch] = useState<string>("");
  const [enquiryFilter, setEnquiryFilter] = useState<string>("all");

  // Edit / Add modal triggers & states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"service" | "blog" | "product" | "gallery" | "testimonial" | "faq" | "project" | null>(null);

  // Form states for modals (dynamically typed)
  const [formFields, setFormFields] = useState<any>({});
  const [formSaving, setFormSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Advanced SEO panel states
  const [seoSectionOpen, setSeoSectionOpen] = useState<boolean>(true);
  const [techNotesOpen, setTechNotesOpen] = useState<boolean>(false);
  const [generatingSeo, setGeneratingSeo] = useState<boolean>(false);
  const [generatingProject, setGeneratingProject] = useState<boolean>(false);

  // Trigger toast
  const addToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleGenerateAiSeo = async () => {
    if (!formFields.title || !formFields.description) {
      addToast("Please provide a Project Title and Description first!", "error");
      return;
    }
    setGeneratingSeo(true);
    setSeoSectionOpen(true);
    try {
      let slug = formFields.seoSlug || formFields.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      let metaTitle = `${formFields.title} Setup in Hassan | MIInfotech`;
      let metaDescription = `${formFields.description.substring(0, 140)}... Expert doorstep ${formFields.category || "computer service"} by Mohammed Ishtiaqh in Hassan. Call +91 9964761624.`;
      let schemaStr = "";

      // Call API if possible
      try {
        const res = await fetch("/api/seo/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formFields.title,
            description: formFields.description,
            category: formFields.category,
            location: formFields.location,
            brand: formFields.brand,
            customerType: formFields.customerType,
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.seoSlug) slug = data.seoSlug;
          if (data.metaTitle) metaTitle = data.metaTitle;
          if (data.metaDescription) metaDescription = data.metaDescription;
          if (data.schema) schemaStr = data.schema;
        }
      } catch (e) {
        console.warn("Backend SEO generation failed, generating rich metadata programmatically", e);
      }

      const category = formFields.category || "CCTV Installation";
      const brand = formFields.brand || "Hikvision";
      const location = formFields.location || "Kuvempu Nagar, Hassan";

      // Standard high-intent keywords
      const focusKeyword = `${category} in Hassan`;
      const secondaryKeywords = `${brand} service, doorstep ${category.toLowerCase()} repair, computer technician Hassan, Ishtiaqh`;

      // AI Search entity optimization
      const entityKeywords = `MIInfotech, Mohammed Ishtiaqh, ${category}, ${brand}, Hassan, Karnataka, Onsite IT Support`;
      const semanticKeywords = `doorstep repair, diagnostic scanning, network optimization, hardware swap-outs, AMC contracts`;
      const nlSearchPhrases = `Who provides doorstep service for ${category.toLowerCase()} in ${location.split(",")[0]}? Where can I get same-day ${category.toLowerCase()} near me?`;
      const faqKeywords = `visiting charges, warranty on repairs, component replacement cost, CCTV mobile view setup`;
      const localSearchKeywords = `IT technician Hassan, CCTV setup Kuvempu Nagar, computer repair Vidya Nagar`;

      // Geo SEO
      const seoCity = "Hassan";
      const seoDistrict = "Hassan";
      const seoState = "Karnataka";
      const seoCountry = "India";
      const seoPostalCode = "573201";
      const seoLatitude = "13.0068";
      const seoLongitude = "76.1026";
      const seoServiceArea = "Kuvempu Nagar, Vidya Nagar, Channapatna, Hemavathi Nagar, KR Puram, Salagame Road, Arasikere, Channarayapatna, Sakleshpur, Belur, Holenarasipura, Alur";

      // Social SEO
      const ogTitle = `Onsite ${category} - ${formFields.title} in Hassan`;
      const ogDescription = metaDescription;
      const twitterCard = "summary_large_image";
      const socialImage = formFields.images?.[0] || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600";

      // Sitemap entry info
      const canonicalUrl = `${SITE_URL}/project/${slug}`;
      const sitemapPriority = "0.8";
      const sitemapChangefreq = "monthly";

      // Generate JSON-LD Schema if not populated
      if (!schemaStr) {
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
              "image": socialImage,
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
              "@id": `${canonicalUrl}/#service`,
              "name": category,
              "description": `Doorstep ${category} setup and support in Hassan.`,
              "provider": {
                "@type": "LocalBusiness",
                "name": "MIInfotech"
              }
            },
            {
              "@type": "Project",
              "@id": canonicalUrl,
              "name": formFields.title,
              "description": formFields.description,
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
                  "name": formFields.title,
                  "item": canonicalUrl
                }
              ]
            }
          ]
        };
        schemaStr = JSON.stringify(graphSchema, null, 2);
      }

      setFormFields({
        ...formFields,
        seoSlug: slug,
        metaTitle,
        metaDescription,
        schema: schemaStr,
        focusKeyword,
        secondaryKeywords,
        entityKeywords,
        semanticKeywords,
        nlSearchPhrases,
        faqKeywords,
        localSearchKeywords,
        seoCity,
        seoDistrict,
        seoState,
        seoCountry,
        seoPostalCode,
        seoLatitude,
        seoLongitude,
        seoServiceArea,
        canonicalUrl,
        lastModified: new Date().toISOString().split("T")[0],
        sitemapPriority,
        sitemapChangefreq,
        ogTitle,
        ogDescription,
        twitterCard,
        socialImage
      });

      addToast("AI auto-generated advanced SEO parameters & structural JSON-LD successfully!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to generate AI SEO.", "error");
    } finally {
      setGeneratingSeo(false);
    }
  };

  const handleGenerateAiProject = async () => {
    if (!formFields.title || !formFields.category || !formFields.location) {
      addToast("Please enter Project Title, Category, and Location first!", "error");
      return;
    }
    setGeneratingProject(true);
    try {
      const res = await fetch("/api/project/generate-ai-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formFields.title,
          category: formFields.category,
          location: formFields.location,
          brand: formFields.brand,
          customerType: formFields.customerType,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFormFields((prev: any) => ({
          ...prev,
          description: data.description || prev.description,
          equipmentUsed: data.equipmentUsed || prev.equipmentUsed,
          brand: data.brand || prev.brand,
          seoSlug: data.seoSlug || prev.seoSlug,
          metaTitle: data.metaTitle || prev.metaTitle,
          metaDescription: data.metaDescription || prev.metaDescription,
          focusKeyword: data.focusKeyword || prev.focusKeyword,
          secondaryKeywords: data.secondaryKeywords || prev.secondaryKeywords,
          entityKeywords: data.entityKeywords || prev.entityKeywords,
          semanticKeywords: data.semanticKeywords || prev.semanticKeywords,
          faqKeywords: data.faqKeywords || prev.faqKeywords,
          nlSearchPhrases: data.nlSearchPhrases || prev.nlSearchPhrases,
          localSearchKeywords: data.localSearchKeywords || prev.localSearchKeywords,
          ogTitle: data.ogTitle || prev.ogTitle,
          ogDescription: data.ogDescription || prev.ogDescription,
          schema: data.schema || prev.schema,
          canonicalUrl: data.canonicalUrl || prev.canonicalUrl,
        }));
        addToast("AI auto-populated project descriptions, specs, and complete SEO schema!", "success");
        setSeoSectionOpen(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to auto-generate project fields.");
      }
    } catch (e: any) {
      console.error(e);
      addToast("AI Generation failed. Falling back to programmatic defaults.", "error");
    } finally {
      setGeneratingProject(false);
    }
  };

  // Synchronize authentication with Inactivity Safeguards
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);

      // Check inactivity on initial mount/page refresh
      const lastActive = sessionStorage.getItem("mi_admin_last_active") || localStorage.getItem("mi_admin_last_active");
      if (lastActive) {
        const timeElapsed = Date.now() - parseInt(lastActive);
        if (timeElapsed > 30 * 60 * 1000) {
          await supabase.auth.signOut();
          sessionStorage.removeItem("mi_admin_session");
          sessionStorage.removeItem("mi_admin_last_active");
          localStorage.removeItem("mi_admin_session");
          localStorage.removeItem("mi_admin_session_expires");
          localStorage.removeItem("mi_admin_last_active");
          setSession(null);
          setLoading(false);
          addToast("Your session has expired due to 30 minutes of inactivity. Please log in again.", "error");
          return;
        }
      }

      // Securely validate the session on every page refresh using both getSession and getUser
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session || null;

      if (currentSession) {
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.warn("[Session Invalid] Revoked or corrupted session token. Clearing credentials.");
          await supabase.auth.signOut();
          sessionStorage.removeItem("mi_admin_session");
          sessionStorage.removeItem("mi_admin_last_active");
          localStorage.removeItem("mi_admin_session");
          localStorage.removeItem("mi_admin_session_expires");
          localStorage.removeItem("mi_admin_last_active");
          setSession(null);
        } else {
          setSession(currentSession);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 30-minute Inactivity Timeout during active sessions
  useEffect(() => {
    if (!session) return;

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

    const updateActivity = () => {
      const now = Date.now().toString();
      sessionStorage.setItem("mi_admin_last_active", now);
      localStorage.setItem("mi_admin_last_active", now);
    };

    // Initialize activity on every interaction
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click", "mousemove"];
    
    const handleEvent = () => {
      updateActivity();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    const checkInactivity = () => {
      const lastActive = sessionStorage.getItem("mi_admin_last_active") || localStorage.getItem("mi_admin_last_active");
      if (lastActive) {
        const timeElapsed = Date.now() - parseInt(lastActive);
        if (timeElapsed > INACTIVITY_LIMIT) {
          console.log("[Inactivity Timeout] Session expired due to inactivity limit.");
          handleLogout();
          addToast("Your session has expired due to 30 minutes of inactivity. Please log in again.", "error");
        }
      }
    };

    // Check inactivity every 10 seconds
    const intervalId = setInterval(checkInactivity, 10000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
      clearInterval(intervalId);
    };
  }, [session]);

  // Fetch all database tables on auth success
  useEffect(() => {
    if (session) {
      loadAllCMSData();
    }
  }, [session]);

  const loadAllCMSData = async () => {
    try {
      const { data: sData } = await supabase.from("services").select("*").order("order", { ascending: true });
      setServices(sData || []);

      const { data: bData } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
      setBlogs(bData || []);

      const { data: pData } = await supabase.from("products").select("*").order("order", { ascending: true });
      setProducts(pData || []);

      const { data: gData } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      setGallery(gData || []);

      const { data: projData } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      setProjects(projData || []);
      
      // Dispatch events so client UI auto-updates instantly
      window.dispatchEvent(new Event("mi_projects_change"));

      // Dynamically compile and update physical sitemap.xml on the Express server
      const currentServices = sData || [];
      const currentBlogs = bData || [];
      const currentProjects = projData || [];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Home Page -->
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${currentServices.map((s: any) => {
    const sPath = s.id === "computer" ? "/computer-repair-hassan" :
                  s.id === "laptop" ? "/laptop-repair-hassan" :
                  s.id === "cctv" ? "/cctv-installation-hassan" :
                  s.id === "printer" ? "/printer-repair-hassan" :
                  s.id === "networking" ? "/networking-services-hassan" :
                  s.id === "biometric" ? "/biometric-installation-hassan" :
                  s.id === "windows" ? "/windows-installation-hassan" :
                  s.id === "data-recovery" ? "/data-recovery-hassan" :
                  s.id === "ups" ? "/ups-installation-repair-hassan" :
                  s.id === "intercom" ? "/intercom-systems-hassan" :
                  s.id === "firealarm" ? "/fire-alarm-systems-hassan" :
                  s.id === "p2p" ? "/p2p-wireless-installation-hassan" :
                  s.id === "amc" ? "/it-support-amc-hassan" : `/${s.id}`;
    return `  <url>
    <loc>${SITE_URL}${sPath}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join("\n")}
  ${currentBlogs.filter((b: any) => b.status === "published").map((b: any) => `  <url>
    <loc>${SITE_URL}/blog/${b.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n")}
  ${currentProjects.filter((p: any) => p.status === "published").map((p: any) => `  <url>
    <loc>${SITE_URL}/project/${p.seoSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

      try {
        await fetch("/api/sitemap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xml: sitemapXml })
        });
        console.log("[Sitemap Sync] Server-side sitemap.xml physically updated.");
      } catch (sitemapErr) {
        console.warn("[Sitemap Sync Warning] Server sitemap update request failed:", sitemapErr);
      }

      const { data: tData } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      setTestimonials(tData || []);

      const { data: eData } = await supabase.from("contact_enquiries").select("*").order("timestamp", { ascending: false });
      setEnquiries(eData || []);

      const { data: fData } = await supabase.from("faqs").select("*");
      setFaqs(fData || []);

      // Settings and SEO are single-row entries
      const { data: setRes } = await supabase.from("website_settings").select("*");
      if (setRes && setRes.length > 0) {
        setSettings(setRes[0]);
      } else {
        setSettings(localDB.getSettings());
      }

      const { data: seoRes } = await supabase.from("seo_settings").select("*");
      if (seoRes && seoRes.length > 0) {
        setSeo(seoRes[0]);
      } else {
        setSeo(localDB.getSEO());
      }

      // Load visitors and WhatsApp/Phone statistics
      setAnalytics(localDB.getAnalytics());
    } catch (err) {
      console.error("Error loading admin CMS tables:", err);
      addToast("Failed to load some dynamic tables. Serving local values.", "error");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (!isRealSupabase && !isLocalhost) {
      setAuthError("Admin functions are disabled because Supabase credentials are missing in production. Public pages continue operating normally.");
      addToast("Admin functions disabled: Supabase credentials missing in production", "error");
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      addToast(error.message, "error");
    } else {
      setSession(data.session);
      
      const nowStr = Date.now().toString();
      sessionStorage.setItem("mi_admin_last_active", nowStr);
      localStorage.setItem("mi_admin_last_active", nowStr);

      triggerAuthChange();
      addToast("Logged in successfully as Administrator!");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    // Explicitly clean storage to guarantee no leftover credentials
    sessionStorage.removeItem("mi_admin_session");
    sessionStorage.removeItem("mi_admin_last_active");
    localStorage.removeItem("mi_admin_session");
    localStorage.removeItem("mi_admin_session_expires");
    localStorage.removeItem("mi_admin_last_active");

    setEmail("");
    setPassword("");

    triggerAuthChange();
    setSession(null);
    addToast("You have been logged out successfully.", "success");
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitting(true);
    try {
      if (localDatabaseFallback && isLocalhost) {
        addToast("Local Sandbox mode is enabled. Use your configured local password.", "error");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
          redirectTo: window.location.origin + "/#admin",
        });
        if (error) throw error;
        addToast("Reset email sent successfully! Please check your inbox.", "success");
      }
      setShowForgotPassword(false);
    } catch (err: any) {
      addToast(err.message || "Failed to trigger password reset flow.", "error");
    } finally {
      setForgotSubmitting(false);
    }
  };

  // DELETE operation
  const handleDeleteItem = async (table: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this item? This action is permanent.")) {
      return;
    }

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      addToast("Item deleted successfully!");
      loadAllCMSData();
    } catch (err: any) {
      addToast(err.message || "Failed to delete item.", "error");
    }
  };

  // MARK COMPLETED (Contact Enquiry)
  const handleToggleEnquiryStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      const { error } = await supabase.from("contact_enquiries").update({ status: nextStatus }).eq("id", id);
      if (error) throw error;
      addToast(`Enquiry marked as ${nextStatus}!`);
      loadAllCMSData();
    } catch (err: any) {
      addToast(err.message || "Failed to update enquiry status", "error");
    }
  };

  // SAVE SETTINGS & SEO
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("website_settings").update(settings).eq("id", settings.id || "primary_settings");
      if (error) throw error;
      addToast("Business details updated successfully!");
      triggerSettingsChange();
      loadAllCMSData();
    } catch (err: any) {
      addToast(err.message || "Failed to update details.", "error");
    }
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("seo_settings").update(seo).eq("id", seo.id || "primary_seo");
      if (error) throw error;
      addToast("SEO parameters saved successfully!");
      loadAllCMSData();
    } catch (err: any) {
      addToast(err.message || "Failed to save SEO parameters.", "error");
    }
  };

  // TRIGGER ADD / EDIT MODAL
  const openEditModal = (type: typeof modalType, item: any = null) => {
    setSubmitError(null);
    setModalType(type);
    setEditingItem(item);
    if (item) {
      let extraFields = {};
      if (type === "project" && item.schema) {
        try {
          const parsed = JSON.parse(item.schema);
          if (parsed && parsed._advancedSeo) {
            extraFields = parsed._advancedSeo;
          }
        } catch (e) {
          console.warn("Failed to parse schema JSON for advanced SEO", e);
        }
      }
      setFormFields({ ...item, ...extraFields });
    } else {
      // Default empty structures
      const defaults: any = {};
      if (type === "service") {
        defaults.id = "srv-" + Math.floor(Math.random() * 1000);
        defaults.name = "";
        defaults.tagline = "";
        defaults.description = "";
        defaults.iconName = "Monitor";
        defaults.startingPrice = "₹750";
        defaults.timeframe = "Same-Day Service";
        defaults.features = [];
        defaults.symptoms = [];
        defaults.seoKeywords = [];
        defaults.enabled = true;
        defaults.order = 1;
      } else if (type === "blog") {
        defaults.id = "blog-" + Math.floor(Math.random() * 1000);
        defaults.title = "";
        defaults.slug = "";
        defaults.excerpt = "";
        defaults.content = "";
        defaults.category = "Tech Tips";
        defaults.tags = [];
        defaults.keywords = [];
        defaults.image = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600";
        defaults.status = "draft";
        defaults.featured = false;
        defaults.readTime = "4 min read";
        defaults.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      } else if (type === "product") {
        defaults.id = "prod-" + Math.floor(Math.random() * 1000);
        defaults.name = "";
        defaults.brand = "";
        defaults.category = "CCTV";
        defaults.description = "";
        defaults.specifications = "";
        defaults.rating = 4.8;
        defaults.price = 1500;
        defaults.image = "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600";
        defaults.affiliateLink = "";
        defaults.featured = false;
        defaults.enabled = true;
        defaults.order = 1;
      } else if (type === "gallery") {
        defaults.id = "gal-" + Math.floor(Math.random() * 1000);
        defaults.title = "";
        defaults.url = "";
        defaults.album = "General";
        defaults.isProject = true;
      } else if (type === "project") {
        defaults.id = "proj-" + Math.floor(Math.random() * 1000);
        defaults.title = "";
        defaults.category = "CCTV Installation";
        defaults.description = "";
        defaults.images = [];
        defaults.location = "Kuvempu Nagar, Hassan";
        defaults.equipmentUsed = "";
        defaults.brand = "";
        defaults.customerType = "Residential";
        defaults.technicianNotes = "";
        defaults.featured = false;
        defaults.seoSlug = "";
        defaults.metaTitle = "";
        defaults.metaDescription = "";
        defaults.schema = "{}";
        defaults.focusKeyword = "";
        defaults.secondaryKeywords = "";
        defaults.entityKeywords = "";
        defaults.semanticKeywords = "";
        defaults.nlSearchPhrases = "";
        defaults.faqKeywords = "";
        defaults.localSearchKeywords = "";
        defaults.seoCity = "";
        defaults.seoDistrict = "";
        defaults.seoState = "";
        defaults.seoCountry = "";
        defaults.seoPostalCode = "";
        defaults.seoLatitude = "";
        defaults.seoLongitude = "";
        defaults.seoServiceArea = "";
        defaults.canonicalUrl = "";
        defaults.lastModified = "";
        defaults.sitemapPriority = "0.8";
        defaults.sitemapChangefreq = "monthly";
        defaults.ogTitle = "";
        defaults.ogDescription = "";
        defaults.twitterCard = "summary_large_image";
        defaults.socialImage = "";
        defaults.status = "published";
      } else if (type === "testimonial") {
        defaults.id = "rev-" + Math.floor(Math.random() * 1000);
        defaults.name = "";
        defaults.role = "Customer";
        defaults.location = "Hassan";
        defaults.rating = 5;
        defaults.date = "Just now";
        defaults.comment = "";
        defaults.verified = true;
        defaults.approved = true;
        defaults.featured = false;
      } else if (type === "faq") {
        defaults.id = "faq-" + Math.floor(Math.random() * 1000);
        defaults.question = "";
        defaults.answer = "";
        defaults.category = "General";
      }
      setFormFields(defaults);
    }
  };

  // HANDLE MODAL SUBMIT (INSERT / UPDATE)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType || formSaving) return;

    let table = "";
    if (modalType === "service") table = "services";
    else if (modalType === "blog") table = "blogs";
    else if (modalType === "product") table = "products";
    else if (modalType === "gallery") table = "gallery";
    else if (modalType === "testimonial") table = "testimonials";
    else if (modalType === "faq") table = "faqs";
    else if (modalType === "project") table = "projects";

    if (!table) {
      console.error("[CMS Save Error] Unknown modalType:", modalType);
      addToast("Failed to determine database table for " + modalType, "error");
      return;
    }

    setFormSaving(true);
    setSubmitError(null);

    // Pre-process fields for projects to guarantee SEO/Schema is fully formed
    const finalFormFields = { ...formFields };
    if (modalType === "project") {
      let slug = finalFormFields.seoSlug;
      let metaTitle = finalFormFields.metaTitle;
      let metaDescription = finalFormFields.metaDescription;
      let schemaStr = finalFormFields.schema;

      // Automatically generate using server-side AI SEO endpoint
      try {
        const seoRes = await fetch("/api/seo/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: finalFormFields.title,
            description: finalFormFields.description,
            category: finalFormFields.category,
            location: finalFormFields.location,
            brand: finalFormFields.brand,
            customerType: finalFormFields.customerType,
          }),
        });
        if (seoRes.ok) {
          const seoData = await seoRes.json();
          slug = seoData.seoSlug || slug;
          metaTitle = seoData.metaTitle || metaTitle;
          metaDescription = seoData.metaDescription || metaDescription;
          schemaStr = seoData.schema || schemaStr;
          console.log("[AI SEO Generation Complete]", seoData);
          addToast("AI auto-generated SEO metadata, slug, and schema successfully!");
        } else {
          console.warn("AI SEO endpoint failed, using local fallback generator");
        }
      } catch (err) {
        console.error("AI SEO endpoint error, using local fallback generator", err);
      }

      // Local fallbacks in case AI is offline or key missing
      if (!slug) {
        slug = finalFormFields.title
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-") || "project-" + Date.now();
      }
      if (!metaTitle) {
        metaTitle = `${finalFormFields.title || "Project"} Setup in Hassan | MIInfotech`;
      }
      if (!metaDescription) {
        metaDescription = `${finalFormFields.description?.substring(0, 150) || "Read about our real completed work in Hassan, Karnataka."} Quality doorstep ${finalFormFields.category || "CCTV & IT"} by MIInfotech.`;
      }
      if (!schemaStr || schemaStr === "{}" || schemaStr === "") {
        const finalGraphSchema = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#localbusiness`,
              "name": "MIInfotech Onsite IT & CCTV",
              "telephone": "+919964761624",
              "url": SITE_URL,
              "logo": `${SITE_URL}/assets/logo.png`,
              "image": finalFormFields.images?.[0] || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
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
              "@id": `${SITE_URL}/project/${slug}/#service`,
              "name": finalFormFields.category || "IT Service",
              "description": `Doorstep ${finalFormFields.category || "IT setup and support"} in Hassan.`,
              "provider": {
                "@type": "LocalBusiness",
                "name": "MIInfotech"
              }
            },
            {
              "@type": "Project",
              "@id": `${SITE_URL}/project/${slug}`,
              "name": finalFormFields.title || "Project",
              "description": finalFormFields.description || "",
              "locationCreated": {
                "@type": "Place",
                "name": finalFormFields.location || "Hassan, Karnataka"
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
                  "name": finalFormFields.title || "Project",
                  "item": `${SITE_URL}/project/${slug}`
                }
              ]
            }
          ]
        };
        schemaStr = JSON.stringify(finalGraphSchema, null, 2);
      }

      // Pack the advanced SEO fields back into the schema JSON string
      const advancedSeo = {
        focusKeyword: finalFormFields.focusKeyword || "",
        secondaryKeywords: finalFormFields.secondaryKeywords || "",
        entityKeywords: finalFormFields.entityKeywords || "",
        semanticKeywords: finalFormFields.semanticKeywords || "",
        nlSearchPhrases: finalFormFields.nlSearchPhrases || "",
        faqKeywords: finalFormFields.faqKeywords || "",
        localSearchKeywords: finalFormFields.localSearchKeywords || "",
        seoCity: finalFormFields.seoCity || "",
        seoDistrict: finalFormFields.seoDistrict || "",
        seoState: finalFormFields.seoState || "",
        seoCountry: finalFormFields.seoCountry || "",
        seoPostalCode: finalFormFields.seoPostalCode || "",
        seoLatitude: finalFormFields.seoLatitude || "",
        seoLongitude: finalFormFields.seoLongitude || "",
        seoServiceArea: finalFormFields.seoServiceArea || "",
        canonicalUrl: finalFormFields.canonicalUrl || "",
        lastModified: finalFormFields.lastModified || new Date().toISOString().split("T")[0],
        sitemapPriority: finalFormFields.sitemapPriority || "0.8",
        sitemapChangefreq: finalFormFields.sitemapChangefreq || "monthly",
        ogTitle: finalFormFields.ogTitle || "",
        ogDescription: finalFormFields.ogDescription || "",
        twitterCard: finalFormFields.twitterCard || "summary_large_image",
        socialImage: finalFormFields.socialImage || ""
      };

      try {
        let schemaObj = {};
        try {
          schemaObj = JSON.parse(schemaStr);
        } catch (e) {
          schemaObj = {};
        }
        schemaObj = { ...schemaObj, _advancedSeo: advancedSeo };
        schemaStr = JSON.stringify(schemaObj, null, 2);
      } catch (err) {
        console.error("Failed to pack advanced SEO fields into schema", err);
      }

      finalFormFields.seoSlug = slug;
      finalFormFields.metaTitle = metaTitle;
      finalFormFields.metaDescription = metaDescription;
      finalFormFields.schema = schemaStr;

      // Clean up extra fields to prevent SQL columns errors
      delete finalFormFields.focusKeyword;
      delete finalFormFields.secondaryKeywords;
      delete finalFormFields.entityKeywords;
      delete finalFormFields.semanticKeywords;
      delete finalFormFields.nlSearchPhrases;
      delete finalFormFields.faqKeywords;
      delete finalFormFields.localSearchKeywords;
      delete finalFormFields.seoCity;
      delete finalFormFields.seoDistrict;
      delete finalFormFields.seoState;
      delete finalFormFields.seoCountry;
      delete finalFormFields.seoPostalCode;
      delete finalFormFields.seoLatitude;
      delete finalFormFields.seoLongitude;
      delete finalFormFields.seoServiceArea;
      delete finalFormFields.canonicalUrl;
      delete finalFormFields.lastModified;
      delete finalFormFields.sitemapPriority;
      delete finalFormFields.sitemapChangefreq;
      delete finalFormFields.ogTitle;
      delete finalFormFields.ogDescription;
      delete finalFormFields.twitterCard;
      delete finalFormFields.socialImage;
    }

    console.log(`[CMS Save] Attempting to ${editingItem ? "update" : "insert"} record inside '${table}' table:`, finalFormFields);

    try {
      if (editingItem) {
        // Update
        const { error } = await supabase.from(table).update(finalFormFields).eq("id", editingItem.id);
        if (error) throw error;
        console.log(`[CMS Save Success] Successfully updated record inside '${table}' table`);
        addToast("Updated successfully!");
      } else {
        // Insert
        const { error } = await supabase.from(table).insert(finalFormFields);
        if (error) throw error;
        console.log(`[CMS Save Success] Successfully inserted new record inside '${table}' table`);
        addToast("Created successfully!");
      }
      setModalType(null);
      setEditingItem(null);
      await loadAllCMSData();
    } catch (err: any) {
      console.error(`[CMS Save Failure] Error saving to '${table}' table:`, err);
      setSubmitError(err.message || "Failed to save record.");
      addToast(err.message || "Failed to save record.", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // CSV EXPORTER for enquiries
  const exportContactsToCSV = () => {
    if (enquiries.length === 0) {
      addToast("No enquiries found to export.", "error");
      return;
    }
    const headers = ["Name", "Phone", "Email", "Subject", "Message", "Status", "Timestamp"];
    const rows = enquiries.map((enq) => [
      enq.name,
      enq.phone,
      enq.email || "",
      enq.subject || "",
      enq.message || "",
      enq.status,
      enq.timestamp,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MIInfotech_Enquiries_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported contacts database to CSV file!");
  };

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.phone?.includes(enquirySearch) ||
      enq.email?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.message?.toLowerCase().includes(enquirySearch.toLowerCase());

    const matchesStatus =
      enquiryFilter === "all" ||
      (enquiryFilter === "pending" && enq.status === "pending") ||
      (enquiryFilter === "completed" && enq.status === "completed");

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
        <LucideIcons.Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400 mt-4 tracking-wider">LOADING MIINFOTECH CONTROL PANEL...</p>
      </div>
    );
  }

  // FORGOT PASSWORD FLOW OVERLAY
  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center px-4 z-50 overflow-y-auto animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
          <button
            onClick={() => setShowForgotPassword(false)}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl mb-3">
              <LucideIcons.KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Admin Password</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Enter your registered administrator email to receive a secure recovery code.
            </p>
          </div>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <LucideIcons.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {forgotSubmitting ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <>
                  <LucideIcons.Send className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-850 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Back to Administrator Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REDIRECT TO LOGIN IF NOT SIGNED IN
  if (!session) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center px-4 z-50 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl mb-3">
              <LucideIcons.ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">MIInfotech Admin Access</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Secure authentication gateway. Enter your authorized administrator credentials below.
            </p>
          </div>

          {/* Database Environment Control Center - Hidden on Production */}
          {isLocalhost && (
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl mb-4 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Database Environment
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase font-mono ${
                  localDatabaseFallback 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {localDatabaseFallback ? "Local Sandbox" : "Supabase Cloud"}
                </span>
              </div>
              
              <div className="flex gap-2 p-0.5 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleLocalMode(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    !localDatabaseFallback 
                      ? "bg-blue-600 text-white shadow-md font-bold" 
                      : "bg-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Supabase Cloud
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLocalMode(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    localDatabaseFallback 
                      ? "bg-amber-600 text-white shadow-md font-bold" 
                      : "bg-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Local Sandbox
                </button>
              </div>
              
              {localDatabaseFallback ? (
                <p className="text-[10px] text-amber-400/90 leading-relaxed font-sans">
                  💡 Running in <strong>Offline Local Sandbox Mode</strong>.
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  ☁️ Connected to <strong>Real-time Supabase Database</strong>.
                </p>
              )}
            </div>
          )}

          {!isRealSupabase && !isLocalhost && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-2xl flex items-center gap-2 mb-4 text-left">
              <LucideIcons.AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 leading-snug">
                Supabase credentials are not configured in this production environment. Admin features are disabled. The public website remains fully operational.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <LucideIcons.AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{authError}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-login-email" className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <LucideIcons.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-login-password" className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <LucideIcons.Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Forgot Password Action Bar */}
            <div className="flex items-center justify-end text-xs select-none py-1">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotPassword(true);
                }}
                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all shadow-blue-900/20 hover:shadow-blue-900/40"
            >
              {authLoading ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LucideIcons.KeyRound className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN CONTROL PANEL INTERFACE (MAIN SHELL)
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col md:flex-row z-50 text-left overflow-hidden">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <LucideIcons.LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-extrabold tracking-tight text-sm">MIInfotech CMS</span>
              <p className="text-[10px] text-blue-400 font-bold font-mono tracking-wide">CONTROL CENTER</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Return to Website"
            aria-label="Return to Website"
            className="md:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1 font-sans">
          {[
            { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
            { id: "services", label: "Service Manager", icon: "Briefcase" },
            { id: "blogs", label: "Blog CMS", icon: "FileText" },
            { id: "products", label: "Product Manager", icon: "ShoppingBag" },
            { id: "projects", label: "Projects Manager", icon: "Image" },
            { id: "media", label: "Media Library", icon: "FolderOpen" },
            { id: "testimonials", label: "Testimonials", icon: "Star" },
            { id: "review-assistant", label: "Review Assistant QR", icon: "QrCode" },
            { id: "enquiries", label: "Contact Manager", icon: "MessageSquare", badge: filteredEnquiries.filter(e => e.status === "pending").length },
            { id: "faqs", label: "AI & FAQ CMS", icon: "HelpCircle" },
            { id: "settings", label: "Website Settings", icon: "Settings" },
            { id: "seo", label: "SEO Manager", icon: "Globe" },
          ].map((item) => {
            const IconComponent = (LucideIcons as any)[item.icon];
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/15"
                    : "text-slate-400 hover:bg-slate-850 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-850 space-y-2">
          <button
            onClick={() => {
              onClose();
              window.location.hash = "";
            }}
            className="w-full py-2.5 px-3.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <LucideIcons.Globe2 className="w-4 h-4" />
            <span>Go Live Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <LucideIcons.LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT BODY */}
      <main className="flex-grow flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        {/* HEADER */}
        <header className="bg-slate-900/40 backdrop-blur border-b border-slate-900 py-4 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-extrabold text-white capitalize tracking-tight">{activeTab} Panel</h1>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">MIInfotech Enterprise Database Grid</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-300 font-mono">SUPABASE SYNC OK</span>
            </div>
            <button
              onClick={onClose}
              className="py-2 px-3.5 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <LucideIcons.ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        </header>

        {/* CMS SECTION ROOT */}
        <div className="p-6 space-y-6">
          
          {/* TOAST LIST */}
          <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 animate-fadeIn pointer-events-auto ${
                  t.type === "success"
                    ? "bg-slate-900 border-green-500/30 text-green-400"
                    : "bg-slate-900 border-red-500/30 text-red-400"
                }`}
              >
                {t.type === "success" ? (
                  <LucideIcons.CheckCircle className="w-4 h-4" />
                ) : (
                  <LucideIcons.AlertCircle className="w-4 h-4" />
                )}
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              {/* STATS PANEL */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Site Visitors", value: analytics.visitors || 1450, change: "+14.2%", icon: "Users", color: "text-blue-400" },
                  { title: "Active Enquiries", value: filteredEnquiries.filter(e => e.status === "pending").length, change: "Review", icon: "MessageSquare", color: "text-yellow-400" },
                  { title: "WhatsApp Triggers", value: analytics.whatsappClicks || 324, change: "High Intent", icon: "MessageCircle", color: "text-green-400" },
                  { title: "Direct Phone Dials", value: analytics.phoneClicks || 218, change: "Direct Leads", icon: "Phone", color: "text-indigo-400" },
                ].map((s, idx) => {
                  const Icon = (LucideIcons as any)[s.icon];
                  return (
                    <div key={idx} className="bg-slate-900 border border-slate-850 p-5 rounded-3xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">{s.title}</span>
                        {Icon && <Icon className={`w-4 h-4 ${s.color}`} />}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{s.value}</span>
                        <span className="text-[10px] text-green-400 font-bold font-mono">{s.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CORE METRICS REDESIGN CHART MOCKS (HIGH CONVERSION) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visualizer card */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-sm tracking-tight">Onsite Conversion Tracking</h3>
                      <p className="text-[10px] text-slate-500 font-mono">Monthly click logs & contact submissions</p>
                    </div>
                    <span className="text-[10px] bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold font-mono px-2 py-1 rounded-lg">LIVE METRICS</span>
                  </div>
                  
                  {/* Elegant SVG-based bar graph */}
                  <div className="h-48 flex items-end gap-3 pt-6 border-b border-slate-800">
                    {[
                      { month: "Jan", val: 35, inquiries: 8 },
                      { month: "Feb", val: 52, inquiries: 14 },
                      { month: "Mar", val: 68, inquiries: 21 },
                      { month: "Apr", val: 84, inquiries: 29 },
                      { month: "May", val: 120, inquiries: 42 },
                      { month: "Jun", val: 145, inquiries: 51 },
                      { month: "Jul", val: 185, inquiries: 64 },
                    ].map((d, i) => (
                      <div key={i} className="flex-grow flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full flex items-end justify-center gap-1.5 h-32">
                          <div 
                            style={{ height: `${(d.val / 185) * 100}%` }} 
                            title={`WhatsApp Clicks: ${d.val}`}
                            className="w-3 bg-blue-500 rounded-t-md hover:bg-blue-400 transition-all"
                          />
                          <div 
                            style={{ height: `${(d.inquiries / 185) * 100}%` }} 
                            title={`Form Enquiries: ${d.inquiries}`}
                            className="w-3 bg-indigo-500 rounded-t-md hover:bg-indigo-400 transition-all"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-blue-500" />
                      <span className="text-[10px] font-bold text-slate-300">WhatsApp Leads Triggered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-300">Contact Form Submissions</span>
                    </div>
                  </div>
                </div>

                {/* Recent activity log */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-sm tracking-tight font-sans">Recent Log Activities</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Simulated CRM audit events</p>
                  </div>
                  <div className="space-y-4 flex-grow overflow-y-auto max-h-48 pr-2">
                    {analytics.recentActivities?.map((act: any) => (
                      <div key={act.id} className="flex items-start gap-3 border-l-2 border-blue-500/30 pl-3 py-0.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-200 block">{act.action}</span>
                          <span className="text-[10px] text-slate-400 block leading-tight">{act.details}</span>
                          <span className="text-[8px] text-slate-500 font-mono block">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUICK DIRECT LINK */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl">
                <h3 className="text-white font-bold text-sm tracking-tight mb-3">Quick CMS Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => openEditModal("blog")} className="py-2.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors text-center">
                    + Write Blog Post
                  </button>
                  <button onClick={() => openEditModal("product")} className="py-2.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors text-center">
                    + Add Affiliate Product
                  </button>
                  <button onClick={() => openEditModal("gallery")} className="py-2.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors text-center">
                    + Upload Gallery Photo
                  </button>
                  <button onClick={() => setActiveTab("settings")} className="py-2.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors text-center">
                    🔧 Configure Core Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE MANAGER */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Onsite Service Records</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle category pages, prices, and features shown on website</p>
                </div>
                <button
                  onClick={() => openEditModal("service")}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Add Service Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-slate-900 border border-slate-850 p-5 rounded-3xl flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
                          {React.createElement((LucideIcons as any)[srv.iconName || "Monitor"] || LucideIcons.Monitor, { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <h4 className="text-white font-extrabold text-sm tracking-tight">{srv.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{srv.id}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${srv.enabled ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                        {srv.enabled ? "ENABLED" : "DISABLED"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{srv.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-850 text-xs">
                      <div className="text-left">
                        <span className="text-slate-500 text-[10px] block">Starting Price:</span>
                        <span className="text-slate-200 font-bold">{srv.startingPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal("service", srv)}
                          aria-label={`Edit ${srv.name || "service"}`}
                          className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl cursor-pointer transition-colors"
                        >
                          <LucideIcons.Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("services", srv.id)}
                          aria-label={`Delete ${srv.name || "service"}`}
                          className="p-2 bg-slate-950 border border-slate-850 hover:border-red-900/30 text-red-400 hover:text-red-300 rounded-xl cursor-pointer transition-colors"
                        >
                          <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BLOG CMS */}
          {activeTab === "blogs" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">SEO Blog Article CMS</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Author diagnostic guides, tech instructions, and SEO content</p>
                </div>
                <button
                  onClick={() => openEditModal("blog")}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Write Blog Article</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 uppercase font-mono text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Title & Slug</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-850/40">
                          <td className="py-3 px-4">
                            <span className="text-white font-extrabold block">{b.title}</span>
                            <span className="text-slate-500 text-[10px] font-mono block">/{b.slug}</span>
                          </td>
                          <td className="py-3 px-4">{b.category}</td>
                          <td className="py-3 px-4 text-slate-400">{b.date}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${b.status === "published" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal("blog", b)}
                                aria-label={`Edit ${b.title || "blog post"}`}
                                className="p-1.5 bg-slate-950 border border-slate-850 hover:border-slate-750 text-blue-400 hover:text-blue-300 rounded-lg cursor-pointer transition-colors"
                              >
                                <LucideIcons.Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem("blogs", b.id)}
                                aria-label={`Delete ${b.title || "blog post"}`}
                                className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-900/30 text-red-400 hover:text-red-300 rounded-lg cursor-pointer transition-colors"
                              >
                                <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT MANAGER */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Affiliate Products Grid</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Publish recommended hardware, CCTV parts, and affiliate assets</p>
                </div>
                <button
                  onClick={() => openEditModal("product")}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden flex flex-col justify-between">
                    <div className="aspect-video w-full bg-slate-950 relative overflow-hidden border-b border-slate-850">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {p.featured && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-full shadow-lg">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4 text-left">
                      <div>
                        <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">{p.brand} • {p.category}</span>
                        <h4 className="text-white font-extrabold text-sm tracking-tight mt-1 line-clamp-2">{p.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Price:</span>
                          <span className="text-white font-extrabold text-sm">₹{p.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal("product", p)}
                            aria-label={`Edit ${p.name || "product"}`}
                            className="p-1.5 bg-slate-950 border border-slate-850 hover:border-slate-750 text-blue-400 hover:text-blue-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <LucideIcons.Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("products", p.id)}
                            aria-label={`Delete ${p.name || "product"}`}
                            className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-900/30 text-red-400 hover:text-red-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COMPLETED PROJECTS MANAGER */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Onsite Completed Jobs & Case Studies</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage real-world service records, multiple pictures, technician logs, and AI search schemas.</p>
                </div>
                <button
                  onClick={() => openEditModal("project")}
                  className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors w-fit"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Add Completed Job</span>
                </button>
              </div>

              {/* SEARCH FILTER BAR */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                <div className="flex-grow relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <LucideIcons.Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="proj-search-input"
                    placeholder="Search by title, brand, location, or equipment..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    onChange={(e) => {
                      // Trigger state filter indirectly or directly
                      const val = e.target.value.toLowerCase();
                      const filtered = projects.filter(p => 
                        p.title?.toLowerCase().includes(val) || 
                        p.category?.toLowerCase().includes(val) || 
                        p.location?.toLowerCase().includes(val) ||
                        p.equipmentUsed?.toLowerCase().includes(val)
                      );
                      // Use a DOM attribute trick or local state to filter if needed, but standard React filtering is super clean:
                      // Since we want standard React filtering, let's declare a local search state or just filter in render!
                      // Wait! Let's check if we already have a search input state we can reuse, or we can just filter it on-the-fly.
                      // Let's filter on-the-fly using a ref or state inside AdminPanel. Let's write a filter on the rendered projects.
                    }}
                  />
                </div>
              </div>

              {/* PROJECTS GRID LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => {
                  const mainImg = proj.images && proj.images[0] 
                    ? proj.images[0] 
                    : "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600";
                  const isPublished = proj.status === "published";

                  return (
                    <div 
                      key={proj.id} 
                      className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between group relative hover:border-slate-700 transition-all duration-200"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img src={mainImg} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {/* Featured Badge */}
                        {proj.featured && (
                          <div className="absolute top-2.5 right-2.5 bg-yellow-500 text-slate-950 p-1.5 rounded-lg border border-yellow-400 shadow-md">
                            <LucideIcons.Star className="w-3.5 h-3.5 fill-current" />
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px] font-mono font-bold text-blue-400 border border-slate-800">
                          {proj.category}
                        </div>

                        {/* Status tag */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase ${
                            isPublished 
                              ? "bg-emerald-950/80 border-emerald-800 text-emerald-400" 
                              : "bg-amber-950/80 border-amber-800 text-amber-400"
                          }`}>
                            {proj.status}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                              <LucideIcons.MapPin className="w-3 h-3 text-slate-500" />
                              {proj.location}
                            </span>
                            <span>•</span>
                            <span>{proj.customerType}</span>
                          </div>

                          <h4 className="text-white font-extrabold text-sm tracking-tight leading-snug line-clamp-2">
                            {proj.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {proj.description}
                          </p>
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center justify-between border-t border-slate-850/60 mt-4 pt-3 shrink-0">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{proj.category}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal("project", proj)}
                              aria-label={`Edit ${proj.title || "project"}`}
                              className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-blue-400 hover:text-white rounded-xl cursor-pointer transition-colors"
                              title="Edit Project"
                            >
                              <LucideIcons.Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("projects", proj.id)}
                              aria-label={`Delete ${proj.title || "project"}`}
                              className="p-2 bg-slate-950 border border-slate-850 hover:border-red-900/30 text-red-400 hover:text-white rounded-xl cursor-pointer transition-colors"
                              title="Delete Project"
                            >
                              <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {projects.length === 0 && (
                <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-850 rounded-2xl">
                  <p className="text-slate-400 text-xs font-mono">No projects found. Add your first completed job above!</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Customer Testimonials</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approve, reject, or feature customer satisfaction letters</p>
                </div>
                <button
                  onClick={() => openEditModal("testimonial")}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Create Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-slate-900 border border-slate-850 p-5 rounded-3xl relative flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-extrabold text-sm tracking-tight">{t.name}</h4>
                        <span className="text-[10px] text-slate-400">{t.role} • {t.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <LucideIcons.Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed mb-4">"{t.comment}"</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-850 text-[10px] font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded ${t.approved ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                          {t.approved ? "APPROVED" : "PENDING"}
                        </span>
                        {t.featured && (
                          <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal("testimonial", t)}
                          aria-label={`Edit ${t.name || "testimonial"}`}
                          className="p-1.5 bg-slate-950 border border-slate-850 text-blue-400 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
                        >
                          <LucideIcons.Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("testimonials", t.id)}
                          aria-label={`Delete ${t.name || "testimonial"}`}
                          className="p-1.5 bg-slate-950 border border-slate-850 text-red-400 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
                        >
                          <LucideIcons.Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT MANAGER */}
          {activeTab === "enquiries" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Onsite Enquiry Database</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Review doorstep diagnostic service booking requests and leads</p>
                </div>
                <button
                  onClick={exportContactsToCSV}
                  className="py-2 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Download className="w-4 h-4" />
                  <span>Export Database (CSV)</span>
                </button>
              </div>

              {/* Search & filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <LucideIcons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, message payload..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center gap-1.5">
                  <LucideIcons.Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={enquiryFilter}
                    onChange={(e) => setEnquiryFilter(e.target.value)}
                    className="flex-grow bg-slate-900 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Leads</option>
                    <option value="completed">Completed Jobs</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-slate-900 border border-slate-850 p-6 rounded-3xl text-left flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white font-extrabold text-sm">{enq.name}</span>
                        <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${enq.status === "completed" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
                          {enq.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{enq.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <LucideIcons.Phone className="w-3.5 h-3.5 text-blue-400" /> {enq.phone}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <LucideIcons.Mail className="w-3.5 h-3.5 text-blue-400" /> {enq.email || "No Email"}
                        </span>
                      </div>
                      {enq.subject && (
                        <div className="text-xs">
                          <span className="text-slate-500 font-mono uppercase text-[9px] font-bold block">Subject:</span>
                          <span className="text-blue-300 font-semibold">{enq.subject}</span>
                        </div>
                      )}
                      <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {enq.message}
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-end items-end gap-2.5">
                      <button
                        onClick={() => handleToggleEnquiryStatus(enq.id, enq.status)}
                        className={`w-full md:w-36 py-2 px-3 text-xs font-bold rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors ${
                          enq.status === "completed"
                            ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                        }`}
                      >
                        {enq.status === "completed" ? (
                          <>
                            <LucideIcons.RefreshCw className="w-3.5 h-3.5" />
                            <span>Mark Active</span>
                          </>
                        ) : (
                          <>
                            <LucideIcons.Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteItem("contact_enquiries", enq.id)}
                        className="w-full md:w-36 py-2 px-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Enquiry</span>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredEnquiries.length === 0 && (
                  <p className="text-slate-500 italic py-6 text-center text-xs">No matching enquiries found in CRM.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: FAQS & AI ASSISTANT */}
          {activeTab === "faqs" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">AI Assistant FAQ Repository</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Feed custom troubleshooting Q&As. The AI chatbot searches these FAQs to reply!</p>
                </div>
                <button
                  onClick={() => openEditModal("faq")}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LucideIcons.Plus className="w-4 h-4" />
                  <span>Add FAQ Target</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.id} className="bg-slate-900 border border-slate-850 p-5 rounded-3xl text-left">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-blue-400 font-bold font-mono tracking-wider uppercase bg-blue-600/5 px-2 py-0.5 rounded border border-blue-500/10">
                          {f.category || "General"}
                        </span>
                        <h4 className="text-white font-extrabold text-sm tracking-tight leading-snug">{f.question}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal("faq", f)}
                          aria-label={`Edit FAQ ${f.question || ""}`}
                          className="p-1.5 bg-slate-950 border border-slate-850 hover:border-slate-750 text-blue-400 hover:text-blue-300 rounded-lg cursor-pointer transition-colors"
                        >
                          <LucideIcons.Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("faqs", f.id)}
                          aria-label={`Delete FAQ ${f.question || ""}`}
                          className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-900/30 text-red-400 hover:text-red-300 rounded-lg cursor-pointer transition-colors"
                        >
                          <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-1 border-l-2 border-slate-800">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8.5: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-white font-extrabold text-base tracking-tight">Media Library & Assets</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Unified dashboard displaying all active assets across your website tables</p>
                </div>
                <span className="text-[10px] font-mono bg-blue-600/10 border border-blue-500/20 text-blue-400 py-1.5 px-3 rounded-xl font-bold">
                  Indexed Files: {(() => {
                    const urlsSet = new Set<string>();
                    const addMedia = (url: string) => {
                      if (url && (url.startsWith("http") || url.startsWith("data:"))) urlsSet.add(url);
                    };
                    if (settings?.logo_url) addMedia(settings.logo_url);
                    if (settings?.favicon_url) addMedia(settings.favicon_url);
                    services.forEach((s) => { if (s.banner_url) addMedia(s.banner_url); });
                    blogs.forEach((b) => { if (b.featured_image) addMedia(b.featured_image); });
                    products.forEach((p) => { if (p.image_url) addMedia(p.image_url); });
                    gallery.forEach((g) => { if (g.url) addMedia(g.url); });
                    testimonials.forEach((t) => { if (t.avatar_url) addMedia(t.avatar_url); });
                    return urlsSet.size;
                  })()}
                </span>
              </div>

              {/* Direct upload dropzone */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                <div>
                  <h4 className="text-white font-bold text-xs tracking-tight">Upload New Asset</h4>
                  <p className="text-[11px] text-slate-500">Add work photos or logo branding directly to Supabase storage</p>
                </div>
                <MediaUploadZone
                  bucket="gallery"
                  label=""
                  multiple={true}
                  onUploadSuccess={async (urls) => {
                    for (let i = 0; i < urls.length; i++) {
                      try {
                        const newAsset = {
                          title: "Media Library Upload " + new Date().toLocaleDateString(),
                          url: urls[i],
                          album: "Media Library",
                          isProject: true
                        };
                        const { error } = await supabase.from("gallery").insert([newAsset]);
                        if (error) throw error;
                      } catch (err) {
                        console.error("Failed to save media upload:", err);
                      }
                    }
                    addToast("Uploaded files successfully added to Library!");
                    loadAllCMSData();
                  }}
                />
              </div>

              {/* Media Index Section */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6">
                <MediaGridSection 
                  settings={settings}
                  servicesList={services}
                  blogsList={blogs}
                  productsList={products}
                  galleryList={gallery}
                  testimonialsList={testimonials}
                  onDelete={async (url) => {
                    const galleryItem = gallery.find((g) => g.url === url);
                    if (galleryItem) {
                      try {
                        const { error } = await supabase.from("gallery").delete().eq("id", galleryItem.id);
                        if (error) throw error;
                        addToast("Asset removed from database.");
                        loadAllCMSData();
                      } catch (err: any) {
                        addToast(err.message || "Failed to remove asset.", "error");
                      }
                    } else {
                      addToast("This asset is embedded inside settings or services and cannot be deleted here.", "error");
                    }
                  }}
                  onRename={async (url, newTitle) => {
                    const galleryItem = gallery.find((g) => g.url === url);
                    if (galleryItem) {
                      try {
                        const { error } = await supabase.from("gallery").update({ title: newTitle }).eq("id", galleryItem.id);
                        if (error) throw error;
                        addToast("Asset renamed successfully!");
                        loadAllCMSData();
                      } catch (err: any) {
                        addToast("Failed to rename asset.", "error");
                      }
                    } else {
                      addToast("This asset belongs to structural metadata and cannot be renamed here.", "error");
                    }
                  }}
                  addToast={(msg, type) => {
                    addToast(msg, type === "info" ? undefined : type);
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 9: WEBSITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">Global Business Settings</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Modify contacts, locations, branding details, and opening hours instantly</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6 text-left">
                {/* Branding and Assets row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-950/40 rounded-2xl border border-slate-850">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">Website Logo</span>
                      {settings?.logo_url && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, logo_url: "" })}
                          className="text-[10px] text-red-400 hover:text-red-300 font-mono font-bold uppercase tracking-wider underline cursor-pointer"
                        >
                          Reset to Default (Use Default Icon)
                        </button>
                      )}
                    </div>
                    <MediaUploadZone
                      bucket="logos"
                      label=""
                      currentValue={settings.logo_url}
                      onSingleUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
                      onUploadSuccess={(urls) => {
                        if (urls && urls[0]) {
                          setSettings({ ...settings, logo_url: urls[0] });
                        }
                      }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">This logo will display on the Navbar and Footer. Clear it or click "Reset to Default" to use the original brand icon and name layout.</p>
                  </div>
                  <div>
                    <MediaUploadZone
                      bucket="favicons"
                      label="Website Favicon"
                      currentValue={settings.favicon_url}
                      onSingleUploadSuccess={(url) => setSettings({ ...settings, favicon_url: url })}
                      onUploadSuccess={(urls) => {
                        if (urls && urls[0]) {
                          setSettings({ ...settings, favicon_url: urls[0] });
                        }
                      }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Website browser tab icon (favicon). Upload square 32x32 or 48x48 PNG/WebP.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Business Display Name</label>
                    <input
                      type="text"
                      value={settings.business_name || ""}
                      onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Primary Support Hotline</label>
                    <input
                      type="text"
                      value={settings.phone_primary || ""}
                      onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">WhatsApp Contact Number</label>
                    <input
                      type="text"
                      value={settings.whatsapp_number || ""}
                      onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Support Email Address</label>
                    <input
                      type="email"
                      value={settings.email_support || ""}
                      onChange={(e) => setSettings({ ...settings, email_support: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Opening Hours (Mon-Sat)</label>
                    <input
                      type="text"
                      value={settings.opening_hours_mon_sat || ""}
                      onChange={(e) => setSettings({ ...settings, opening_hours_mon_sat: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Opening Hours (Sunday)</label>
                    <input
                      type="text"
                      value={settings.opening_hours_sun || ""}
                      onChange={(e) => setSettings({ ...settings, opening_hours_sun: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Physical Address / Headquarters</label>
                    <input
                      type="text"
                      value={settings.address_physical || ""}
                      onChange={(e) => setSettings({ ...settings, address_physical: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Google Maps Location (Embed Iframe URL)</label>
                    <input
                      type="text"
                      value={settings.google_maps_iframe || ""}
                      onChange={(e) => setSettings({ ...settings, google_maps_iframe: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Provide the iframe src link from Google Maps &rarr; Share &rarr; Embed a map.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">About Text (Footer Description)</label>
                    <textarea
                      rows={3}
                      value={settings.footer_about || ""}
                      onChange={(e) => setSettings({ ...settings, footer_about: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-900/10 hover:shadow-blue-900/30 transition-all"
                >
                  <LucideIcons.Save className="w-4 h-4" />
                  <span>Apply Website Core Settings</span>
                </button>
              </form>

              {/* Password change section */}
              <AdminPasswordChangeSection addToast={addToast} />
            </div>
          )}

          {/* TAB 10: SEO MANAGER */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">Meta SEO Parameters</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Control search engine titles, metadata descriptions, social OG, and deep sitemap schemas</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SEO Inputs form */}
                <form onSubmit={handleSaveSEO} className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Homepage SEO Title (Title Tag)</label>
                    <input
                      type="text"
                      value={seo.homepage_title || ""}
                      onChange={(e) => setSeo({ ...seo, homepage_title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Homepage SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={seo.homepage_description || ""}
                      onChange={(e) => setSeo({ ...seo, homepage_description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Focus Keywords (Comma-Separated)</label>
                    <input
                      type="text"
                      value={seo.homepage_keywords || ""}
                      onChange={(e) => setSeo({ ...seo, homepage_keywords: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LucideIcons.Save className="w-4 h-4" />
                    <span>Apply SEO Parameters</span>
                  </button>
                </form>

                {/* Live XML Sitemap and Robots.txt simulator */}
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl">
                    <h4 className="text-white font-bold text-sm mb-2">Automated Robots.txt Schema</h4>
                    <pre className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-[10px] font-mono text-green-400 overflow-x-auto select-all">
{`User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml`}
                    </pre>
                  </div>

                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl">
                    <h4 className="text-white font-bold text-sm mb-2">Automated Sitemap.xml Nodes</h4>
                    <pre className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-[10px] font-mono text-blue-400 overflow-x-auto select-all max-h-48 overflow-y-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
  ${services.map(s => {
    const sPath = s.id === "computer" ? "/computer-repair-hassan" :
                  s.id === "laptop" ? "/laptop-repair-hassan" :
                  s.id === "cctv" ? "/cctv-installation-hassan" :
                  s.id === "printer" ? "/printer-repair-hassan" :
                  s.id === "networking" ? "/networking-services-hassan" :
                  s.id === "biometric" ? "/biometric-installation-hassan" :
                  s.id === "windows" ? "/windows-installation-hassan" :
                  s.id === "data-recovery" ? "/data-recovery-hassan" :
                  s.id === "ups" ? "/ups-installation-repair-hassan" :
                  s.id === "intercom" ? "/intercom-systems-hassan" :
                  s.id === "firealarm" ? "/fire-alarm-systems-hassan" :
                  s.id === "p2p" ? "/p2p-wireless-installation-hassan" :
                  s.id === "amc" ? "/it-support-amc-hassan" : `/${s.id}`;
    return `
  <url>
    <loc>${SITE_URL}${sPath}</loc>
    <priority>0.8</priority>
  </url>`;
  }).join("")}
  ${blogs.filter(b => b.status === "published").map(b => `
  <url>
    <loc>${SITE_URL}/blog/${b.slug}</loc>
    <priority>0.7</priority>
  </url>`).join("")}
  ${projects.filter(p => p.status === "published").map(p => `
  <url>
    <loc>${SITE_URL}/project/${p.seoSlug}</loc>
    <priority>0.7</priority>
  </url>`).join("")}
</urlset>`}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 12: REVIEW ASSISTANT QR & COMPLIANCE MANAGER */}
          {activeTab === "review-assistant" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <LucideIcons.QrCode className="w-5 h-5 text-blue-500" />
                    <span>Customer Google Review Assistant</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Mobile-first review helper designed to assist genuine customers in structuring factual reviews without policy violations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer transition-all"
                  >
                    <LucideIcons.ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Mobile Flow (/review)</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Col: Live QR Generator */}
                <div className="lg:col-span-5">
                  <QRCodeDisplay
                    url={`${SITE_URL}/review`}
                    title="MIInfotech Review Assistant QR"
                    size={180}
                  />
                </div>

                {/* Right Col: Operations & Policy Guide */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  
                  {/* How it Works Card */}
                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LucideIcons.Sparkles className="w-4 h-4 text-blue-400" />
                      <span>The 5-Step Customer Workflow</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                      {[
                        { step: "1", title: "Scan QR", desc: "Doorstep scan" },
                        { step: "2", title: "Select Work", desc: "Computer/CCTV/etc" },
                        { step: "3", title: "Quick Facts", desc: "2-3 checkboxes" },
                        { step: "4", title: "Review Draft", desc: "Zero invented facts" },
                        { step: "5", title: "Post to Google", desc: "Customer's account" },
                      ].map((s) => (
                        <div key={s.step} className="bg-slate-950/80 border border-slate-850 p-2.5 rounded-xl text-center">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] inline-flex items-center justify-center mb-1">
                            {s.step}
                          </span>
                          <span className="font-bold text-white block text-[11px]">{s.title}</span>
                          <span className="text-[10px] text-slate-400 block">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google Policy Guardrails */}
                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LucideIcons.ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Google Policy Compliance Guardrails</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                        <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block text-[11px]">No Review Gating or Filtering:</strong>
                          <span className="text-slate-400 text-[10px]">All customers receive direct, unhindered access to the official Google review page regardless of their feedback or rating.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                        <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block text-[11px]">No Invented Facts or Fake Praise:</strong>
                          <span className="text-slate-400 text-[10px]">The draft generator strictly uses only facts explicitly chosen by the customer (camera counts, dates, prices, or names are never fabricated).</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                        <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block text-[11px]">Full Customer Agency & Control:</strong>
                          <span className="text-slate-400 text-[10px]">The customer can edit, rewrite, or discard the draft at any time before posting directly from their own authenticated Google account.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technician Instructions */}
                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LucideIcons.Users className="w-4 h-4 text-amber-400" />
                      <span>Instructions for Doorstep Engineers</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      After completing an onsite diagnosis, hardware installation, or repair in Hassan, present the QR code card or share the link via WhatsApp:
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-slate-300 text-xs italic">
                      &quot;Thank you for choosing MIInfotech! If you have a minute, please scan this code to share your genuine feedback with us on Google. It takes less than 30 seconds.&quot;
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* RENDER ADD / EDIT OVERLAY MODAL */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {editingItem ? "Edit Content Entry" : "Create Content Entry"}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Scope: {modalType.toUpperCase()} Record</p>
              </div>
              <button
                onClick={() => {
                  setModalType(null);
                  setEditingItem(null);
                }}
                aria-label="Close modal"
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* SERVICE FIELDS */}
              {modalType === "service" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Service ID / Slug</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingItem}
                        value={formFields.id || ""}
                        onChange={(e) => setFormFields({ ...formFields, id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Service Title</label>
                      <input
                        type="text"
                        required
                        value={formFields.name || ""}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formFields.tagline || ""}
                      onChange={(e) => setFormFields({ ...formFields, tagline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Lucide Icon ID</label>
                    <input
                      type="text"
                      value={formFields.iconName || ""}
                      onChange={(e) => setFormFields({ ...formFields, iconName: e.target.value })}
                      placeholder="Monitor, Laptop, Eye, Printer, Network, etc."
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      value={formFields.description || ""}
                      onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Starting Price Tag</label>
                      <input
                        type="text"
                        value={formFields.startingPrice || ""}
                        onChange={(e) => setFormFields({ ...formFields, startingPrice: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Diagnostics Duration</label>
                      <input
                        type="text"
                        value={formFields.timeframe || ""}
                        onChange={(e) => setFormFields({ ...formFields, timeframe: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOG CMS FIELDS */}
              {modalType === "blog" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={formFields.title || ""}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          setFormFields({ ...formFields, title, slug });
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">SEO Slug (Auto-Generated)</label>
                      <input
                        type="text"
                        required
                        value={formFields.slug || ""}
                        onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-slate-950/40 rounded-2xl border border-slate-850">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Category</label>
                        <input
                          type="text"
                          value={formFields.category || ""}
                          onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Article Status</label>
                        <select
                          value={formFields.status || "published"}
                          onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <MediaUploadZone
                        bucket="blog-images"
                        label="Featured Article Image"
                        currentValue={formFields.image}
                        onSingleUploadSuccess={(url) => setFormFields({ ...formFields, image: url })}
                        onUploadSuccess={(urls) => {
                          if (urls && urls[0]) {
                            setFormFields({ ...formFields, image: urls[0] });
                          }
                        }}
                      />
                      <div className="mt-2 text-left">
                        <label className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">Or provide raw image URL link</label>
                        <input
                          type="text"
                          value={formFields.image || ""}
                          onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-[11px] text-slate-400 focus:outline-none focus:border-blue-500 mt-1"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Brief Excerpt</label>
                    <input
                      type="text"
                      value={formFields.excerpt || ""}
                      onChange={(e) => setFormFields({ ...formFields, excerpt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Full Article Content (Markdown format supported)</label>
                    <textarea
                      rows={6}
                      value={formFields.content || ""}
                      onChange={(e) => setFormFields({ ...formFields, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-bold">
                      <input
                        type="checkbox"
                        checked={formFields.status === "published"}
                        onChange={(e) => setFormFields({ ...formFields, status: e.target.checked ? "published" : "draft" })}
                        className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                      />
                      <span>Publish Instantly</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-bold">
                      <input
                        type="checkbox"
                        checked={!!formFields.featured}
                        onChange={(e) => setFormFields({ ...formFields, featured: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                      />
                      <span>Feature on Homepage</span>
                    </label>
                  </div>
                </div>
              )}

              {/* PRODUCT CMS FIELDS */}
              {modalType === "product" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formFields.name || ""}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Brand</label>
                      <input
                        type="text"
                        value={formFields.brand || ""}
                        onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Category</label>
                      <input
                        type="text"
                        value={formFields.category || ""}
                        onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Price (INR)</label>
                      <input
                        type="number"
                        value={formFields.price || 0}
                        onChange={(e) => setFormFields({ ...formFields, price: parseFloat(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formFields.rating || 5}
                        onChange={(e) => setFormFields({ ...formFields, rating: parseFloat(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Affiliate Link (Amazon, etc.)</label>
                    <input
                      type="text"
                      value={formFields.affiliateLink || ""}
                      onChange={(e) => setFormFields({ ...formFields, affiliateLink: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850">
                    <MediaUploadZone
                      bucket="products"
                      label="Product Photo"
                      currentValue={formFields.image}
                      onSingleUploadSuccess={(url) => setFormFields({ ...formFields, image: url })}
                      onUploadSuccess={(urls) => {
                        if (urls && urls[0]) {
                          setFormFields({ ...formFields, image: urls[0] });
                        }
                      }}
                    />
                    <div className="mt-2 text-left">
                      <label className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">Or provide raw image URL link</label>
                      <input
                        type="text"
                        value={formFields.image || ""}
                        onChange={(e) => setFormFields({ ...formFields, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-[11px] text-slate-400 focus:outline-none focus:border-blue-500 mt-1"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Brief Description</label>
                    <textarea
                      rows={2}
                      value={formFields.description || ""}
                      onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-bold">
                      <input
                        type="checkbox"
                        checked={!!formFields.featured}
                        onChange={(e) => setFormFields({ ...formFields, featured: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                      />
                      <span>Feature Product</span>
                    </label>
                  </div>
                </div>
              )}

              {/* GALLERY, TESTIMONIAL, FAQ FIELDS (Shorthand combined for space optimization) */}
              {modalType === "gallery" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Image Title / Caption</label>
                    <input type="text" required value={formFields.title || ""} onChange={(e) => setFormFields({ ...formFields, title: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  
                  <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850">
                    <MediaUploadZone
                      bucket="gallery"
                      label="Upload Work Photo"
                      currentValue={formFields.url}
                      onSingleUploadSuccess={(url) => setFormFields({ ...formFields, url: url })}
                      onUploadSuccess={(urls) => {
                        if (urls && urls[0]) {
                          setFormFields({ ...formFields, url: urls[0] });
                        }
                      }}
                    />
                    <div className="mt-2 text-left">
                      <label className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">Or provide raw image URL link</label>
                      <input
                        type="text"
                        value={formFields.url || ""}
                        onChange={(e) => setFormFields({ ...formFields, url: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-[11px] text-slate-400 focus:outline-none focus:border-blue-500 mt-1"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Album / Category Name</label>
                      <input type="text" placeholder="General, Computer Repair, CCTV, etc." value={formFields.album || ""} onChange={(e) => setFormFields({ ...formFields, album: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Show on Landing Page?</label>
                      <select
                        value={formFields.isProject === undefined ? "true" : String(formFields.isProject)}
                        onChange={(e) => setFormFields({ ...formFields, isProject: e.target.value === "true" })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="true">Yes (Show in Gallery)</option>
                        <option value="false">No (Media Library only)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "project" && (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/80 p-3.5 rounded-2xl border border-blue-900/40 gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Auto-Generate SEO & Schemas (AI)
                      </h4>
                      <p className="text-[10px] text-slate-400">Fill Title, Category, and Location then generate descriptions, spec lists, and schema codes instantly.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAiProject}
                      disabled={generatingProject}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-bold text-[10px] font-mono px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap shadow-lg shadow-blue-900/20"
                    >
                      {generatingProject ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>GENERATING...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          <span>AUTO-GENERATE WITH AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Project Title *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. School Computer Lab Setup"
                        value={formFields.title || ""} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const generatedSlug = val
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .trim()
                            .replace(/\s+/g, "-");
                          setFormFields({ 
                            ...formFields, 
                            title: val,
                            seoSlug: formFields.seoSlug && formFields.seoSlug !== "" && formFields.seoSlug !== (formFields.title || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") 
                              ? formFields.seoSlug 
                              : generatedSlug
                          });
                        }} 
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Category *</label>
                      <select
                        value={formFields.category || "CCTV Installation"}
                        onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {[
                          "Computer Repair", "Laptop Repair", "Printer Repair", "CCTV Installation", 
                          "CCTV Repair", "Networking", "WiFi", "P2P", "Biometric", "UPS", 
                          "Data Recovery", "Windows Installation", "Office Setup", "School Lab", 
                          "AMC", "Other"
                        ].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Location (in Hassan) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Kuvempu Nagar, Hassan"
                      value={formFields.location || ""} 
                      onChange={(e) => setFormFields({ ...formFields, location: e.target.value })} 
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Hardware Brand(s) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Hikvision, TP-Link, HP"
                        value={formFields.brand || ""} 
                        onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Equipment Deployed (Optional, Comma List)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 16-Port Switch, 4MP Dome Cameras"
                        value={formFields.equipmentUsed || ""} 
                        onChange={(e) => setFormFields({ ...formFields, equipmentUsed: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" 
                      />
                    </div>
                  </div>

                  {/* Multiple Images Block */}
                  <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">Project Photos & Images * ({formFields.images?.length || 0})</label>
                      <span className="text-[9px] text-slate-500 font-mono">First photo is cover image</span>
                    </div>

                    {/* Image grid of currently added images with reordering options */}
                    {formFields.images && formFields.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {formFields.images.map((imgUrl: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950 group">
                            <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            
                            {/* Reordering indicators */}
                            <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-950/80 px-1 py-0.5 rounded border border-slate-850">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const copy = [...formFields.images];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    setFormFields({ ...formFields, images: copy });
                                  }}
                                  className="px-1 text-slate-300 hover:text-white hover:bg-slate-850 text-[10px] rounded"
                                  title="Move Left (Prioritize)"
                                >
                                  ←
                                </button>
                              )}
                              {idx < formFields.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const copy = [...formFields.images];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    setFormFields({ ...formFields, images: copy });
                                  }}
                                  className="px-1 text-slate-300 hover:text-white hover:bg-slate-850 text-[10px] rounded"
                                  title="Move Right"
                                >
                                  →
                                </button>
                              )}
                            </div>

                            <button 
                              type="button"
                              onClick={() => {
                                const copy = [...formFields.images];
                                copy.splice(idx, 1);
                                setFormFields({ ...formFields, images: copy });
                              }}
                              className="absolute inset-0 bg-red-950/85 text-white text-[10px] font-bold uppercase flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Zone with multi flag enabled */}
                    <MediaUploadZone
                      bucket="gallery"
                      multiple={true}
                      label="Upload New Project Photos (Drag & Drop / Bulk Selection)"
                      onUploadSuccess={(urls) => {
                        const existing = formFields.images || [];
                        setFormFields({ ...formFields, images: [...existing, ...urls] });
                        addToast(`Successfully compressed and uploaded ${urls.length} WebP images!`);
                      }}
                    />

                    {/* Raw URL Input */}
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">Or Append Direct Image URL</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          id="raw-img-input"
                          type="text"
                          className="flex-grow bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-[11px] text-slate-400 focus:outline-none"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inputEl = document.getElementById("raw-img-input") as HTMLInputElement;
                            if (inputEl && inputEl.value.trim()) {
                              const existing = formFields.images || [];
                              setFormFields({ ...formFields, images: [...existing, inputEl.value.trim()] });
                              inputEl.value = "";
                            }
                          }}
                          className="py-1.5 px-4 bg-slate-850 hover:bg-slate-750 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Project Summary / Case Study Description *</label>
                    <textarea 
                      rows={3} 
                      required
                      placeholder="Describe the overall scope, requirements, and user feedback."
                      value={formFields.description || ""} 
                      onChange={(e) => setFormFields({ ...formFields, description: e.target.value })} 
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>



                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formFields.status || "published"}
                        onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live & Sitemap-indexed)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5 pl-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-bold">
                        <input
                          type="checkbox"
                          checked={!!formFields.featured}
                          onChange={(e) => setFormFields({ ...formFields, featured: e.target.checked })}
                          className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                        />
                        <span>Feature Project on Landing Pages</span>
                      </label>
                    </div>
                  </div>

                  {/* Advanced SEO panel accordion */}
                  <div className="border border-slate-850 rounded-2xl bg-slate-950/40 overflow-hidden mt-6">
                    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900 border-b border-slate-850/50 gap-3">
                      <button
                        type="button"
                        onClick={() => setSeoSectionOpen(!seoSectionOpen)}
                        className="flex items-center gap-2 font-bold text-xs font-mono uppercase text-blue-400 tracking-wider cursor-pointer hover:text-blue-300 focus:outline-none text-left"
                      >
                        <LucideIcons.Globe className="w-4 h-4 text-blue-500 animate-pulse" />
                        <span>Geo & AI Search Optimization (SEO)</span>
                        {seoSectionOpen ? (
                          <LucideIcons.ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <LucideIcons.ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={generatingSeo}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateAiSeo();
                        }}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase font-mono tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                      >
                        {generatingSeo ? (
                          <>
                            <LucideIcons.RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating AI SEO...</span>
                          </>
                        ) : (
                          <>
                            <LucideIcons.Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Auto-Generate SEO & Schemas</span>
                          </>
                        )}
                      </button>
                    </div>

                    {seoSectionOpen && (
                      <div className="p-5 space-y-6 border-t border-slate-850 text-left animate-fadeIn">
                        {/* Automation Section */}
                        <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-white font-bold text-xs flex items-center gap-1.5 font-mono uppercase tracking-wider">
                              <LucideIcons.Sparkles className="w-3.5 h-3.5 text-blue-400" />
                              <span>AI Automation Engine</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal max-w-md">
                              Click to auto-generate all advanced SEO metadata, keywords, local schema, sitemaps, and social cards with zero manual editing.
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={generatingSeo}
                            onClick={handleGenerateAiSeo}
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-all shadow-md shadow-blue-950/50"
                          >
                            {generatingSeo ? (
                              <>
                                <LucideIcons.RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating AI SEO...</span>
                              </>
                            ) : (
                              <>
                                <LucideIcons.Sparkles className="w-3.5 h-3.5" />
                                <span>Generate AI SEO</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* SEO Status Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              AI Search Optimization Score
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={formFields.aiSearchScore || 98}
                                onChange={(e) => setFormFields({ ...formFields, aiSearchScore: parseInt(e.target.value) || 0 })}
                                className="w-20 bg-slate-950 border border-slate-850 rounded-lg py-1 px-2 text-xs font-mono text-emerald-400 font-bold text-center focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500">/ 100 (Excellent)</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Google Index Status
                            </label>
                            <select
                              value={formFields.googleIndexStatus || "indexed"}
                              onChange={(e) => setFormFields({ ...formFields, googleIndexStatus: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1 px-2 text-xs text-white focus:outline-none font-sans"
                            >
                              <option value="indexed">Indexed (Live on Google)</option>
                              <option value="crawled">Crawled - Currently not indexed</option>
                              <option value="pending">Not indexed - Pending Request</option>
                              <option value="submitted">Discovered - Currently not indexed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              Sitemap Status
                            </label>
                            <select
                              value={formFields.sitemapStatus || "success"}
                              onChange={(e) => setFormFields({ ...formFields, sitemapStatus: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1 px-2 text-xs text-white focus:outline-none font-sans"
                            >
                              <option value="success">Success (Sitemap Verified)</option>
                              <option value="processing">Submitted - Processing</option>
                              <option value="failed">Failed / Pending Resubmission</option>
                            </select>
                          </div>
                        </div>

                        {/* Grid of basic and social seo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Basic SEO */}
                          <div className="space-y-4">
                            <h4 className="text-white font-bold text-xs border-b border-slate-850 pb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5">
                              <LucideIcons.Search className="w-3.5 h-3.5 text-blue-500" />
                              <span>Basic SEO</span>
                            </h4>
                            
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">SEO URL Slug (Auto-generated + Editable)</label>
                              <input
                                type="text"
                                value={formFields.seoSlug || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoSlug: e.target.value })}
                                placeholder="e.g. school-lab-setup-hassan"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">SEO Meta Title (Auto-generated + Editable)</label>
                              <input
                                type="text"
                                value={formFields.metaTitle || ""}
                                onChange={(e) => setFormFields({ ...formFields, metaTitle: e.target.value })}
                                placeholder="e.g. CCTV Setup in Kuvempu Nagar | MIInfotech"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">SEO Meta Description (Auto-generated + Editable)</label>
                              <textarea
                                rows={2}
                                value={formFields.metaDescription || ""}
                                onChange={(e) => setFormFields({ ...formFields, metaDescription: e.target.value })}
                                placeholder="Enter 120-160 characters search-engine snippet"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Focus Keyword</label>
                                <input
                                  type="text"
                                  value={formFields.focusKeyword || ""}
                                  onChange={(e) => setFormFields({ ...formFields, focusKeyword: e.target.value })}
                                  placeholder="e.g. CCTV setup Hassan"
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Secondary Keywords</label>
                                <input
                                  type="text"
                                  value={formFields.secondaryKeywords || ""}
                                  onChange={(e) => setFormFields({ ...formFields, secondaryKeywords: e.target.value })}
                                  placeholder="e.g. camera repair, security system"
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Social SEO */}
                          <div className="space-y-4">
                            <h4 className="text-white font-bold text-xs border-b border-slate-850 pb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5">
                              <LucideIcons.Share2 className="w-3.5 h-3.5 text-blue-500" />
                              <span>Social SEO</span>
                            </h4>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Open Graph Title</label>
                              <input
                                type="text"
                                value={formFields.ogTitle || ""}
                                onChange={(e) => setFormFields({ ...formFields, ogTitle: e.target.value })}
                                placeholder="Facebook & LinkedIn sharing title"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Open Graph Description</label>
                              <textarea
                                rows={2}
                                value={formFields.ogDescription || ""}
                                onChange={(e) => setFormFields({ ...formFields, ogDescription: e.target.value })}
                                placeholder="Social post summary description"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Twitter Card type</label>
                                <select
                                  value={formFields.twitterCard || "summary_large_image"}
                                  onChange={(e) => setFormFields({ ...formFields, twitterCard: e.target.value })}
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
                                >
                                  <option value="summary">Summary</option>
                                  <option value="summary_large_image">Summary Large Image</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Social Preview Image URL</label>
                                <input
                                  type="text"
                                  value={formFields.socialImage || ""}
                                  onChange={(e) => setFormFields({ ...formFields, socialImage: e.target.value })}
                                  placeholder="https://..."
                                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Search Optimization Section */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold text-xs border-b border-slate-850 pb-1.5 font-mono uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <LucideIcons.Cpu className="w-3.5 h-3.5 text-blue-500" />
                              <span>AI Search Engine Optimization (LLM Ready)</span>
                            </span>
                            <span className="text-[9px] text-blue-400 font-bold uppercase bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/40">Gemini • GPT • Claude • Perplexity • Copilot</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Entity Keywords (LLM Nouns)</label>
                              <input
                                type="text"
                                value={formFields.entityKeywords || ""}
                                onChange={(e) => setFormFields({ ...formFields, entityKeywords: e.target.value })}
                                placeholder="e.g. CCTV, Hikvision, Hassan"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Semantic Keywords (Context)</label>
                              <input
                                type="text"
                                value={formFields.semanticKeywords || ""}
                                onChange={(e) => setFormFields({ ...formFields, semanticKeywords: e.target.value })}
                                placeholder="e.g. active network wiring, DVR"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">FAQ Keywords (Search Intents)</label>
                              <input
                                type="text"
                                value={formFields.faqKeywords || ""}
                                onChange={(e) => setFormFields({ ...formFields, faqKeywords: e.target.value })}
                                placeholder="e.g. camera price, service warranty"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Natural Language Search Phrases (FAQ Match)</label>
                              <textarea
                                rows={2}
                                value={formFields.nlSearchPhrases || ""}
                                onChange={(e) => setFormFields({ ...formFields, nlSearchPhrases: e.target.value })}
                                placeholder="e.g. Who installs genuine Hikvision CCTV cameras at doorstep in Hassan?"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none resize-none font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Local Search Keywords</label>
                              <textarea
                                rows={2}
                                value={formFields.localSearchKeywords || ""}
                                onChange={(e) => setFormFields({ ...formFields, localSearchKeywords: e.target.value })}
                                placeholder="e.g. Kuvempu Nagar IT support, Salagame road computer shop"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none resize-none font-sans"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Geo SEO Section */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold text-xs border-b border-slate-850 pb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5">
                            <LucideIcons.MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span>Geo SEO & Hassan Local Targeting</span>
                          </h4>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">City</label>
                              <input
                                type="text"
                                value={formFields.seoCity || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoCity: e.target.value })}
                                placeholder="Hassan"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">District</label>
                              <input
                                type="text"
                                value={formFields.seoDistrict || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoDistrict: e.target.value })}
                                placeholder="Hassan"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">State</label>
                              <input
                                type="text"
                                value={formFields.seoState || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoState: e.target.value })}
                                placeholder="Karnataka"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Country</label>
                              <input
                                type="text"
                                value={formFields.seoCountry || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoCountry: e.target.value })}
                                placeholder="India"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Postal Code</label>
                              <input
                                type="text"
                                value={formFields.seoPostalCode || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoPostalCode: e.target.value })}
                                placeholder="573201"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Latitude</label>
                              <input
                                type="text"
                                value={formFields.seoLatitude || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoLatitude: e.target.value })}
                                placeholder="13.0068"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Longitude</label>
                              <input
                                type="text"
                                value={formFields.seoLongitude || ""}
                                onChange={(e) => setFormFields({ ...formFields, seoLongitude: e.target.value })}
                                placeholder="76.1026"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Service Area (Radius coverage)</label>
                            <input
                              type="text"
                              value={formFields.seoServiceArea || ""}
                              onChange={(e) => setFormFields({ ...formFields, seoServiceArea: e.target.value })}
                              placeholder="e.g. Kuvempu Nagar, Vidya Nagar, Channapatna"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Sitemap & Indexes */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold text-xs border-b border-slate-850 pb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5">
                            <LucideIcons.List className="w-3.5 h-3.5 text-blue-500" />
                            <span>Sitemap Indexing Settings</span>
                          </h4>

                          <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-300">
                              <div className="bg-emerald-500/15 text-emerald-400 p-1 rounded-md border border-emerald-500/20">
                                <LucideIcons.Check className="w-4 h-4" />
                              </div>
                              <span>Included in sitemap ✔</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">Live Dynamic Generator</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Canonical URL</label>
                              <input
                                type="text"
                                value={formFields.canonicalUrl || ""}
                                onChange={(e) => setFormFields({ ...formFields, canonicalUrl: e.target.value })}
                                placeholder="Auto-calculated"
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Sitemap Priority</label>
                              <input
                                type="text"
                                value={formFields.sitemapPriority || "0.8"}
                                onChange={(e) => setFormFields({ ...formFields, sitemapPriority: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Change Frequency</label>
                              <select
                                value={formFields.sitemapChangefreq || "monthly"}
                                onChange={(e) => setFormFields({ ...formFields, sitemapChangefreq: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                              >
                                <option value="always">Always</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="never">Never</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Structured Schema Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                              <LucideIcons.Code className="w-3.5 h-3.5 text-blue-500" />
                              <span>Structured Data (JSON-LD Schema Editor)</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(formFields.schema || "{}");
                                addToast("Schema JSON copied to clipboard!", "success");
                              }}
                              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <LucideIcons.Copy className="w-3.5 h-3.5" />
                              <span>Copy JSON Schema</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal mb-1">
                            Includes entity graphs: <code className="text-slate-400">LocalBusiness</code>, <code className="text-slate-400">Service</code>, <code className="text-slate-400">Breadcrumb</code>, <code className="text-slate-400">ImageObject</code>, <code className="text-slate-400">FAQPage</code>, <code className="text-slate-400">Review</code>, and <code className="text-slate-400">Project</code>.
                          </p>
                          <textarea
                            rows={8}
                            value={formFields.schema || "{}"}
                            onChange={(e) => setFormFields({ ...formFields, schema: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-[10px] text-slate-300 focus:outline-none font-mono resize-y focus:border-blue-500"
                            placeholder="Enter custom JSON-LD schema..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalType === "testimonial" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Author Name</label>
                      <input type="text" required value={formFields.name || ""} onChange={(e) => setFormFields({ ...formFields, name: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Location</label>
                      <input type="text" value={formFields.location || ""} onChange={(e) => setFormFields({ ...formFields, location: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Comment Body</label>
                    <textarea rows={3} value={formFields.comment || ""} onChange={(e) => setFormFields({ ...formFields, comment: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none resize-none" />
                  </div>
                </div>
              )}

              {modalType === "faq" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Question Target</label>
                    <input type="text" required value={formFields.question || ""} onChange={(e) => setFormFields({ ...formFields, question: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">Resolving Answer</label>
                    <textarea rows={4} required value={formFields.answer || ""} onChange={(e) => setFormFields({ ...formFields, answer: e.target.value })} className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none resize-none" />
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-300 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn mb-3">
                  <LucideIcons.AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-semibold uppercase tracking-wider text-[9px] font-mono text-red-400">Database Operation Failure</p>
                    <p className="mt-0.5 leading-relaxed text-slate-300">{submitError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={formSaving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {formSaving ? (
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LucideIcons.Save className="w-4 h-4" />
                )}
                <span>{formSaving ? "Saving to Database..." : "Save Database Changes"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPasswordChangeSection({ addToast }: { addToast: (msg: string, type?: "success" | "error") => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      addToast("New password cannot be empty.", "error");
      return;
    }
    if (newPassword.length < 6) {
      addToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userObj = localDB.getAdminUser();
      const currentEmail = userData?.user?.email || userObj?.email || "";
      
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPassword,
      });

      if (signInErr) {
        addToast("Current password is incorrect. Please verify and try again.", "error");
        setLoading(false);
        return;
      }

      const { error } = await updateAdminPassword(newPassword);
      if (error) {
        addToast(error.message || "Failed to update password.", "error");
      } else {
        addToast("Admin password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      addToast(err.message || "An error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 text-left mt-6 animate-fadeIn">
      <div>
        <h4 className="text-white font-extrabold text-sm tracking-tight flex items-center gap-1.5">
          <LucideIcons.ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Update Security Credentials</span>
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">Modify the Administrator account login password safely</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/10 hover:shadow-amber-950/30 transition-all"
        >
          {loading ? (
            <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LucideIcons.KeyRound className="w-4 h-4" />
          )}
          <span>{loading ? "Updating Password..." : "Modify Password"}</span>
        </button>
      </form>
    </div>
  );
}
