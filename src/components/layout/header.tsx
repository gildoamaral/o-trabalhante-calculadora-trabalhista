"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const hasPushedMenuState = useRef(false)
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

  const menuIconColor = resolvedTheme === 'dark' ? '#ffffff' : 'oklch(0.40 0.01 240)'

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      if (!hasPushedMenuState.current) {
        return
      }

      hasPushedMenuState.current = false
      setIsMobileMenuOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleMobileMenuOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (!hasPushedMenuState.current && window.history.state?.mobileMenuOpen !== true) {
        window.history.pushState(
          { ...(window.history.state ?? {}), mobileMenuOpen: true },
          '',
          window.location.href,
        )
        hasPushedMenuState.current = true
      }

      setIsMobileMenuOpen(true)
      return
    }

    if (hasPushedMenuState.current) {
      window.history.back()
      return
    }

    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 w-full border-b ${isScrolled
          ? 'border-border/40 bg-background/70 backdrop-blur-md shadow-sm'
          : 'border-border bg-background/95 backdrop-blur-sm'
        }`}
    >
      <div className="w-full lg:container lg:mx-auto flex h-16 items-center justify-between px-4">

        {/* Left: Logo */}
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
          <Link href="/rescisao" className={linkClass('/rescisao')}>
            Rescisao
          </Link>
          <Link href="/decimo-terceiro" className={linkClass('/decimo-terceiro')}>
            13º Salário
          </Link>
        </nav>

        {/* Right: desktop ThemeToggle + mobile hamburger (opens sheet from right) */}
        <div className="flex items-center ml-auto">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuOpenChange}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 md:hidden active:bg-transparent focus:bg-transparent hover:bg-muted">
                <Menu className="size-7" color={menuIconColor} />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader className='border-b'>
                <SheetTitle className='text-lg'>O Trabalhante</SheetTitle>
                <SheetDescription>Escolha sua calculadora</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                <Link
                  href="/ferias"
                  className={linkClass('/ferias')}
                  onClick={() => {
                    hasPushedMenuState.current = false
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Ferias
                </Link>
                <Link
                  href="/rescisao"
                  className={linkClass('/rescisao')}
                  onClick={() => {
                    hasPushedMenuState.current = false
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Rescisao
                </Link>
                <Link
                  href="/decimo-terceiro"
                  className={linkClass('/decimo-terceiro')}
                  onClick={() => {
                    hasPushedMenuState.current = false
                    setIsMobileMenuOpen(false)
                  }}
                >
                  13º Salário
                </Link>
              </div>
              <SheetFooter className='py-8'>
                <div className="w-full flex justify-end">
                  <div className="flex items-center bg-muted rounded-md">
                    <ThemeToggle />
                  </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
