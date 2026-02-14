import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMEConnect - The B2B Gateway for SME Services',
  description: 'The B2B Gateway for SME Services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900 font-sans overflow-x-hidden">{children}</body>
    </html>
  )
}
