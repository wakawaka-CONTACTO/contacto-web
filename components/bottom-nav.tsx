"use client"

import Link from "next/link"
import { MessageSquare, User, Home } from "lucide-react"

interface BottomNavProps {
  currentPath: string
}

export function BottomNav({ currentPath }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-black border-t border-gray-800">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/main"
          className={`flex flex-col items-center space-y-1 ${
            currentPath === "/main" ? "text-[#2ea7e0]" : "text-white"
          }`}
        >
          <Home size={24} />
          <span className="text-xs font-pixel">CT</span>
        </Link>
        <Link
          href="/chat"
          className={`flex flex-col items-center space-y-1 ${
            currentPath === "/chat" ? "text-[#2ea7e0]" : "text-white"
          }`}
        >
          <MessageSquare size={24} />
          <span className="text-xs font-pixel">Chat</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center space-y-1 ${
            currentPath === "/profile" ? "text-[#2ea7e0]" : "text-white"
          }`}
        >
          <User size={24} />
          <span className="text-xs font-pixel">Profile</span>
        </Link>
      </div>
    </div>
  )
}

