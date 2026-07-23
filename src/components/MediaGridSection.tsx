import React, { useState } from "react";
import { Search, Copy, Check, Trash2, Edit2, ExternalLink, HelpCircle, FileText, Briefcase, ShoppingBag, Image as ImageIcon, Settings, Star } from "lucide-react";

interface MediaGridSectionProps {
  settings: any;
  servicesList: any[];
  blogsList: any[];
  productsList: any[];
  galleryList: any[];
  testimonialsList: any[];
  onDelete: (url: string) => Promise<void>;
  onRename: (url: string, newTitle: string) => Promise<void>;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function MediaGridSection({
  settings,
  servicesList,
  blogsList,
  productsList,
  galleryList,
  testimonialsList,
  onDelete,
  onRename,
  addToast,
}: MediaGridSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [newTitleVal, setNewTitleVal] = useState("");

  // Aggregate all media assets from the loaded states
  const mediaList: any[] = [];
  const urlsSet = new Set<string>();

  const addMedia = (url: string, sourceTable: string, title: string, category: string) => {
    if (url && !urlsSet.has(url) && (url.startsWith("http") || url.startsWith("data:"))) {
      urlsSet.add(url);
      mediaList.push({
        url,
        sourceTable,
        title: title || "Unnamed Image Asset",
        category,
        isDeletable: sourceTable === "gallery"
      });
    }
  };

  // 1. Logos & Favicon
  if (settings?.logo_url) {
    addMedia(settings.logo_url, "settings", "Website Navbar Logo", "branding");
  }
  if (settings?.favicon_url) {
    addMedia(settings.favicon_url, "settings", "Browser Tab Favicon", "branding");
  }

  // 2. Services
  servicesList.forEach((s) => {
    if (s.banner_url) {
      addMedia(s.banner_url, "services", `${s.name} - Banner Image`, "services");
    }
    if (s.icon && s.icon.startsWith("http")) {
      addMedia(s.icon, "services", `${s.name} - Custom Icon Image`, "services");
    }
  });

  // 3. Blogs
  blogsList.forEach((b) => {
    if (b.featured_image) {
      addMedia(b.featured_image, "blogs", `${b.title} - Featured Image`, "blogs");
    }
  });

  // 4. Products
  productsList.forEach((p) => {
    if (p.image_url) {
      addMedia(p.image_url, "products", `${p.name} - Product Image`, "products");
    }
  });

  // 5. Gallery
  galleryList.forEach((g) => {
    if (g.url) {
      addMedia(g.url, "gallery", g.title, "gallery");
    }
  });

  // 6. Testimonials
  testimonialsList.forEach((t) => {
    if (t.avatar_url) {
      addMedia(t.avatar_url, "testimonials", `${t.author_name} - Profile Photo`, "testimonials");
    }
  });

  // Filter & Search the aggregated media list
  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sourceTable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || m.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast("Asset link copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleStartRename = (url: string, currentTitle: string) => {
    setEditingUrl(url);
    setNewTitleVal(currentTitle);
  };

  const handleSaveRename = async (url: string) => {
    if (!newTitleVal.trim()) return;
    await onRename(url, newTitleVal);
    setEditingUrl(null);
  };

  const categories = [
    { id: "all", label: "All Media", count: mediaList.length },
    { id: "branding", label: "Branding/Logos", count: mediaList.filter(m => m.category === "branding").length },
    { id: "gallery", label: "Gallery Assets", count: mediaList.filter(m => m.category === "gallery").length },
    { id: "blogs", label: "Blog Images", count: mediaList.filter(m => m.category === "blogs").length },
    { id: "services", label: "Services Banners", count: mediaList.filter(m => m.category === "services").length },
    { id: "products", label: "Product Photos", count: mediaList.filter(m => m.category === "products").length },
    { id: "testimonials", label: "Testimonials", count: mediaList.filter(m => m.category === "testimonials").length },
  ];

  const getSourceIcon = (sourceTable: string) => {
    switch (sourceTable) {
      case "settings": return <Settings className="w-3.5 h-3.5 text-blue-400" />;
      case "services": return <Briefcase className="w-3.5 h-3.5 text-indigo-400" />;
      case "blogs": return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      case "products": return <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />;
      case "gallery": return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
      case "testimonials": return <Star className="w-3.5 h-3.5 text-pink-400" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-4">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets by title, URL path, or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Categories count pills row */}
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`py-1 px-3.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid displaying filtered media items */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl">
          <p className="text-xs text-slate-500">No media assets found matching the filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col group relative hover:border-slate-750 transition-all shadow-md"
            >
              {/* Media preview element */}
              <div className="relative aspect-video bg-slate-900 border-b border-slate-850 overflow-hidden flex items-center justify-center">
                <img
                  src={media.url}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(media.url)}
                    title="Copy Image URL to Clipboard"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 shadow-md cursor-pointer transition-colors"
                  >
                    {copiedUrl === media.url ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Image in New Tab"
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 shadow-md cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {media.isDeletable && (
                    <button
                      type="button"
                      onClick={() => onDelete(media.url)}
                      title="Delete Asset from Gallery"
                      className="p-2 bg-red-950 hover:bg-red-900 text-red-400 hover:text-white rounded-xl border border-red-900/50 shadow-md cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description & info panel */}
              <div className="p-3.5 flex-grow flex flex-col justify-between gap-2 bg-slate-900/40">
                <div className="space-y-1">
                  {editingUrl === media.url ? (
                    <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={newTitleVal}
                        onChange={(e) => setNewTitleVal(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white w-full focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(media.url)}
                        className="p-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-[11px] font-semibold text-white leading-tight line-clamp-1 truncate w-full" title={media.title}>
                        {media.title}
                      </p>
                      {media.isDeletable && (
                        <button
                          onClick={() => handleStartRename(media.url, media.title)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Metadata labels */}
                  <div className="flex items-center gap-1.5">
                    {getSourceIcon(media.sourceTable)}
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider capitalize">
                      {media.sourceTable}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-900 mt-1">
                  <span className="text-[8px] font-mono text-slate-600 truncate max-w-[80px]">
                    {media.url.startsWith("data:") ? "Local Base64" : media.url.substring(media.url.lastIndexOf("/") + 1)}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    media.url.startsWith("data:")
                      ? "bg-slate-800 text-slate-400 border border-slate-700"
                      : "bg-blue-950/40 text-blue-400 border border-blue-900/40"
                  }`}>
                    {media.url.startsWith("data:") ? "Local" : "Cloud"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
