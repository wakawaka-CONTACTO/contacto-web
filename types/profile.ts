export interface UserProfile {
  id: number
  username: string
  socialId: string | null
  loginType: string
  email: string
  description: string
  instagramId: string
  webUrl: string
  password: null
  userPortfolio: {
    portfolioId: number
    userId: number
    portfolioImages: string[]
  }
  userPurposes: number[]
  userTalents: {
    id: number
    userId: number
    talentType: string
  }[]
}

export const PURPOSE_MAP: Record<number, string> = {
  0: "Get Along With U",
  1: "Collaborate Project",
  2: "Art Residency",
  3: "Make New Brand",
  4: "Group exhibition",
}

export const TALENT_MAP: Record<string, { name: string; color: string }> = {
  "산업 디자인": { name: "Industrial Design", color: "bg-pink-500" },
  "그래픽 디자인": { name: "Graphic Design", color: "bg-blue-500" },
  "패션 디자인": { name: "Fashion Design", color: "bg-purple-500" },
  "UX/UI 디자인": { name: "UX/UI Design", color: "bg-indigo-500" },
  "브랜딩": { name: "Branding", color: "bg-red-500" },
  "모션 그래픽": { name: "Motion Graphic", color: "bg-orange-500" },
  "애니메이션": { name: "Animation", color: "bg-yellow-500" },
  "일러스트레이션": { name: "Illustration", color: "bg-green-500" },
  "인테리어 디자인": { name: "Interior Design", color: "bg-emerald-500" },
  "건축 디자인": { name: "Architecture Design", color: "bg-lime-500" },
  "텍스타일": { name: "Textile", color: "bg-gray-500" },
  "패브릭 제품": { name: "Fabric Product", color: "bg-stone-500" },
  "스타일링": { name: "Styling", color: "bg-rose-500" },
  "가방 디자인": { name: "Bag Design", color: "bg-teal-500" },
  "신발 디자인": { name: "Shoes Design", color: "bg-cyan-500" },
  "회화": { name: "Painting", color: "bg-violet-500" },
  "조소": { name: "Sculpture", color: "bg-zinc-500" },
  "키네틱 아트": { name: "Kinetic Art", color: "bg-sky-500" },
  "도자기": { name: "Ceramics", color: "bg-fuchsia-500" },
  "목공": { name: "Woodworking", color: "bg-brown-500" },
  "주얼리": { name: "Jewelry", color: "bg-amber-500" },
  "금속 공예": { name: "Metal Craft", color: "bg-yellow-700" },
  "유리 공예": { name: "Glass Craft", color: "bg-blue-300" },
  "판화": { name: "Printmaking", color: "bg-gray-700" },
  "미학": { name: "Aesthetics", color: "bg-pink-300" },
  "터프팅": { name: "Tufting", color: "bg-green-700" },
  "시인": { name: "Poet", color: "bg-red-300" },
  "글쓰기": { name: "Writing", color: "bg-gray-400" },
  "사진": { name: "Photography", color: "bg-yellow-400" },
  "광고": { name: "Advertising", color: "bg-orange-600" },
  "시나리오": { name: "Scenario", color: "bg-blue-600" },
  "작곡": { name: "Composition", color: "bg-purple-600" },
  "감독": { name: "Director", color: "bg-red-700" },
  "춤": { name: "Dance", color: "bg-pink-700" },
  "노래": { name: "Singing", color: "bg-indigo-700" },
  "뮤지컬": { name: "Musical", color: "bg-teal-700" },
  "코미디": { name: "Comedy", color: "bg-gray-600" },
  "연기": { name: "Acting", color: "bg-blue-800" },
  "제작": { name: "Production", color: "bg-green-800" }
};

