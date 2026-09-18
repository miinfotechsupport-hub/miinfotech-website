import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, Phone, Calendar, Search, MapPin, CheckCircle, FileText, ChevronRight, Eye, Server, Database, Globe, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const sections = [
    {
      id: 1,
      title: "1. Introduction",
      icon: ShieldCheck,
      content: `Welcome to MIINFOTECH (also referred to as "MIInfotech", "we", "us", or "our"). We operate as an Onsite Service-Area Business (SAB) based in Hassan, Karnataka, India, founded and operated by Mohammed Ishtiaqh. We specialize in doorstep computer repair, laptop servicing, CCTV camera installation, networking infrastructure, printer repair, and corporate Annual Maintenance Contracts (AMC).

This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you visit our website (https://miinfotech.netlify.app/) or engage our onsite technical services. We are committed to maintaining the highest standards of data privacy and transparency in compliance with applicable Indian information technology laws and global privacy principles.`
    },
    {
      id: 2,
      title: "2. Information We Collect",
      icon: Eye,
      content: `We believe in data minimization. We only collect the minimal information necessary to deliver effective onsite technical solutions, answer your inquiries, and provide accurate service cost estimates. 

We do not engage in invasive behavioral tracking, and we do not sell, rent, or trade your personal data to data brokers or advertising networks under any circumstances.`
    },
    {
      id: 3,
      title: "3. Information Provided Directly by Users",
      icon: UserCheck,
      content: `When you interact with our website or contact us directly, you may voluntarily provide certain information to us:

• Contact & Booking Details: Your full name, telephone / WhatsApp phone number, and email address.
• Service Request Details: The category of service needed (e.g., CCTV installation, laptop screen repair, PC formatting, LAN cabling, printer servicing), device make/model, and a description of the technical issue.
• Service Location: Your home, retail shop, clinic, school, or office address in Hassan City or surrounding outskirts to enable our technician to navigate to your premises for onsite service.
• Review Feedback: If you choose to use our Google Review helper or provide a service testimonial, the feedback and ratings you select to share your experience.`
    },
    {
      id: 4,
      title: "4. Website Usage & Technical Information",
      icon: Server,
      content: `When you access https://miinfotech.netlify.app/, standard technical diagnostic data may be recorded automatically by our hosting infrastructure (Netlify):

• Device & Browser Data: Browser type and version, operating system, device type, screen resolution, and preferred language.
• Network & Connection Data: Internet Protocol (IP) address, approximate geographic city/region, internet service provider, referring URL, and timestamps of page visits.

This information is processed in aggregate purely to ensure website reliability, defend against DDoS attacks, monitor network latency, and maintain operational stability.`
    },
    {
      id: 5,
      title: "5. Google Sign-In & Google Authentication",
      icon: Lock,
      content: `Our platform integrates Google Cloud Identity / Google OAuth ("Google Sign-In") for administrative authentication and authorized administrative portal management:

• Administrative Access: Google Authentication is used by authorized business administrators to securely access administrative management dashboards without storing raw passwords.
• Minimal Scopes: When authenticating via Google Sign-In, we only request standard, non-sensitive identity profile scopes (such as Google User ID, display name, and verified email address) necessary to authenticate authorized personnel.
• Compliance with Google API Services User Data Policy: We strictly adhere to the Google API Services User Data Policy, including the Limited Use requirements. We do NOT access private emails, Google Drive files, calendars, contacts, or sensitive personal Google account data.
• No Third-Party Transfer: Google user data is never transferred, sold, or used for advertising, behavioral retargeting, or credit evaluation.`
    },
    {
      id: 6,
      title: "6. How We Use Your Information",
      icon: CheckCircle,
      content: `We utilize the information collected strictly for legitimate business operations:

1. Onsite Service Fulfillment: To dispatch an experienced technician with diagnostic toolkits and spare parts to your doorstep in Hassan.
2. Communications & Updates: To respond to your quote requests, confirm appointment schedules, discuss spare part availability, and provide warranty support via call, SMS, or WhatsApp.
3. Quotations & Billing: To prepare accurate cost estimates, itemized invoices, and warranty records for physical hardware parts.
4. Administrative Management: To manage service inquiries, keep track of ongoing AMC obligations, and maintain business security.`
    },
    {
      id: 7,
      title: "7. How We Protect Your Information",
      icon: ShieldCheck,
      content: `We apply industry-standard security measures to guard your information against unauthorized access, loss, or alteration:

• Encrypted Transmission (SSL/HTTPS): All network traffic between your web browser and our website is strictly encrypted using modern Transport Layer Security (TLS/SSL).
• Onsite Technical Confidentiality: When our technician performs diagnostics, data recovery, OS formatting, or CCTV DVR configuration on your physical premises, we adhere to strict confidentiality protocols. Our technicians do not browse, copy, or retain your personal photographs, personal documents, financial databases, or surveillance video footage.
• Restricted Access: Administrative dashboards and database access are strictly limited to authorized personnel using multi-factor authentication and role-based access controls.`
    },
    {
      id: 8,
      title: "8. Supabase & Database Data Handling",
      icon: Database,
      content: `Our website utilizes Supabase as a secure cloud database backend to store submitted service inquiries, published portfolio showcases, and company blog articles:

• Data Isolation & Row-Level Security: Customer inquiries submitted through our contact form are stored in protected Supabase database tables with strict Row-Level Security (RLS) policies.
• Encryption: Database connections and data in transit are protected with 256-bit SSL encryption.
• No Public Leakage: Database credentials and service-role secrets are protected server-side and never exposed to public frontend clients.`
    },
    {
      id: 9,
      title: "9. Cookies & Local Storage Technologies",
      icon: FileText,
      content: `We maintain a lightweight, privacy-first web footprint:

• Essential Local Storage: We do NOT use invasive advertising cookies or cross-site tracking pixels. We use standard browser HTML5 LocalStorage solely for essential functionality, such as remembering your UI preferences (e.g., active tabs, estimate calculator state) and secure administrative session tokens.
• Browser Control: You can clear or disable LocalStorage and browser cookies at any time through your browser settings without affecting your ability to browse our service catalog or contact us.`
    },
    {
      id: 10,
      title: "10. Third-Party Services Used by the Website",
      icon: Globe,
      content: `To provide a modern, secure web experience, we interface with trusted third-party infrastructure providers:

• Netlify: High-speed global Content Delivery Network (CDN) and hosting provider with automated SSL certification.
• Supabase: Scalable backend database provider for storing customer inquiries and website content.
• Google Cloud / Google Identity: OAuth authentication provider for secure administrative login and Google Maps location reference.
• WhatsApp (Meta): Provides optional click-to-chat functionality, allowing customers to initiate a direct conversation with our service desk via their own WhatsApp application.
• Unsplash: Serves public stock photography and portfolio illustration assets.

We do NOT integrate third-party advertising trackers, data resale brokers, or intrusive analytics scripts.`
    },
    {
      id: 11,
      title: "11. Data Retention",
      icon: Calendar,
      content: `We retain customer personal information only for as long as reasonably necessary to fulfill the purposes outlined in this Privacy Policy:

• Service Enquiries: Stored for the duration needed to resolve the technical request and follow up on customer satisfaction.
• Warranty & Invoicing Records: Retained for the statutory period required under Indian taxation and consumer protection regulations to honor manufacturer and service warranties.
• When personal data is no longer needed, it is permanently deleted or anonymized.`
    },
    {
      id: 12,
      title: "12. User Rights & Data Deletion Requests",
      icon: UserCheck,
      content: `We respect your ownership of your personal data. In accordance with applicable data protection laws, you possess the right to:

• Access & Review: Request a summary of the personal contact details we hold regarding your service history.
• Rectification: Request correction of inaccurate, outdated, or incomplete contact information.
• Erasure / Deletion: Request the complete deletion of your contact records from our database.
• Withdraw Consent: Withdraw permission for us to contact you for follow-up service notifications.

To submit a data access or deletion request, please email Mohammed Ishtiaqh at miinfotech.support@gmail.com or call +91 99647 61624 with your name and contact number. We will process your request promptly within 7 business days.`
    },
    {
      id: 13,
      title: "13. Children's Privacy",
      icon: ShieldCheck,
      content: `Our website and technical services are designed for adult homeowners, business owners, IT administrators, and institutional representatives. We do not knowingly solicit or collect personal identifiable information from individuals under the age of 18. If we become aware that a minor has provided us with personal data, we will immediately delete that information from our records.`
    },
    {
      id: 14,
      title: "14. Changes to this Privacy Policy",
      icon: FileText,
      content: `We may revise or update this Privacy Policy periodically to reflect technological updates, regulatory changes, or adjustments to our technical service operations. The updated version will be posted on this page with an updated "Effective Date." We encourage you to review this policy periodically to stay informed about our data protection practices.`
    },
    {
      id: 15,
      title: "15. Contact Information",
      icon: Mail,
      content: `If you have questions, feedback, or concerns regarding this Privacy Policy or our handling of your personal data, please reach out to us directly:

• Business Name: MIINFOTECH (MIInfotech)
• Founder & Proprietor: Mohammed Ishtiaqh
• Primary Service Phone / WhatsApp: +91 99647 61624
• Official Email: miinfotech.support@gmail.com
• Operating Region: Hassan City & Outskirts, Karnataka 573201, India
• Service Model: Doorstep Onsite Service-Area Business (SAB)
• Operating Hours: Monday to Saturday (9:30 AM – 8:00 PM), Sunday (10:00 AM – 3:00 PM)`
    }
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="privacy-policy-section" className="py-24 md:py-32 bg-slate-950 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header with Badges */}
        <div className="border-b border-slate-900 pb-8 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-500 font-semibold uppercase tracking-wider text-xs font-mono mb-2">
                <Lock className="w-4 h-4" />
                <span>MIInfotech Privacy & Trust</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                This document details how MIInfotech protects your personal data, handles service inquiries, and complies with Google OAuth security standards.
              </p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Effective Date</span>
                <span className="text-xs text-white font-bold font-mono">September 18, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search Filter Box */}
        <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search privacy policy, e.g., 'Google', 'data deletion', 'Supabase', 'cookies'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-slate-400 hover:text-white underline font-mono cursor-pointer flex-shrink-0"
            >
              Clear Filter
            </button>
          )}
          <div className="text-[11px] text-slate-500 font-mono flex-shrink-0">
            Showing {filteredSections.length} of {sections.length} Sections
          </div>
        </div>

        {/* Desktop Split View: Side Index Table + Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side navigation panel (Sticky on desktop) */}
          <div className="hidden lg:block lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-5 sticky top-28 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-4 px-2">
              Privacy Index ({sections.length})
            </h3>
            <div className="space-y-1">
              {sections.map((section) => {
                const isSelected = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      const element = document.getElementById(`privacy-section-${section.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <span className="truncate pr-2">{section.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "translate-x-0.5 text-white" : "text-slate-600 group-hover:text-slate-400"
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-850 px-2 text-[11px] text-slate-500 leading-relaxed font-mono">
              🔒 Standard SSL/TLS encryption active across all visits to miinfotech.netlify.app.
            </div>
          </div>

          {/* Right Main Content Cards */}
          <div className="lg:col-span-8 space-y-6">
            {filteredSections.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 font-mono text-xs">
                No matching privacy sections found for "{searchTerm}".
              </div>
            ) : (
              filteredSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <article
                    key={section.id}
                    id={`privacy-section-${section.id}`}
                    className="bg-slate-900/60 border border-slate-850 hover:border-slate-700 rounded-3xl p-6 sm:p-8 transition-all scroll-mt-28"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal space-y-2">
                      {section.content}
                    </div>
                  </article>
                );
              })
            )}

            {/* Direct Contact Support Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 text-left mt-10">
              <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Inquiries & Data Requests</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Have questions about your data privacy?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Contact founder Mohammed Ishtiaqh directly to request data deletion, review your stored inquiry information, or ask questions about our privacy policies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <a
                  href="tel:+919964761624"
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500 p-3.5 rounded-xl flex items-center gap-3 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>+91 99647 61624</span>
                </a>

                <a
                  href="mailto:miinfotech.support@gmail.com"
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500 p-3.5 rounded-xl flex items-center gap-3 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">miinfotech.support@gmail.com</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
