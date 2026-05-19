"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const base = 'px-3 py-2 text-sm font-medium rounded-md transition-colors'
    const active = pathname?.startsWith(href)
      ? 'text-primary bg-primary/5'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    return `${base} ${active}`
  }

  const logoSrc = isMounted && resolvedTheme === "dark"
    ? "/logo-subtitulo-dark.svg"
    : "/logo-subtitulo.svg"

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4}}
      className={`sticky top-0 z-50 w-full border-b ${
        isScrolled 
          ? 'border-border/40 bg-background/70 backdrop-blur-md shadow-sm' 
          : 'border-border bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="w-full lg:container lg:mx-auto flex h-15 items-center justify-between px-4">

        <Link href="/" className="flex items-center">
          <img
            src={logoSrc}
            alt="O Trabalhante - Calculos Trabalhistas"
            className="h-10 w-auto"
          />
        </Link>


        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link href="/ferias" className={linkClass('/ferias')}>
            Ferias
          </Link>
          <Link href="/rescisao" className={`${linkClass('/rescisao')} flex items-center gap-2`}>
            Rescisao
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Em breve
            </Badge>
          </Link>
          <Link href="/decimo-terceiro" className={linkClass('/decimo-terceiro')}>
            13º Salário
          </Link>
        </nav>

        {/* Toggle */}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
