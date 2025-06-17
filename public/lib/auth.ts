export interface AdminUser {
  username: string
  isAuthenticated: boolean
  loginTime: string
}

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "wecandoit@123",
}

const AUTH_STORAGE_KEY = "admin_auth"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const authData: AdminUser = {
      username,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    return true
  }
  return false
}

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const authData = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!authData) return false

  try {
    const parsed: AdminUser = JSON.parse(authData)
    const loginTime = new Date(parsed.loginTime).getTime()
    const now = new Date().getTime()

    // Check if session has expired
    if (now - loginTime > SESSION_DURATION) {
      logout()
      return false
    }

    return parsed.isAuthenticated
  } catch {
    return false
  }
}

export const getAuthUser = (): AdminUser | null => {
  if (typeof window === "undefined") return null

  const authData = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!authData) return null

  try {
    return JSON.parse(authData)
  } catch {
    return null
  }
}
