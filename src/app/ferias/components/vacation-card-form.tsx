import { CalculateButton } from '@/components/calculate-button'
import { CardContent } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrencyInput } from '@/lib/format'
import { Info } from 'lucide-react'
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
  isCalculating: boolean
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
  isCalculating,
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
        <div className="flex items-center gap-2">
          <Label htmlFor="salario" className="text-foreground font-medium">
            Salário Bruto Mensal
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Informe seu salário bruto (antes dos descontos)</p>
            </TooltipContent>
          </Tooltip>
        </div>
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
        <div className="flex items-center gap-2">
          <Label htmlFor="periodo-ferias" className="text-foreground font-medium">
            Período de Férias
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Selecione o período das suas férias (máximo{" "}
                {maxVacationDays} dias)
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDays={maxVacationDays}
          placeholder="Selecione o período"
        />
      </div>

      {/* Vender dias */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <Label htmlFor="vender" className="text-foreground font-medium">
              Vender 10 dias
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Abono pecuniário: converta 1/3 das férias em dinheiro. Este
                  valor é isento de INSS e IRRF.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground">
            Abono pecuniário (valor isento de impostos)
          </p>
        </div>
        <Switch id="vender" checked={venderDias} onCheckedChange={setVenderDias}/>
      </div>

      {/* Botão Calcular */}
      <CalculateButton
        onClick={handleCalculate}
        disabled={!isFormValid || isCalculating}
        isCalculating={isCalculating}
        label="Calcular Férias"
      />
    </CardContent>
  )
}
