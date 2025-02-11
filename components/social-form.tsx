"use client"

import type React from "react"
import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ArtisticHeader } from "./artistic-header"

export function SocialForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.social.instagram || data.social.website) {
      router.push("/onboarding/talent")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ArtisticHeader />
      <div className="flex-1 bg-[#ffd8d8] flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-mono uppercase">DO YOU HAVE SNS & WEBSITE</h1>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold font-mono uppercase">
                  INSTAGRAM <span className="text-red-500">*REQUIRED*</span>
                </label>
                <Input
                  value={data.social.instagram}
                  onChange={(e) => updateData({ social: { ...data.social, instagram: e.target.value } })}
                  className="bg-white border-2 border-black font-mono uppercase placeholder:uppercase"
                  placeholder="@contactocreator"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold font-mono uppercase">WEBSITE</label>
                <Input
                  value={data.social.website}
                  onChange={(e) => updateData({ social: { ...data.social, website: e.target.value } })}
                  className="bg-white border-2 border-black font-mono uppercase placeholder:uppercase"
                  placeholder="contactocreator.com"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-gray-200 hover:bg-green-400 text-black transition-colors font-mono uppercase"
              >
                Continue
              </Button>
              <div className="text-center mt-4 p-2 border-2 border-black bg-green-400 font-mono">4/6</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

