"use client";

import React from "react";
import { Plus, Search, BookOpen } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenUpload: () => void;
  bookCount: number;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenUpload,
  bookCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav-clean transition-all duration-300">
      <div className="w-full px-4 sm:px-12 lg:px-16 py-3 md:py-0 md:h-20 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow shrink-0">
            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <div className="font-editorial text-lg md:text-2xl font-black tracking-tight text-stone-900 whitespace-nowrap">
            JZA{" "}
            <span className="font-cormorant italic font-normal text-stone-500 text-sm md:text-lg">
              Curations
            </span>
          </div>
        </div>

        {/* Action Button & Book Count */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto md:order-3">
          <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider text-stone-500">
            {bookCount} Books Available
          </span>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-stone-900 text-stone-100 font-semibold text-xs shadow hover:bg-stone-800 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Book</span>
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="w-full md:w-auto md:flex-1 md:max-w-md md:mx-4 md:order-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-stone-200/60 text-stone-900 placeholder-stone-400 border border-stone-300/40 focus:border-stone-800 focus:bg-white focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded bg-stone-300 text-stone-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
