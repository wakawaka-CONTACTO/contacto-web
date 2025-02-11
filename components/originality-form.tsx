"use client"

import type React from "react"
import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { ArtisticHeader } from "./artistic-header"

export function OriginalityForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.originality) {
      router.push("/onboarding/social")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ArtisticHeader />
      <div className="flex-1 bg-yellow-400 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-mono uppercase">EXPLAIN YOUR ORIGINALITY</h1>
            </div>
            <Textarea
              value={data.originality}
              onChange={(e) => updateData({ originality: e.target.value })}
              className="bg-white border-2 border-black min-h-[150px] font-mono uppercase placeholder:uppercase"
              placeholder="We are make a ceramic for design."
              required
            />
            <div>
              <Button
                type="submit"
                className="w-full bg-gray-200 hover:bg-green-400 text-black transition-colors font-mono uppercase"
              >
                Continue
              </Button>
              <div className="text-center mt-4 p-2 border-2 border-black bg-green-400 font-mono">3/6</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

