import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { Header, Footer } from "@/src/components/layout";
import GlobalThemeWrapper from "@/src/components/layout/GlobalThemeWrapper";
import { getNavigationConfig } from "@/src/lib/db/getNavigationConfig";
import connectDB from "@/src/lib/db/connection";
import { SiteConfig } from "@/src/lib/db/models";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { navigation } = await getNavigationConfig();
  await connectDB();
  const config = await SiteConfig.findOne().lean();
  const theme = config?.theme || { accentColor: '#D4AF37' };

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-container-lowest font-body-default text-body-default text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        <GlobalThemeWrapper initialThemeConfig={theme}>
          <ThemeProvider>
            <Header navLinks={navigation.main} />
            <main className="flex-1 w-full pt-16 min-h-screen bg-surface-container-lowest">{children}</main>
            <Footer navLinks={navigation.footer} />
          </ThemeProvider>
        </GlobalThemeWrapper>
      </body>
    </html>
  );
}
