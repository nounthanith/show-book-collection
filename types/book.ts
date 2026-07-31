export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: "Literature" | "Technology" | "Science" | "Philosophy" | "Business" | "Art & Design";
  gradient: string; // Cover background styling
  tileBg: "tile-bg-coral" | "tile-bg-navy" | "tile-bg-maroon" | "tile-bg-sage" | "tile-bg-white" | "tile-bg-charcoal" | "tile-bg-amber" | "tile-bg-olive" | "tile-bg-rose" | "tile-bg-teal";
  coverTextColor: string;
  pdfUrl: string;
  pages: number;
  rating: number;
  reads: number;
  publishedYear: number;
  isFeatured?: boolean;
  fileSize?: string;
  language?: string;
  tags: string[];
}
