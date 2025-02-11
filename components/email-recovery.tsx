"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type RecoveryStep = "input" | "result"

export function EmailRecovery() {
  const [step, setStep] = useState<RecoveryStep>("input")
  const [profileName, setProfileName] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profileName) {
      // Simulate API call - replace with actual API integration
      try {
        // const response = await fetch('/api/recover-email', {
        //   method: 'POST',
        //   body: JSON.stringify({ profileName }),
        //   headers: { 'Content-Type': 'application/json' },
        // });
        // const data = await response.json();
        // setMaskedEmail(data.maskedEmail);

        // Temporary simulation
        setMaskedEmail("jo***k@wa****la.***")
        setStep("result")
      } catch (error) {
        console.error("Error:", error)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">CONTACTO</h1>
          {step === "input" ? (
            <>
              <h2 className="mt-6 text-2xl font-semibold text-white">Input your Profile name.</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="bg-white text-black border-2 border-gray-200 text-center"
                  placeholder="Name"
                  required
                />
                <Button
                  type="submit"
                  className={`w-full ${
                    profileName ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
                  } text-black transition-colors`}
                >
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-2xl font-semibold text-white">Your E-mail is</h2>
              <div className="mt-8 w-full p-4 border-2 border-white text-white text-center">{maskedEmail}</div>
              <Button
                onClick={() => (window.location.href = "/login")}
                className="mt-6 w-full bg-green-400 hover:bg-green-500 text-black"
              >
                Go to Log in
              </Button>
            </>
          )}
          <div className="mt-4">
            <Link href="/help/password" className="text-blue-500 hover:text-blue-400">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

