import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift } from 'lucide-react'

export function ThirteenthCardHeader() {
  return (
    <CardHeader>
      <div className="flex md:items-start items-center justify-between flex-col md:flex-row gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg md:text-xl text-foreground">
              Calculadora de 13º Salário
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Calcule sua Gratificação Natalina
            </CardDescription>
          </div>
        </div>
      </div>
    </CardHeader>
  )
}
