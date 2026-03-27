import type { Metadata } from 'next';
import { Space_Mono, Inter } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MOHAMMED JIYADH | UI/UX Designer & Front End Developer',
  description: 'Digital Product Designer and User Experience Strategist portfolio building high-end interactive experiences.',
};

import TargetCursor from '@/components/TargetCursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} bg-black`}>
      <body className="bg-black antialiased text-white selection:bg-cyan-500/40 font-sans">
        <TargetCursor />
        {children}
      </body>
    </html>
  );
}
