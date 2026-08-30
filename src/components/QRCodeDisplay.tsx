import React, { useState, useRef } from "react";
import { Download, Copy, Check, ExternalLink, QrCode, Share2, Printer as PrintIcon, Sparkles, Image } from "lucide-react";
import { GOOGLE_REVIEW_URL } from "./ReviewAssistant";
import { SITE_URL } from "../lib/config";
import LogoIcon from "./LogoIcon";

interface QRCodeDisplayProps {
  url?: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

export default function QRCodeDisplay({
  url = `${SITE_URL}/review`,
  title = "MIInfotech Review Assistant QR",
  subtitle = "Scan with any smartphone camera to open the review assistant",
  size = 220
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<"assistant" | "direct">("assistant");
  const [showCardModal, setShowCardModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentUrl = selectedType === "assistant" ? `${SITE_URL}/review` : GOOGLE_REVIEW_URL;

  // High-Resolution 1200x1200px PNG & SVG QR generator URLs
  const qrDisplayUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=0f172a&margin=2`;
  const qrHighResPngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=0f172a&margin=4&format=png`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=0f172a&margin=4&format=svg`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! Thank you for choosing MIInfotech for your technical service. Please share your genuine experience with us on Google: ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 max-w-sm mx-auto shadow-xl">
      
      {/* Type Switcher */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 text-xs">
        <button
          type="button"
          onClick={() => setSelectedType("assistant")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            selectedType === "assistant"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          QR A (Review Assistant)
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("direct")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            selectedType === "direct"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          QR B (Direct Google)
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">
          {selectedType === "assistant" ? "QR A: Guided Review Assistant" : "QR B: Direct Google Review"}
        </h3>
        <p className="text-[11px] text-slate-400">
          {selectedType === "assistant"
            ? "Encodes https://miinfotech.netlify.app/review"
            : "Encodes direct Google write-review dialog"}
        </p>
      </div>

      {/* QR Code Container (Print-ready clean white background) */}
      <div className="bg-white p-4 rounded-2xl shadow-inner inline-block border-2 border-slate-200">
        <img
          src={qrDisplayUrl}
          alt="MIINFOTECH customer review QR code"
          width={size}
          height={size}
          className="mx-auto block"
          loading="lazy"
        />
        <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-wider block mt-1.5">
          {selectedType === "assistant" ? "Scan for Review Assistant" : "Scan to Review on Google"}
        </span>
      </div>

      {/* Destination URL Display */}
      <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-left flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono text-slate-300 truncate">
          {currentUrl}
        </span>
        <button
          onClick={handleCopyLink}
          className="text-xs text-blue-400 hover:text-blue-300 shrink-0 flex items-center gap-1 cursor-pointer font-mono"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* QR File Downloads (1200x1200px PNG + SVG) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={qrHighResPngUrl}
          download={`miinfotech-${selectedType}-1200px.png`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Download High-Res 1200x1200px PNG"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>PNG (1200px)</span>
        </a>

        <a
          href={qrSvgUrl}
          download={`miinfotech-${selectedType}.svg`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Download Scalable Vector Graphic (SVG)"
        >
          <Download className="w-3.5 h-3.5 text-purple-400" />
          <span>Vector SVG</span>
        </a>
      </div>

      {/* Customer Mobile Card & WhatsApp Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setShowCardModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
        >
          <Image className="w-3.5 h-3.5" />
          <span>Customer Card</span>
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE / SHAREABLE MOBILE QR CARD (Part 14) */}
      {/* ========================================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-5 animate-fadeIn shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Customer Mobile QR Card
              </span>
              <button
                onClick={() => setShowCardModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Standalone Printable Card Container */}
            <div 
              ref={cardRef} 
              className="bg-white text-slate-900 rounded-2xl p-6 text-center space-y-4 shadow-xl border border-slate-200"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="bg-slate-900 p-1.5 rounded-xl text-blue-500">
                  <LogoIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">MIINFOTECH</h4>
                  <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Doorstep IT & Security</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  ⭐ Share Your Service Experience
                </h3>
                <p className="text-xs text-slate-600 italic px-2">
                  "Your genuine feedback helps other customers understand our services."
                </p>
              </div>

              {/* QR Code in Card */}
              <div className="bg-slate-50 p-3 rounded-xl inline-block border border-slate-200 shadow-inner">
                <img
                  src={qrDisplayUrl}
                  alt="MIInfotech Review QR"
                  width={220}
                  height={220}
                  className="mx-auto block"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Scan to share your MIInfotech experience
                </span>
                <span className="text-[10px] font-mono text-blue-700 block">
                  {currentUrl}
                </span>
              </div>

              {/* Service tags footer */}
              <div className="border-t border-slate-200 pt-3 text-[9px] font-medium text-slate-500 space-y-0.5">
                <p className="font-semibold text-slate-700">
                  Computer • Laptop • CCTV • Printer • Networking • UPS • IT Services
                </p>
                <p>Hassan, Karnataka • Direct: +91 9964761624</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrintCard}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PrintIcon className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              <a
                href={qrHighResPngUrl}
                download="miinfotech-customer-review-qr-1200px.png"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download QR PNG</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
