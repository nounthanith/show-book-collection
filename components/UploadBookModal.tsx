"use client";

import React, { useState, useRef, useEffect } from "react";
import { Book } from "@/types/book";
import { CATEGORIES } from "@/data/books";
import { X, UploadCloud, CheckCircle2, Loader2, FileText } from "lucide-react";
import gsap from "gsap";

interface UploadBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
}

const TILE_PRESETS: { name: string; tileBg: Book["tileBg"]; gradient: string }[] = [
  { name: "Coral Red", tileBg: "tile-bg-coral", gradient: "from-amber-700 via-amber-800 to-amber-950" },
  { name: "Deep Royal Navy", tileBg: "tile-bg-navy", gradient: "from-slate-900 via-slate-800 to-blue-950" },
  { name: "Plum Maroon", tileBg: "tile-bg-maroon", gradient: "from-blue-600 via-indigo-700 to-purple-900" },
  { name: "Sage Gray", tileBg: "tile-bg-sage", gradient: "from-orange-400 via-rose-500 to-amber-300" },
  { name: "Off White Mat", tileBg: "tile-bg-white", gradient: "from-amber-100 via-rose-100 to-amber-200" },
  { name: "Slate Charcoal", tileBg: "tile-bg-charcoal", gradient: "from-teal-800 via-slate-800 to-amber-900" },
];

export default function UploadBookModal({ isOpen, onClose, onAddBook }: UploadBookModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Book["category"]>("Literature");
  const [pages, setPages] = useState(300);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.92, y: 16, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setSelectedFileName(file.name);
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please fill in the book title.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const randomPreset =
        TILE_PRESETS[Math.floor(Math.random() * TILE_PRESETS.length)];

      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("gradient", randomPreset.gradient);
      formData.append("tileBg", randomPreset.tileBg);
      formData.append("pages", String(pages));

      const res = await fetch("/api/books", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.book) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      onAddBook(data.book as Book);
      onClose();
      setTitle("");
      setDescription("");
      setSelectedFileName(null);
      setSelectedFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all";
  const labelClass =
    "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2";

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-sm overflow-y-auto"
    >
      <div
        ref={contentRef}
        className="w-full max-w-2xl bg-white text-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8 font-sans"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#faf9f4] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-stone-900">
                Add PDF Book to Collection
              </h3>
              <p className="text-xs text-stone-500">
                Share your PDF book with an editorial color-block tile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* File Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? "border-amber-500 bg-amber-500/10"
                : selectedFileName
                ? "border-emerald-500/50 bg-emerald-50"
                : "border-stone-300 bg-stone-50 hover:border-stone-400"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              id="pdf-input"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {selectedFileName ? (
              <div className="flex items-center justify-center gap-3 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm truncate max-w-xs">{selectedFileName} ready</span>
              </div>
            ) : (
              <label htmlFor="pdf-input" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <UploadCloud className="w-10 h-10 text-amber-600" />
                <span className="text-sm font-semibold text-stone-700">
                  Drag & Drop your PDF book here, or <span className="text-amber-600 underline">Browse</span>
                </span>
                <span className="text-xs text-stone-400">Supports standard PDF format</span>
              </label>
            )}
          </div>

          {/* Book Title */}
          <div>
            <label className={labelClass}>
              Book Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. WILD DARK SHORE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Category & Page Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Book["category"])}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c !== "All" && c !== "Top 12 Picks").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Page Count
              </label>
              <input
                type="number"
                min="1"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief synopsis or review..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed text-stone-100 font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Add to Collection
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
