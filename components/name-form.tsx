"use client"

import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ArtisticHeader } from "./artistic-header"
import type React from "react" // Import React

export function NameForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.name) {
      router.push("/onboarding/purpose")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ArtisticHeader />
      <div className="flex-1 bg-yellow-300 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 font-mono uppercase">LET ME KNOW YOUR NAME</h1>
              <p className="text-sm font-mono uppercase">BRAND NAME, PEN NAME, ARTIST NAME ETC...</p>
            </div>
            <Input
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="bg-white border-2 border-black text-center text-xl font-mono uppercase placeholder:uppercase"
              placeholder="CONTACTO"
              required
            />
            <div>
              <Button
                type="submit"
                className="w-full bg-gray-200 hover:bg-green-400 text-black transition-colors font-mono uppercase"
              >
                Continue
              </Button>
              <div className="text-center mt-4 p-2 border-2 border-black bg-green-400 font-mono">1/6</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

