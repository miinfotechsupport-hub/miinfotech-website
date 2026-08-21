import React, { useState } from "react";
import { Download, Copy, Check, ExternalLink, QrCode, Share2 } from "lucide-react";
import { GOOGLE_REVIEW_URL } from "./ReviewAssistant";
import { SITE_URL } from "../lib/config";

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
  size = 200
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<"assistant" | "direct">("assistant");

  const currentUrl = selectedType === "assistant" ? `${SITE_URL}/review` : GOOGLE_REVIEW_URL;

  // Use reliable high-resolution QR image API for instant vector/PNG generation
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=0f172a&margin=2`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! Thank you for choosing MIInfotech for your technical service. Please share your genuine experience with us on Google: ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
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
          QR A (AI Assistant)
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
          {selectedType === "assistant" ? "Guided Review Assistant QR" : "Direct Google Review QR"}
        </h3>
        <p className="text-[11px] text-slate-400">
          {selectedType === "assistant"
            ? "Assists customer to draft their genuine service facts"
            : "Opens Google review dialog directly"}
        </p>
      </div>

      {/* QR Code Container (Print-ready clean white background) */}
      <div className="bg-white p-4 rounded-2xl shadow-inner inline-block border-2 border-slate-200">
        <img
          src={qrImageUrl}
          alt={title}
          width={size}
          height={size}
          className="mx-auto block"
          loading="lazy"
        />
        <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-wider block mt-1.5">
          Scan to Review MIInfotech
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

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={qrImageUrl}
          download={`miinfotech-qr-${selectedType}.png`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR</span>
        </a>

        <button
          onClick={handleShareWhatsApp}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp Link</span>
        </button>
      </div>

    </div>
  );
}
