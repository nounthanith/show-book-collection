"use client";

import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="shrink-0 flex flex-row md:flex-col md:justify-center items-center md:items-start gap-3 md:gap-0 px-4 sm:px-6 lg:px-8 py-3 md:py-0 border-b md:border-b-0 md:border-r border-stone-300/60 md:w-56 lg:w-80">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow shrink-0">
        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
      </div>

      <div>
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
          Part 1 &bull; Digital Library
        </span>
        <h1 className="font-editorial text-base md:text-4xl lg:text-5xl font-black md:font-normal tracking-tight uppercase text-stone-900 leading-none md:mt-4">
          <span className="md:hidden">
            The Personal <span className="text-amber-600">Curation</span>
          </span>
          <span className="hidden md:inline">
            The Personal
            <br />
            <span className="font-black">Curation</span>
          </span>
        </h1>
        <p className="hidden md:block text-xs lg:text-sm font-medium text-stone-600 leading-relaxed mt-5">
          An editorial showcase of top literary works, technical guides, and curated PDF books. Click any book to open and read it.
        </p>
        <div className="hidden md:flex mt-6 items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-800">
          <span>Click a book to read</span>
          <ArrowRight className="w-4 h-4 text-amber-600" />
        </div>
      </div>
    </section>
  );
}
