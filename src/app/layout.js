import { Inter } from 'next/font/google'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import '@/styles/globals.scss'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    const metadata = {
        title: 'Studio PianoLife',
    }

    return (
        <html lang="ko">
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="viewpo rt" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="icon" type="image/x-icon" href="/common/icon.ico"></link>

            </head>
            <body>
                <Header />
                <div className="content">
                    {children}
                </div>
                <Analytics />
                <Footer />
            </body>
        </html>
    )
}
