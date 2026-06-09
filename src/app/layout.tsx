import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Foody — Explore Culinary Experiences',
    template: '%s | Foody',
  },
  description:
    'Search and refine your choice to discover the perfect restaurant. Order food online from your favourite restaurants.',
  keywords: ['food', 'restaurant', 'order', 'delivery'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' suppressHydrationWarning>
      <head>
        {/* Nunito — Figma design system font */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
