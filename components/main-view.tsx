"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { fetchPortfolios } from "@/lib/api"
import type { Portfolio } from "@/types/portfolio"
import { Camera, Download, Menu } from "lucide-react"
import { getAuthToken } from "@/lib/auth"
import { config } from "@/config"
import { PortfolioDetailModal } from "./portfolio-detail-modal"
import { MatchModal } from "./match-modal"
import { BottomNav } from "./bottom-nav"
import { useRouter } from "next/navigation"
import { ImageWithFallback } from "./image-with-fallback"

const BASE_URL = config.BASE_URL

export function MainView() {
  const router = useRouter()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [matchResult, setMatchResult] = useState<{
    userPortfolios:
      | {
          portfolioId: number
          userId: number
          username: string
          portfolioImages: string[]
        }[]
      | null
    chatRoomId: number | null
    matched: boolean
  } | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
      return
    }
    if (isInitialLoad) {
      setIsInitialLoad(false)
      loadPortfolios().then(r => r)
      setCurrentPage(0)
    }
  }, [router, isInitialLoad,loadPortfolios])

  async function loadPortfolios(page = 0) {
    try {
      console.log(`Fetching portfolios for page: ${page}`);
      const data = await fetchPortfolios(page);
      if (data.length === 0) {
        return; // 더 이상 포트폴리오가 없으면 종료
      }
      setPortfolios((prevPortfolios) => {
        const newPortfolios = [...prevPortfolios, ...data]; // 기존 포트폴리오에 새로 가져온 포트폴리오 추가
        setCurrentPage(currentPage)
        console.log("Updated portfolios. Current queue size:", newPortfolios.length);
        return newPortfolios;
      });
  
      if (currentPortfolio === null) {
        setCurrentPortfolio(data[0]); // 첫 번째 포트폴리오 설
      }
  
      setLoading(false);
    } catch (err) {
      console.error("Error loading portfolios:", err);
      setError("Failed to load portfolios");
      setLoading(false);
    }
  }

  async function loadMorePortfolios (){
      loadPortfolios(currentPage + 1)
  }

  const handleNext = () => {
    console.log("Handling next portfolio");
    if (!currentPortfolio) return;

    // 전체 윈도우의 overflow를 hidden으로 설정
    document.body.style.overflow = "hidden";

    if (currentImageIndex < currentPortfolio.portfolioImageUrl.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.slice(1);
        console.log("Current queue size after removal:", newPortfolios.length);
        return newPortfolios;
      });

      if (portfolios.length > 1) {
        setCurrentPortfolio(portfolios[1]);
        setCurrentImageIndex(0);
      } else if (portfolios.length === 1) {
        loadMorePortfolios(); // 다음 페이지 로드
      }
    }

    // 애니메이션이 끝난 후 overflow를 원래대로 되돌림
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 300); // 애니메이션 시간에 맞춰 조정

    console.log("Current queue size after next:", portfolios.length);
  }


  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        handleAction("DISLIKE")
      } else {
        handleAction("LIKE")
      }
    }
  }

  const handleAction = async (status: "LIKE" | "DISLIKE") => {
    if (!currentPortfolio) return

    const token = getAuthToken()
    if (!token) {
      setError("No authentication token found. Please log in.")
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/users/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          likedUserId: currentPortfolio.userId,
          status: status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send like/dislike")
      }

      const result = await response.json()

      // Only show match modal if there's a match
      if (result.matched) {
        setMatchResult(result)
      }

      // Move to the next portfolio
      handleNext()
    } catch (err) {
      console.log(err)
      setError("Failed to send like/dislike")
    }
  }

  const handleImageClick = () => {
    if (currentPortfolio) {
      setIsDetailModalOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#ffffff] font-mono">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#ffffff] font-mono">{error}</div>
      </div>
    )
  }

  if (!currentPortfolio) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#ffffff] font-mono">No portfolios available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      <header className="bg-[#2ea7e0] py-4">
        <h1 className="text-center text-[#ffffff] profile-title">
          Profile by {currentPortfolio.username || "Unknown User"}
        </h1>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        </link>
      </header>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPortfolio.portfolioId}-${currentImageIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleSwipe}
            className="absolute inset-0"
          >
            <div className="relative h-full">
              <button onClick={handleImageClick} className="absolute inset-0 w-full h-full focus:outline-none">
                <ImageWithFallback
                  src={currentPortfolio.portfolioImageUrl[currentImageIndex] || "/placeholder.svg"}
                  alt={`Portfolio ${currentPortfolio.portfolioId}`}
                  fill
                  className="object-cover"
                />
              </button>

              <div className="absolute top-4 right-4 bg-[#000000]/50 px-2 py-1 rounded-full">
                <span className="text-[#ffffff] font-mono text-sm">
                  {currentImageIndex + 1}/{currentPortfolio.portfolioImageUrl.length}
                </span>
              </div>

              <div className="absolute bottom-8 inset-x-0 flex justify-between px-8">
                <motion.button
                  className="w-16 h-16 rounded-full bg-[#ffffff] flex items-center justify-center text-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction("DISLIKE")}
                >
                  ✕
                </motion.button>
                <motion.button
                  className="w-16 h-16 rounded-full bg-[#ffffff] flex items-center justify-center text-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction("LIKE")}
                >
                  O
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-4 flex justify-between items-center border-t border-[#c8c8c8] mb-16">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-mono text-[#ffffff]">CT</span>
        </div>
        <div className="flex space-x-6">
          <button className="text-[#ffffff]">
            <Camera className="w-6 h-6" />
          </button>
          <button className="text-[#ffffff]">
            <Download className="w-6 h-6" />
          </button>
          <button className="text-[#ffffff]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </footer>
      <BottomNav currentPath="/main" />
      <PortfolioDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        portfolioUserId={currentPortfolio?.userId || 0}
      />
      {matchResult && <MatchModal isOpen={true} onClose={() => setMatchResult(null)} matchResult={matchResult} />}
    </div>
  )
}
