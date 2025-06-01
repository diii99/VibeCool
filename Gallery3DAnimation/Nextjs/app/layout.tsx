import type { Metadata } from "next";
// Remove Geist font imports
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import "./base.css";
import Script from "next/script";

// Remove Geist font instantiations
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// 
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Gallery (3D) Grid Animations | Yourware",
  description: "Converted Next.js version of the Gallery (3D) Grid Animations project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/pxn8wdc.css" />
      </head>
      {/* Remove Geist font variables from className and keep antialiased and loading */}
      <body className={"antialiased loading"}>
        {children}
      </body>
    </html>
  );
}
