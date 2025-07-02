"use client"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
  children: React.ReactNode
}

export default function AuthGuard({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) return <p className="text-center mt-8">Chargement de l'authentification...</p>

  if (!isAuthenticated) return <p className="text-center mt-8">Redirection...</p>

  return <>{children}</>
}
