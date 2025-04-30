import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "../components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Career Mentor AI - Your Personal Career Guide",
  description:
    "Get personalized career advice, resume analysis, and job recommendations with our AI-powered career mentor.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Navbar />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  )
}
