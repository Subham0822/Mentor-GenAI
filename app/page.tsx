"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Upload, Briefcase, ArrowRight, Bot, Star, Zap, BookOpen } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-gray-950 text-white">
      {/* Hero Section with animated background */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => {
            const baseSize = 100 + (i % 5) * 50
            const xOffset = ((i * 5) % 100) - 50
            const yOffset = ((i * 7) % 100) - 50
            const scale = 0.5 + (i % 5) * 0.1
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500 opacity-20"
                initial={{
                  x: `${xOffset}%`,
                  y: `${yOffset}%`,
                  scale: scale,
                }}
                animate={{
                  x: [`${xOffset}%`, `${(xOffset + 10) % 100 - 50}%`, `${xOffset}%`],
                  y: [`${yOffset}%`, `${(yOffset + 10) % 100 - 50}%`, `${yOffset}%`],
                }}
                transition={{
                  duration: 15 + (i % 5) * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: `${baseSize}px`,
                  height: `${baseSize}px`,
                  filter: "blur(50px)",
                }}
              />
            )
          })}
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div
              className="inline-block rounded-lg bg-purple-900/50 backdrop-blur-sm px-3 py-1 text-sm text-purple-200 border border-purple-700/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              AI-Powered Career Guidance
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Career Mentor AI
            </motion.h1>
            <motion.p
              className="max-w-[700px] text-gray-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your personal AI career advisor. Get expert guidance, resume analysis, and job recommendations in seconds.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a
                href="#chatbot"
                className="inline-flex h-12 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 border border-purple-500/20"
                variants={buttonVariant}
                whileHover="hover"
                whileTap="tap"
              >
                Try Now <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-8 text-sm font-medium shadow-lg shadow-black/20 transition-all hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-600"
                variants={buttonVariant}
                whileHover="hover"
                whileTap="tap"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                  Powerful Features
                </h2>
              </motion.div>
              <motion.p
                className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Everything you need to advance your career journey
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-500/30"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-purple-900/50 p-3 border border-purple-700/50"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="h-6 w-6 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Career Guidance</h3>
              <p className="text-gray-400 text-center">
                Get personalized advice on career paths, skill development, and professional growth.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-cyan-900/50 p-3 border border-cyan-700/50"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Upload className="h-6 w-6 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Resume Analysis</h3>
              <p className="text-gray-400 text-center">
                Upload your resume for instant feedback and improvement suggestions.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-4 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-blue-900/50 p-3 border border-blue-700/50"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Briefcase className="h-6 w-6 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Job Search</h3>
              <p className="text-gray-400 text-center">
                Find relevant job opportunities based on your skills and preferences.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section id="chatbot" className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <motion.h2
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Chat with Career Mentor AI
              </motion.h2>
              <motion.p
                className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ask questions, get career advice, or upload your resume for analysis
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl w-full bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col h-[600px]">
              <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Career Mentor AI
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                {messages.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <motion.div
                      className="rounded-full bg-purple-900/50 p-4 border border-purple-700/50"
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
                      <Sparkles className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <p className="text-lg font-medium">How can I help with your career today?</p>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto w-full"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        onClick={() => setInput("What skills should I learn to become a data scientist?")}
                        className="p-2 text-sm text-left rounded-md border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
                        variants={itemVariant}
                        whileHover={{ scale: 1.02 }}
                      >
                        Skills for data science
                      </motion.button>
                      <motion.button
                        onClick={() => setInput("How do I prepare for a job interview?")}
                        className="p-2 text-sm text-left rounded-md border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
                        variants={itemVariant}
                        whileHover={{ scale: 1.02 }}
                      >
                        Interview preparation
                      </motion.button>
                      <motion.button
                        onClick={() => setInput("Find marketing jobs in New York")}
                        className="p-2 text-sm text-left rounded-md border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
                        variants={itemVariant}
                        whileHover={{ scale: 1.02 }}
                      >
                        Find marketing jobs
                      </motion.button>
                      <motion.button
                        onClick={() => triggerImageUpload()}
                        className="p-2 text-sm text-left rounded-md border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors"
                        variants={itemVariant}
                        whileHover={{ scale: 1.02 }}
                      >
                        Analyze my resume
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-tr-none"
                              : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                          }`}
                        >
                          {message.image && (
                            <motion.div
                              className="mb-2"
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
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="max-w-[80%] rounded-lg p-4 bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700">
                      <div className="flex space-x-2">
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
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-800 p-4 bg-gray-900">
                {imagePreview && (
                  <motion.div
                    className="mb-2 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md h-20 w-auto object-cover"
                    />
                    <motion.button
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                )}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-2 text-gray-400 hover:text-purple-400 focus:outline-none transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Upload className="h-5 w-5" />
                  </motion.button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about career advice, job search, or upload a resume..."
                    className="flex-1 rounded-md border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    className="p-2 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || (!input.trim() && !imageFile)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Features Section */}
      <motion.section
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose Career Mentor AI
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-purple-900/50 p-3 border border-purple-700/50"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Zap className="h-6 w-6 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Instant Feedback</h3>
              <p className="text-gray-400">Get immediate insights and advice without waiting for human feedback.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-cyan-900/50 p-3 border border-cyan-700/50"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star className="h-6 w-6 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Personalized Advice</h3>
              <p className="text-gray-400">
                Tailored guidance based on your unique skills, experience, and career goals.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-sm"
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="rounded-full bg-blue-900/50 p-3 border border-blue-700/50"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BookOpen className="h-6 w-6 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Industry Insights</h3>
              <p className="text-gray-400">Stay updated with the latest trends and requirements in your industry.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-950 text-white border-t border-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex space-x-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                variants={itemVariant}
                whileHover={{ y: -2 }}
              >
                About
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                variants={itemVariant}
                whileHover={{ y: -2 }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                variants={itemVariant}
                whileHover={{ y: -2 }}
              >
                Terms
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                variants={itemVariant}
                whileHover={{ y: -2 }}
              >
                Contact
              </motion.a>
            </motion.div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Career Mentor AI. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </main>
  )
}
