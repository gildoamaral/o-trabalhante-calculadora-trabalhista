"use client"

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Card } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import { calcularRescisao } from '@/lib/calculations/rescisao'
import { parseCurrency } from '@/lib/format'
import type { FormaAvisoPrevio, FormaRescisao, RescisaoResultType } from '@/types/types'
import { RescisaoCardForm, RescisaoCardHeader, RescisaoResult } from './components'

export default function RescisaoCalculator() {
  const [salario, setSalario] = React.useState('')
  const [dataAdmissao, setDataAdmissao] = React.useState('')
  const [dataRescisao, setDataRescisao] = React.useState('')
  const [formaAvisoPrevio, setFormaAvisoPrevio] = React.useState<FormaAvisoPrevio>('trabalhado')
  const [formaRescisao, setFormaRescisao] = React.useState<FormaRescisao>('sem-justa-causa')
  const [feriasVencidas, setFeriasVencidas] = React.useState(false)
  const [numeroDependentes, setNumeroDependentes] = React.useState(0)
  const [adiantamentoDecimoTerceiro, setAdiantamentoDecimoTerceiro] = React.useState(false)
  const [result, setResult] = React.useState<RescisaoResultType | null>(null)
  const resultSectionRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!result) {
      return
    }

    window.requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [result])

  const handleCalculate = () => {
    const salarioNum = parseCurrency(salario)

    if (
      Number.isNaN(salarioNum) ||
      salarioNum <= 0 ||
      !dataAdmissao ||
      !dataRescisao ||
      dataRescisao < dataAdmissao
    ) {
      return
    }

    const resultado = calcularRescisao(
      salarioNum,
      dataAdmissao,
      dataRescisao,
      formaAvisoPrevio,
      formaRescisao,
      feriasVencidas,
      numeroDependentes,
      adiantamentoDecimoTerceiro,
    )

    setResult(resultado)
  }

  const isFormValid =
    !!salario &&
    !!dataAdmissao &&
    !!dataRescisao &&
    dataRescisao >= dataAdmissao

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="border-border shadow-sm space-y-2">
            <RescisaoCardHeader />
            <RescisaoCardForm
              salario={salario}
              setSalario={setSalario}
              dataAdmissao={dataAdmissao}
              setDataAdmissao={setDataAdmissao}
              dataRescisao={dataRescisao}
              setDataRescisao={setDataRescisao}
              formaAvisoPrevio={formaAvisoPrevio}
              setFormaAvisoPrevio={setFormaAvisoPrevio}
              formaRescisao={formaRescisao}
              setFormaRescisao={setFormaRescisao}
              feriasVencidas={feriasVencidas}
              setFeriasVencidas={setFeriasVencidas}
              numeroDependentes={numeroDependentes}
              setNumeroDependentes={setNumeroDependentes}
              adiantamentoDecimoTerceiro={adiantamentoDecimoTerceiro}
              setAdiantamentoDecimoTerceiro={setAdiantamentoDecimoTerceiro}
              handleCalculate={handleCalculate}
              isFormValid={isFormValid}
            />
          </Card>
        </motion.div>

        <AnimatePresence>
          {result && (
            <div ref={resultSectionRef} className="scroll-mt-24">
              <RescisaoResult result={result} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
