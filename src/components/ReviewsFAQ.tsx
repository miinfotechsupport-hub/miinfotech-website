import React, { useState, useEffect } from "react";
import { FAQS_DATA, REVIEWS_DATA, FAQItem, ReviewItem } from "../types";
import { 
  Star, ShieldAlert, Check, HelpCircle, MessageSquare, Search, 
  ChevronDown, ChevronUp, UserCheck, Calendar, RefreshCw, Settings, 
  Globe, AlertCircle, CheckCircle2, Trash2, Eye, EyeOff, Building
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface ReviewsFAQProps {
  showOnly?: "reviews" | "faqs" | "process";
}

export default function ReviewsFAQ({ showOnly }: ReviewsFAQProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First expanded by default
  const [activeFaqCategory, setActiveFaqCategory] = useState("All");

  const [faqsList, setFaqsList] = useState<FAQItem[]>(FAQS_DATA);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await supabase.from("faqs").select("*").order("order", { ascending: true });
        if (data && data.length > 0) {
          setFaqsList(data.map((item: any) => ({
            id: item.id || String(item.order),
            question: item.question,
            answer: item.answer,
            category: item.category || "General"
          })));
        }
      } catch (err) {
        console.error("Failed to load FAQs from DB:", err);
      }
    };
    fetchFaqs();
  }, []);

  // Direct CMS-managed customer reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(REVIEWS_DATA.length);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCMSReviews = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from("testimonials").select("*");
      if (data && data.length > 0) {
        const approvedList = data.filter((item: any) => item.approved !== false);
        if (approvedList.length > 0) {
          const mapped: ReviewItem[] = approvedList.map((item: any) => ({
            name: item.name,
            role: item.role || "Verified Customer",
            location: item.location || "Hassan",
            rating: item.rating || 5,
            date: item.date || new Date(item.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            comment: item.comment,
            verified: item.verified ?? true,
            profilePhoto: item.profilePhoto || item.avatar_url || ""
          }));
          setReviews(mapped);
          setTotalReviews(mapped.length);
          const sum = mapped.reduce((acc, cur) => acc + cur.rating, 0);
          setAvgRating(sum / mapped.length);
        } else {
          setReviews(REVIEWS_DATA);
          setTotalReviews(REVIEWS_DATA.length);
          setAvgRating(5.0);
        }
      } else {
        setReviews(REVIEWS_DATA);
        setTotalReviews(REVIEWS_DATA.length);
        setAvgRating(5.0);
      }
    } catch (err) {
      console.error("Failed to load customer reviews from Supabase:", err);
      setReviews(REVIEWS_DATA);
      setTotalReviews(REVIEWS_DATA.length);
      setAvgRating(5.0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSReviews();
    window.addEventListener("mi_testimonials_change", fetchCMSReviews);
    return () => {
      window.removeEventListener("mi_testimonials_change", fetchCMSReviews);
    };
  }, []);

  const faqCategories = ["All", "General", "Pricing", "Hardware", "CCTV", "Networking", "Laptop", "AMC"];

  // Filter FAQs based on category AND search input
  const filteredFaqs = faqsList.filter((faq) => {
    const matchesCategory = activeFaqCategory === "All" || faq.category === activeFaqCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  // Render isolated sections for custom homepage ordering
  if (showOnly === "reviews") {
    return (
      <section id="reviews-section" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeIn">
            <div className="max-w-3xl">
              <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Customer Validation</span>
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
                What Our Clients Say in Hassan
              </h2>
              <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">
                We focus on building long-term local trust. Read reviews from our actual residential, commercial, and institutional clients across Hassan, Karnataka.
              </p>
            </div>

            {/* Overall Rating Indicator */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="text-center border-r border-slate-800 pr-4">
                <span className="text-2xl font-black text-white block">{avgRating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-500 font-mono">OUT OF 5</span>
              </div>
              <div>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium block mt-1">Based on {totalReviews} verified reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {reviews.map((review, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg relative"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[9px] uppercase tracking-wider font-mono bg-blue-500/10 border border-blue-500/10 px-2.5 py-0.5 rounded-full">
                      <UserCheck className="w-3 h-3" />
                      <span>Verified Client</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {review.date.includes(",") ? review.date.split(",")[1]?.trim() : review.date}
                    </span>
                  </div>

                  <div className="flex gap-1 mb-3.5">
                    {[...Array(review.rating)].map((_, sidx) => (
                      <Star key={sidx} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="border-t border-slate-900 pt-4 text-left flex items-center gap-3">
                  {review.profilePhoto ? (
                    <img 
                      src={review.profilePhoto} 
                      alt={review.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm font-mono uppercase">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">{review.name}</h4>
                    <div className="flex flex-col text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span className="text-slate-300 font-semibold">{review.role}</span>
                      <span className="text-blue-500 mt-0.5">📍 {review.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex flex-col items-center justify-center gap-4 animate-fadeIn">
            <a 
              href="https://share.google/hnUk6Bt7LUOFrdL2g"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <span>Verify & Read All Reviews on Google Business Profile</span>
              <span className="text-blue-500">→</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (showOnly === "process") {
    return (
      <section id="process-section" className="py-16 md:py-24 bg-slate-950/30 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fadeIn">
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Precision Operations</span>
            <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1">Our Onsite Doorstep Process</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Four simple steps to get your computer system, networking grid, or security system back to peak performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative animate-fadeIn">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800 -z-10 hidden lg:block" />

            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">01 • INITIATION</span>
              <h4 className="text-white font-bold text-base">Call or Message</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reach out to Mohammed Ishtiaqh via phone, email, or our interactive cost estimator. Describe your required technical repair or project scope.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">02 • DISPATCH</span>
              <h4 className="text-white font-bold text-base">Expert Visits You</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We coordinate a doorstep appointment. A fully equipped diagnostic engineer arrives at your home, retail store, school, or factory in Hassan limits.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">03 • DIAGNOSIS</span>
              <h4 className="text-white font-bold text-base">Physical Inspection</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We physically test the malfunctioning unit or map out structured conduits. We explain the core defect and issue a firm upfront estimate.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">04 • RESOLUTION</span>
              <h4 className="text-white font-bold text-base">Quality Repair</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We repair with original OEM parts, finalize structured cable terminations, and configure secure streams. We test system stability before handing over.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (showOnly === "faqs") {
    return (
      <section id="faqs-section" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800 text-left">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 animate-fadeIn">
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Expert Answers</span>
            <h2 className="font-sans text-3xl font-extrabold text-white mt-2 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
              Have specific questions about our onsite service area model, parts warranty, or AMC contracts in Hassan? We've got you covered.
            </p>
          </div>

          {/* Interactive Search Panel */}
          <div className="relative mb-8 max-w-lg mx-auto animate-fadeIn">
            <Search className="w-5 h-5 text-slate-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search local IT & CCTV FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-4.5 py-3.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* FAQ Category buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8 animate-fadeIn">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  activeFaqCategory === cat
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion container */}
          <div className="space-y-4 animate-fadeIn">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Collapsible Header button */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${idx}`}
                      className="w-full flex items-center justify-between p-5 text-left text-white font-bold text-sm sm:text-base hover:bg-slate-900/40 cursor-pointer"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {/* Expandable Panel */}
                    {isExpanded && (
                      <div 
                        id={`faq-answer-${idx}`}
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 animate-slideDown"
                      >
                        <p>{faq.answer}</p>
                        <span className="inline-block bg-slate-900 text-slate-500 font-mono text-[9px] px-2.5 py-0.5 rounded mt-3.5">
                          Category: {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-950/60 border border-slate-850 rounded-2xl text-slate-500 text-sm font-mono">
                No matching FAQs found. Please call +91 9964761624 directly for immediate guidance!
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faqs-reviews-section" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* REVIEWS GRID SUBSECTION */}
        <div id="reviews-subsection" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Customer Validation</span>
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
                What Our Clients Say in Hassan
              </h2>
              <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">
                We focus on building long-term local trust. Read reviews from our actual residential, commercial, and institutional clients across Hassan, Karnataka.
              </p>
            </div>

            {/* Overall Rating Indicator */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="text-center border-r border-slate-800 pr-4">
                <span className="text-2xl font-black text-white block">{avgRating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-500 font-mono">OUT OF 5</span>
              </div>
              <div>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium block mt-1">Based on {totalReviews} verified reviews</span>
              </div>
            </div>
          </div>



          {/* REVIEWS GRID LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg relative animate-fadeIn"
              >
                <div>
                  {/* Verified badge */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[9px] uppercase tracking-wider font-mono bg-blue-500/10 border border-blue-500/10 px-2.5 py-0.5 rounded-full">
                      <UserCheck className="w-3 h-3" />
                      <span>Verified Client</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {review.date.includes(",") ? review.date.split(",")[1]?.trim() : review.date}
                    </span>
                  </div>

                  {/* Stars list */}
                  <div className="flex gap-1 mb-3.5">
                    {[...Array(review.rating)].map((_, sidx) => (
                      <Star key={sidx} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="border-t border-slate-900 pt-4 text-left flex items-center gap-3">
                  {review.profilePhoto ? (
                    <img 
                      src={review.profilePhoto} 
                      alt={review.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm font-mono uppercase">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">{review.name}</h4>
                    <div className="flex flex-col text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span className="text-slate-300 font-semibold">{review.role}</span>
                      <span className="text-blue-500 mt-0.5">📍 {review.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex flex-col items-center justify-center gap-4">
            <a 
              href="https://share.google/hnUk6Bt7LUOFrdL2g"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <span>Verify & Read All Reviews on Google Business Profile</span>
              <span className="text-blue-500">→</span>
            </a>
          </div>
        </div>

        {/* WORK PROCESS TIMELINE SUBSECTION */}
        <div id="process-subsection" className="mb-20 py-12 border-y border-slate-800 bg-slate-950/30 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-3xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Precision Operations</span>
            <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-white mt-1">Our Onsite Doorstep Process</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Four simple steps to get your computer system, networking grid, or security system back to peak performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Sequential horizontal timeline connector lines on large layouts */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800 -z-10 hidden lg:block" />

            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">01 • INITIATION</span>
              <h4 className="text-white font-bold text-base">Call or Message</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reach out to Mohammed Ishtiaqh via phone, email, or our interactive cost estimator. Describe your required technical repair or project scope.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">02 • DISPATCH</span>
              <h4 className="text-white font-bold text-base">Expert Visits You</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We coordinate a doorstep appointment. A fully equipped diagnostic engineer arrives at your home, retail store, school, or factory in Hassan limits.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">03 • DIAGNOSIS</span>
              <h4 className="text-white font-bold text-base">Physical Inspection</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We physically test the malfunctioning unit or map out structured conduits. We explain the core defect and issue a firm upfront estimate.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-blue-500 font-mono text-xs font-black tracking-widest uppercase">04 • RESOLUTION</span>
              <h4 className="text-white font-bold text-base">Quality Repair</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We repair with original OEM parts, finalize structured cable terminations, and configure secure streams. We test system stability before handing over.
              </p>
            </div>
          </div>
        </div>

        {/* FAQS DYNAMIC SECTION */}
        <div id="faqs-subsection" className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-xs font-mono">Expert Answers</span>
            <h2 className="font-sans text-3xl font-extrabold text-white mt-2 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
              Have specific questions about our onsite service area model, parts warranty, or AMC contracts in Hassan? We've got you covered.
            </p>
          </div>

          {/* Interactive Search Panel */}
          <div className="relative mb-8 max-w-lg mx-auto">
            <Search className="w-5 h-5 text-slate-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search local IT & CCTV FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-4.5 py-3.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* FAQ Category buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  activeFaqCategory === cat
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion container */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Collapsible Header button */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${idx}`}
                      className="w-full flex items-center justify-between p-5 text-left text-white font-bold text-sm sm:text-base hover:bg-slate-900/40 cursor-pointer"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {/* Expandable Panel */}
                    {isExpanded && (
                      <div 
                        id={`faq-answer-${idx}`}
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 animate-slideDown"
                      >
                        <p>{faq.answer}</p>
                        <span className="inline-block bg-slate-900 text-slate-500 font-mono text-[9px] px-2.5 py-0.5 rounded mt-3.5">
                          Category: {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-950/60 border border-slate-850 rounded-2xl text-slate-500 text-sm font-mono">
                No matching FAQs found. Please call +91 9964761624 directly for immediate guidance!
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
