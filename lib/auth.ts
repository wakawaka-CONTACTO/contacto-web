import type { SignInRequest, SignInResponse } from "@/types/auth"
import type { OnboardingData } from "@/types/onboarding"
import { config } from "@/config"

const BASE_URL = config.BASE_URL

export async function signIn(credentials: SignInRequest): Promise<SignInResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error("Failed to sign in")
  }

  const data = await response.json()

  localStorage.setItem("userId", data.userId.toString())
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("refreshToken", data.refreshToken)

  return data
}

export function getAuthToken(): string | null {
  return localStorage.getItem("accessToken")
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export async function signUp(data: OnboardingData): Promise<void> {
  const formData = new FormData()
  formData.append(
    "userSignUpReq",
    new Blob(
      [
        JSON.stringify({
          name: data.name,
          loginType: "LOCAL",
          email: data.email,
          description: data.originality,
          instagramId: data.social.instagram,
          webUrl: data.social.website,
          username: data.username,
          password: data.password,
        }),
      ],
      { type: "application/json" },
    ),
  )

  formData.append(
    "purpose",
    new Blob([JSON.stringify(data.purpose.map((p) => ({ purposeType: p })))], { type: "application/json" }),
  )
  formData.append(
    "talent",
    new Blob([JSON.stringify(data.talents.map((t) => ({ talentType: t })))], { type: "application/json" }),
  )

  for (const element of data.portfolioImages) {
    formData.append("portfolioImgs", element)
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/signup`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Signup failed")
  }

  const responseData = await response.json()
  localStorage.setItem("userId", responseData.userId.toString())
  localStorage.setItem("accessToken", responseData.accessToken)
  localStorage.setItem("refreshToken", responseData.refreshToken)
}

