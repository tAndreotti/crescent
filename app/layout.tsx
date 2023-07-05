import Navbar from '@/components/Navbar/Navbar'
import './globals.css'
import { MuseoModerno } from 'next/font/google'
import { AuthProvider } from './context/store'

const museo = MuseoModerno({ subsets: ['latin'] })

export const metadata = {
  title: 'Waning Crescent',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={museo.className}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}