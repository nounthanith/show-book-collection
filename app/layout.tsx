import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SAMPLE_BOOKS } from "@/data/books";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "digital library",
    "personal library",
    "online books",
    "free PDF books",
    "book collection",
    "reading room",
    "literature",
    "curated books",
  ],
  category: "books",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

const booksJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Featured Books",
  itemListElement: SAMPLE_BOOKS.map((book, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Book",
      name: book.title,
      author: { "@type": "Person", name: book.author },
      description: book.description,
      genre: book.category,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* logo */}
      <link rel="icon" href="/logo.webp" />
      <body className="min-h-full flex flex-col font-sans transition-colors duration-400 bg-[#f4f3ee] text-[#181716]">
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={booksJsonLd} />
        {children}
      </body>
    </html>
  );
}
