"use client"

import { AnimatePresence, motion } from 'framer-motion'
import * as React from "react"
import { Card } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import { calcularDecimoTerceiro } from '@/lib/calculations/thirteenth-salary'
import { parseCurrency } from '@/lib/format'
import { DecimoTerceiroResultType } from '@/types/types'
import { ThirteenthCardHeader, ThirteenthCardForm, ThirteenthResult } from './components'

export default function DecimoTerceiroCalculator() {
  const [salario, setSalario] = React.useState("")
  const [meses, setMeses] = React.useState(12)
  const [result, setResult] = React.useState<DecimoTerceiroResultType | null>(null)

  const handleCalculate = () => {
    const salarioNum = parseCurrency(salario)
    if (isNaN(salarioNum) || salarioNum <= 0) return

    const resultado = calcularDecimoTerceiro(salarioNum, meses)
    setResult(resultado)
  }

  const isFormValid = !!salario && meses >= 1 && meses <= 12

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-border shadow-sm space-y-2">
            <ThirteenthCardHeader />
            <ThirteenthCardForm
              salario={salario}
              setSalario={setSalario}
              meses={meses}
              setMeses={setMeses}
              handleCalculate={handleCalculate}
              isFormValid={isFormValid}
            />
          </Card>
        </motion.div>

        {/* Resultado */}
        <AnimatePresence>
          {result && (
            <ThirteenthResult result={result} />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}