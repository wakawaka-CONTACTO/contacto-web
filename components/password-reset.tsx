"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

type ResetStep = "email" | "verification" | "new-password"

interface PasswordRequirements {
  hasLength: boolean
  hasUpperCase: boolean
  hasNumber: boolean
}

export function PasswordReset() {
  const [step, setStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validatePassword = (pass: string): PasswordRequirements => ({
    hasLength: pass.length >= 8,
    hasUpperCase: /[A-Z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
  })

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would make the API call to send verification email
      setStep("verification")
    }
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length === 6) {
      setStep("new-password")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const requirements = validatePassword(password)
    const isValid = Object.values(requirements).every(Boolean) && password === confirmPassword

    if (isValid) {
      try {
        // Here you would make the API call to update password
        // const response = await fetch('/api/reset-password', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     email,
        //     verificationCode,
        //     newPassword: password
        //   }),
        // })

        // Redirect to login after successful password reset
        window.location.href = "/login"
      } catch (error) {
        console.error("Error resetting password:", error)
      }
    }
  }

  const renderVerificationInput = () => {
    return (
      <div className="relative w-full">
        <div className="flex justify-between mb-2">
          {Array(6)
            .fill("_")
            .map((_, index) => (
              <span key={index} className="text-2xl text-white w-8 text-center font-mono">
                {verificationCode[index] || "_"}
              </span>
            ))}
        </div>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
            setVerificationCode(value)
          }}
          className="absolute inset-0 opacity-0 cursor-text font-mono"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={6}
        />
      </div>
    )
  }

  const requirements = validatePassword(password)
  const isValid = Object.values(requirements).every(Boolean) && password === confirmPassword

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono uppercase">CONTACTO</h1>

          {step === "email" && (
            <>
              <h2 className="mt-6 text-2xl font-semibold text-white font-mono uppercase">Send a verification code</h2>
              <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-black border-2 border-gray-200 font-mono uppercase placeholder:uppercase"
                  placeholder="E-mail"
                  required
                />
                <Button
                  type="submit"
                  className={`w-full ${
                    email ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
                  } text-black font-mono uppercase`}
                >
                  Continue
                </Button>
              </form>
            </>
          )}

          {step === "verification" && (
            <>
              <h2 className="mt-6 text-2xl font-semibold text-white font-mono uppercase">E-mail verification code</h2>
              <form onSubmit={handleVerificationSubmit} className="mt-8 space-y-6">
                {renderVerificationInput()}
                <Button
                  type="submit"
                  className={`w-full ${
                    verificationCode.length === 6 ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
                  } text-black font-mono uppercase`}
                >
                  Next
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      /* Add resend logic */
                    }}
                    className="text-blue-500 hover:text-blue-400 font-mono uppercase"
                  >
                    Resend E-mail
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "new-password" && (
            <>
              <h2 className="mt-6 text-2xl font-semibold text-white font-mono uppercase">Reset password</h2>
              <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white text-black border-2 border-gray-200 pr-10 font-mono uppercase placeholder:uppercase"
                      placeholder="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-white font-mono">
                    <div className={`uppercase ${requirements.hasLength ? "text-green-400" : ""}`}>
                      ✓ AT LEAST 8 CHAR.
                    </div>
                    <div className={`uppercase ${requirements.hasUpperCase ? "text-green-400" : ""}`}>
                      ✓ AT LEAST 1 UPPERCASE
                    </div>
                    <div className={`uppercase ${requirements.hasNumber ? "text-green-400" : ""}`}>
                      ✓ AT LEAST 1 NUMBER
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white text-black border-2 border-gray-200 pr-10 font-mono uppercase placeholder:uppercase"
                      placeholder="confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full ${
                    isValid ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
                  } text-black font-mono uppercase`}
                  disabled={!isValid}
                >
                  Next
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

