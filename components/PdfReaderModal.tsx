"use client";

import React, { useEffect, useRef, useState } from "react";
import { Book } from "@/types/book";
import { X, Download, Share2, Maximize2, Minimize2, ExternalLink, BookOpen, Star, Sun, Moon } from "lucide-react";
import gsap from "gsap";
import PdfCanvasViewer from "./PdfCanvasViewer";

interface PdfReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

const formatReads = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : `${n}`;

export default function PdfReaderModal({ book, onClose }: PdfReaderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readerTheme, setReaderTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    if (book && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.94, y: 40, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.2)" }
      );
    }
  }, [book]);

  if (!book) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(book.pdfUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-md"
    >
      <div
        ref={contentRef}
        className={`w-full flex flex-col bg-[#faf9f4] text-stone-900 rounded-xs overflow-hidden shadow-2xl border border-stone-300/60 transition-all duration-300 ${isFullscreen ? "h-full max-w-full rounded-none" : "h-[92vh] max-w-6xl"
          }`}
      >
        <div className="px-4 sm:px-6 py-3 bg-white/70 backdrop-blur border-b border-stone-200 flex items-center justify-between gap-4 flex-wrap">

          <div className="flex items-center gap-3 min-w-0">
            <div className={`relative w-10 h-14 sm:w-11 sm:h-16 rounded-sm bg-linear-to-tr ${book.gradient} shrink-0 flex items-center justify-center shadow-md overflow-hidden border-l-2 border-black/15`}>
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-linear-to-r from-black/25 to-transparent" />
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 opacity-90" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
                JZA • Reading Room
              </span>
              <h3 className="font-editorial font-black text-base sm:text-xl tracking-tight text-stone-900 truncate">
                {book.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-500 font-medium truncate">
                <span className="truncate">{book.author}</span>
                <span className="hidden sm:inline text-stone-300">•</span>
                <span className="hidden sm:inline">{book.pages} Pages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <span className="hidden lg:inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-stone-200/80 text-stone-700 border border-stone-300/50">
              {book.category}
            </span>

            <button
              onClick={() => setReaderTheme(readerTheme === "dark" ? "light" : "dark")}
              title="Toggle Reader Paper Tone"
              className="p-2 rounded-full bg-stone-100 border border-stone-300/60 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
            >
              {readerTheme === "dark" ? (
                <Moon className="w-4 h-4 text-stone-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              className="p-2 rounded-full bg-stone-100 border border-stone-300/60 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleShare}
              title="Copy PDF Link"
              className="p-2 rounded-full bg-stone-100 border border-stone-300/60 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all relative"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-8 right-0 px-2 py-1 bg-stone-900 text-white text-[10px] rounded-md shadow whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>

            <a
              href={book.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-2 rounded-full bg-stone-100 border border-stone-300/60 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              title="Close Reader"
              className="p-2 rounded-full bg-stone-900 text-stone-100 hover:bg-rose-600 transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        <div
          className={`flex-1 w-full h-full relative ${readerTheme === "dark"
            ? "bg-[#201d18]"
            : "bg-linear-to-b from-[#ebe9e1] to-[#e2dfd4]"
            }`}
        >
          <PdfCanvasViewer url={book.pdfUrl} dark={readerTheme === "dark"} />
        </div>

        <div className="px-4 sm:px-6 py-2.5 bg-white/70 backdrop-blur border-t border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-200/70 text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-stone-500 shrink-0">
            <span className="hidden sm:flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {book.rating.toFixed(1)}
            </span>
            <span className="hidden md:inline">{book.publishedYear}</span>
            <span>{formatReads(book.reads)} reads</span>
            {book.fileSize && (
              <span className="hidden sm:inline text-stone-400">{book.fileSize}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
