import { CalculateButton } from '@/components/features/calculate-button'
import { LabelWithTooltip } from '@/components/ui/label-with-tooltip'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrencyInput } from '@/lib/format'

interface ThirteenthCardFormProps {
  salario: string
  setSalario: (value: string) => void
  meses: number
  setMeses: (value: number) => void
  handleCalculate: () => void
  isFormValid: boolean
}

export function ThirteenthCardForm({
  salario,
  setSalario,
  meses,
  setMeses,
  handleCalculate,
  isFormValid,
}: ThirteenthCardFormProps) {
  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalario(formatCurrencyInput(e.target.value))
  }

  const handleMesesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val)) setMeses(Math.min(Math.max(val, 1), 12))
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

      {/* Botão Calcular */}
      <CalculateButton onClick={handleCalculate} disabled={!isFormValid}>
        Calcular 13º Salário
      </CalculateButton>
    </CardContent>
  )
}
