import './globals.css'

export const metadata = {
  title: 'FinSight AI — Your Smart Stock Market Companion',
  description: 'AI-powered stock market analysis for beginners, intermediate and pro investors.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}