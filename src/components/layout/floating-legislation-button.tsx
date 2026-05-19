"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpen, ExternalLink } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import legislacaoFerias from "@/data/legislacao-ferias-data.json"
import legislacaoDecimoTerceiro from "@/data/legislacao-decimo-terceiro-data.json"

interface LegislacaoItem {
  titulo: string
  artigo: string
  conteudo: string
  link: string
}

const legislationData: Record<string, { title: string; description: string; items: LegislacaoItem[] }> = {
  "/ferias": {
    title: "Legislação Trabalhista - Férias",
    description: "Principais artigos da CLT e Constituição sobre férias",
    items: legislacaoFerias as LegislacaoItem[],
  },
  "/decimo-terceiro": {
    title: "Legislação Trabalhista - 13º Salário",
    description: "Principais artigos da CLT sobre 13º salário",
    items: legislacaoDecimoTerceiro as LegislacaoItem[],
  },
  "/rescisao": {
    title: "Legislação Trabalhista - Rescisão",
    description: "Principais artigos da CLT sobre rescisão",
    items: [], // Adicionar dados depois
  },
}

export function FloatingLegislationButton() {
  const pathname = usePathname()
  const legislation = legislationData[pathname]
  const [isOpen, setIsOpen] = React.useState(false)
  const hasPushedState = React.useRef(false)

  React.useEffect(() => {
    const onPopState = () => {
      if (!hasPushedState.current) return
      hasPushedState.current = false
      setIsOpen(false)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (!hasPushedState.current && window.history.state?.floatingLegislationOpen !== true) {
        window.history.pushState({ ...(window.history.state ?? {}), floatingLegislationOpen: true }, '', window.location.href)
        hasPushedState.current = true
      }
      setIsOpen(true)
      return
    }

    if (hasPushedState.current) {
      // go back to consume the pushed history entry
      window.history.back()
      return
    }

    setIsOpen(false)
  }

  if (!legislation || legislation.items.length === 0) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 cursor-pointer  right-6 h-14 w-14 rounded-full z-50"
          aria-label="Ver legislação "
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg px-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {legislation.title}
          </SheetTitle>
          <SheetDescription>
            {legislation.description}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full overflow-y-auto">
          <div className="space-y-4 pb-6">
            {legislation.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">
                    {item.titulo}
                  </h4>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      onClick={() => {
                        hasPushedState.current = false
                        setIsOpen(false)
                      }}
                    >
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap flex items-center gap-1 hover:bg-primary/20 transition-colors">
                        {item.artigo}
                        <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </span>
                    </a>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                      {item.artigo}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.conteudo}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
