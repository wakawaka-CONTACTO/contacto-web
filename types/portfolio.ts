export interface Portfolio {
  portfolioId: number
  userId: number
  username: string | null
  portfolioImageUrl: string[]
}

export interface PortfolioResponse {
  data: Portfolio[]
  error?: string
}

export interface PageableResponse<T> {
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  numberOfElements: number
  empty: boolean
}

