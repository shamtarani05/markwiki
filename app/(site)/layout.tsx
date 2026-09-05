import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { Header, Footer } from "@/src/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MarcWiki - Fan Wiki Platform for Anime, Games & Web Novels",
    template: "%s | MarcWiki",
  },
  description: "The ultimate fan-powered wiki platform for anime, games, web novels, and webtoons. Discover lore, contribute knowledge, and connect with passionate communities.",
  keywords: ["wiki", "fandom", "anime", "games", "web novels", "webtoons", "manhwa", "manga", "gaming wiki"],
  authors: [{ name: "MarcWiki" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MarcWiki",
    title: "MarcWiki - Fan Wiki Platform",
    description: "The ultimate fan-powered wiki platform for anime, games, web novels, and webtoons.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarcWiki - Fan Wiki Platform",
    description: "The ultimate fan-powered wiki platform for anime, games, and web novels.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
