import { Press_Start_2P } from "next/font/google"
import { OnboardingProvider } from "@/context/onboarding-context"
import "./globals.css"
import type React from "react"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${pressStart2P.variable}`}>
      <OnboardingProvider>{children}</OnboardingProvider>
      </body>
      </html>
  )
}

