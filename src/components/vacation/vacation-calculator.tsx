"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, CalendarDays, Info } from "lucide-react"
import { differenceInDays } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { LegislationSheet } from "@/components/vacation/legislation-sheet"
import { VacationResult } from "@/components/vacation/vacation-result"
import { SalaryInput } from "@/components/vacation/salary-input"
import { SellDaysToggle } from "@/components/vacation/sell-days-toggle"
import { calcularFerias } from "@/lib/calculations/vacation"
import { parseCurrency } from "@/lib/format"
import type { VacationResult as VacationResultType } from "@/types/types"

const MAX_VACATION_DAYS = 30

export function VacationCalculator() {
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
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      Calculadora de Férias
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Calcule o valor das suas férias CLT
                    </CardDescription>
                  </div>
                </div>

                <LegislationSheet />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Salário */}
              <SalaryInput value={salario} onChange={setSalario} />

              {/* Período de Férias */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground font-medium">
                    Período de Férias
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Selecione o período das suas férias (máximo{" "}
                        {MAX_VACATION_DAYS} dias)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  maxDays={MAX_VACATION_DAYS}
                  placeholder="Selecione o período"
                />
              </div>

              {/* Vender dias */}
              <SellDaysToggle
                checked={venderDias}
                onCheckedChange={setVenderDias}
              />

              {/* Botão Calcular */}
              <CalculateButton
                onClick={handleCalculate}
                disabled={!isFormValid || isCalculating}
                isCalculating={isCalculating}
              />
            </CardContent>
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

function CalculateButton({
  onClick,
  disabled,
  isCalculating,
}: {
  onClick: () => void
  disabled: boolean
  isCalculating: boolean
}) {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full" size="lg">
      <AnimatePresence mode="wait">
        {isCalculating ? (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Calculator className="h-5 w-5" />
            </motion.div>
            Calculando...
          </motion.div>
        ) : (
          <motion.div
            key="calculate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calcular Férias
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
