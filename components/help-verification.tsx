"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function HelpVerification() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isCodeComplete, setIsCodeComplete] = useState(false)
  useRouter();
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple digits

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)
    setIsCodeComplete(newCode.every((digit) => digit !== ""))

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleResendEmail = () => {
    // Add resend email logic here
    console.log("Resending verification email")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">E-mail verification code</h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-between gap-2">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl bg-white text-black border-2 border-gray-200"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          <Button
            className={`w-full ${
              isCodeComplete ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
            } text-black`}
          >
            Next
          </Button>
          <div className="text-center">
            <button onClick={handleResendEmail} className="text-blue-500 hover:text-blue-400">
              Resend E-mail
            </button>
          </div>
        </div>
      </div>
      {/* Number pad is shown here just for visual representation */}
      <div className="mt-8 w-full max-w-sm bg-gray-100 p-4 rounded-t-xl">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "delete"].map((num, index) => (
            <div
              key={index}
              className={`h-12 flex items-center justify-center ${
                num === null ? "invisible" : "bg-white rounded-md shadow"
              }`}
            >
              {num === "delete" ? "⌫" : num}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

