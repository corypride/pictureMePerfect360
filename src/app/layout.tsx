import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'PictureMePerfect360 - 360° Photo Booth Rental',
    template: '%s | PictureMePerfect360'
  },
  description: 'Professional 360° photo booth rental for weddings, parties, and events. Create unforgettable memories with our state-of-the-art spinning photo booth technology.',
  keywords: ['360 photo booth', 'photo booth rental', 'event photography', 'wedding photo booth', 'party photo booth', 'event entertainment'],
  authors: [{ name: 'PictureMePerfect360' }],
  creator: 'PictureMePerfect360',
  publisher: 'PictureMePerfect360',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PictureMePerfect360 - 360° Photo Booth Rental',
    description: 'Professional 360° photo booth rental for weddings, parties, and events. Create unforgettable memories with our state-of-the-art spinning photo booth technology.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PictureMePerfect360',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PictureMePerfect360 360° Photo Booth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PictureMePerfect360 - 360° Photo Booth Rental',
    description: 'Professional 360° photo booth rental for weddings, parties, and events.',
    images: ['/og-image.jpg'],
    creator: '@PictureMePerfect360',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="font-body antialiased">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Toaster />

        {/* Analytics and third-party scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  );
}
