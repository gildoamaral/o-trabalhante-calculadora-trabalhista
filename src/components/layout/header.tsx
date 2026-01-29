"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calculator } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
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
      <div className="container mx-auto flex h-15 items-center justify-between px-4">

        {/* Nome */}
        <div className="flex items-center gap-4 group transition-all duration-300">

          <div className="flex items-center justify-center w-10 h-10 rounded-md transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-primary/20">
            <img src="otrabalhante.jpg" alt="O trabalhante" className='rounded-xl' />
          </div>

          <div className='flex flex-col transition-all duration-300 group-hover:translate-x-0.5'>
          
            <span className="text-lg font-semibold text-foreground leading-tight">
              O Trabalhante
            </span>

            <span className="text-sm text-secondary-foreground leading-tight">
              Calculadora Trabalhista
              </span>
          
          </div>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/ferias"
            className="px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-md transition-colors"
          >
            Ferias
          </Link>
          <Link
            href="#"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
          >
            Rescisao
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Em breve
            </Badge>
          </Link>
          <Link
            href="#"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
          >
            13o Salario
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Em breve
            </Badge>
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
