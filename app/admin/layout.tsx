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
      <body className="bg-surface-container-lowest text-on-surface">
        <ThemeProvider>
          {/* h-screen + overflow-hidden on the shell, independent overflow-y-auto
              on the sidebar and <main> — the page itself never scrolls, so the
              sidebar and topbar stay put no matter how tall the content is. */}
          <div className="h-screen overflow-hidden flex">
            <AdminSidebar />
            <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
              <AdminTopBar />
              <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
