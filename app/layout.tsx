import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pizza Club Fameck — Commander en ligne',
  description:
    'Commandez vos pizzas en ligne chez Pizza Club Fameck. Livraison à Fameck, Hayange, Florange et environs. Pizzas artisanales, burgers, pâtes.',
  keywords: 'pizza fameck, commander pizza, livraison pizza fameck, pizza club',
  openGraph: {
    title: 'Pizza Club Fameck',
    description: 'Commandez vos pizzas artisanales en ligne',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
