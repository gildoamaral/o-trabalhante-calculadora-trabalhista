"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Info } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"
import type { VacationResultType } from "@/types/types"

interface VacationResultProps {
  /** Resultado do cálculo de férias */
  result: VacationResultType
  /** Período de férias selecionado */
  dateRange?: DateRange
  /** Número de dias de férias */
  diasFerias: number
}

/**
 * Componente que exibe o resultado detalhado do cálculo de férias
 */
export function VacationResult({
  result,
  dateRange,
  diasFerias,
}: VacationResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-border shadow-sm overflow-hidden">
        {/* Header com valor principal */}
        <ResultHeader
          totalLiquido={result.totalLiquido}
          dateRange={dateRange}
          diasFerias={diasFerias}
        />

        <CardContent className="p-6 space-y-6">
          {/* Proventos */}
          <ProventosSection result={result} />

          <Separator />

          {/* Descontos */}
          <DescontosSection result={result} />

          {/* Aviso */}
          <DisclaimerNote />
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ResultHeader({
  totalLiquido,
  dateRange,
  diasFerias,
}: {
  totalLiquido: number
  dateRange?: DateRange
  diasFerias: number
}) {
  return (
    <div className="bg-primary/5 border-b border-border p-6 text-center">
      <p className="text-sm text-muted-foreground mb-1">
        Valor líquido a receber
      </p>
      <motion.p
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="text-4xl font-bold text-primary"
      >
        {formatCurrency(totalLiquido)}
      </motion.p>
      {dateRange?.from && dateRange?.to && (
        <p className="text-sm text-muted-foreground mt-2">
          {format(dateRange.from, "dd/MM/yyyy")} a{" "}
          {format(dateRange.to, "dd/MM/yyyy")} ({diasFerias} dias)
        </p>
      )}
    </div>
  )
}

function ProventosSection({ result }: { result: VacationResultType }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-accent">
        <TrendingUp className="h-4 w-4" />
        <h4 className="font-semibold">Proventos</h4>
      </div>
      <div className="space-y-2 text-sm">
        <ResultLine
          label={`Férias (${result.diasFerias} dias)`}
          value={formatCurrency(result.valorFerias)}
          delay={0.1}
        />
        <ResultLine
          label="1/3 Constitucional"
          value={formatCurrency(result.tercoConstitucional)}
          delay={0.15}
        />
        {result.abonoPecuniario > 0 && (
          <>
            <ResultLine
              label="Abono Pecuniário (10 dias)"
              value={formatCurrency(result.abonoPecuniario)}
              delay={0.2}
            />
            <ResultLine
              label="1/3 sobre Abono"
              value={formatCurrency(result.tercoAbono)}
              delay={0.25}
            />
          </>
        )}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between py-2 font-semibold"
        >
          <span className="text-foreground">Total Bruto</span>
          <span className="text-accent">{formatCurrency(result.totalBruto)}</span>
        </motion.div>
      </div>
    </div>
  )
}

function DescontosSection({ result }: { result: VacationResultType }) {
  const totalDescontos = result.inss + result.irrf

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-destructive">
        <TrendingDown className="h-4 w-4" />
        <h4 className="font-semibold">Descontos</h4>
      </div>
      <div className="space-y-2 text-sm">
        <ResultLine
          label="INSS"
          value={`- ${formatCurrency(result.inss)}`}
          delay={0.35}
          variant="destructive"
        />
        <ResultLine
          label="IRRF"
          value={`- ${formatCurrency(result.irrf)}`}
          delay={0.4}
          variant="destructive"
        />
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="flex justify-between py-2 font-semibold"
        >
          <span className="text-foreground">Total Descontos</span>
          <span className="text-destructive">
            - {formatCurrency(totalDescontos)}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

function ResultLine({
  label,
  value,
  delay,
  variant = "default",
}: {
  label: string
  value: string
  delay: number
  variant?: "default" | "destructive"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex justify-between py-2 border-b border-border/50"
    >
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          variant === "destructive"
            ? "text-destructive font-medium"
            : "text-foreground font-medium"
        }
      >
        {value}
      </span>
    </motion.div>
  )
}

function DisclaimerNote() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border"
    >
      <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <p className="text-xs text-muted-foreground">
        Valores aproximados com base nas tabelas de INSS e IRRF de 2024.
        Consulte o RH da sua empresa para valores exatos.
      </p>
    </motion.div>
  )
}
