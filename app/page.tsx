"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CodeGeneratorLayout from "@/components/code-generator-layout"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/auth/validate", {
      method: "GET",
      credentials: "include", // Garante que o cookie será enviado automaticamente
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token inválido")
        }
        return response.json()
      })
      .catch((error) => {
        console.error("Erro de autenticação:", error)
        router.push("/login")
      })
      .finally(() => setIsLoading(false))
  }, [router])

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    )

  return <CodeGeneratorLayout />
}
