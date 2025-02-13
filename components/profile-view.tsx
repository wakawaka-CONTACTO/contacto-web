"use client"

import { useState, useEffect } from "react"
import { fetchUserProfile } from "@/lib/api"
import type { UserProfile } from "@/types/profile"
import { PURPOSE_MAP, TALENT_MAP } from "@/types/profile"
import { BottomNav } from "./bottom-nav"
import { Upload } from "lucide-react"
import { ImageWithFallback } from "./image-with-fallback"
export function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

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
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="font-press-start">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#f9af55] p-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-press-start">C</span>
          <div className="h-[2px] bg-black flex-grow mx-4"></div>
          <span className="text-4xl font-press-start">T</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black">
        <button
          className={`flex-1 p-4 font-press-start text-sm ${activeTab === "edit" ? "bg-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("edit")}
        >
          Profile Edit
        </button>
        <button
          className={`flex-1 p-4 font-press-start text-sm ${activeTab === "preview" ? "bg-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Username */}
        <input
          type="text"
          value={profile.username}
          className="w-full p-3 border-2 border-black font-press-start"
          readOnly={activeTab === "preview"}
        />

        {/* Portfolio Images */}
        <div className="grid grid-cols-2 gap-4">
          {profile.userPortfolio.portfolioImages.map((image, index) => (
            <div key={index} className="aspect-square relative bg-gray-200">
              {image ? (
                <ImageWithFallback src={image || "/placeholder.svg"} alt="Portfolio" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs mt-2">Upload</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Talents */}
        <div>
          <h3 className="font-press-start text-sm mb-2 flex items-center">
            Talent <span className="ml-2">✏️</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.userTalents.map((talent) => (
              <span
                key={talent.id}
                className={`px-3 py-1 text-sm ${
                  TALENT_MAP[talent.talentType].color || "bg-black-500"
                } text-black rounded`}
              >
                {TALENT_MAP[talent.talentType]?.name || talent.talentType}
              </span>
            ))}
          </div>
        </div>

        {/* Originality */}
        <div>
          <h3 className="font-press-start text-sm mb-2">My originality</h3>
          <textarea
            value={profile.description}
            className="w-full p-3 border-2 border-black min-h-[100px]"
            readOnly={activeTab === "preview"}
          />
        </div>

        {/* Purpose */}
        <div>
          <h3 className="font-press-start text-sm mb-2">Purpose</h3>
          <div className="grid grid-cols-2 gap-4">
            {profile.userPurposes.map((purpose) => (
              <div key={purpose} className="border-2 border-black p-2 text-sm font-press-start">
                #{PURPOSE_MAP[purpose]}
              </div>
            ))}
          </div>
        </div>

        {/* SNS & Website */}
        <div>
          <h3 className="font-press-start text-sm mb-2">SNS & Web Site</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1">INSTAGRAM *REQUIRED*</label>
              <input
                type="text"
                value={profile.instagramId}
                className="w-full p-3 border-2 border-black"
                readOnly={activeTab === "preview"}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">WEBSITE</label>
              <input
                type="text"
                value={profile.webUrl}
                className="w-full p-3 border-2 border-black"
                readOnly={activeTab === "preview"}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {activeTab === "edit" && <button className="w-full p-4 bg-green-400 text-black font-press-start">SAVE</button>}
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}

