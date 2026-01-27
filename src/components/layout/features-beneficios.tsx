"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

const features = [
  {
    icon: Clock,
    text: "Cálculo instantâneo",
  },
  {
    icon: ShieldCheck,
    text: "Tabelas INSS/IRRF 2024",
  },
  {
    icon: CheckCircle2,
    text: "100% gratuito",
  },
]

export function FeaturesBeneficios() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const current = features[currentIndex]
  const Icon = current.icon

  return (
    <>
      {/* Mobile: Carrossel */}
      <div className="md:hidden mb-10">
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{current.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop: Lista estática */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-muted-foreground">
        {features.map((feature, index) => {
          const FeatureIcon = feature.icon
          return (
            <div key={index} className="flex items-center gap-2">
              <FeatureIcon className="h-4 w-4 text-primary" />
              <span>{feature.text}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
