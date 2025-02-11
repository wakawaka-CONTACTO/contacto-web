export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  userId: number
  accessToken: string
  refreshToken: string
}

export interface AuthError {
  message: string
}

