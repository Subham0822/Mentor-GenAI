"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Bot, ArrowLeft, Paperclip, Zap, Loader2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; image?: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [fullResponse, setFullResponse] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingText])

  // Simulated typing effect
  useEffect(() => {
    if (isTyping && fullResponse) {
      const timeout = setTimeout(() => {
        if (typingText.length < fullResponse.length) {
          setTypingText(fullResponse.substring(0, typingText.length + 1))
        } else {
          setIsTyping(false)
          setMessages((prev) => [...prev, { role: "assistant", content: fullResponse }])
          setFullResponse("")
          setTypingText("")
        }
      }, 10) // Speed of typing

      return () => clearTimeout(timeout)
    }
  }, [isTyping, typingText, fullResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile) return

    const userMessage = input
    setInput("")
    setShowSuggestions(false)

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

      // Start typing animation
      setFullResponse(response.text)
      setIsTyping(true)
      setTypingText("")
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const buttonVariant = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  }

  const suggestions = [
    { text: "What skills should I learn to become a data scientist?", icon: <Zap className="h-4 w-4" /> },
    { text: "How do I prepare for a job interview?", icon: <Sparkles className="h-4 w-4" /> },
    { text: "Find marketing jobs in New York", icon: <Sparkles className="h-4 w-4" /> },
    { text: "Analyze my resume", icon: <Paperclip className="h-4 w-4" /> },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-gray-950 text-white">
      {/* Chat interface */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="h-5 w-5 text-gray-300" />
              </motion.div>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                ></motion.div>
              </div>
              <div>
                <h1 className="font-bold text-white">Career Mentor AI</h1>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles className="h-5 w-5 text-purple-400" />
            </motion.div>
          </div>
        </header>

        {/* Chat area with animated background */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500 opacity-5"
                initial={{
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 - 50 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  x: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
                  y: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
                }}
                transition={{
                  duration: 15 + Math.random() * 30,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: Math.random() * 300 + 50 + "px",
                  height: Math.random() * 300 + 50 + "px",
                  filter: "blur(50px)",
                }}
              />
            ))}
          </div>

          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center space-y-6 relative z-10"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.div
                className="rounded-full bg-purple-900/50 p-6 border border-purple-700/50"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Sparkles className="h-12 w-12 text-purple-400" />
              </motion.div>
              <div className="space-y-2 max-w-lg">
                <h2 className="text-2xl font-bold text-white">Welcome to Career Mentor AI</h2>
                <p className="text-gray-300">
                  I'm your personal career advisor. Ask me anything about career development, resume building, job
                  searching, or interview preparation.
                </p>
              </div>

              {showSuggestions && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full mt-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInput(suggestion.text)}
                      className="p-3 text-sm text-left rounded-md border border-gray-700 bg-gray-800/70 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      variants={itemVariant}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(124, 58, 237, 0.2)" }}
                    >
                      <span className="text-purple-400">{suggestion.icon}</span>
                      <span>{suggestion.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} relative z-10`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-tr-none"
                      : "bg-gray-800/90 backdrop-blur-sm text-gray-200 rounded-tl-none border border-gray-700"
                  }`}
                >
                  {message.image && (
                    <motion.div
                      className="mb-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={message.image || "/placeholder.svg"}
                        alt="Uploaded image"
                        width={300}
                        height={200}
                        className="rounded-md max-w-full h-auto"
                      />
                    </motion.div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === "assistant" && (
                    <div className="mt-1 flex justify-end">
                      <span className="text-xs text-gray-400">Career Mentor AI</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-[80%] rounded-2xl p-4 bg-gray-800/90 backdrop-blur-sm text-gray-200 rounded-tl-none border border-gray-700 shadow-lg">
                <div className="whitespace-pre-wrap">{typingText}</div>
                <div className="inline-flex items-center h-5">
                  {typingText.length < fullResponse.length && (
                    <motion.div
                      className="flex space-x-1 ml-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="h-2 w-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      />
                    </motion.div>
                  )}
                </div>
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-gray-400">Career Mentor AI</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          {isLoading && !isTyping && (
            <motion.div
              className="flex justify-start relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-[80%] rounded-2xl p-4 bg-gray-800/90 backdrop-blur-sm text-gray-200 rounded-tl-none border border-gray-700 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-800 p-4 bg-gray-900/80 backdrop-blur-sm">
          {imagePreview && (
            <motion.div
              className="mb-2 relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative rounded-md overflow-hidden h-20 w-auto border border-gray-700">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="h-full w-auto object-cover"
                />
                <motion.button
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-1 right-1 bg-gray-900/80 text-white rounded-full p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-3 w-3" />
                </motion.button>
              </div>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <motion.button
              type="button"
              onClick={triggerImageUpload}
              className="p-3 rounded-full text-gray-400 hover:text-purple-400 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading || isTyping}
            >
              <Paperclip className="h-5 w-5" />
            </motion.button>
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about career advice, job search, or upload a resume..."
                className="w-full rounded-full border border-gray-700 bg-gray-800 py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent pr-12"
                disabled={isLoading || isTyping}
              />
              <motion.button
                type="submit"
                className="absolute right-1 top-1 p-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isTyping || (!input.trim() && !imageFile)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 