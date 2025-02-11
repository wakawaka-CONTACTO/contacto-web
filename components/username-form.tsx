"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/context/onboarding-context"

export function UsernameForm() {
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { updateData } = useOnboarding()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateData({ username })
    router.push("/signup/password")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">Choose a username</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white text-black"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-500" disabled={!username}>
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}

