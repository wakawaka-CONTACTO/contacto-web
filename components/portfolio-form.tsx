"use client"

import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArtisticHeader } from "./artistic-header"
import { signUp } from "@/lib/auth"

interface PortfolioImage {
  id: string
  url: string
  file: File
}

export function PortfolioForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && images.length < 10) {
      const newImages = Array.from(files)
        .slice(0, 10 - images.length)
        .map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          url: URL.createObjectURL(file),
          file,
        }))
      setImages((prev) => [...prev, ...newImages])
      updateData({ portfolioImages: [...data.portfolioImages, ...newImages.map((img) => img.file)] })
    }
  }

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
    updateData({ portfolioImages: images.filter((img) => img.id !== id).map((img) => img.file) })
  }

  const handleComplete = async () => {
    if (images.length > 0) {
      try {
        setError(null)
        await signUp(data)
        // Redirect to the tutorial page after successful signup
        router.push("/tutorial")
      } catch (error) {
        console.error("Error during signup:", error)
        setError("An error occurred during signup. Please try again.")
      }
    }
  }

  const scrollTo = (index: number) => {
    scrollContainerRef.current?.children[index].scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <ArtisticHeader />

      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-md">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white font-mono text-center uppercase">SHOW YOUR</h1>
              <h1 className="text-4xl font-bold text-white font-mono text-center uppercase">BEST PORTFOLIO</h1>
              <div className="w-full h-[2px] bg-white my-4"></div>
            </div>

            <div className="relative aspect-square w-full bg-[#c8c8c8] rounded-none overflow-hidden">
              {images.length > 0 ? (
                <>
                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory h-full"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {images.map((image, index) => (
                      <div key={image.id} className="flex-shrink-0 w-full h-full snap-start">
                        <div className="relative w-full h-full">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Portfolio image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemove(image.id)}
                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                          >
                            <X className="h-6 w-6 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 rounded-full bg-white/50 cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        onClick={() => scrollTo(index)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8" />
                  <span className="mt-2 font-mono uppercase">Upload (Max 10)</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" multiple />
                </label>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div
                className={`flex-1 p-3 text-center font-mono border ${
                  images.length > 0 ? "bg-[#17db4e] border-[#17db4e]" : "bg-[#c8c8c8] border-[#c8c8c8]"
                }`}
              >
                {images.length}/10
              </div>
              {images.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleComplete}
                    className="ml-4 bg-[#17db4e] hover:bg-[#17db4e]/90 text-black font-mono uppercase"
                  >
                    Complete
                  </Button>
                </motion.div>
              )}
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

