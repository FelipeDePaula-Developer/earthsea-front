"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Settings, User, Code, Eye, Copy, Sun, Moon, Smartphone, Tablet, Monitor, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarTrigger,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function CodeGeneratorLayout() {
    const router = useRouter()
    const [isDarkMode, setIsDarkMode] = React.useState(false)
    const [previewDevice, setPreviewDevice] = React.useState("desktop")

    const handleLogout = () => {
        // In a real application, you would clear the session/token
        localStorage.removeItem("isAuthenticated")
        router.push("/login")
      }

    const [prompt, setPrompt] = React.useState("") // Estado para armazenar o prompt digitado
    const [generatedCode, setGeneratedCode] = React.useState("// O código gerado aparecerá aqui...") // Estado para armazenar o código gerado
    const [loading, setLoading] = React.useState(false) // Estado para indicar carregamento

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault() // Prevenir recarregamento da página
        setLoading(true) // Ativar estado de carregamento

        try {
            const response = await fetch("http://localhost:8080/chat/generate/gemini", {
                method: "POST",
                credentials: "include",  // Inclui cookies e headers necessários
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"question":prompt}), // Enviando o prompt ao backend
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Erro ao gerar código")
            }

            const data = await response.json()
            setGeneratedCode(data.response) // Atualiza o estado com o código gerado
        } catch (error) {
            console.error("Erro:", error)
            setGeneratedCode("// Erro ao gerar código.")
        } finally {
            setLoading(false) // Finaliza carregamento
        }
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <Sidebar className="hidden w-64 flex-shrink-0 border-r lg:block">
                    <SidebarHeader>
                        <h2 className="px-4 text-lg font-semibold">Code Generator</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <nav className="space-y-2 px-2">
                            <Button variant="ghost" className="w-full justify-start">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </nav>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-sm">v1.0.0</span>
                            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                        <SidebarTrigger className="lg:hidden" />
                        <div className="ml-auto flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-shrink-0 border-b p-4">
                            <form className="flex space-x-2" onSubmit={handleSubmit}>
                                <Input
                                    className="flex-1"
                                    placeholder="Enter your prompt here..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Generating..." : "Generate"}
                                </Button>
                            </form>
                        </div>
                        <Tabs defaultValue="code" className="flex flex-1 flex-col overflow-hidden">
                            <div className="flex items-center justify-between border-b px-4">
                                <TabsList className="w-full justify-start">
                                    <TabsTrigger value="code" className="flex-1">
                                        <Code className="mr-2 h-4 w-4" />
                                        Code
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="flex-1">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value="code" className="flex-1 overflow-auto p-4">
                                <pre className="h-full w-full overflow-auto">
                                    <code className="block whitespace-pre-wrap">
                                        {generatedCode}
                                    </code>
                                </pre>
                            </TabsContent>
                            <TabsContent value="preview" className="flex-1 overflow-hidden p-4">
                                <div className="flex h-full flex-col">
                                    <div className="mb-4 flex justify-end space-x-2">
                                        <Button
                                            variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setPreviewDevice("mobile")}
                                        >
                                            <Smartphone className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={previewDevice === "tablet" ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setPreviewDevice("tablet")}
                                        >
                                            <Tablet className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setPreviewDevice("desktop")}
                                        >
                                            <Monitor className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-auto">
                                        <div
                                            className={`h-full ${
                                                previewDevice === "mobile" ? "w-[375px]" : previewDevice === "tablet" ? "w-[768px]" : "w-full"
                                            } mx-auto`}
                                        >
                                            <iframe className="h-full w-full rounded border" title="Preview" src="about:blank" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
