import React, { useState } from "react";
import { ShieldCheck, ArrowUpRight, Scale, Mail, Phone, Calendar, Search, MapPin, CheckCircle, FileText, ChevronRight } from "lucide-react";

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const clauses = [
    {
      id: 1,
      title: "1. Acceptance of Terms",
      content: "By engaging MIInfotech for any IT support, computer or laptop repair, CCTV installation, networking solutions, or by purchasing hardware accessories, you agree to be bound by these Terms and Conditions. These terms constitute a legally binding service contract between the client (referred to as \"Customer\", \"you\", or \"your\") and MIInfotech (referred to as \"MIInfotech\", \"we\", \"us\", or \"our\"). If you do not agree with any part of these terms, please notify us immediately prior to the commencement of any diagnostic or physical services."
    },
    {
      id: 2,
      title: "2. Business Information",
      content: "MIInfotech is a professional, registered Service-Area Business (SAB) specializing in doorstep onsite IT infrastructure and security solutions. Founded and operated by Mohammed Ishtiaqh, we serve residential, retail, SME, and institutional customers in Hassan City, Karnataka, India, and surrounding outskirts. We operate strictly as an onsite mobile service provider, meaning we do not maintain a retail walk-in storefront; all hardware diagnostics, installations, and repairs are carried out at your designated doorstep or physical site. Standard business operating hours are from 9:00 AM to 9:00 PM, Monday through Sunday."
    },
    {
      id: 3,
      title: "3. Products & Services",
      content: "MIInfotech offers a comprehensive suite of digital, network, and security services, including computer onsite troubleshooting, laptop repairs, operating system installations, SSD performance upgrades, wired and wireless structured LAN networking, printer configurations, CCTV camera physical installations, signal cameras repair, remote viewing DVR/NVR mobile configuration, and preventive Annual Maintenance Contracts (AMC). All products, replacement spares, and physical goods provided during repairs are sourced from premium authorized channels to ensure genuine performance."
    },
    {
      id: 4,
      title: "4. Quotations & Pricing",
      content: "All pricing estimates, verbal proposals, and written quotations provided by MIInfotech are based on initial user descriptions and standard labor calculations. Quotations are valid for 7 calendar days from the date of issuance unless specified otherwise. We reserve the right to revise quotes if the physical site condition or the actual diagnostic scan reveals additional underlying faults, components damage, or if the client requests modifications to the scope of work. Onsite diagnostics and visiting fees are fixed at ₹450 within local Hassan City and ₹1200 (₹450 base + ₹750 travel charge) for outskirts regions depending on the distance from the city center."
    },
    {
      id: 5,
      title: "5. Taxes",
      content: "All prices, service rates, and material quotes displayed, calculated, or communicated by MIInfotech are strictly exclusive of Goods and Services Tax (GST) unless explicitly specified otherwise in a formal written commercial invoice. Applicable GST rates under Indian tax schedules will be calculated and added extra to the final billing invoice. Tax compliance, physical invoices, and digital billing statements will be furnished to the customer upon final clearance."
    },
    {
      id: 6,
      title: "6. Payment Terms",
      content: "Payments for all onsite diagnostics, basic desktop repairs, or general troubleshooting are due immediately upon the completion of the physical service call. We accept payments through physical Cash, major UPI channels (Google Pay, PhonePe, Paytm), and instant Bank Transfers. For extensive system deployments, complex structured LAN cabling, or CCTV security projects, the client must pay an advance deposit of 50% of the total estimated invoice value before physical materials are dispatched or work begins. The remaining 50% balance is strictly due immediately upon final physical installation and testing."
    },
    {
      id: 7,
      title: "7. Goods Once Sold Policy",
      content: "We enforce a strict \"Goods Once Sold\" policy. Once a physical product (including SSDs, RAM sticks, Wi-Fi routers, CCTV cameras, NVRs, cabling, power supplies, or UPS systems) is purchased, delivered, unboxed, or physically installed on the client's premises, it cannot be returned, exchanged, or refunded. Returns or exchanges are only processed under direct manufacturing defect guidelines discovered at the immediate time of unboxing or as required under applicable consumer protection laws."
    },
    {
      id: 8,
      title: "8. Installation Terms",
      content: "All physical installation tasks, including drilling, bracket mounting, conduit laying, cap casing, and cable termination, are executed with professional care. Technicians are not liable for minor cosmetic alterations or surface blemishes naturally resulting from drilling or structural requirements. The customer is requested to provide explicit alignment and placement inputs before physical mounting begins. Any alteration or relocation requested after the physical installation has been completed will be treated as a fresh service call and billed accordingly."
    },
    {
      id: 9,
      title: "9. Customer Responsibilities",
      content: "To guarantee smooth onsite service, the customer must ensure that a responsible adult representative is present at the site during the entire duration of the technician's visit. The customer must provide safe, unobstructed access to all computers, network devices, and mounting areas. You must also supply stable electric power, appropriate ventilation, a clean working surface, and active local internet credentials (SSID and passwords) when configuring network or camera synchronization."
    },
    {
      id: 10,
      title: "10. Electrical Point & Site Readiness",
      content: "Before our team arrives for any CCTV deployment, networking cabinet mounting, or desktop setup, the site must be fully ready. This includes the availability of active, stable AC electrical points (sockets), protective surge suppressors, and standard physical access clearance. If a service call cannot be completed due to missing electrical lines, ongoing construction delays, or lack of site access, the call will be rescheduled, and a minimum site-non-readiness fee of ₹350 will be charged."
    },
    {
      id: 11,
      title: "11. Additional Materials & Extra Charges",
      content: "The price calculated in standard service estimators or quotes represents the baseline labor and defined core equipment. Any additional consumables, including extra Cat6 network cables, RG6 coaxial video cables, PVC conduits, casing/capping channels, plastic junction boxes, BNC video connectors, DC power connectors, wall anchors, or additional electrical wiring used to complete the setup will be tracked physically and billed extra on an actual consumption per-meter or per-piece basis."
    },
    {
      id: 12,
      title: "12. Service Visit Charges",
      content: "Standard visiting and diagnostic charges of ₹450 (within Hassan City) and ₹1200 (outskirts regions) are strictly applicable for every onsite trip dispatched to customer premises, regardless of whether a repair is performed. These charges apply to standard diagnostic visits during product warranty claims to cover transport, fuel, and diagnostic labor, unless the equipment is covered under a comprehensive MIInfotech Annual Maintenance Contract (AMC) or if otherwise agreed in writing."
    },
    {
      id: 13,
      title: "13. Warranty Policy",
      content: "MIInfotech offers a dedicated 15-day service warranty on our repair craftsmanship. This service warranty covers only the specific software adjustment or configuration adjustment performed during our visit. If the same exact issue recurs within 15 calendar days from the service date due to a defect in our repair labor, we will dispatch a technician to rectify it with no additional labor charges. This does not cover secondary operating issues, virus re-infection, or customer-induced damage."
    },
    {
      id: 14,
      title: "14. Manufacturer Warranty",
      content: "All physical hardware spares, components, and devices supplied by MIInfotech (such as WD/Crucial SSDs, Kingston RAM, Hikvision/CP Plus Cameras, TP-Link switches, and APC UPS systems) carry standard manufacturer warranties. These warranties are provided directly by the respective brands, and MIInfotech acts as a facilitating partner. Customers must preserve and present the original commercial tax invoice to initiate a manufacturer warranty replacement or repair claim."
    },
    {
      id: 15,
      title: "15. Warranty Claim Processing",
      content: "Warranty replacement for hardware items must undergo the brand's authorized testing and approval process. This standard evaluation and replacement processing duration generally takes 15 to 25 working days. MIInfotech can handle the pickup, shipping, follow-up, and return delivery of components with the authorized service centers for a nominal logistics and handling fee, depending on the item and service point location."
    },
    {
      id: 16,
      title: "16. Items Not Covered Under Warranty",
      content: "Warranty coverage does not apply to software operating systems (Windows, Linux, macOS), configured applications, firmware corruptions, device-driver compatibility mismatches, file system crashes, virus or malware cleanup, and lost file structures. Re-infections, unauthorized software downloads, third-party system changes, or configuration tweaks performed by the user after our departure are strictly excluded from warranty support."
    },
    {
      id: 17,
      title: "17. No Warranty on Accessories",
      content: "Please note that standard consumables, high-wear peripherals, and connection accessories carry zero replacement or repair warranty. This includes, but is not limited to, external power adapters (CCTV/DVR/NVR/Router adapters), computer mice, BNC connectors, DC plugs, raw CCTV cables, LAN patch cables, surge spike busters, basic ethernet desktop switches, signal converters, HDMI/VGA cables, and other auxiliary accessories."
    },
    {
      id: 18,
      title: "18. Warranty Exclusions",
      content: "Any hardware or service warranty is rendered null and void immediately if the device exhibits physical impact damage, cracked casing, burnt IC components, motherboard short circuits, water or liquid ingress, fire damage, direct lightning strikes, electric power surges, voltage fluctuations, unauthorized third-party repairs, broken warranty seals, customer negligence, extreme dampness or rust, pest or rodent chewing, and natural acts of God."
    },
    {
      id: 19,
      title: "19. Data Backup & Loss Disclaimer",
      content: "THE CUSTOMER IS SOLELY AND ENTIRELY RESPONSIBLE FOR MAINTAINING COMPLETE BACKUPS OF ALL SENSITIVE DATA, PERSONAL FILES, OPERATING DATABASES, AND SOFTWARE APPLICATIONS BEFORE ANY TECHNICIAN COMMENCES REPAIR, DIAGNOSTIC, OR SYSTEM UPGRADE WORK. MIINFOTECH, ITS FOUNDER MOHAMMED ISHTIAQH, AND DISPATCHED TECHNICIANS SHALL HAVE ZERO LIABILITY FOR THE ACCIDENTAL DELETION, CORRUPTION, OVERWRITING, OR SYSTEM LOSS OF FILES, RECOVERY CONFIGURATIONS, OR DATA STRUCTURES DURING ONSITE TROUBLESHOOTING."
    },
    {
      id: 20,
      title: "20. Annual Maintenance Contract (AMC) Terms",
      content: "AMC contracts are governed by their respective individual service agreement documents. Standard AMCs include routine preventive check-ups, unlimited free diagnostic service dispatches, and priority response times. Hardware components replacement and custom structural rewiring are not included in non-comprehensive contracts. AMC clients enjoy 100% free onsite diagnostic check-ups during the active duration of their contract term."
    },
    {
      id: 21,
      title: "21. Cancellation & Rescheduling Policy",
      content: "Customers may cancel or reschedule a booked onsite service visit by notifying us via call or WhatsApp at least 2 hours before the scheduled technician arrival window. If a customer cancels a service call after the technician has already reached the premises, or if the premises are locked, a trip cancellation and dispatch charge of ₹300 will be instantly payable by the client."
    },
    {
      id: 22,
      title: "22. Limitation of Liability",
      content: "To the maximum extent permitted by applicable Indian law, the total cumulative liability of MIInfotech and its founder Mohammed Ishtiaqh for any direct claims, losses, service damages, or performance failures arising out of a specific service call, shall never exceed the actual amount paid by the customer to MIInfotech for that specific service call. We are not liable for secondary business interruption, loss of profits, or data leaks."
    },
    {
      id: 23,
      title: "23. Third-Party Products & Manufacturer Liability",
      content: "MIInfotech acts strictly as a certified service integrator and retail service vendor. We do not manufacture any hardware components. We carry zero product liability for inherent manufacturing design flaws, brand-side security vulnerabilities, firmware bugs, software-side device updates, or direct physical recalls announced by original equipment manufacturers (OEMs)."
    },
    {
      id: 24,
      title: "24. Intellectual Property",
      content: "All digital assets, logos, graphic layouts, custom-written text content, software UI designs, and digital code associated with MIInfotech (including on this platform and marketing catalogs) are the exclusive intellectual property of MIInfotech and its founder Mohammed Ishtiaqh. Unauthorized copying, downloading, distribution, or reproduction of any branding is strictly prohibited."
    },
    {
      id: 25,
      title: "25. Privacy & Confidentiality",
      content: "MIInfotech respects customer privacy and digital integrity. During physical repairs, data transfers, or DVR camera sync tasks, our technicians only access data areas strictly necessary to complete the service. We do not inspect, copy, or distribute your private databases, personal photo archives, email records, or surveillance videos. All client information is treated with absolute confidentiality."
    },
    {
      id: 26,
      title: "26. Force Majeure",
      content: "MIInfotech shall not be held liable or responsible for any failure, delay, or service disruptions resulting from circumstances beyond our reasonable control. This includes extreme weather events (heavy monsoon flooding, storms), local power grid outages, regional telecommunication blockages, strikes, national lockouts, pandemics, civic blockades, or material supply chain failures."
    },
    {
      id: 27,
      title: "27. Governing Law & Jurisdiction",
      content: "These Terms and Conditions, alongside any commercial service engagements, shall be governed, interpreted, and enforced in compliance with the laws of the Republic of India. Any legal dispute, arbitration, claim, or litigation arising between the Customer and MIInfotech shall be subject exclusively to the territorial jurisdiction of the courts located in Hassan, Karnataka, India."
    },
    {
      id: 28,
      title: "28. Changes to Terms & Conditions",
      content: "MIInfotech reserves the complete right, at our sole discretion, to modify, update, append, or replace these Terms and Conditions at any point of time. The updated version of the terms will be posted live on our web platform with the updated 'Effective Date'. Your continued engagement for service requests following any updates constitutes complete acceptance of the new terms."
    },
    {
      id: 29,
      title: "29. Contact Information",
      content: "If you have any questions, require official clarifications, or want to discuss any specific clause in these terms, please contact MIInfotech before booking: \n\n• Founder: Mohammed Ishtiaqh \n• Primary Service Hotline: +91 99647 61624 \n• Support Email: miinfotech.support@gmail.com \n• Support Region: Hassan City & Outskirts, Karnataka, India \n• Service Model: Standard Onsite Support Desk (SAB)"
    }
  ];

  const filteredClauses = clauses.filter(
    (clause) =>
      clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="terms-section" className="py-24 md:py-32 bg-slate-950 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Elegant Top Header with Slate Badge */}
        <div className="border-b border-slate-900 pb-8 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono mb-2">
                <Scale className="w-4 h-4" />
                <span>MIInfotech Legal Framework</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Please review these professional guidelines and operating policies. These clauses outline mutual responsibilities, warranty terms, and billing procedures for all doorstep IT operations in Hassan, Karnataka.
              </p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Last Updated</span>
                <span className="text-xs text-white font-bold font-mono">July 17, 2026</span>
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
              placeholder="Search terms, e.g., 'warranty', 'payment', 'backup'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
            Showing {filteredClauses.length} of {clauses.length} Sections
          </div>
        </div>

        {/* Desktop Split View: Side Index Table + Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side navigation panel (Sticky on desktop) */}
          <div className="hidden lg:block lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-5 sticky top-28 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-4 px-2">
              Sections Index ({clauses.length})
            </h3>
            <div className="space-y-1">
              {clauses.map((clause) => {
                const isSelected = activeSection === clause.id;
                return (
                  <button
                    key={clause.id}
                    onClick={() => {
                      setActiveSection(clause.id);
                      const element = document.getElementById(`clause-${clause.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <span className="truncate pr-2">{clause.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "translate-x-0.5 text-white" : "text-slate-600 group-hover:text-slate-400"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actual Terms Content List */}
          <div className="lg:col-span-8 space-y-6">
            {filteredClauses.length > 0 ? (
              filteredClauses.map((clause) => {
                const isActive = activeSection === clause.id;
                return (
                  <div
                    key={clause.id}
                    id={`clause-${clause.id}`}
                    className={`bg-slate-900 border rounded-3xl p-6 sm:p-8 transition-all ${
                      isActive 
                        ? "border-blue-500/50 shadow-xl shadow-blue-500/5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20" 
                        : "border-slate-850 hover:border-slate-800"
                    }`}
                    onClick={() => setActiveSection(clause.id)}
                  >
                    <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {clause.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          Ref: MI-TC-{String(clause.id).padStart(2, "0")}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {clause.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-12 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-white font-bold text-base">No Matching Policies Found</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  We couldn't find any section matching "{searchTerm}". Please check your spelling or clear the filter.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs py-2 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Show All Policies
                </button>
              </div>
            )}

            {/* General Legal Disclaimer Board */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 sm:p-8 text-left mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-500">
                <Scale className="w-5 h-5 flex-shrink-0" />
                <h4 className="text-white font-bold text-sm sm:text-base">Pre-Service Consent Alert</h4>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                By dispatching a service technician from MIInfotech, the customer hereby consents and acknowledges that all repairs, configuration updates, mounting tasks, and hardware upgrades are performed strictly under these published guidelines. It is the customer's sole responsibility to secure appropriate data backups and ensure power/electrical parameters are stable at the service site.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
