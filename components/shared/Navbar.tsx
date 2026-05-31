'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Compare', href: '/compare' },
  { label: 'Trending', href: '/trending' },
  { label: 'Reports', href: '/reports' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#05080f]/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/30 transition-all">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">SocialPulse</span>
                <span className="text-white/40 font-normal ml-1 text-sm">Intelligence</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      pathname === link.href
                        ? 'text-white bg-white/[0.08]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard">
                <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                  <BarChart2 className="w-4 h-4" />
                  Analyze Now
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white/60 hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary w-full mt-2 text-sm py-2">Analyze Now</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
