"use client";

import React from "react";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <aside className="shrink-0 flex flex-row md:flex-col md:justify-center items-center md:items-start justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-0 border-t md:border-t-0 md:border-l border-stone-300/60 md:w-48 lg:w-72">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow shrink-0">
          <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <div className="font-editorial text-xs md:text-base font-black tracking-tight text-stone-900">
          JZA Curations
        </div>
      </div>

      <p className="md:hidden text-[10px] text-stone-500 font-medium">
        &copy; {new Date().getFullYear()} JZA
      </p>

      <div className="hidden md:block mt-8 text-xs text-stone-500 font-medium leading-relaxed space-y-2">
        <p className="flex items-center gap-1.5">
          Crafted with
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          using Next.js &amp; GSAP
        </p>
        <p>&copy; {new Date().getFullYear()} Nuon Thanith.</p>
      </div>
    </aside>
  );
}
