"use client";

import { useEffect, useRef, useState } from "react";
import type * as pdfjsTypes from "pdfjs-dist";

interface PdfCanvasViewerProps {
  url: string;
  dark?: boolean;
}

export default function PdfCanvasViewer({ url, dark = false }: PdfCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let pdfDoc: pdfjsTypes.PDFDocumentProxy | null = null;
    let loadingTask: pdfjsTypes.PDFDocumentLoadingTask | null = null;
    const rendered = new Set<number>();
    const pageEls = new Map<number, HTMLDivElement>();

    const renderPage = async (pageNum: number) => {
      if (!pdfDoc || rendered.has(pageNum)) return;
      rendered.add(pageNum);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const base = page.getViewport({ scale: 1 });
        const el = pageEls.get(pageNum);
        if (!el) return;
        const width = el.clientWidth || 600;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const scale = (width * ratio) / base.width;
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(base.height * scale);
        el.appendChild(canvas);
        await page.render({ canvas, viewport: page.getViewport({ scale }) }).promise;
      } catch {
        // ignore individual page rendering errors
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const pageNum = Number((entry.target as HTMLElement).dataset.page);
            if (!rendered.has(pageNum)) {
              observer.unobserve(entry.target);
              renderPage(pageNum);
            }
          }
        }
      },
      { root: containerRef.current, rootMargin: "1200px 0px" }
    );

    const load = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
        loadingTask = pdfjs.getDocument({ url: proxyUrl });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDoc = pdf;

        const container = containerRef.current!;
        container.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const div = document.createElement("div");
          div.dataset.page = String(i);
          div.className =
            "w-full bg-white shadow-md mb-2 rounded-sm overflow-hidden";
          div.style.aspectRatio = `${base.width} / ${base.height}`;
          container.appendChild(div);
          pageEls.set(i, div);
          observer.observe(div);
        }

        if (cancelled) return;
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load PDF:", err);
        setStatus("error");
      }
    };

    load();

    return () => {
      cancelled = true;
      observer.disconnect();
      loadingTask?.destroy();
    };
  }, [url]);

  return (
    <div
      className={`w-full h-full relative overflow-y-auto ${
        dark ? "bg-[#201d18]" : "bg-linear-to-b from-[#ebe9e1] to-[#e2dfd4]"
      }`}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-stone-500">
          Loading PDF…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs font-semibold text-stone-500 px-8 text-center">
          <span>Couldn&apos;t load this PDF here.</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-stone-900 text-stone-100 font-bold text-xs shadow hover:bg-stone-800"
          >
            Open in new tab
          </a>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full flex flex-col items-center px-1.5 py-2"
      />
    </div>
  );
}
