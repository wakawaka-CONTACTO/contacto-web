import type { Portfolio } from "@/types/portfolio"
import type { UserProfile } from "@/types/profile"
import type { ChatRoom } from "@/types/chat" // Import ChatRoom type
import { config } from "@/config"
import { getAuthToken } from "@/lib/auth"

const BASE_URL = config.BASE_URL || "http://localhost"

export async function fetchPortfolios(page = 0): Promise<Portfolio[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("No authentication token found. Please log in.")
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/portfolios?page=${page}&size=3`, {
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication expired. Please log in again.")
    }
    throw new Error("Failed to fetch portfolios")
  }

  const data: Portfolio[] = await response.json()
  return data
}

export async function fetchChatRooms(page = 0, size = 10): Promise<ChatRoom[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/me/chatroom?page=${page}&size=${size}`, {
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch chat rooms")
  }

  const data = await response.json()
  return data
}

// 새로운 함수 추가
export async function fetchUserProfile(): Promise<UserProfile> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}

