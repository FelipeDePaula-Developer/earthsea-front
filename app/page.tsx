"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CodeGeneratorLayout from "@/components/code-generator-layout"

export default function Home() {
  const router = useRouter()

  // This is a simple authentication check
  // In a real application, you would check for a valid session/token
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  return <CodeGeneratorLayout />
}

