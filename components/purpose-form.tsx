"use client"
import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArtisticHeader } from "./artistic-header"

const purposes = [
  { text: "Get Along With U", activeColor: "bg-[#ff6b6b]", enumValue: "GET_ALONG_WITH_U" },
  { text: "Collaborate Project", activeColor: "bg-[#f06292]", enumValue: "WANT_TO_COLLABORATE" },
  { text: "Make New Brand", activeColor: "bg-[#4dabf7]", enumValue: "WANNA_MAKE_NEW_BRAND" },
  { text: "Art Residency", activeColor: "bg-[#ffd43b]", enumValue: "ART_RESIDENCY" },
  { text: "Group exhibition", activeColor: "bg-[#69db7c]", enumValue: "GROUP_EXHIBITION" },
]

export function PurposeForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()

  const togglePurpose = (enumValue: string) => {
    const newPurposes = data.purpose.includes(enumValue)
      ? data.purpose.filter((p) => p !== enumValue)
      : [...data.purpose, enumValue]
    updateData({ purpose: newPurposes })
  }

  const handleContinue = () => {
    if (data.purpose.length > 0) {
      router.push("/onboarding/originality")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ArtisticHeader />
      <div className="flex-1 bg-[#4dabf7] flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 font-mono uppercase">WHAT'S YOUR PURPOSE?</h1>
              <p className="text-sm font-mono uppercase">MULTIPLE SELECTION</p>
            </div>
            <div className="space-y-4">
              {purposes.map(({ text, activeColor, enumValue }) => (
                <button
                  key={enumValue}
                  onClick={() => togglePurpose(enumValue)}
                  className={`w-full p-4 text-center border-2 border-black transition-all font-mono uppercase
                    ${data.purpose.includes(enumValue) ? activeColor : "bg-white"}`}
                >
                  {`# ${text}`}
                </button>
              ))}
            </div>
            <div className="pt-8">
              <Button
                onClick={handleContinue}
                className="w-full bg-gray-200 hover:bg-green-400 text-black transition-colors font-mono uppercase"
                disabled={data.purpose.length === 0}
              >
                Continue
              </Button>
              <div className="text-center mt-4 p-2 border-2 border-black bg-green-400 font-mono">2/6</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}