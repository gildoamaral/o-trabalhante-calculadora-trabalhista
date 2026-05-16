import { CalculateButton } from '@/components/features/calculate-button'
import { LabelWithTooltip } from '@/components/ui/label-with-tooltip'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrencyInput } from '@/lib/format'
import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ThirteenthCardFormProps {
  salario: string
  setSalario: (value: string) => void
  meses: number
  setMeses: (value: number) => void
  numeroDependentes: number
  setNumeroDependentes: (value: number) => void
  rendaVariavel: string
  setRendaVariavel: (value: string) => void
  handleCalculate: () => void
  isFormValid: boolean
}

export function ThirteenthCardForm({
  salario,
  setSalario,
  meses,
  setMeses,
  numeroDependentes,
  setNumeroDependentes,
  rendaVariavel,
  setRendaVariavel,
  handleCalculate,
  isFormValid,
}: ThirteenthCardFormProps) {
  const [openOptions, setOpenOptions] = React.useState(false)

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalario(formatCurrencyInput(e.target.value))
  }

  const handleMesesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val)) setMeses(Math.min(Math.max(val, 1), 12))
  }

  const handleDependentesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (isNaN(val) || val < 0) {
      setNumeroDependentes(0)
      return
    }
    setNumeroDependentes(val)
  }

  const handleRendaVariavelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRendaVariavel(formatCurrencyInput(e.target.value))
  }

  return (
    <CardContent className="space-y-5">

      {/* Salário */}
      <div className="space-y-2">
        <LabelWithTooltip
          label="Salário Bruto"
          tooltipText="Informe seu salário bruto mensal para calcular o valor do 13º salário."
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

      {/* Meses trabalhados */}
      <div className="space-y-2">
        <LabelWithTooltip
          label="Meses Trabalhados"
          tooltipText="Informe quantos meses você trabalhou no ano. Apenas meses com mais de 15 dias trabalhados contam como mês completo. Máximo: 12."
          htmlFor="meses"
        />
        <div className="relative">
          <Input
            id="meses"
            type="number"
            min={1}
            max={12}
            placeholder="12"
            value={meses}
            onChange={handleMesesChange}
            className="pr-16"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            {meses === 1 ? 'mês' : 'meses'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Cada mês com mais de 15 dias trabalhados conta como 1/12 do 13º.
        </p>
      </div>

      {/* Menu */}
      <div>
        <button
          type="button"
          className="w-full flex items-center justify-between py-1 px-1 text-sm font-medium text-foreground hover:cursor-pointer hover:bg-muted/30"
          onClick={() => setOpenOptions((v) => !v)}
          aria-expanded={openOptions}
        >
          <span>Opções adicionais</span>
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
                <div className="flex flex-col space-y-2 p-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Dependentes"
                      tooltipText="Quantidade de dependentes utilizados para dedução do IRRF do 13º salário."
                      htmlFor="dependentes-13"
                    />
                  </div>

                  <div>
                    <Input
                      id="dependentes-13"
                      type="number"
                      min={0}
                      className="bg-foreground/10 hover:bg-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/20"
                      value={numeroDependentes}
                      onChange={handleDependentesChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col p-2 space-y-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Renda Variável"
                      tooltipText="Rendimentos variáveis (comissões, bônus) que compõem a base do 13º salário."
                      htmlFor="renda-variavel-13"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <Input
                      id="renda-variavel-13"
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
      <CalculateButton onClick={handleCalculate} disabled={!isFormValid}>
        Calcular 13º Salário
      </CalculateButton>
    </CardContent>
  )
}
