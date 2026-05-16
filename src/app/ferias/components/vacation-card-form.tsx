import { CalculateButton } from '@/components/features/calculate-button'
import { LabelWithTooltip } from '@/components/ui/label-with-tooltip'
import { CardContent } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { formatCurrencyInput } from '@/lib/format'
import { DateRange } from 'react-day-picker'
import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface VacationCardFormProps {
  salario: string
  setSalario: (value: string) => void
  dateRange: DateRange | undefined
  setDateRange: (value: DateRange | undefined) => void
  venderDias: boolean
  setVenderDias: (value: boolean) => void
  numeroDependentes: number
  setNumeroDependentes: (value: number) => void
  rendaVariavel?: string
  setRendaVariavel?: (value: string) => void
  handleCalculate: () => void
  isFormValid: boolean
  maxVacationDays: number
}

export function VacationCardForm({
  salario,
  setSalario,
  dateRange,
  setDateRange,
  venderDias,
  setVenderDias,
  numeroDependentes,
  setNumeroDependentes,
  rendaVariavel,
  setRendaVariavel,
  handleCalculate,
  isFormValid,
  maxVacationDays,
}: VacationCardFormProps) {
  const [openOptions, setOpenOptions] = React.useState(false)
  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setSalario(formatted)
  }

  const handleDependentesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value)

    if (value < 0) {
      setNumeroDependentes(0)
      return
    }

    setNumeroDependentes(value)
  }

  const handleRendaVariavelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setRendaVariavel?.(formatted)
  }

  return (
    <CardContent className="space-y-5">

      {/* Salário */}
      <div className="space-y-2">
        <LabelWithTooltip
          label="Salário Bruto"
          tooltipText="Salário bruto mensal, sem benefícios ou descontos. Este valor é a base para o cálculo das férias."
          htmlFor="salario"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            R$
          </span>
          <Input
            id="salario"
            type="text"
            placeholder="0,00"
            value={salario}
            onChange={handleSalarioChange}
            className="pl-10"
          />
        </div>

      </div>

      {/* Período de Férias */}
      <div className="space-y-2">

        <LabelWithTooltip
          label="Período de Férias"
          tooltipText={`Selecione o período das suas férias. O máximo permitido é de ${maxVacationDays} dias.`}
          htmlFor="date-range"
        />

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDays={maxVacationDays}
          placeholder="Selecione o período"
        />
      </div>


      {/* Menu */}
      <div>
        <button
          type="button"
          className="w-full flex items-center justify-between py-1 px-1 text-sm font-medium text-foreground hover:cursor-pointer hover:bg-muted/30"
          onClick={() => setOpenOptions((v) => !v)}
          aria-expanded={openOptions}
        >
          <span >Opções adicionais</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${openOptions ? 'rotate-180' : ''}`} />
        </button>

        <hr className="border-border" />

        <AnimatePresence>
          {openOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col py-2 bg-muted/80">
                {/* Vender dias */}
                <div className="flex items-center justify-between p-2 mb-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Vender dias de férias"
                      tooltipText="Ative esta opção se deseja vender 1/3 dos seus dias de férias (abono pecuniário)."
                      htmlFor="vender"
                    />
                  </div>
                  <Switch id="vender" checked={venderDias} onCheckedChange={setVenderDias} />
                </div>

                {/* Dependentes */}
                <div className="flex flex-col space-y-2 p-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Dependentes"
                      tooltipText="Quantidade de dependentes utilizados para dedução do IRRF."
                      htmlFor="dependentes"
                    />
                  </div>

                  <div className="">
                    <Input
                      id="dependentes"
                      type="number"
                      min={0}
                      className='bg-foreground/10 hover:bg-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/20'
                      value={numeroDependentes}
                      onChange={handleDependentesChange}
                    />
                  </div>
                </div>
                {/* Renda Variável (extra dentro da área) */}
                <div className="flex flex-col p-2 space-y-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Renda Variável"
                      tooltipText="Rendimentos variáveis (comissões, bônus). Coloque a média recebida mensalmente."
                      htmlFor="renda-variavel-extra"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <Input
                      id="renda-variavel-extra"
                      type="text"
                      placeholder="0,00"
                      className="pl-10 bg-foreground/10 hover:bg-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/20"
                      value={rendaVariavel}
                      onChange={handleRendaVariavelChange}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão Calcular */}
      <CalculateButton onClick={handleCalculate} disabled={!isFormValid}> Calcular Férias </CalculateButton>
    </CardContent>
  )
}
