"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchUserProfile } from "@/lib/api"
import type { UserProfile } from "@/types/profile"
import { BottomNav } from "./bottom-nav"

export function SettingsView() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await fetchUserProfile()
      setProfile(data)
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  const handleLogout = () => {
    // 로그아웃 로직 구현
    router.push("/login")
  }

  const handleDeleteAccount = () => {
    // 계정 삭제 로직 구현
    if (confirm("Are you sure want to delete your account?")) {
      router.push("/login")
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9af55] to-yellow-300 flex items-center justify-center">
        <div className="font-press-start">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9af55] to-yellow-300 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-press-start">C</span>
          <div className="h-[2px] bg-black flex-grow mx-4"></div>
          <span className="text-4xl font-press-start">T</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-press-start mb-8">Account Setting</h1>

        <div className="space-y-4">
          {/* Email */}
          <div className="bg-gray-200 p-4">
            <div className="font-press-start">E-mail</div>
            <div>{profile.email}</div>
          </div>

          {/* Password */}
          <div className="bg-gray-200 p-4">
            <div className="font-press-start">Password</div>
            <div>{"*".repeat(10)}</div>
          </div>

          {/* Help & Support */}
          <button className="w-full p-4 bg-green-400 text-black font-press-start text-left">Help & Support</button>

          {/* Community Guidelines */}
          <button className="w-full p-4 bg-green-400 text-black font-press-start text-left">
            Community Guidelines
          </button>

          {/* Privacy */}
          <button className="w-full p-4 bg-green-400 text-black font-press-start text-left">Privacy</button>
        </div>

        {/* Version */}
        <div className="mt-20 text-center">
          <h2 className="font-press-start text-xl mb-2">CONTACTO</h2>
          <p className="text-sm">V 1.00.01</p>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between">
          <button onClick={handleLogout} className="text-sm underline font-press-start">
            Log out
          </button>
          <button onClick={handleDeleteAccount} className="text-sm underline font-press-start">
            Delete Account
          </button>
        </div>
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}

