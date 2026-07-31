"use client";

import React, { useRef, useEffect, useState } from "react";
import { Book } from "@/types/book";
import { ChevronDown } from "lucide-react";

interface BookshelfScrollProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const PAGE_SIZE = 10;

const SPINE_STYLES = [
  { bg: "bg-[#e8a3b8] text-[#3d1220]", width: "w-16 sm:w-20", height: "h-[38vh] min-h-60" },
  { bg: "bg-[#437855] text-emerald-100", width: "w-14 sm:w-16", height: "h-[33vh] min-h-52" },
  { bg: "bg-[#e05328] text-white", width: "w-20 sm:w-24", height: "h-[42vh] min-h-68" },
  { bg: "bg-[#292a2c] text-stone-200", width: "w-12 sm:w-14", height: "h-[35vh] min-h-56" },
  { bg: "bg-[#f2aab8] text-stone-900", width: "w-16 sm:w-18", height: "h-[40vh] min-h-64" },
  { bg: "bg-[#c9b7b5] text-stone-900", width: "w-14 sm:w-16", height: "h-[34vh] min-h-54" },
  { bg: "bg-[#d43737] text-white", width: "w-12 sm:w-14", height: "h-[44vh] min-h-72" },
  { bg: "bg-[#336699] text-white", width: "w-16 sm:w-18", height: "h-[35vh] min-h-56" },
  { bg: "bg-[#d8d6cf] text-stone-900", width: "w-24 sm:w-28", height: "h-[46vh] min-h-76" },
  { bg: "bg-[#213555] text-blue-100", width: "w-12 sm:w-14", height: "h-[34vh] min-h-54" },
  { bg: "bg-[#e09f3e] text-amber-950", width: "w-14 sm:w-16", height: "h-[39vh] min-h-62" },
  { bg: "bg-[#6b2d5c] text-rose-100", width: "w-20 sm:w-22", height: "h-[42vh] min-h-68" },
];

export default function BookshelfScroll({ books, onSelectBook }: BookshelfScrollProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleBooks = books.slice(0, visibleCount);
  const hasMore = visibleCount < books.length;

  const loadMore = () => {
    setVisibleCount((count) => count + PAGE_SIZE);
  };

  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <div
        ref={shelfRef}
        className="w-full flex gap-4 items-end overflow-x-auto no-scrollbar pb-8 pt-6 px-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.length === 0 && (
          <div className="w-full mx-auto h-64 flex flex-col items-center justify-center text-center">
            <p className="font-editorial text-2xl font-bold text-stone-800">
              No books found
            </p>
            <p className="text-xs text-stone-500 mt-2">
              Try a different search or add a new book.
            </p>
          </div>
        )}

        {visibleBooks.map((book, idx) => {
          const style = SPINE_STYLES[idx % SPINE_STYLES.length];

          return (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              title={book.title}
              className={`group relative shrink-0 first:ml-auto last:mr-auto ${style.width} ${style.height} ${style.bg} rounded-xs shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between p-3 select-none hover:-translate-y-4 hover:scale-105 hover:z-20 border-l border-white/20`}
            >
              <div className="text-[9px] font-bold tracking-widest uppercase opacity-75 text-center truncate">
                {book.category.substring(0, 4)}
              </div>

              <div className="my-auto flex items-center justify-center overflow-hidden">
                <span
                  className="font-editorial text-xs sm:text-sm font-black tracking-wider uppercase text-center max-h-full overflow-hidden"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {book.title}
                </span>
              </div>

              <div className="text-[9px] font-semibold tracking-wider uppercase opacity-80 text-center truncate">
                {book.author.split(" ")[0]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full h-3 bg-stone-400/40 rounded-full shadow-inner" />

      {hasMore && (
        <div className="w-full flex flex-col items-center justify-center mt-5">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 text-stone-100 font-bold text-xs shadow-lg hover:bg-stone-800 active:scale-95 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
            Show More Books
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-2">
            Showing {visibleCount} of {books.length} books
          </span>
        </div>
      )}
    </div>
  );
}
