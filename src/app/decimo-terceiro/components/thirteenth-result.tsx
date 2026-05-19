"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Info, Copy, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format"
import { formatDecimoTerceiroCopy } from "@/lib/format-copy-result-thirteenth-salary"
import type { DecimoTerceiroResultType } from "@/types/types"

interface ThirteenthResultProps {
  result: DecimoTerceiroResultType
}

export function ThirteenthResult({ result }: ThirteenthResultProps) {
  const [isCopied, setIsCopied] = useState(false)
  const copiedTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const copyTextToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "true")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    const success = document.execCommand("copy")
    document.body.removeChild(textarea)

    if (!success) {
      throw new Error("Falha ao copiar o resultado")
    }
  }

  const handleCopyResult = async () => {
    try {
      const formattedText = formatDecimoTerceiroCopy(result)
      await copyTextToClipboard(formattedText)
      setIsCopied(true)
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
      copiedTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-border shadow-sm overflow-hidden">
        {/* Header com valor principal */}
        <div className="bg-primary/5 border-b border-border p-6 relative">
          <div className="flex items-center justify-between ">
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleCopyResult}
              className="hover:bg-primary/20 absolute top-3 right-3 rounded-md"
              title="Copiar resultado"
            >
              {isCopied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Total líquido a receber
          </p>
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold text-primary"
          >
            {formatCurrency(result.totalLiquido)}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-2">
            {result.mesesTrabalhados === 12
              ? "13º completo (12 meses)"
              : `Proporcional a ${result.mesesTrabalhados}/12 meses`}
          </p>
          </div>
        </div>


        <CardContent className="p-6 space-y-6">

          {/* Resumo por parcelas */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Resumo por Parcelas</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">1ª Parcela</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(result.primeiraParcelaLiquida)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Até 30 de novembro</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">2ª Parcela</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(result.segundaParcela)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Até 20 de dezembro</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Proventos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-4 w-4" />
              <h4 className="font-semibold">Proventos</h4>
            </div>
            <div className="space-y-2 text-sm">
              <ResultLine
                label="13º Salário Bruto"
                value={formatCurrency(result.valorBruto)}
                delay={0.1}
              />
              {result.rendaVariavel !== undefined && result.rendaVariavel > 0 && (
                <ResultLine
                  label="Renda Variável"
                  value={formatCurrency(result.rendaVariavel)}
                  delay={0.12}
                />
              )}
              <ResultLine
                label="1ª Parcela (adiantamento, sem impostos)"
                value={formatCurrency(result.primeiraParcelaLiquida)}
                delay={0.15}
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between py-2 font-semibold"
              >
                <span className="text-foreground">Total Bruto</span>
                <span className="text-accent">{formatCurrency(result.valorBruto)}</span>
              </motion.div>
            </div>
          </div>

          <Separator />

          {/* Descontos aplicados na 2ª parcela */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <TrendingDown className="h-4 w-4" />
              <h4 className="font-semibold">Descontos (aplicados na 2ª parcela)</h4>
            </div>
            <div className="space-y-2 text-sm">
              <ResultLine
                label="INSS"
                value={`- ${formatCurrency(result.inss)}`}
                delay={0.25}
                variant="destructive"
              />
              <ResultLine
                label="IRRF"
                value={`- ${formatCurrency(result.irrf)}`}
                delay={0.3}
                variant="destructive"
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-between py-2 font-semibold"
              >
                <span className="text-foreground">Total Descontos</span>
                <span className="text-destructive">
                  - {formatCurrency(result.inss + result.irrf)}
                </span>
              </motion.div>
            </div>
          </div>

          <Separator />



          {/* Aviso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border"
          >
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Valores aproximados com base nas tabelas de INSS e IRRF de 2026. O IRRF do 13º usa
              tabela exclusiva, calculado sobre o total bruto. Consulte o RH da sua empresa para
              valores exatos.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
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
