"use client"

import { createContext, useContext, useState } from "react"
import type { OnboardingContextType, OnboardingData } from "@/types/onboarding"

const initialData: OnboardingData = {
  email: "",
  password: "",
  username: "",
  name: "",
  purpose: [],
  originality: "",
  social: {
    instagram: "",
    website: "",
  },
  talents: [],
  portfolioImages: [],
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData)

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  return <OnboardingContext.Provider value={{ data, updateData }}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

