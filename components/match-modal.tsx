"use client"

import { X, Send } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { ChatRoom } from "./chat-room"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchResult: {
    userPortfolios:
      | {
          portfolioId: number
          userId: number
          username: string
          portfolioImages: string[]
          portfolioImageUrl: string[]
        }[]
      | null
    chatRoomId: number | null
    matched: boolean
  }
}

export function MatchModal({ isOpen, onClose, matchResult }: MatchModalProps) {
  const [showChat, setShowChat] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState("")
  const [customMessage, setCustomMessage] = useState("")

  if (!isOpen) return null

  const quickMessages = ["hello!", "Nice to meet you!", "Hi", "Oh!"]

  const handleQuickMessage = (message: string) => {
    setSelectedMessage(message)
    setCustomMessage(message)
  }

  const handleStartChat = () => {
    if (matchResult.matched && matchResult.chatRoomId) {
      setShowChat(true)
    }
  }

  const processedPortfolios = matchResult.userPortfolios
    ? Array.from(new Set(matchResult.userPortfolios.map((p) => p.userId)))
        .map((userId) => matchResult.userPortfolios?.find((p) => p.userId === userId))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
    : []

  if (showChat && matchResult.chatRoomId) {
    return (
      <ChatRoom
        chatRoomId={matchResult.chatRoomId}
        participantId={processedPortfolios[1]?.userId || 0}
        onClose={onClose}
        initialMessage={customMessage || selectedMessage}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="w-full max-w-md p-4">
        <div className="relative">
          {/* Close button */}
          <button onClick={onClose} className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center">
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Match result content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-pixel text-white mb-4">
              {matchResult.matched ? "Oh! You both like each other" : "Not a match this time"}
            </h2>
          </div>

          {/* Portfolio images */}
          {matchResult.matched && processedPortfolios && (
            <div className="relative h-64 mb-8">
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute left-0 top-0 w-1/2 h-full"
              >
                <Image
                  src={
                    processedPortfolios[0]?.portfolioImageUrl?.[0] ||
                    processedPortfolios[0]?.portfolioImages?.[0] ||
                    "/placeholder.svg"
                  }
                  alt="Your portfolio"
                  fill
                  className="object-cover rounded-lg"
                />
              </motion.div>
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 top-0 w-1/2 h-full"
              >
                <Image
                  src={
                    processedPortfolios[1]?.portfolioImageUrl?.[0] ||
                    processedPortfolios[1]?.portfolioImages?.[0] ||
                    "/placeholder.svg"
                  }
                  alt="Their portfolio"
                  fill
                  className="object-cover rounded-lg"
                />
              </motion.div>
            </div>
          )}

          {/* Chat interface */}
          {matchResult.matched && (
            <div className="space-y-4">
              <div className="text-xl font-pixel text-white mb-4">just say hello</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickMessages.map((message) => (
                  <button
                    key={message}
                    onClick={() => handleQuickMessage(message)}
                    className={`px-4 py-2 rounded ${
                      selectedMessage === message
                        ? "bg-[#2ea7e0] text-white"
                        : "bg-white/10 text-white hover:bg-[#2ea7e0]/50"
                    } transition-colors font-pixel`}
                  >
                    {message}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-[#c8c8c8] rounded-lg text-black placeholder-black/70 font-pixel"
                />
                <button
                  onClick={handleStartChat}
                  disabled={!customMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#2ea7e0] text-white rounded-lg hover:bg-[#2ea7e0]/80 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

