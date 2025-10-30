import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Providers } from './providers';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'AppTrack - Track Your Applications',
  description: 'Track job and scholarship applications efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'relative min-h-screen bg-background text-foreground antialiased',
          inter.variable,
          'font-sans'
        )}
      >
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(174,191,255,0.6),rgba(255,255,255,0)_65%)] blur-2xl dark:bg-[radial-gradient(circle_at_top,rgba(82,126,255,0.3),transparent_60%)]" />
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_85%_5%,rgba(206,192,255,0.4),transparent_68%)] dark:bg-[radial-gradient(circle_at_80%_10%,rgba(158,97,255,0.25),transparent_65%)]" />
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(248,250,254,0.94)_0%,rgba(241,244,253,0.9)_45%,rgba(235,239,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(9,13,26,0.65)_0%,rgba(9,13,26,0.92)_40%,rgba(9,13,26,0.98)_100%)]" />

        <Providers>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}