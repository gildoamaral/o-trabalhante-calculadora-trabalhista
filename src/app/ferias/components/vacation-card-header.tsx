import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { LegislationSheet } from './legislation-sheet'

export function VacationCardHeader() {
  return (
    <CardHeader className="pb-4">
      <div className="flex md:items-center items-end justify-between flex-col md:flex-row gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">
              Calculadora de Férias
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Calcule o valor das suas férias CLT
            </CardDescription>
          </div>
        </div>

        <LegislationSheet />
      </div>
    </CardHeader>
  )
}
