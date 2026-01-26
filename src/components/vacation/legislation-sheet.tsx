"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

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

interface LegislacaoItem {
  titulo: string
  artigo: string
  conteudo: string
}

/**
 * Sheet lateral com informações sobre legislação trabalhista de férias
 */
export function LegislationSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Legislação</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Legislação Trabalhista
          </SheetTitle>
          <SheetDescription>
            Principais artigos da CLT e Constituição sobre férias
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
          <div className="space-y-4">
            {(legislacaoFerias as LegislacaoItem[]).map((item, index) => (
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
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                    {item.artigo}
                  </span>
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
