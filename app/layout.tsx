import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AI Career Hub - Your AI-Powered Career Operating System',
    template: '%s | AI Career Hub',
  },
  description: 'Build professional profiles, analyze career readiness, generate ATS resumes, get AI feedback, receive learning roadmaps, prepare for interviews, and match with your dream jobs.',
  keywords: ['career', 'AI', 'resume builder', 'job matching', 'interview prep', 'career development', 'ATS optimization'],
  authors: [{ name: 'AI Career Hub' }],
  creator: 'AI Career Hub',
  metadataBase: new URL('https://aicareerhub.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aicareerhub.app',
    title: 'AI Career Hub - Your AI-Powered Career Operating System',
    description: 'Build professional profiles, analyze career readiness, generate ATS resumes, get AI feedback, receive learning roadmaps, prepare for interviews, and match with your dream jobs.',
    siteName: 'AI Career Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Career Hub - Your AI-Powered Career Operating System',
    description: 'Build professional profiles, analyze career readiness, generate ATS resumes, get AI feedback, receive learning roadmaps, prepare for interviews, and match with your dream jobs.',
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
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7CB9E8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background min-h-screen">
        <Providers>
          {children}
        </Providers>
        {/* {process.env.NODE_ENV === 'production' && <Analytics />} */}
      </body>
    </html>
  )
}
