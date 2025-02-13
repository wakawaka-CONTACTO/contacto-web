"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth"
import { config } from "@/config"
import { ImageWithFallback } from "./image-with-fallback"

const BASE_URL = config.BASE_URL

interface UserPortfolio {
  portfolioId: number
  userId: number
  portfolioImages: string[]
}

interface UserTalent {
  id: number | null
  userId: number
  talentType: string
}

interface UserDetail {
  id: number
  username: string
  socialId: string | null
  loginType: string
  email: string
  description: string
  instagramId: string
  webUrl: string
  userPortfolio: UserPortfolio
  userPurposes: number[]
  userTalents: UserTalent[]
}

interface PortfolioDetailModalProps {
  isOpen: boolean
  onClose: () => void
  portfolioUserId: number
}

const purposeColors = {
  1: "bg-[#fe3843]", // Get Along With U
  2: "bg-[#ef62c7]", // Collaborate Project
  3: "bg-[#ffdb1c]", // Art Residency
  4: "bg-[#1a76ff]", // Make New Brand
  5: "bg-[#98fe68]", // Group exhibition
}

const purposeLabels = {
  1: "Get Along With U",
  2: "Collaborate Project",
  3: "Art Residency",
  4: "Make New Brand",
  5: "Group exhibition",
}

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
  "조소": "Sculpture",
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
  "제작": "Production"
};


export function PortfolioDetailModal({ isOpen, onClose, portfolioUserId }: PortfolioDetailModalProps) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen && portfolioUserId) {
      fetchUserDetail().then(r => r)
    }
  }, [isOpen, portfolioUserId])

  const fetchUserDetail = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/portfolios/${portfolioUserId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user detail")
      }

      const data = await response.json()
      setUserDetail(data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setError("Failed to load user detail")
      setLoading(false)
    }
  }

  const translateTalentType = (koreanType: string): string => {
    return talentTypeMap[koreanType] || koreanType
  }

  const nextImage = () => {
    if (userDetail) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === userDetail.userPortfolio.portfolioImages.length - 1 ? 0 : prevIndex + 1,
      )
    }
  }

  const prevImage = () => {
    if (userDetail) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? userDetail.userPortfolio.portfolioImages.length - 1 : prevIndex - 1,
      )
    }
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    )
  }

  if (error || !userDetail) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white font-mono">{error || "Failed to load user detail"}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-y-auto"
    >
      {/* Close button at top */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Portfolio image carousel */}
        <div className="relative aspect-[4/3] w-full mb-8">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={userDetail.userPortfolio.portfolioImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${userDetail.username}'s portfolio image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {userDetail.userPortfolio.portfolioImages.length}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-mono text-white mb-6 font-pixel">{userDetail.username}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {userDetail.userTalents.map((talent, index) => (
            <span key={index} className="px-3 py-1 bg-[#ef62c7] text-white text-sm font-mono rounded">
              {translateTalentType(talent.talentType)}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-white mb-8 font-mono">{userDetail.description}</p>

        {/* Looking for section */}
        <div className="mb-8">
          <h2 className="text-white font-mono mb-4">Looking for</h2>
          <div className="grid gap-2">
            {userDetail.userPurposes.map((purposeId, index) => (
              <div key={index} className={`px-4 py-2 ${purposeColors[purposeId]} text-black font-mono`}>
                # {purposeLabels[purposeId]}
              </div>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-white font-mono">Instagram:</span>
            <Link
              href={`https://instagram.com/${userDetail.instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline font-mono"
            >
              {userDetail.instagramId || "N/A"}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white font-mono">Website:</span>
            <Link
              href={userDetail.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline font-mono break-all"
            >
              {userDetail.webUrl || "N/A"}
            </Link>
          </div>
        </div>

        {/* Bottom close button */}
        <button
          onClick={onClose}
          className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  )
}

