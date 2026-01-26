"use client"

import * as React from "react"
import { format, differenceInDays, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarRange, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DateRangePickerProps {
  /** O range de datas selecionado */
  value?: DateRange
  /** Callback quando o range muda */
  onChange?: (range: DateRange | undefined) => void
  /** Número máximo de dias que podem ser selecionados */
  maxDays?: number
  /** Placeholder quando nenhuma data está selecionada */
  placeholder?: string
  /** Classes CSS adicionais */
  className?: string
  /** Se o componente está desabilitado */
  disabled?: boolean
}

/**
 * Componente genérico de seleção de período de datas
 * Com altura fixa para evitar mudanças de layout entre meses
 */
export function DateRangePicker({
  value,
  onChange,
  maxDays = 30,
  placeholder = "Selecione o período",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const daysCount = React.useMemo(() => {
    if (value?.from && value?.to) {
      return differenceInDays(value.to, value.from) + 1
    }
    return 0
  }, [value])

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from) + 1
      if (days > maxDays) {
        // Limita ao máximo de dias permitidos
        onChange?.({
          from: range.from,
          to: addDays(range.from, maxDays - 1),
        })
        return
      }
    }
    onChange?.(range)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent hover:bg-muted",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarRange className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <span className="flex-1">
                {format(value.from, "dd MMM yyyy", { locale: ptBR })} -{" "}
                {format(value.to, "dd MMM yyyy", { locale: ptBR })}
                <span className="ml-2 text-primary font-medium">
                  ({daysCount} {daysCount === 1 ? "dia" : "dias"})
                </span>
              </span>
            ) : (
              format(value.from, "dd MMM yyyy", { locale: ptBR })
            )
          ) : (
            <span>{placeholder}</span>
          )}
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-2"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="min-h-[300px]">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={ptBR}
            fixedWeeks
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
