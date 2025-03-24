"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import CodeGeneratorLayout from "@/components/code-generator-layout"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const jwtToken = Cookies.get("jwt")

    if (!jwtToken) {
      router.push("/login")
      setIsLoading(false) // Importante definir isLoading como false aqui também
    } else {
      fetch("http://localhost:8080/auth/validate", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token inválido")
          }
          return response.json() // É uma boa prática consumir a resposta
        })
        .catch((error) => {
          console.error("Erro de autenticação:", error)
          Cookies.remove("jwt")
          router.push("/login")
        })
        .finally(() => setIsLoading(false))
    }
  }, [router])

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    )

  return <CodeGeneratorLayout />
}

