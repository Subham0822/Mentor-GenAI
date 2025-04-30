"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Bot, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Career Mentor AI</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <motion.span
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Home
            </motion.span>
          </Link>
          <Link href="/chat">
            <motion.span
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Chat
            </motion.span>
          </Link>
          <Link href="#">
            <motion.span
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Features
            </motion.span>
          </Link>
          <Link href="#">
            <motion.span
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              About
            </motion.span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatedMobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </header>
  )
}

function AnimatedMobileMenu({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  return (
    <motion.div
      className="md:hidden"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { opacity: 1, height: "auto" },
        closed: { opacity: 0, height: 0 },
      }}
    >
      <div className="px-4 py-3 space-y-1 bg-gray-900 border-t border-gray-800">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <motion.div
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </motion.div>
        </Link>
        <Link href="/chat" onClick={() => setIsOpen(false)}>
          <motion.div
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Chat
          </motion.div>
        </Link>
        <Link href="#" onClick={() => setIsOpen(false)}>
          <motion.div
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Features
          </motion.div>
        </Link>
        <Link href="#" onClick={() => setIsOpen(false)}>
          <motion.div
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
