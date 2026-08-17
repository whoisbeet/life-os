import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
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
  manifest: "/manifest.json",
  alternates: { canonical: siteConfig.repositoryUrl },
  openGraph: { type: "website", url: siteConfig.repositoryUrl, siteName: siteConfig.name, title: siteConfig.title, description: siteConfig.description, locale: "en_US", images: [{ url: siteConfig.ogImage, width: 2058, height: 1338, alt: "The Terminal personal operating system" }] },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: [siteConfig.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "The Terminal" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" /><link rel="icon" href="/favicon.ico" /><link rel="icon" href="/icon.svg" type="image/svg+xml" /></head><body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}><ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange><QueryProvider>{children}<Toaster richColors position="bottom-right" closeButton /></QueryProvider></ThemeProvider></body></html>;
}
