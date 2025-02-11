export interface OnboardingData {
  email: string
  password: string
  name: string
  username: string
  purpose: string[]
  originality: string
  social: {
    instagram: string
    website: string
  }
  talents: string[]
  portfolioImages: File[]
}

export interface OnboardingContextType {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
}

