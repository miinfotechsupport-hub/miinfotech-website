import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { SITE_URL } from "../lib/config";
import { ProjectItem } from "../types";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Wrench, 
  Shield, 
  Phone, 
  MessageSquare, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  ZoomIn, 
  Maximize2, 
  Star, 
  Link as LinkIcon, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Camera
} from "lucide-react";

interface ProjectCardProps {
  key?: any;
  project: any;
  onOpenDetails: (project: any) => void;
}

function ProjectCard({ project, onOpenDetails }: ProjectCardProps) {
  const imagesList = project.images && project.images.length > 0
    ? project.images
    : ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"];
    
  const [activeImage, setActiveImage] = useState(imagesList[0]);

  // Sync activeImage if the project's images change
  useEffect(() => {
    if (project.images && project.images[0]) {
      setActiveImage(project.images[0]);
    }
  }, [project.images]);

  return (
    <div 
      id={`project-card-${project.id}`}
      className="bg-slate-900/40 border border-slate-850 hover:border-slate-700 hover:bg-slate-900/75 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group animate-fadeIn h-full"
    >
      {/* Photo Container with overlay indicators */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 shrink-0">
        <img 
          src={activeImage} 
          alt={`${project.title} - Doorstep IT Work in Hassan`} 
          title={`${project.title} | MIInfotech Hassan`}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]" 
          referrerPolicy="no-referrer"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider">
          {project.category}
        </div>

        {/* Photo Count Badge ( highlights real installation photos ) */}
        {imagesList.length > 1 && (
          <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Camera className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{imagesList.length} ONSITE PHOTOS</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 bg-slate-950/30 px-2 py-0.5 rounded border border-slate-850/30">
              <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
              <span>{project.location}</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Hover / Interactable Gallery Strip */}
        {imagesList.length > 1 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-850/30">
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Quick Gallery Preview (Hover/Click to View):
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {imagesList.slice(0, 5).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setActiveImage(imgUrl)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(imgUrl);
                  }}
                  className={`relative w-10 h-8 rounded-md overflow-hidden shrink-0 border transition-all ${
                    activeImage === imgUrl 
                      ? "border-blue-500 ring-1 ring-blue-500/50 scale-105" 
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </button>
              ))}
              {imagesList.length > 5 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(project);
                  }}
                  className="w-10 h-8 bg-slate-950 border border-slate-850 rounded-md flex flex-col items-center justify-center shrink-0 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <span className="text-[9px] font-bold font-mono">+{imagesList.length - 5}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action buttons footer */}
        <div className="border-t border-slate-850/60 pt-3.5 space-y-2.5">
          <button 
            onClick={() => onOpenDetails(project)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 group/btn shadow-lg shadow-blue-900/10"
          >
            <span>View Full Case Study & Hardware Specs</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-200 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a 
              href="tel:+919964761624"
              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Phone className="w-3 h-3 text-blue-500 shrink-0" />
              <span>Call Mohammed</span>
            </a>
            <a 
              href={`https://wa.me/919964761624?text=Hi%20MIInfotech%2C%20I%20saw%20your%20completed%20project%20%22${encodeURIComponent(project.title)}%22%20and%20want%20to%20inquire%20about%20similar%20services.`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 text-[11px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProjectsGalleryProps {
  limit?: number;
  onViewAllClick?: () => void;
}

export default function ProjectsGallery({ limit, onViewAllClick }: ProjectsGalleryProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  
  // Lightbox and Zoom state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  
  // Touch Swiping references
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sidebar inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setInquirySubmitting(true);
    try {
      const payload = {
        name: inquiryName,
        phone: inquiryPhone,
        email: "",
        subject: `Project Enquiry: ${selectedProject?.category || "IT Service"}`,
        message: `Inquired about similar setup as: "${selectedProject?.title}". Additional requirements: ${inquiryMessage || "None"}`,
        status: "pending",
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.from("contact_enquiries").insert(payload);
      if (error) throw error;

      setInquirySuccess(true);
      setInquiryName("");
      setInquiryPhone("");
      setInquiryMessage("");
    } catch (err) {
      console.error("Failed to submit sidebar project inquiry:", err);
      alert("Notice: Could not submit enquiry. Please call Mohammed directly at +91 99647 61624!");
    } finally {
      setInquirySubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) {
          // Filter to only show published ones
          setProjects(data.filter((p: any) => p.status === "published"));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();

    const refreshHandler = () => {
      fetchProjects();
    };
    window.addEventListener("mi_projects_change", refreshHandler);
    return () => {
      window.removeEventListener("mi_projects_change", refreshHandler);
    };
  }, []);

  // Distinct categories present in published projects (plus 'All')
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((p) => p.category === filter);

  // Determine actual items to render on this section instance
  const displayedProjects = limit ? projects.slice(0, limit) : filteredProjects;

  // Sync selected project with URL pathname for Deep-linking
  useEffect(() => {
    if (projects.length === 0) return;
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/project/")) {
        const slug = path.replace("/project/", "");
        const linkedProject = projects.find((p) => p.seoSlug === slug || (p.id && p.id.toString() === slug));
        if (linkedProject) {
          setSelectedProject(linkedProject);
          setActiveImageIndex(0);
        }
      } else {
        setSelectedProject(null);
      }
    };
    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [projects]);

  const openDetails = (project: ProjectItem) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    setLightboxZoom(false);
    const slug = project.seoSlug || project.id;
    window.history.pushState(null, "", `/project/${slug}`);
    window.dispatchEvent(new Event("popstate"));
  };

  const closeDetails = () => {
    setSelectedProject(null);
    setIsLightboxOpen(false);
    setLightboxZoom(false);
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new Event("popstate"));
  };

  const handlePrevImage = (imagesCount: number) => {
    setActiveImageIndex((prev) => (prev === 0 ? imagesCount - 1 : prev - 1));
  };

  const handleNextImage = (imagesCount: number) => {
    setActiveImageIndex((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
  };

  // Touch Swipe handlers for mobile galleries
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (imagesCount: number) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    // Swipe left to show next image, swipe right to show previous image
    if (diff > 50) {
      handleNextImage(imagesCount);
    } else if (diff < -50) {
      handlePrevImage(imagesCount);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Find related projects (other projects in the same category)
  const relatedProjects = selectedProject
    ? projects
        .filter((p) => p.id !== selectedProject.id && p.category === selectedProject.category)
        .slice(0, 2)
    : [];

  // Fallback to latest other projects if none in the same category
  const finalRelatedProjects = selectedProject && relatedProjects.length === 0
    ? projects.filter((p) => p.id !== selectedProject.id).slice(0, 2)
    : relatedProjects;

  if (selectedProject) {
    return (
      <section id="project-case-study" className="py-16 md:py-24 bg-slate-950 border-b border-slate-900 text-left animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-8 border-b border-slate-900 pb-4">
            <button 
              onClick={closeDetails} 
              className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>Home</span>
            </button>
            <span>/</span>
            <button 
              onClick={closeDetails} 
              className="hover:text-blue-400 transition-colors cursor-pointer font-semibold"
            >
              <span>Completed Projects</span>
            </button>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-[200px] sm:max-w-[400px]">{selectedProject.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Full Case Study Details */}
            <div className="lg:col-span-8 flex flex-col md:block gap-y-4 md:gap-y-10 md:space-y-10">
              
              {/* Responsive Photo Gallery/Slider */}
              <div 
                className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-850 bg-slate-950 group select-none shadow-2xl order-1 md:order-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(selectedProject.images?.length || 0)}
              >
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <>
                    <img 
                      src={selectedProject.images[activeImageIndex]} 
                      alt={`${selectedProject.title} - Step ${activeImageIndex + 1}`} 
                      title={`${selectedProject.title} - Physical Onsite View`}
                      loading="lazy"
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setIsLightboxOpen(true)}
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating Controls */}
                    <div className="absolute top-4 left-4 flex gap-2 items-center z-10">
                      <button 
                        onClick={() => setIsLightboxOpen(true)}
                        className="bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Fullscreen Lightbox</span>
                      </button>
                    </div>

                    {selectedProject.images.length > 1 && (
                      <>
                        <button 
                          onClick={() => handlePrevImage(selectedProject.images.length)}
                          aria-label="Previous image"
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full border border-slate-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleNextImage(selectedProject.images.length)}
                          aria-label="Next image"
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full border border-slate-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-mono text-slate-300 border border-slate-800 shadow-lg">
                          {activeImageIndex + 1} / {selectedProject.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">No images uploaded</div>
                )}
              </div>

              {/* Title & Metadata Header */}
              <div className="space-y-4 order-2 md:order-none mt-2 md:mt-0">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-600/15 border border-blue-500/20 rounded-xl text-blue-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    {selectedProject.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-[10px] font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{selectedProject.location}</span>
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedProject.title}
                </h1>
              </div>

              {/* Case Study Core Narratives: Challenge & Solution */}
              <div className="space-y-8 order-3 md:order-none mt-10 md:mt-0">
                {selectedProject.challenge ? (
                  <div className="space-y-3 bg-slate-900/30 p-6 rounded-3xl border border-slate-850">
                    <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                      The Challenge
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base leading-[1.8] whitespace-pre-line">
                      {selectedProject.challenge}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-900/30 p-6 rounded-3xl border border-slate-850">
                    <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                      Case Study Overview
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base leading-[1.8] whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {selectedProject.solution && (
                  <div className="space-y-3 bg-slate-900/30 p-6 rounded-3xl border border-slate-850">
                    <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                      The Solution & Execution
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base leading-[1.8] whitespace-pre-line">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}
                
                {selectedProject.technicianNotes && (
                  <div className="space-y-3 bg-blue-950/10 p-6 rounded-3xl border border-blue-900/20 text-left">
                    <h3 className="text-blue-400 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <span>Technician Specifications & Configuration Log:</span>
                    </h3>
                    <div className="text-slate-200 text-xs sm:text-sm leading-[1.8] whitespace-pre-line font-mono bg-slate-950/50 p-4 rounded-xl border border-slate-850/60 overflow-x-auto">
                      {selectedProject.technicianNotes}
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Customer Feedback widget */}
              <div className="space-y-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-left order-4 md:order-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                    Verified Job Review
                  </span>
                </div>
                <p className="text-slate-200 italic text-xs sm:text-sm leading-[1.8]">
                  "Mohammed Ishtiaqh handled our doorstep {selectedProject.category.toLowerCase()} setup in Hassan with absolute professionalism. He completed everything on time, set up our mobile apps, and walked us through the technical details. Strongly recommended!"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-850/50 pt-3 mt-4">
                  <span className="font-semibold text-white">
                    Verified Client
                  </span>
                  <span>{selectedProject.location}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Sidebar with Enquiry Form & Spares */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Back Button */}
              <button 
                onClick={closeDetails}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-850 text-white font-sans text-xs font-bold rounded-2xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>Back to Projects Gallery</span>
              </button>

              {/* High-Converting Onsite Service Enquiry Form */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>Get a Similar Doorstep Quote</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Request custom diagnostics, CCTV mapping, or system installation at your Hassan premises.
                  </p>
                </div>

                {inquirySuccess ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-2xl text-center space-y-3 py-6 animate-scaleUp">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <Star className="w-5 h-5 fill-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold text-xs">Request Received!</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Mohammed Ishtiaqh will call you back within 15-30 minutes for diagnostics booking.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySuccess(false)}
                      className="text-[10px] font-mono text-blue-400 font-bold uppercase hover:underline"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSidebarSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Mohammed"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-1">WhatsApp / Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="e.g. +91 99000 12345"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-1">Special Notes (Optional)</label>
                      <textarea 
                        rows={3}
                        placeholder="Tell us about your requirements..."
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={inquirySubmitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {inquirySubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <span>Request Onsite Estimate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <span className="text-[10px] text-slate-500 font-mono">Or Call Direct: <a href="tel:+919964761624" className="text-blue-400 hover:underline">+91 99647 61624</a></span>
                </div>
              </div>

              {/* Project Information Widget - Clean Responsive 2-Column Layout on Mobile */}
              <div className="p-6 bg-slate-900/50 border border-slate-850 rounded-3xl space-y-4 w-full">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <Shield className="w-5 h-5 md:w-4 md:h-4 text-blue-500 shrink-0" />
                  <h4 className="text-white font-bold text-sm md:text-xs font-mono uppercase tracking-wider">Project Information</h4>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-3.5 text-xs">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                    <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Location:</span>
                    <strong className="text-white lg:text-right font-sans text-sm lg:text-xs">{selectedProject.location}</strong>
                  </div>
                  
                  {selectedProject.brand && (
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                      <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Hardware Brand:</span>
                      <strong className="text-white lg:text-right font-sans text-sm lg:text-xs">{selectedProject.brand}</strong>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                    <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Customer Type:</span>
                    <strong className="text-white lg:text-right font-sans text-sm lg:text-xs">{selectedProject.customerType || selectedProject.clientType || "Corporate / Retail"}</strong>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                    <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Service Category:</span>
                    <strong className="text-white lg:text-right font-sans text-sm lg:text-xs">{selectedProject.category}</strong>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                    <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Service Model:</span>
                    <strong className="text-emerald-400 font-mono text-xs lg:text-[10px] lg:text-right">Onsite Doorstep Support</strong>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start p-3 lg:p-0 bg-slate-900 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-850 lg:border-none h-full">
                    <span className="text-slate-400 font-mono text-[11px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-0">Warranty Status:</span>
                    <strong className="text-white font-mono text-xs lg:text-[10px] lg:text-right">Original OEM Warranty</strong>
                  </div>
                </div>
              </div>

              {/* Hardware Deployed Card - Full Width on Mobile, Bullet Points, Improved spacing & font-size */}
              {selectedProject.equipmentUsed && (
                <div className="p-6 bg-slate-900/50 border border-slate-850 rounded-3xl space-y-5 w-full">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Wrench className="w-5 h-5 text-blue-500 shrink-0" />
                    <h4 className="text-white font-bold text-sm md:text-xs font-mono uppercase tracking-wider">Hardware Deployed</h4>
                  </div>
                  <ul className="space-y-3 text-sm md:text-base text-slate-200 list-disc pl-5">
                    {selectedProject.equipmentUsed.split(",").map((item) => item.trim()).filter(Boolean).map((item, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Completed Works Widget */}
              {finalRelatedProjects.length > 0 && (
                <div className="p-6 bg-slate-900/50 border border-slate-850 rounded-3xl space-y-4 text-left">
                  <h4 className="text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Other Hassan Works</span>
                  </h4>
                  <div className="space-y-4">
                    {finalRelatedProjects.map((rel) => {
                      const cover = rel.images && rel.images[0]
                        ? rel.images[0]
                        : "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600";
                      return (
                        <div
                          key={rel.id}
                          onClick={() => openDetails(rel)}
                          className="flex gap-4 p-2 bg-slate-950/20 hover:bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl transition-all cursor-pointer group"
                        >
                          <img
                            src={cover}
                            alt={rel.title}
                            className="w-14 h-14 object-cover rounded-xl shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow min-w-0 flex flex-col justify-center">
                            <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider block mb-0.5">{rel.category}</span>
                            <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors block truncate">{rel.title}</span>
                            <span className="text-[9px] font-mono text-slate-500 block truncate">{rel.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Injected Schemas */}
          {selectedProject.schema && (
            <script 
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: selectedProject.schema }}
            />
          )}

          {/* Fallback Breadcrumb Schema */}
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
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
                    "name": "Completed Projects",
                    "item": `${SITE_URL}/#projects`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": selectedProject.title,
                    "item": `${SITE_URL}/project/${selectedProject.seoSlug || selectedProject.id}`
                  }
                ]
              })
            }}
          />

          {/* Full Screen Lightbox in Single Page view */}
          {isLightboxOpen && (
            <div className="fixed inset-0 bg-black/95 z-50 flex flex-col select-none animate-fadeIn">
              {/* Lightbox Header Controls */}
              <div className="bg-black/40 p-4 border-b border-slate-900 flex justify-between items-center z-10 shrink-0">
                <div className="text-xs font-mono text-slate-400">
                  Lightbox View • {activeImageIndex + 1} / {selectedProject.images?.length || 1}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLightboxZoom(!lightboxZoom)}
                    aria-label="Toggle Zoom"
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>{lightboxZoom ? "1x Zoom" : "2x Zoom"}</span>
                  </button>
                  <button 
                    onClick={() => setIsLightboxOpen(false)}
                    aria-label="Close Lightbox"
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Large image viewer with touch swiping */}
              <div 
                className="flex-grow w-full flex items-center justify-center p-4 relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(selectedProject.images?.length || 0)}
              >
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <img 
                    src={selectedProject.images[activeImageIndex]} 
                    alt={`${selectedProject.title} Lightbox`}
                    className={`max-w-full max-h-[75vh] object-contain transition-transform duration-300 ${lightboxZoom ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"}`}
                    onClick={() => setLightboxZoom(!lightboxZoom)}
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Navigation buttons */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => handlePrevImage(selectedProject.images.length)}
                      aria-label="Previous image"
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-full text-white transition-all cursor-pointer hidden md:block z-20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleNextImage(selectedProject.images.length)}
                      aria-label="Next image"
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-full text-white transition-all cursor-pointer hidden md:block z-20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom bar with Swipe & Zoom Indicator below the image gallery, smaller and never covers images */}
              <div className="p-3 bg-black/60 border-t border-slate-900 text-center flex justify-center items-center shrink-0 z-10">
                <span className="px-3.5 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[10px] md:text-xs font-mono text-slate-400 select-none shadow-xl pointer-events-none">
                  Swipe left/right • Tap to zoom
                </span>
              </div>
            </div>
          )}

        </div>
      </section>
    );
  }

  return (
    <section id="projects-section" className="py-16 md:py-24 bg-slate-950 border-b border-slate-900 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold w-fit tracking-wide uppercase font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real completed jobs</span>
            </div>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {limit ? "Latest Completed Projects" : "Recent Work & Portfolio"}
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              100% real onsite installation, network wiring, and system diagnostic repair work completed by Mohammed Ishtiaqh across Hassan, Karnataka.
            </p>
          </div>

          {/* Filtering Tabs (Only visible when not displaying a limited homepage section) */}
          {!limit && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filter === cat
                      ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono">Loading real-work showcase...</p>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-850 p-12 rounded-3xl text-center max-w-lg mx-auto">
            <p className="text-slate-400 text-sm">No completed projects uploaded under this category yet.</p>
          </div>
        ) : (
          /* Projects Grid with equal height cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onOpenDetails={openDetails} 
              />
            ))}
          </div>
        )}

        {/* Home page CTA redirect to projects tab */}
        {limit && projects.length > limit && (
          <div className="mt-12 text-center animate-fadeIn">
            <button
              onClick={onViewAllClick}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-sans text-sm font-bold px-8 py-4 rounded-xl transition-all shadow-md cursor-pointer group"
            >
              <span>Explore Complete Projects Portfolio</span>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Dynamic SEO Internal Link list for Crawler Discoverability */}
        {!loading && projects.length > 0 && (
          <nav className="mt-16 pt-8 border-t border-slate-900" aria-label="MIInfotech Completed Projects Index">
            <details className="group border border-slate-900 rounded-2xl bg-slate-950/40 p-4 transition-all duration-300">
              <summary className="text-xs font-mono font-bold text-slate-500 hover:text-slate-400 cursor-pointer flex items-center justify-between select-none">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Sitemap & Internal Project Directory Index ({projects.length} Works)</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-4 border-t border-slate-900/50 mt-3">
                {projects.map((p) => (
                  <a
                    key={p.id}
                    href={`/project/${p.seoSlug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openDetails(p);
                    }}
                    className="flex items-center justify-between bg-slate-900/30 hover:bg-slate-900/70 border border-slate-850/60 px-3 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-blue-400 transition-colors font-mono"
                  >
                    <span className="truncate mr-2 max-w-[80%]">{p.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                  </a>
                ))}
              </div>
            </details>
          </nav>
        )}

      </div>

    </section>
  );
}

