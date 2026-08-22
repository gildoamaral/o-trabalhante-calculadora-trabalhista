"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, TrendingDown, TrendingUp, Info } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import { formatRescisaoCopy } from '@/lib/format-copy-result-rescisao'
import type { RescisaoResultType } from '@/types/types'

interface RescisaoResultProps {
  result: RescisaoResultType
}

export function RescisaoResult({ result }: RescisaoResultProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  const copiedTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
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

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    const success = document.execCommand('copy')
    document.body.removeChild(textarea)

    if (!success) {
      throw new Error('Falha ao copiar o resultado')
    }
  }

  const handleCopyResult = async () => {
    try {
      const formattedText = formatRescisaoCopy(result)
      await copyTextToClipboard(formattedText)
      setIsCopied(true)

      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }

      copiedTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="bg-primary/5 border-b border-border p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleCopyResult}
              className="hover:bg-primary/20 absolute top-3 right-3 rounded-md"
              title="Copiar resultado"
            >
              {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total líquido estimado</p>
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-4xl font-bold text-primary"
            >
              {formatCurrency(result.totalLiquido)}
            </motion.p>
            <p className="text-sm text-muted-foreground mt-2">
              {result.formaRescisao === 'justa-causa'
                ? 'Rescisão por justa causa'
                : 'Rescisão com verbas proporcionais'}
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <ResumoSection result={result} />

          <Separator />

          <DescontosSection result={result} />

          <Separator />

          <DisclaimerNote />
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ResumoSection({ result }: { result: RescisaoResultType }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-accent">
        <TrendingUp className="h-4 w-4" />
        <h4 className="font-semibold">Proventos</h4>
      </div>
      <div className="space-y-2 text-sm">
        <ResultLine label="Saldo de salário" value={formatCurrency(result.saldoSalario)} delay={0.1} />
        {result.avisoPrevioProvento > 0 && (
          <ResultLine label="Aviso prévio" value={formatCurrency(result.avisoPrevioProvento)} delay={0.14} />
        )}
        {result.feriasVencidasValor > 0 && (
          <ResultLine label="Férias vencidas" value={formatCurrency(result.feriasVencidasValor)} delay={0.18} />
        )}
        {result.feriasProporcionais > 0 && (
          <ResultLine label={`Férias proporcionais (${result.mesesProporcionais} meses)`} value={formatCurrency(result.feriasProporcionais)} delay={0.22} />
        )}
        {result.decimoTerceiroProporcional > 0 && (
          <ResultLine label={`13º proporcional (${result.mesesDecimoTerceiro} meses)`} value={formatCurrency(result.decimoTerceiroProporcional)} delay={0.26} />
        )}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between py-2 font-semibold"
        >
          <span className="text-foreground">Total Proventos</span>
          <span className="text-accent">{formatCurrency(result.totalProventos)}</span>
        </motion.div>
      </div>
    </div>
  )
}

function DescontosSection({ result }: { result: RescisaoResultType }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-destructive">
        <TrendingDown className="h-4 w-4" />
        <h4 className="font-semibold">Descontos</h4>
      </div>
      <div className="space-y-2 text-sm">
        <ResultLine label="INSS" value={`- ${formatCurrency(result.inss)}`} delay={0.34} variant="destructive" />
        <ResultLine label="IRRF" value={`- ${formatCurrency(result.irrf)}`} delay={0.38} variant="destructive" />
        {result.avisoPrevioDesconto > 0 && (
          <ResultLine label="Aviso prévio descontado" value={`- ${formatCurrency(result.avisoPrevioDesconto)}`} delay={0.42} variant="destructive" />
        )}
        {result.descontoAdiantamentoDecimoTerceiro > 0 && (
          <ResultLine label="Adiantamento do 13º" value={`- ${formatCurrency(result.descontoAdiantamentoDecimoTerceiro)}`} delay={0.46} variant="destructive" />
        )}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between py-2 font-semibold"
        >
          <span className="text-foreground">Total Descontos</span>
          <span className="text-destructive">- {formatCurrency(result.totalDescontos)}</span>
        </motion.div>
      </div>
    </div>
  )
}

function DisclaimerNote() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border"
    >
      <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <p className="text-xs text-muted-foreground">
        Cálculo estimado com base nas verbas mais comuns da rescisão trabalhista. O aviso prévio,
        férias e 13º podem variar conforme o tipo de desligamento e a convenção aplicável.
      </p>
    </motion.div>
  )
}

function ResultLine({
  label,
  value,
  delay,
  variant = 'default',
}: {
  label: string
  value: string
  delay: number
  variant?: 'default' | 'destructive'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex justify-between py-2 border-b border-border/50"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={variant === 'destructive' ? 'text-destructive font-medium' : 'text-foreground font-medium'}>
        {value}
      </span>
    </motion.div>
  )
}