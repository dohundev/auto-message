import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '문자 생성기',
  description: '웨딩 촬영 안내 문자를 쉽게 만들어보세요.',
  openGraph: {
    title: '문자 생성기',
    description: '웨딩 촬영 안내 문자를 쉽게 만들어보세요.',
    url: 'https://auto-message-ochre.vercel.app/',
    siteName: '문자 생성기',
    images: [{ url: 'https://auto-message-ochre.vercel.app/og-image.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
