
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PwaSetup from "@/components/PwaSetup";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EvoFit - PWA ULTIMATE",
  description: "O PWA definitivo para Personal Trainers e seus alunos.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-dark-bg text-dark-text antialiased`}>
        {children}
        <PwaSetup />
      </body>
    </html>
  );
}
