"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [error, setError] = React.useState<{ [key: string]: string }>({})
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError({})

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const login = formData.get("username") as string
    const password = formData.get("password") as string

    const requestBody = {
      user: { email },
      credential: { login, password }
    }

    try {
      const response = await fetch("http://localhost:8080/user/cad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      }).then(function(response) {
        return response.json()
      })

      if (response.status === "BAD_REQUEST") {
        const fieldErrors = response.messages || []
        const newErrors: { [key: string]: string } = {}

        fieldErrors.forEach((error: { field: string | number; message: string }) => {
          if (formRef.current) {
            const input = formRef.current.querySelector(`[name="${error.field}"]`) as HTMLInputElement
            if (input) {
              newErrors[error.field as string] = error.message  // Certifique-se de que o campo de erro corresponde corretamente
            }
          }
        })

        console.log(newErrors)
        setError(newErrors)
        throw new Error("Validation errors occurred")
      }

      router.push("fieldErrors/login")
    } catch (error: unknown) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? { general: error.message } : { general: "An unknown error occurred" })

      if (formRef.current) {
        formRef.current.reset()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to create a new account</CardDescription>
        </CardHeader>
        <form ref={formRef} onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error.general && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-500">{error.general}</p>
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required />
              {error.email && <p className="text-sm text-red-500">{error.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="Choose a username" required />
              {error.username && <p className="text-sm text-red-500">{error.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" required />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              {error.password && <p className="text-sm text-red-500">{error.password}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
  )
}
