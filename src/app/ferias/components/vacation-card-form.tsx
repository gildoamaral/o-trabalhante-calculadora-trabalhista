import { CalculateButton } from '@/components/calculate-button'
import { LabelWithTooltip } from '@/components/label-with-tooltip'
import { CardContent } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { formatCurrencyInput } from '@/lib/format'
import { DateRange } from 'react-day-picker'

interface VacationCardFormProps {
  salario: string
  setSalario: (value: string) => void
  dateRange: DateRange | undefined
  setDateRange: (value: DateRange | undefined) => void
  venderDias: boolean
  setVenderDias: (value: boolean) => void
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
  handleCalculate,
  isFormValid,
  maxVacationDays,
}: VacationCardFormProps) {
  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setSalario(formatted)
  }

  return (
    <CardContent className="space-y-5">

      {/* Salário */}
      <div className="space-y-2">
        <LabelWithTooltip
          label="Salário"
          tooltipText="Informe seu salário bruto mensal para calcular o valor das férias."
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

      {/* Vender dias */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/80">
        <div className="space-y-0.5 flex-1">
          <LabelWithTooltip
            label="Vender dias de férias"
            tooltipText="Ative esta opção se deseja vender parte dos seus dias de férias (abono pecuniário)."
            htmlFor="vender"
          />
          <p className="text-sm text-muted-foreground">
            Abono pecuniário (valor isento de impostos)
          </p>
        </div>
        <Switch id="vender" checked={venderDias} onCheckedChange={setVenderDias} />
      </div>

      {/* Botão Calcular */}
      <CalculateButton onClick={handleCalculate} disabled={!isFormValid}> Calcular Férias </CalculateButton>
    </CardContent>
  )
}
