import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { SessionProvider } from 'next-auth/react';
import { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer.tsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://real.harshafix.diy'),
  title: {
    default: 'Real Market - Find Your Dream Property',
    template: '%s | Real Market'
  },
  description: 'Discover your perfect property with Real Market. Browse through our extensive collection of houses, apartments, and condos.',
  keywords: ['real estate', 'property listings', 'houses for sale', 'apartments', 'condos', 'real estate marketplace'],
  authors: [{ name: 'Real Market Team' }],
  creator: 'Real Market',
  publisher: 'Real Market',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://real.harshafix.diy',
    siteName: 'Real Market',
    title: 'Real Market - Find Your Dream Property',
    description: 'Discover your perfect property with Real Market. Browse through our extensive collection of houses, apartments, and condos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Real Market - Property Listings'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Market - Find Your Dream Property',
    description: 'Discover your perfect property with Real Market. Browse through our extensive collection of houses, apartments, and condos.',
    images: ['/og-image.jpg'],
    creator: '@realmarket'
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
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="canonical" href="https://real.harshafix.diy" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <SessionProvider session={session}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
