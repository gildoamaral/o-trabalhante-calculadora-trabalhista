"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrencyInput } from "@/lib/format"

interface SalaryInputProps {
  /** Valor atual do salário (string formatada) */
  value: string
  /** Callback quando o valor muda */
  onChange: (value: string) => void
  /** ID do input */
  id?: string
}

/**
 * Componente de input para salário com formatação automática
 */
export function SalaryInput({
  value,
  onChange,
  id = "salario",
}: SalaryInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-foreground font-medium">
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
          id={id}
          type="text"
          placeholder="0,00"
          value={value}
          onChange={handleChange}
          className="pl-10"
        />
      </div>
    </div>
  )
}
