"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "./bottom-nav"
import { fetchChatRooms } from "@/lib/api"
import type { ChatRoom } from "@/types/chat"
import { useRouter } from "next/navigation"
import { ImageWithFallback } from "./image-with-fallback"


export function ChatList() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadChatRooms()
  }, [])

  const loadChatRooms = async () => {
    try {
      const data = await fetchChatRooms()
      setChatRooms(data)
      setLoading(false)
    } catch (err) {
      setError("Failed to load chat rooms")
      setLoading(false)
    }
  }

  const handleChatRoomClick = (chatRoomId: number) => {
    router.push(`/chat/${chatRoomId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5dfdb] flex items-center justify-center">
        <div className="text-sm">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5dfdb] flex items-center justify-center">
        <div className="text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5dfdb] flex flex-col">
      <header className="bg-[#f5dfdb] p-4 border-b border-black/10">
        <h1 className="text-base font-press-start">Messages</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {chatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl font-press-start mb-4">Not Yet</div>
            <p className="text-center text-sm">
              If we find first match,
              <br />
              We&apos;ll notice you on push.
            </p>
          </div>
        ) : (
          chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleChatRoomClick(room.id)}
              className="w-full border-b border-black/10 p-4 flex items-center space-x-4 hover:bg-black/5 transition-colors"
            >
              <div className="relative w-16 h-16 overflow-hidden rounded-full">
                <ImageWithFallback
                  src={room.chatRoomThumbnail}
                  alt="basic"
                  className="object-cover"
                  fill
                  svgProps={{ className: "object-cover rounded-full", width: "60", height: "60" }}
                  backgroundColor="white"
                  textColor="black"
                />
                {room.unreadMessageCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#2ea7e0] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-press-start">
                    {room.unreadMessageCount}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-start">
                  <h3 className="font-press-start text-sm">{room.title}</h3>
                </div>
                <p className="text-xs text-gray-600 truncate">{room.latestMessageContent || "No messages yet"}</p>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav currentPath="/chat" />
    </div>
  )
}

