import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const { env } = process;

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Badges",
  description: "Platform to generate badges to personalize your profiles and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {
        env.NODE_ENV === 'production' && <>
          <head>
            <Script
              defer
              src="https://umami.byfruits.dev/script.js"
              data-website-id="b5dd3cb3-4c90-496a-b1a6-aa5b343bbaef"
            />
          </head>
        </>
      }

      <body
        className={`${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
