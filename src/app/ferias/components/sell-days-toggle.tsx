"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SellDaysToggleProps {
  /** Se a opção de vender dias está ativada */
  checked: boolean
  /** Callback quando o valor muda */
  onCheckedChange: (checked: boolean) => void
}

/**
 * Toggle para a opção de vender 10 dias de férias (abono pecuniário)
 */
export function SellDaysToggle({
  checked,
  onCheckedChange,
}: SellDaysToggleProps) {
  return (
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
      <Switch id="vender" checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
