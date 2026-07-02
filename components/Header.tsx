"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const NavLinks = () => (
    <>
      <Link
        href="/tutorials"
        className="font-medium hover:text-primary transition-colors px-2 py-1"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Tutorials
      </Link>
      <Link
        href="/dashboard"
        className="font-medium hover:text-primary transition-colors px-2 py-1"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-variant bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary">
              Tutorial Platform
            </Link>
            <nav className="hidden md:flex gap-6">
              <NavLinks />
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              className="md:hidden p-2 text-on-surface hover:bg-surface-variant rounded-md"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-surface flex flex-col p-4 border-t border-surface-variant overflow-y-auto">
          <nav className="flex flex-col gap-4 text-lg">
            <NavLinks />
          </nav>
        </div>
      )}
    </header>
  )
}
