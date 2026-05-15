import axios from "axios"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/token"

const axiosInstance = axios.create()

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 응답 인터셉터 (mock refresh)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()

        // 🔥 mock refresh (서버 대신)
        const newAccessToken = "newAccessToken_" + Date.now()

        if (!refreshToken) throw new Error("no refresh token")

        setTokens(newAccessToken, refreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return axiosInstance(originalRequest)
      } catch (err) {
        clearTokens()
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance