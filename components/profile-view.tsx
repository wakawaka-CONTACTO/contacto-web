"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { fetchUserProfile } from "@/lib/api"
import type { UserProfile } from "@/types/profile"
import { PURPOSE_MAP, TALENT_MAP } from "@/types/profile"
import { BottomNav } from "./bottom-nav"
import { Upload } from "lucide-react"
import { ImageWithFallback } from "./image-with-fallback"

const talentTypeMap = {
  "산업 디자인": "Industrial Design",
  "그래픽 디자인": "Graphic Design",
  "패션 디자인": "Fashion Design",
  "UX/UI 디자인": "UX/UI Design",
  "브랜딩": "Branding",
  "모션 그래픽": "Motion Graphic",
  "애니메이션": "Animation",
  "일러스트레이션": "Illustration",
  "인테리어 디자인": "Interior Design",
  "건축 디자인": "Architecture Design",
  "텍스타일": "Textile",
  "패브릭 제품": "Fabric Product",
  "스타일링": "Styling",
  "가방 디자인": "Bag Design",
  "신발 디자인": "Shoes Design",
  "회화": "Painting",
  "조소": "",  // 매핑 없음
  "키네틱 아트": "Kinetic Art",
  "도자기": "Ceramics",
  "목공": "Woodworking",
  "주얼리": "Jewelry",
  "금속 공예": "Metal Craft",
  "유리 공예": "Glass Craft",
  "판화": "Printmaking",
  "미학": "Aesthetics",
  "터프팅": "Tufting",
  "시인": "Poet",
  "글쓰기": "Writing",
  "사진": "Photography",
  "광고": "Advertising",
  "시나리오": "Scenario",
  "작곡": "Composition",
  "감독": "Director",
  "춤": "Dance",
  "노래": "Singing",
  "뮤지컬": "Musical",
  "코미디": "Comedy",
  "연기": "Acting",
  "제작": "Production",
}


export function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
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

  const handleSettingsClick = () => {
    router.push("/profile/settings")
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

