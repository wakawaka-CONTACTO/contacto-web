"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"

type LoginStep = "email" | "password"

export function LoginForm() {
  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setStep("password")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn({ email, password })
      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }
      // 로그인 성공 후 상태가 안정화될 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push("/main")
      router.refresh() // 네비게이션 상태 리프레시
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setError(null)
  }

  if (step === "email") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white font-mono">CONTACTO</h1>
            <h2 className="mt-6 text-2xl font-semibold text-white">Log in</h2>
          </div>
          <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
            <div>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black border-2 border-gray-200"
                required
              />
            </div>
            <Button
              type="submit"
              className={`w-full ${
                email ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
              } text-black`}
            >
              Continue
            </Button>
          </form>
          <div className="text-center space-y-4">
            <Link
              href="/signup"
              className="inline-block text-blue-500 hover:text-blue-400 border border-gray-200 border-blue-500 px-4 py-2 w-full rounded dark:border-gray-800"
            >
              Create a new account
            </Link>
            <div>
              <Link href="/help" className="text-blue-500 hover:text-blue-400">
                Need help signing in?
              </Link>
            </div>
            <div>
              <Link href="/privacy" className="text-blue-500 hover:text-blue-400">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">CONTACTO</h1>
          <h2 className="mt-6 text-2xl font-semibold text-white">Log in</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-black border-2 border-gray-200 pr-10"
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
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className={`w-full ${
              password ? "bg-green-400 hover:bg-green-500" : "bg-gray-200 hover:bg-gray-300"
            } text-black`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <div className="text-center space-y-4">
          <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400">
            Forgot your password?
          </Link>
          <div>
            <button onClick={handleBackToEmail} className="text-blue-500 hover:text-blue-400">
              Go to First step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

