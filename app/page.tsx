"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Upload, Briefcase, ArrowRight, Bot } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; image?: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile) return

    const userMessage = input
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage, image: imagePreview || undefined }])
    setIsLoading(true)

    try {
      let response

      if (imageFile) {
        // Handle image upload
        const formData = new FormData()
        formData.append("message", userMessage)
        formData.append("image", imageFile)

        const res = await fetch("/api/analyze-image", {
          method: "POST",
          body: formData,
        })

        response = await res.json()
        setImageFile(null)
        setImagePreview(null)
      } else {
        // Handle text message
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
          }),
        })

        response = await res.json()
      }

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response.text }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700">
              AI-Powered Career Guidance
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Career Mentor AI
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Your personal AI career advisor. Get expert guidance, resume analysis, and job recommendations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="#chatbot"
                className="inline-flex h-12 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-700"
              >
                Try Now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Everything you need to advance your career journey
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-purple-100 p-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Career Guidance</h3>
              <p className="text-gray-500 text-center">
                Get personalized advice on career paths, skill development, and professional growth.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-blue-100 p-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Resume Analysis</h3>
              <p className="text-gray-500 text-center">
                Upload your resume for instant feedback and improvement suggestions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Job Search</h3>
              <p className="text-gray-500 text-center">
                Find relevant job opportunities based on your skills and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section id="chatbot" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Chat with Career Mentor AI
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Ask questions, get career advice, or upload your resume for analysis
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="flex flex-col h-[600px]">
              <div className="bg-purple-600 text-white p-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Career Mentor AI
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
                    <div className="rounded-full bg-purple-100 p-4">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-lg font-medium">How can I help with your career today?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto w-full">
                      <button
                        onClick={() => setInput("What skills should I learn to become a data scientist?")}
                        className="p-2 text-sm text-left rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        Skills for data science
                      </button>
                      <button
                        onClick={() => setInput("How do I prepare for a job interview?")}
                        className="p-2 text-sm text-left rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        Interview preparation
                      </button>
                      <button
                        onClick={() => setInput("Find marketing jobs in New York")}
                        className="p-2 text-sm text-left rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        Find marketing jobs
                      </button>
                      <button
                        onClick={() => triggerImageUpload()}
                        className="p-2 text-sm text-left rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        Analyze my resume
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-purple-600 text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {message.image && (
                          <div className="mb-2">
                            <Image
                              src={message.image || "/placeholder.svg"}
                              alt="Uploaded image"
                              width={300}
                              height={200}
                              className="rounded-md max-w-full h-auto"
                            />
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800 rounded-tl-none">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4">
                {imagePreview && (
                  <div className="mb-2 relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md h-20 w-auto object-cover"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-2 text-gray-500 hover:text-purple-600 focus:outline-none"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about career advice, job search, or upload a resume..."
                    className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                    disabled={isLoading || (!input.trim() && !imageFile)}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Career Mentor AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
