"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/context/onboarding-context"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const router = useRouter()
  const { updateData } = useOnboarding()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToPrivacy) {
      alert("Please agree to the privacy policy.")
      return
    }
    updateData({ email })
    router.push("/signup/username")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">Sign up</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-black"
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <div className="flex items-center space-x-2">
                <label htmlFor="privacy" className="text-sm text-white">
                  AGREE PRIVACY POLICY
                </label>
                <Link href="/privacy" className="text-sm text-blue-500 hover:text-blue-400">
                  SEE DETAIL
                </Link>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-400 text-black hover:bg-green-500"
            disabled={!email || !agreedToPrivacy}
          >
            Continue
          </Button>
        </form>
        <div className="text-center">
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Back to Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

