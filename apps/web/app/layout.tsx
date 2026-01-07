import { DesignSystemProvider } from "@vestly/ui";
import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vestly | Asset Management",
  description:
    "Manage your assets with precision and style. Deep analytics for the modern investor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={figtree.variable} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
