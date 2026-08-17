import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { siteConfig } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.repositoryUrl),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.repositoryUrl }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  category: "Productivity",
  classification: "Open-source productivity software",
  manifest: "/manifest.json",
  alternates: { canonical: siteConfig.repositoryUrl },
  openGraph: { type: "website", url: siteConfig.repositoryUrl, siteName: siteConfig.name, title: siteConfig.title, description: siteConfig.description, locale: "en_US", images: [{ url: siteConfig.ogImage, width: 2058, height: 1338, alt: "Life OS public landing page and app preview" }] },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: [siteConfig.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Life OS" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning className="bg-background"><body className={`${geistSans.variable} ${geistMono.variable} min-h-screen min-h-[100dvh] antialiased bg-background text-foreground`}><ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><QueryProvider>{children}<Toaster /><Sonner richColors position="bottom-right" /></QueryProvider></ThemeProvider></body></html>;
}
