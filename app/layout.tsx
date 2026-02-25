import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WCID Dashboard',
  description: 'Internal dashboard for What Can I Do data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
