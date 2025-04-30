"use client"
import { Sparkles, ArrowRight, Star, Zap, BookOpen, MessageSquare, Briefcase, Upload } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"

export default function Home() {
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

  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Floating animation for the chat preview
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-purple-950 to-gray-950 text-white">
      {/* Hero Section with animated background */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500 opacity-20"
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

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="flex flex-col space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              style={{ y: y1, opacity }}
            >
              <motion.div
                className="inline-block rounded-lg bg-purple-900/50 backdrop-blur-sm px-3 py-1 text-sm text-purple-200 border border-purple-700/50 w-fit"
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
                Your personal AI career advisor. Get expert guidance, resume analysis, and job recommendations in
                seconds.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/chat">
                  <motion.div
                    className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-purple-700 px-8 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 border border-purple-500/20"
                    variants={buttonVariant}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Chat Now <MessageSquare className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
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

            <motion.div className="relative" style={{ y: y2 }} animate={floatingAnimation}>
              <div className="relative mx-auto w-full max-w-md">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/90 to-gray-900/90 p-2 shadow-2xl ring-1 ring-gray-700/80">
                  <div className="flex items-center justify-between rounded-lg bg-gray-950 px-4 py-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400">Career Mentor AI</div>
                    <div className="w-16"></div>
                  </div>
                  <div className="h-full rounded-lg bg-gray-900 p-4 overflow-hidden">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg bg-purple-600 p-3 text-sm text-white">
                          I need help with my resume for a UX design position.
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg bg-gray-800 p-3 text-sm text-gray-200 border border-gray-700">
                          <div className="animate-pulse mb-1 h-2 w-12 bg-purple-400/50 rounded"></div>
                          I'd be happy to help with your UX design resume! For this role, highlight your design process,
                          tools you're proficient with, and any user research experience.
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg bg-purple-600 p-3 text-sm text-white">
                          What skills should I emphasize?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg bg-gray-800 p-3 text-sm text-gray-200 border border-gray-700">
                          <div className="animate-pulse mb-1 h-2 w-16 bg-purple-400/50 rounded"></div>
                          Focus on: UI/UX tools (Figma, Adobe XD), prototyping, user testing, accessibility knowledge,
                          and collaboration skills.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 blur-2xl opacity-70"></div>
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 blur-2xl opacity-70"></div>
              </div>
            </motion.div>
          </div>
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

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-900/40 to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Accelerate Your Career?
            </motion.h2>
            <motion.p
              className="max-w-[700px] text-gray-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start chatting with Career Mentor AI today and get personalized guidance for your professional journey.
            </motion.p>
            <Link href="/chat">
              <motion.div
                className="inline-flex h-14 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-purple-700 px-12 text-base font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 border border-purple-500/20"
                variants={buttonVariant}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </Link>
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
