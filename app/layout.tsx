import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SocialPulse Intelligence',
  description:
    'Cross-Platform Social Media Analytics & Intelligence — Analyze any public social media content instantly across YouTube, Instagram, TikTok, Twitter, and LinkedIn.',
  keywords: ['social media analytics', 'youtube analytics', 'instagram analytics', 'tiktok analytics', 'engagement rate'],
  openGraph: {
    title: 'SocialPulse Intelligence',
    description: 'Cross-Platform Social Media Analytics & Intelligence',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#05080f] text-white antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
