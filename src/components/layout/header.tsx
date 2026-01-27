"use client"

import { motion } from "framer-motion"
import { Calculator } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            CalcTrab
          </span>
        </div>

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

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
