"use client"
import { useEffect, useState } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  return { isAuthenticated, isLoading }
}
