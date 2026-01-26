"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { VacationCalculator } from "@/components/vacation"
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Calculadora de Verbas Trabalhistas
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Calcule o valor das suas ferias CLT de forma simples e precisa. 
            Baseado na legislacao trabalhista brasileira.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Calculo instantaneo</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Tabelas INSS/IRRF 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>100% gratuito</span>
          </div>
        </motion.div>

        {/* Calculator */}
        <VacationCalculator />

        {/* Footer info */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center border-t border-border pt-8"
        >
          <p className="text-sm text-muted-foreground">
            Desenvolvido com base na legislacao CLT brasileira.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Os valores apresentados sao estimativas. Consulte o RH da sua empresa para valores exatos.
          </p>
        </motion.footer>
      </main>
    </div>
  )
}
