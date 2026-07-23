import React from "react";
import { Phone, MessageSquare } from "lucide-react";

export default function FloatingCTABar() {
  return (
    <>
      {/* Floating Buttons on Desktop (Bottom Right Side Stacked) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col gap-3">
        <a
          href="https://wa.me/919964761624?text=Hi%20MIInfotech%2C%20I%20would%20like%20to%20enquire%20about%20your%20doorstep%20IT%20services%20(Computer%2FCCTV%2FNetworking%2FAMC).%20Please%20let%20me%20know%20your%20availability%20for%20a%20setup%2Frepair%20visit.%20Thanks!"
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-bold border border-emerald-500/30"
          title="Chat on WhatsApp: +91 9964761624"
        >
          <MessageSquare className="w-4 h-4 fill-current animate-pulse" />
          <span>WhatsApp: +91 99647 61624</span>
        </a>

        <a
          href="tel:+919964761624"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-bold border border-blue-500/30"
          title="Call Mohammed Ishtiaqh"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>Call: +91 99647 61624</span>
        </a>
      </div>

      {/* Sticky Bottom Ribbon on Mobile Layouts (Responsive Touch targets with Safe Area padding) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-850 px-3 pt-2.5 flex sm:hidden gap-2 shadow-2xl justify-between pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
        <a
          href="https://wa.me/919964761624?text=Hi%20MIInfotech%2C%20I%20would%20like%20to%20enquire%20about%20your%20doorstep%20IT%20services%20(Computer%2FCCTV%2FNetworking%2FAMC).%20Please%20let%20me%20know%20your%20availability%20for%20a%20setup%2Frepair%20visit.%20Thanks!"
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 active:bg-emerald-500"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span>WhatsApp: +91 9964761624</span>
        </a>

        <a
          href="tel:+919964761624"
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 active:bg-blue-500"
        >
          <Phone className="w-3.5 h-3.5 fill-current" />
          <span>Call: +91 9964761624</span>
        </a>
      </div>
    </>
  );
}
