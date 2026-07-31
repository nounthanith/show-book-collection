import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Book } from "@/types/book";
import { dbConnect } from "@/lib/mongoose";
import { isR2Configured, uploadPdfToR2 } from "@/lib/r2";
import BookModel from "@/models/Book";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const VALID_CATEGORIES: Book["category"][] = [
  "Literature",
  "Technology",
  "Science",
  "Philosophy",
  "Business",
  "Art & Design",
];

const VALID_TILE_BGS: Book["tileBg"][] = [
  "tile-bg-coral",
  "tile-bg-navy",
  "tile-bg-maroon",
  "tile-bg-sage",
  "tile-bg-white",
  "tile-bg-charcoal",
  "tile-bg-amber",
  "tile-bg-olive",
  "tile-bg-rose",
  "tile-bg-teal",
];

const fallbackPdfUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export async function GET() {
  try {
    await dbConnect();
    const books = await BookModel.find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    const serialized: Book[] = books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      description: b.description,
      category: b.category,
      gradient: b.gradient,
      tileBg: b.tileBg,
      coverTextColor: b.coverTextColor,
      pdfUrl: b.pdfUrl,
      pages: b.pages,
      rating: b.rating,
      reads: b.reads,
      publishedYear: b.publishedYear,
      isFeatured: b.isFeatured,
      fileSize: b.fileSize,
      language: b.language,
      tags: b.tags,
    }));

    return Response.json({ books: serialized });
  } catch (err) {
    console.error("Failed to load books:", err);
    return Response.json(
      { error: "Something went wrong while loading books." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").toUpperCase().trim();
    const author = String(formData.get("author") ?? "").trim() || "Anonymous";
    const description = String(formData.get("description") ?? "").trim();
    const rawCategory = String(formData.get("category") ?? "Literature");
    const rawTileBg = String(formData.get("tileBg") ?? "tile-bg-coral");
    const gradient = String(formData.get("gradient") ?? "").trim();
    const rawPages = Number(formData.get("pages") ?? 250);
    const file = formData.get("file");

    if (!title) {
      return Response.json(
        { error: "Book title is required." },
        { status: 400 }
      );
    }

    const category: Book["category"] = (VALID_CATEGORIES as string[]).includes(
      rawCategory
    )
      ? (rawCategory as Book["category"])
      : "Literature";

    const tileBg: Book["tileBg"] = (VALID_TILE_BGS as string[]).includes(
      rawTileBg
    )
      ? (rawTileBg as Book["tileBg"])
      : "tile-bg-coral";

    const pages = Number.isFinite(rawPages)
      ? Math.min(10000, Math.max(1, Math.round(rawPages)))
      : 250;

    let pdfUrl = fallbackPdfUrl;
    let fileSize = "2.5 MB";

    const isFile =
      file !== null &&
      typeof file === "object" &&
      "arrayBuffer" in file &&
      "name" in file &&
      "size" in file;

    if (isFile) {
      const pdfFile = file as File;
      const isPdf =
        pdfFile.type === "application/pdf" ||
        pdfFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        return Response.json(
          { error: "Only PDF files are allowed." },
          { status: 400 }
        );
      }

      if (pdfFile.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: "PDF file is too large. Maximum size is 25 MB." },
          { status: 413 }
        );
      }

      const filename = `${Date.now()}-${randomUUID()}.pdf`;

      if (isR2Configured()) {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        pdfUrl = await uploadPdfToR2(buffer, `uploads/${filename}`);
      } else {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.writeFile(
          path.join(UPLOADS_DIR, filename),
          Buffer.from(await pdfFile.arrayBuffer())
        );
        pdfUrl = `/uploads/${filename}`;
      }

      fileSize = `${Math.max(0.1, pdfFile.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const book = {
      id: `custom-${Date.now()}`,
      title,
      author,
      description: description || "User uploaded custom PDF book.",
      category,
      gradient: gradient || "from-amber-700 via-amber-800 to-amber-950",
      tileBg,
      coverTextColor: "text-white",
      pdfUrl,
      pages,
      rating: 5.0,
      reads: 0,
      publishedYear: new Date().getFullYear(),
      isFeatured: false,
      fileSize,
      language: "English",
      tags: [category, "User Upload", "PDF"],
      sortOrder: -Date.now(),
    };

    await dbConnect();
    const created = await BookModel.create(book);

    const saved: Book = {
      id: created.id,
      title: created.title,
      author: created.author,
      description: created.description,
      category: created.category as Book["category"],
      gradient: created.gradient,
      tileBg: created.tileBg as Book["tileBg"],
      coverTextColor: created.coverTextColor,
      pdfUrl: created.pdfUrl,
      pages: created.pages,
      rating: created.rating,
      reads: created.reads,
      publishedYear: created.publishedYear,
      isFeatured: created.isFeatured,
      fileSize: created.fileSize,
      language: created.language,
      tags: created.tags,
    };

    return Response.json({ book: saved }, { status: 201 });
  } catch (err) {
    console.error("Failed to save custom book:", err);
    return Response.json(
      { error: "Something went wrong while saving your book." },
      { status: 500 }
    );
  }
}
