"use client"
import { useOnboarding } from "@/context/onboarding-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArtisticHeader } from "./artistic-header"

// Enum 형태로 재능 정의 (저장할 값은 대문자로 설정)
const talentsEnum = {
  INDUSTRIAL: "INDUSTRIAL",
  GRAPHIC: "GRAPHIC",
  FASHION: "FASHION",
  UX_UI: "UX_UI",
  BRANDING: "BRANDING",
  MOTION: "MOTION",
  ANIMATION: "ANIMATION",
  ILLUSTRATION: "ILLUSTRATION",
  INTERIOR: "INTERIOR",
  ARCHITECTURE: "ARCHITECTURE",
  TEXTILE: "TEXTILE",
  FABRIC_PRODUCT: "FABRIC_PRODUCT",
  STYLING: "STYLING",
  BAG_DESIGN: "BAG_DESIGN",
  SHOES_DESIGN: "SHOES_DESIGN",
  PAINTING: "PAINTING",
  RIDICULE: "RIDICULE",
  KINETIC: "KINETIC",
  CERAMICS: "CERAMICS",
  WOOD: "WOOD",
  JEWEL: "JEWEL",
  METAL: "METAL",
  GLASS: "GLASS",
  PRINTMAKING: "PRINTMAKING",
  AESTHETICS: "AESTHETICS",
  TUFFTING: "TUFFTING",
  POET: "POET",
  WRITING: "WRITING",
  PHOTO: "PHOTO",
  ADVERTISING: "ADVERTISING",
  SCENARIO: "SCENARIO",
  COMPOSE: "COMPOSE",
  DIRECTOR: "DIRECTOR",
  DANCE: "DANCE",
  SING: "SING",
  MUSICAL: "MUSICAL",
  COMEDY: "COMEDY",
  ACT: "ACT",
  PRODUCTION: "PRODUCTION",
}

// 화면에 표시할 텍스트와 저장할 Enum 값을 매핑 (예: "Industrial"을 누르면 "INDUSTRIAL"이 저장됨)
const talentsDisplay = {
  "Industrial": talentsEnum.INDUSTRIAL,
  "Graphic": talentsEnum.GRAPHIC,
  "Fashion": talentsEnum.FASHION,
  "UX/UI": talentsEnum.UX_UI,
  "Branding": talentsEnum.BRANDING,
  "Motion": talentsEnum.MOTION,
  "Animation": talentsEnum.ANIMATION,
  "Illustration": talentsEnum.ILLUSTRATION,
  "Interior": talentsEnum.INTERIOR,
  "Architecture": talentsEnum.ARCHITECTURE,
  "Textile": talentsEnum.TEXTILE,
  "Fabric Product": talentsEnum.FABRIC_PRODUCT,
  "Styling": talentsEnum.STYLING,
  "Bag Design": talentsEnum.BAG_DESIGN,
  "Shoes Design": talentsEnum.SHOES_DESIGN,
  "Painting": talentsEnum.PAINTING,
  "Ridicule": talentsEnum.RIDICULE,
  "Kinetic": talentsEnum.KINETIC,
  "Ceramics": talentsEnum.CERAMICS,
  "Wood": talentsEnum.WOOD,
  "Jewel": talentsEnum.JEWEL,
  "Metal": talentsEnum.METAL,
  "Glass": talentsEnum.GLASS,
  "Printmaking": talentsEnum.PRINTMAKING,
  "Aesthetics": talentsEnum.AESTHETICS,
  "Tuffting": talentsEnum.TUFFTING,
  "Poet": talentsEnum.POET,
  "Writing": talentsEnum.WRITING,
  "Photo": talentsEnum.PHOTO,
  "Advertising": talentsEnum.ADVERTISING,
  "Scenario": talentsEnum.SCENARIO,
  "Compose": talentsEnum.COMPOSE,
  "Director": talentsEnum.DIRECTOR,
  "Dance": talentsEnum.DANCE,
  "Sing": talentsEnum.SING,
  "Musical": talentsEnum.MUSICAL,
  "Comedy": talentsEnum.COMEDY,
  "Act": talentsEnum.ACT,
  "Production": talentsEnum.PRODUCTION,
}

const talents = {
  "DESIGN & FASHION": {
    color: "bg-pink-400",
    items: [
      "Industrial",
      "Graphic",
      "Fashion",
      "UX/UI",
      "Branding",
      "Motion",
      "Animation",
      "Illustration",
      "Interior",
      "Architecture",
      "Textile",
      "Fabric Product",
      "Styling",
      "Bag Design",
      "Shoes Design",
    ],
  },
  "ART & CRAFT": {
    color: "bg-blue-400",
    items: [
      "Painting",
      "Ridicule",
      "Kinetic",
      "Ceramics",
      "Wood",
      "Jewel",
      "Metal",
      "Glass",
      "Printmaking",
      "Aesthetics",
      "Tuffting",
    ],
  },
  "MEDIA & CONTENTS": {
    color: "bg-amber-200",
    items: [
      "Poet",
      "Writing",
      "Photo",
      "Advertising",
      "Scenario",
      "Compose",
      "Director",
      "Dance",
      "Sing",
      "Musical",
      "Comedy",
      "Act",
      "Production",
    ],
  },
}

export function TalentForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()

  const toggleTalent = (talent: string) => {
    const enumValue = talentsDisplay[talent] // Enum 값 가져오기
    console.log(enumValue)
    // 이미 선택된 재능이면 제거, 아니면 추가
    const newTalents = data.talents.includes(enumValue)
      ? data.talents.filter((t) => t !== enumValue)
      : [...data.talents, enumValue]
    updateData({ talents: newTalents })
  }

  const handleContinue = () => {
    if (data.talents.length > 0) {
      router.push("/onboarding/portfolio")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ArtisticHeader />
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center font-mono uppercase">
              WHAT&#39;S YOUR TALENT?
            </h1>
            {Object.entries(talents).map(([category, { color, items }]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-bold font-mono uppercase">{category}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((talent) => (
                    <button
                      key={talent}
                      onClick={() => toggleTalent(talent)}
                      className={`p-3 text-center border-2 border-black transition-all font-mono uppercase
                        ${color} ${
                          data.talents.includes(talentsDisplay[talent])
                            ? "ring-2 ring-black ring-offset-2"
                            : "opacity-80 hover:opacity-100"
                        }`}
                    >
                      {talent}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-8">
              <Button
                onClick={handleContinue}
                className="w-full bg-green-400 text-black hover:bg-green-500 font-mono uppercase"
                disabled={data.talents.length === 0}
              >
                Continue
              </Button>
              <div className="text-center mt-4 p-2 border-2 border-black bg-green-400 font-mono">
                5/6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
