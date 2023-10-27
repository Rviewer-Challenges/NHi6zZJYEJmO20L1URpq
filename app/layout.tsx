import '@/styles/globals.css';
import '@/styles/card.css';
import '@/styles/animation.css';
import type { Metadata } from 'next'
import localFont from 'next/font/local';
import { siteConfig } from '@/config/site';

const pokeSolid = localFont({
  src: '../public/fonts/pokemon-solid.ttf',
  variable: '--font-pokeSolid'
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pokeSolid.variable} bg-[#2C7ABC]`}>
        <div className='flex w-full min-h-screen items-center'>
          {children}
        </div>
      </body>
    </html>
  )
}
