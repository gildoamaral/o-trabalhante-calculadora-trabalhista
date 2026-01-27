"use client"
import { AnimatePresence, motion } from 'framer-motion'
import * as React from "react"
import { VacationCardForm, VacationCardHeader, VacationResult } from './components'
import { Card } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import { calcularFerias } from '@/lib/calculations/vacation'
import { parseCurrency } from '@/lib/format'
import { differenceInDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { VacationResultType } from '@/types/types'



const MAX_VACATION_DAYS = 30

export default function VacationCalculator() {
  const [salario, setSalario] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [venderDias, setVenderDias] = React.useState(false)
  const [result, setResult] = React.useState<VacationResultType | null>(null)
  const [isCalculating, setIsCalculating] = React.useState(false)
  const diasFerias = React.useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInDays(dateRange.to, dateRange.from) + 1
    }
    return 0
  }, [dateRange])

  const handleCalculate = () => {
    const salarioNum = parseCurrency(salario)
    if (isNaN(salarioNum) || salarioNum <= 0 || diasFerias === 0) return

    setIsCalculating(true)

    // Pequeno delay para feedback visual
    setTimeout(() => {
      const resultado = calcularFerias(salarioNum, diasFerias, venderDias)
      setResult(resultado)
      setIsCalculating(false)
    }, 600)
  }

  const isFormValid = salario && diasFerias > 0



  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-border shadow-sm">
            <VacationCardHeader />
            <VacationCardForm
              salario={salario}
              setSalario={setSalario}
              dateRange={dateRange}
              setDateRange={setDateRange}
              venderDias={venderDias}
              setVenderDias={setVenderDias}
              handleCalculate={handleCalculate}
              isFormValid={!!isFormValid}
              isCalculating={isCalculating}
              maxVacationDays={MAX_VACATION_DAYS}
            />
          </Card>
        </motion.div>

        {/* Resultado */}
        <AnimatePresence>
          {result && (
            <VacationResult
              result={result}
              dateRange={dateRange}
              diasFerias={diasFerias}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

