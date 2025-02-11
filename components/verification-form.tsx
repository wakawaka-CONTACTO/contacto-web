"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 인증 코드 확인 로직 추가
    console.log("인증 코드 확인:", verificationCode)
  }

  const handleResend = () => {
    // 여기에 이메일 재전송 로직 추가
    console.log("인증 메일 재전송")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">E-mail verification code</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-white text-black text-center text-lg tracking-widest"
              placeholder="●"
              maxLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gray-200 text-black hover:bg-gray-300">
            Next
          </Button>
        </form>
        <div className="text-center">
          <button onClick={handleResend} className="text-blue-500 hover:text-blue-400">
            Resend E-mail
          </button>
        </div>
      </div>
    </div>
  )
}

