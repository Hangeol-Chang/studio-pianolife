import './globals.scss'
import { Inter } from 'next/font/google'
import Header from '@/components/common/header'
import Footer from '@/components/common/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Studio PianoLife',
    description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" style={
            {
                margin: 'auto',
            }
        }>
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </head>
            <body className={inter.className}>
                <Header />
                <div className='content'>
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    )
}