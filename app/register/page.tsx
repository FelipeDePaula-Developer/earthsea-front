import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Code Generator</h1>
        <p className="text-muted-foreground">Generate code from natural language prompts</p>
      </div>
      <RegisterForm />
    </div>
  )
}

