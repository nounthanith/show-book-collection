"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import { SAMPLE_BOOKS } from "@/data/books";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BookshelfScroll from "@/components/BookshelfScroll";
import Footer from "@/components/Footer";
import PdfReaderModal from "@/components/PdfReaderModal";
import UploadBookModal from "@/components/UploadBookModal";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBookForReader, setActiveBookForReader] = useState<Book | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        let apiBooks: Book[] = [];
        try {
          const res = await fetch("/api/books", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            apiBooks = Array.isArray(data.books) ? data.books : [];
          }
        } catch {
          apiBooks = [];
        }

        if (apiBooks.length === 0) {
          const storedCustomBooks = localStorage.getItem("lumina_custom_books");
          const localCustom: Book[] = storedCustomBooks
            ? JSON.parse(storedCustomBooks)
            : [];
          apiBooks = [...localCustom, ...SAMPLE_BOOKS];
        }

        if (!cancelled) {
          setBooks(apiBooks);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load books:", err);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddBook = (newBook: Book) => {
    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);

    const customOnly = updatedBooks.filter((b) => b.id.startsWith("custom-"));
    localStorage.setItem("lumina_custom_books", JSON.stringify(customOnly));

    setActiveBookForReader(newBook);
  };

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f4f3ee] text-[#181716] font-sans selection:bg-amber-400">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        bookCount={books.length}
      />

      <main className="flex-1 w-full min-h-0 flex flex-col md:flex-row items-stretch">
        <Hero />

        <div className="flex-1 min-w-0 px-2 sm:px-6 py-2 sm:py-4">
          <BookshelfScroll
            key={searchQuery}
            books={filteredBooks}
            loading={isLoading}
            onSelectBook={(book) => setActiveBookForReader(book)}
          />
        </div>

        <Footer />
      </main>

      <PdfReaderModal
        book={activeBookForReader}
        onClose={() => setActiveBookForReader(null)}
      />

      <UploadBookModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
}
