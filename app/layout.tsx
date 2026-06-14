import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "ShelfLens",
  title: {
    default: "ShelfLens | Phone-Based Shelf Visibility",
    template: "%s | ShelfLens",
  },
  description:
    "ShelfLens helps store teams scan shelves with a phone, detect empty expected-facing zones, and prioritise the shelves that need action.",
  icons: {
    icon: [
      {
        url: "/shelflens-exact-logo-pack/shelflens-tab-icon-transparent.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/shelflens-exact-logo-pack/shelflens-tab-icon-transparent.png",
    apple: "/shelflens-exact-logo-pack/shelflens-tab-icon-transparent.png",
  },
  openGraph: {
    title: "ShelfLens | Phone-Based Shelf Visibility",
    description:
      "Scan shelves with a phone, detect empty expected-facing zones, and give store teams a clear action list.",
    siteName: "ShelfLens",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ShelfLens | Phone-Based Shelf Visibility",
    description:
      "Phone-based shelf visibility for gaps, expected-facing compliance, and store action.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
