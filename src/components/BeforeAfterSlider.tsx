import React, { useState } from "react";
import { Move } from "lucide-react";

interface BeforeAfterSliderProps {
  imageBefore: string;
  imageAfter: string;
  title: string;
}

export default function BeforeAfterSlider({ imageBefore, imageAfter, title }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden select-none bg-slate-950 border border-slate-800 group shadow-2xl">
      
      {/* ALWAYS-VISIBLE STATIC OVERLAY BADGES (outside clipped regions to prevent crop/hiding) */}
      <div className="absolute top-4 left-4 bg-rose-950/95 border border-rose-500/30 text-rose-300 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider font-extrabold z-20 shadow-lg pointer-events-none">
        Before Onsite
      </div>
      <div className="absolute top-4 right-4 bg-emerald-950/95 border border-emerald-500/30 text-emerald-300 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider font-extrabold z-20 shadow-lg pointer-events-none">
        After MIInfotech
      </div>

      {/* 1. Before Image (Base Layer - visible on the left of the slider) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={imageBefore}
          alt={`${title} Before`}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. After Image (Top Overlay Layer - clipped on the left to reveal the Before image underneath) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none transition-all duration-75"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img
          src={imageAfter}
          alt={`${title} After`}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 3. Drag Handlebar line and knob */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white/90 z-20 pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-200">
          <Move className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* 4. Interactive Invisible Range Input Overlaid */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="Before and After Slider"
      />

      {/* 5. Helpful Hover Hint Indicator (fades out on interaction) */}
      {!hasInteracted && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none z-20">
          <div className="bg-slate-900/95 text-white border border-slate-700/80 text-xs py-1.5 px-3.5 rounded-full shadow-xl flex items-center gap-1.5 font-sans font-semibold animate-bounce">
            <span>↔</span> Drag Slider to Compare
          </div>
        </div>
      )}
    </div>
  );
}
