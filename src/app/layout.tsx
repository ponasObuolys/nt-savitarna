import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NT Savitarna | 1Partner",
    template: "%s | NT Savitarna",
  },
  description: "Nekilnojamojo turto vertinimo savitarnos sistema",
  keywords: ["nekilnojamasis turtas", "vertinimas", "1partner", "savitarna"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
