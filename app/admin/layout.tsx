import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";
import AdminSidebar from "@/src/components/admin/shell/AdminSidebar";
import AdminTopBar from "@/src/components/admin/shell/AdminTopBar";

// A separate root layout (own <html>/<body>) from app/(site)/layout.tsx —
// the admin portal is a distinct app, not a page wrapped in the public
// site's Header/Footer/nav.
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
    default: "Admin — MarcWiki",
    template: "%s | Admin — MarcWiki",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-[#0B0B0F] text-[#F5F3EF] relative overflow-hidden">
        {/* Global Cosmic Violet Nebula Glow Background */}
        <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden z-0">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-primary/30 via-secondary-container/20 to-transparent blur-[140px] rounded-full"></div>
          <div className="absolute top-1/3 -left-[10%] w-[500px] h-[500px] bg-secondary-container/15 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/4 -right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full"></div>
        </div>
        {/* Global Editorial Ambient Grid Overlay */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,120,255,0.08),transparent)] pointer-events-none z-0"></div>

        <ThemeProvider>
          {/* h-screen + overflow-hidden on the shell, independent overflow-y-auto
              on the sidebar and <main> — the page itself never scrolls, so the
              sidebar and topbar stay put no matter how tall the content is. */}
          <div className="relative z-10 h-screen overflow-hidden flex">
            <AdminSidebar />
            <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden bg-transparent">
              <AdminTopBar />
              <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
