"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HelpOptions() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">Need help signing in?</h2>
        </div>
        <div className="space-y-8">
          <Link href="/help/email" className="block">
            <Button className="w-full py-6 bg-gray-200 hover:bg-gray-300 text-black text-lg">
              Forgot your E-mail?
            </Button>
          </Link>
          <Link href="/help/password" className="block">
            <Button className="w-full py-6 bg-gray-200 hover:bg-gray-300 text-black text-lg">
              Forgot your Password?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

