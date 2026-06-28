import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ChatPopup } from '@/components/common/chat-popup';
import { UserProvider } from '@/context/user-context';
import ReduxProvider from '@/redux/ReduxProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'SCHOLASTIKA',
  description: 'Scholarstika is a SaaS platform for schools and universities.',
  generator: 'Scholarstika',
  icons: {
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ReduxProvider>
          <UserProvider>
            {children}
            <ChatPopup />
            <Analytics />
          </UserProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}

