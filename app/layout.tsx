import { UmamiAnalytics } from '@/components/common/UmamiAnalytics';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'movGR',
  description:
    'Sigue el transporte público de Granada en directo',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    creator: 'mianfg',
  },
  openGraph: {
    title: 'movGR',
    description:
      'Sigue el transporte público de Granada en directo',
    url: 'https://movgr.mianfg.me',
    siteName: 'mianfg',
    images: [
      {
        url: '/cover.png',
        width: 1200,
        height: 630,
        alt: 'mianfg cover image',
        type: 'image/jpeg',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  metadataBase: new URL('https://movgr.mianfg.me'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden" suppressHydrationWarning>
      <head>
        <UmamiAnalytics />
      </head>
      <body
        className={`${inter.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
