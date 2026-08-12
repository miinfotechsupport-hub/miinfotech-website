import React, { useState } from "react";
import { ShoppingBag, ShieldCheck, Check, Sparkles, MessageSquare, Phone, ArrowRight, Tag } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  specifications?: string;
  price: number;
  image: string;
  featured?: boolean;
  enabled?: boolean;
}

interface ProductsShowcaseProps {
  products?: ProductItem[];
  onRequestInstallation?: (productName: string) => void;
}

const DEFAULT_PRODUCTS_FALLBACK: ProductItem[] = [
  {
    id: "prod-1",
    name: "Hikvision 2MP Full HD Indoor Dome CCTV Camera",
    brand: "Hikvision",
    category: "CCTV",
    description: "High performance CMOS sensor camera with up to 1080P resolution, smart IR night vision up to 20m, and weatherproof construction.",
    specifications: "Resolution: 1080p Full HD; Connection: BNC; Night Vision: Up to 20 meters; Sensor: High Performance CMOS",
    price: 1850,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "prod-2",
    name: "Crucial MX500 500GB SATA 2.5-inch Internal SSD",
    brand: "Crucial",
    category: "Computer Spares",
    description: "Supercharge your laptop or desktop speed. Features sequential reads up to 560MB/s and sequential writes up to 510MB/s for instant booting and fast loading.",
    specifications: "Interface: SATA 6.0Gb/s; Capacity: 500 GB; Form Factor: 2.5-inch; MTBF: 1.8 Million Hours",
    price: 3200,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "prod-3",
    name: "CP Plus 4 Channel Full HD Smart DVR",
    brand: "CP Plus",
    category: "CCTV",
    description: "Compact and powerful digital video recorder supporting 4 AHD/IP/CVBS camera channels, automatic cloud sync, and remote mobile app preview via gDMSS.",
    specifications: "Channels: 4; Video Output: HDMI, VGA; Compression: H.265+; Mobile App: gDMSS / iDMSS",
    price: 2950,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    featured: false
  },
  {
    id: "prod-4",
    name: "TP-Link Archer C6 Gigabit Dual-Band Wi-Fi Router",
    brand: "TP-Link",
    category: "Networking",
    description: "AC1200 Dual-Band Wi-Fi router delivering up to 867Mbps over 5GHz and 300Mbps over 2.4GHz with 4 external antennas for whole-home coverage.",
    specifications: "Speed: AC1200; Ports: 4x Gigabit LAN, 1x Gigabit WAN; Antennas: 4 External",
    price: 2450,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    featured: true
  }
];

export default function ProductsShowcase({ products, onRequestInstallation }: ProductsShowcaseProps) {
  const displayProducts = (products && products.length > 0) ? products : DEFAULT_PRODUCTS_FALLBACK;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(displayProducts.map((p) => p.category)))];

  const filteredProducts = selectedCategory === "All"
    ? displayProducts
    : displayProducts.filter((p) => p.category === selectedCategory);

  const handleOrderWhatsApp = (productName: string) => {
    const text = encodeURIComponent(`Hi MIInfotech, I would like to inquire about ordering and doorstep installation for: ${productName}`);
    window.open(`https://wa.me/919964761624?text=${text}`, "_blank");
  };

  return (
    <section className="py-24 bg-slate-950 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wide font-mono mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Hardware & CCTV Catalog</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            IT Hardware & CCTV Equipment in Hassan
          </h1>
          <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
            Quality CCTV cameras, Wi-Fi routers, SSDs, and networking supplies available with <strong className="text-white">same-day doorstep installation</strong> across Hassan, Karnataka.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider">
                    {product.category}
                  </div>
                  {product.brand && (
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-mono">
                      {product.brand}
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white leading-snug tracking-tight group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {product.specifications && (
                    <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-[11px] text-slate-300 font-mono space-y-1">
                      <span className="text-blue-400 font-bold block text-[10px] uppercase tracking-wider">Key Specifications:</span>
                      {product.specifications.split(";").map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{spec.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 border-t border-slate-800/50 mt-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Estimated Price</span>
                  <span className="text-xl font-extrabold text-white font-mono">₹{product.price.toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(product.name)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Request Installation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Onsite Service Callout Banner */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Need Custom Hardware or Bulk CCTV Setup?</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
            Founder <strong>Mohammed Ishtiaqh</strong> visits your office or home in Hassan to perform physical site surveys, recommend exact camera counts, and bring diagnostic hardware.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919964761624"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call +91 99647 61624</span>
            </a>
            <a
              href="https://wa.me/919964761624?text=Hi%20MIInfotech,%20I%20need%20a%20custom%20hardware%20quote%20for%20my%20premises."
              target="_blank"
              rel="noreferrer"
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
