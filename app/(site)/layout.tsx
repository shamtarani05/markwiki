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
      <body className="bg-surface-container-lowest font-body-default text-body-default text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Global Cosmic Violet Nebula Glow Background */}
        <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden z-0">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-primary/30 via-secondary-container/20 to-transparent blur-[140px] rounded-full"></div>
          <div className="absolute top-1/3 -left-[10%] w-[500px] h-[500px] bg-secondary-container/15 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/4 -right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full"></div>
        </div>
        {/* Global Editorial Ambient Grid Overlay */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,120,255,0.12),transparent)] pointer-events-none z-0"></div>

        <GlobalThemeWrapper initialThemeConfig={theme}>
          <ThemeProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header navLinks={navigation.main} />
              <main className="flex-1 w-full pt-16 min-h-screen">{children}</main>
              <Footer navLinks={navigation.footer} />
            </div>
          </ThemeProvider>
        </GlobalThemeWrapper>
      </body>
    </html>
  );
}
