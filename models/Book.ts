import { Schema, model, models, type Model } from "mongoose";
import type { Book } from "@/types/book";

export interface BookDoc extends Book {
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<BookDoc>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    gradient: { type: String, default: "" },
    tileBg: { type: String, default: "tile-bg-coral" },
    coverTextColor: { type: String, default: "text-white" },
    pdfUrl: { type: String, required: true },
    pages: { type: Number, default: 250 },
    rating: { type: Number, default: 5 },
    reads: { type: Number, default: 0 },
    publishedYear: { type: Number, default: new Date().getFullYear() },
    isFeatured: { type: Boolean, default: false },
    fileSize: { type: String, default: "" },
    language: { type: String, default: "English" },
    tags: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BookModel: Model<BookDoc> =
  (models.Book as Model<BookDoc>) ||
  model<BookDoc>("Book", bookSchema);

export default BookModel;
