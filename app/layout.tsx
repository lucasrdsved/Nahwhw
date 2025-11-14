import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import PwaSetup from '@/components/PwaSetup';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EvoFit Ultimate • Personal Trainer PWA',
  description: 'PWA premium para personal trainers e alunos com backend Supabase simulado.',
  manifest: '/manifest.json',
  themeColor: '#05070F',
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="application-name" content="EvoFit Ultimate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EvoFit" />
      </head>
      <body className={`${inter.variable} bg-midnight text-slate-100 antialiased min-h-screen`}> 
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%)]">
          {children}
        </div>
        <PwaSetup />
      </body>
    </html>
  );
}
