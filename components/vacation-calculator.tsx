"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calculator, 
  CalendarDays, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  BookOpen,
  ChevronRight,
  X,
  CalendarRange
} from "lucide-react"
import { format, differenceInDays, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface VacationResult {
  salarioBruto: number
  diasFerias: number
  valorFerias: number
  tercoConstitucional: number
  abonoPecuniario: number
  tercoAbono: number
  totalBruto: number
  inss: number
  irrf: number
  totalLiquido: number
}

// Tabela INSS 2024
function calcularINSS(salario: number): number {
  if (salario <= 1412.00) {
    return salario * 0.075
  } else if (salario <= 2666.68) {
    return 1412.00 * 0.075 + (salario - 1412.00) * 0.09
  } else if (salario <= 4000.03) {
    return 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (salario - 2666.68) * 0.12
  } else if (salario <= 7786.02) {
    return 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (salario - 4000.03) * 0.14
  } else {
    return 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (7786.02 - 4000.03) * 0.14
  }
}

// Tabela IRRF 2024
function calcularIRRF(baseCalculo: number, inss: number): number {
  const base = baseCalculo - inss
  
  if (base <= 2259.20) {
    return 0
  } else if (base <= 2826.65) {
    return base * 0.075 - 169.44
  } else if (base <= 3751.05) {
    return base * 0.15 - 381.44
  } else if (base <= 4664.68) {
    return base * 0.225 - 662.77
  } else {
    return base * 0.275 - 896.00
  }
}

function calcularFerias(
  salarioBruto: number,
  diasFerias: number,
  venderDias: boolean
): VacationResult {
  const valorFerias = (salarioBruto / 30) * diasFerias
  const tercoConstitucional = valorFerias / 3
  
  let abonoPecuniario = 0
  let tercoAbono = 0
  
  if (venderDias) {
    abonoPecuniario = (salarioBruto / 30) * 10
    tercoAbono = abonoPecuniario / 3
  }
  
  const totalBruto = valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono
  const baseCalculoDesconto = valorFerias + tercoConstitucional
  const inss = calcularINSS(baseCalculoDesconto)
  const irrf = Math.max(0, calcularIRRF(baseCalculoDesconto, inss))
  const totalLiquido = totalBruto - inss - irrf
  
  return {
    salarioBruto,
    diasFerias,
    valorFerias,
    tercoConstitucional,
    abonoPecuniario,
    tercoAbono,
    totalBruto,
    inss,
    irrf,
    totalLiquido
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const legislacaoFerias = [
  {
    titulo: "Direito a Ferias",
    artigo: "Art. 129 - CLT",
    conteudo: "Todo empregado tera direito anualmente ao gozo de um periodo de ferias, sem prejuizo da remuneracao."
  },
  {
    titulo: "Periodo Aquisitivo",
    artigo: "Art. 130 - CLT",
    conteudo: "Apos cada periodo de 12 meses de vigencia do contrato de trabalho, o empregado tera direito a ferias de 30 dias corridos."
  },
  {
    titulo: "Reducao por Faltas",
    artigo: "Art. 130 - CLT",
    conteudo: "As ferias serao concedidas proporcionalmente ao numero de faltas injustificadas: ate 5 faltas = 30 dias; de 6 a 14 faltas = 24 dias; de 15 a 23 faltas = 18 dias; de 24 a 32 faltas = 12 dias."
  },
  {
    titulo: "Terco Constitucional",
    artigo: "Art. 7, XVII - CF/88",
    conteudo: "O empregado tem direito a receber, alem do salario normal, um acrescimo de pelo menos 1/3 sobre a remuneracao de ferias."
  },
  {
    titulo: "Abono Pecuniario",
    artigo: "Art. 143 - CLT",
    conteudo: "E facultado ao empregado converter 1/3 do periodo de ferias a que tiver direito em abono pecuniario, no valor da remuneracao que lhe seria devida nos dias correspondentes."
  },
  {
    titulo: "Prazo para Pagamento",
    artigo: "Art. 145 - CLT",
    conteudo: "O pagamento da remuneracao das ferias sera efetuado ate 2 dias antes do inicio do respectivo periodo de gozo."
  },
  {
    titulo: "Fracionamento",
    artigo: "Art. 134, 1 - CLT",
    conteudo: "Desde que haja concordancia do empregado, as ferias poderao ser usufruidas em ate 3 periodos, sendo que um deles nao podera ser inferior a 14 dias corridos e os demais nao poderao ser inferiores a 5 dias corridos, cada um."
  },
  {
    titulo: "Ferias em Dobro",
    artigo: "Art. 137 - CLT",
    conteudo: "Sempre que as ferias forem concedidas apos o prazo legal (periodo concessivo de 12 meses), o empregador pagara em dobro a respectiva remuneracao."
  },
  {
    titulo: "Inicio das Ferias",
    artigo: "Art. 134, 3 - CLT",
    conteudo: "E vedado o inicio das ferias no periodo de 2 dias que antecede feriado ou dia de repouso semanal remunerado."
  }
]

export function VacationCalculator() {
  const [salario, setSalario] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [venderDias, setVenderDias] = React.useState(false)
  const [result, setResult] = React.useState<VacationResult | null>(null)
  const [isCalculating, setIsCalculating] = React.useState(false)

  const diasFerias = React.useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInDays(dateRange.to, dateRange.from) + 1
    }
    return 0
  }, [dateRange])

  const handleCalculate = () => {
    const salarioNum = parseFloat(salario.replace(/\D/g, '')) / 100
    if (isNaN(salarioNum) || salarioNum <= 0 || diasFerias === 0) return

    setIsCalculating(true)
    
    setTimeout(() => {
      const resultado = calcularFerias(salarioNum, diasFerias, venderDias)
      setResult(resultado)
      setIsCalculating(false)
    }, 600)
  }

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      const numValue = parseInt(value) / 100
      value = numValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
    setSalario(value)
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from) + 1
      if (days > 30) {
        // Limita a 30 dias
        setDateRange({
          from: range.from,
          to: addDays(range.from, 29)
        })
        return
      }
    }
    setDateRange(range)
  }

  const clearDateRange = () => {
    setDateRange(undefined)
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      Calculadora de Ferias
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Calcule o valor das suas ferias CLT
                    </CardDescription>
                  </div>
                </div>
                
                {/* Helper Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Legislacao</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Legislacao Trabalhista
                      </SheetTitle>
                      <SheetDescription>
                        Principais artigos da CLT e Constituicao sobre ferias
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
                      <div className="space-y-4">
                        {legislacaoFerias.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-lg border border-border bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">{item.titulo}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                                {item.artigo}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.conteudo}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              {/* Salario */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="salario" className="text-foreground font-medium">
                    Salario Bruto Mensal
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Informe seu salario bruto (antes dos descontos)</p>
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

              {/* Periodo de Ferias com Calendario */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground font-medium">
                    Periodo de Ferias
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Selecione o periodo das suas ferias (maximo 30 dias)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-transparent hover:bg-muted",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <span className="flex-1">
                            {format(dateRange.from, "dd MMM yyyy", { locale: ptBR })} - {format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}
                            <span className="ml-2 text-primary font-medium">({diasFerias} dias)</span>
                          </span>
                        ) : (
                          format(dateRange.from, "dd MMM yyyy", { locale: ptBR })
                        )
                      ) : (
                        <span>Selecione o periodo</span>
                      )}
                      {dateRange && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearDateRange()
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={1}
                      locale={ptBR}
                    />
                    <div className="p-3 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        Maximo de 30 dias. Selecione a data inicial e final.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
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
                        <p>Abono pecuniario: converta 1/3 das ferias em dinheiro. Este valor e isento de INSS e IRRF.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Abono pecuniario (valor isento de impostos)
                  </p>
                </div>
                <Switch
                  id="vender"
                  checked={venderDias}
                  onCheckedChange={setVenderDias}
                />
              </div>

              {/* Botao Calcular */}
              <Button
                onClick={handleCalculate}
                disabled={!salario || diasFerias === 0 || isCalculating}
                className="w-full"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Calculator className="h-5 w-5" />
                      </motion.div>
                      Calculando...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calculate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Calculator className="h-5 w-5" />
                      Calcular Ferias
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resultado */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="border-border shadow-sm overflow-hidden">
                {/* Header com valor principal */}
                <div className="bg-primary/5 border-b border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Valor liquido a receber</p>
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold text-primary"
                  >
                    {formatCurrency(result.totalLiquido)}
                  </motion.p>
                  {dateRange?.from && dateRange?.to && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {format(dateRange.from, "dd/MM/yyyy")} a {format(dateRange.to, "dd/MM/yyyy")} ({diasFerias} dias)
                    </p>
                  )}
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Proventos */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <TrendingUp className="h-4 w-4" />
                      <h4 className="font-semibold">Proventos</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-between py-2 border-b border-border/50"
                      >
                        <span className="text-muted-foreground">Ferias ({result.diasFerias} dias)</span>
                        <span className="text-foreground font-medium">{formatCurrency(result.valorFerias)}</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex justify-between py-2 border-b border-border/50"
                      >
                        <span className="text-muted-foreground">1/3 Constitucional</span>
                        <span className="text-foreground font-medium">{formatCurrency(result.tercoConstitucional)}</span>
                      </motion.div>
                      {result.abonoPecuniario > 0 && (
                        <>
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-between py-2 border-b border-border/50"
                          >
                            <span className="text-muted-foreground">Abono Pecuniario (10 dias)</span>
                            <span className="text-foreground font-medium">{formatCurrency(result.abonoPecuniario)}</span>
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="flex justify-between py-2 border-b border-border/50"
                          >
                            <span className="text-muted-foreground">1/3 sobre Abono</span>
                            <span className="text-foreground font-medium">{formatCurrency(result.tercoAbono)}</span>
                          </motion.div>
                        </>
                      )}
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-between py-2 font-semibold"
                      >
                        <span className="text-foreground">Total Bruto</span>
                        <span className="text-accent">{formatCurrency(result.totalBruto)}</span>
                      </motion.div>
                    </div>
                  </div>

                  <Separator />

                  {/* Descontos */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-destructive">
                      <TrendingDown className="h-4 w-4" />
                      <h4 className="font-semibold">Descontos</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex justify-between py-2 border-b border-border/50"
                      >
                        <span className="text-muted-foreground">INSS</span>
                        <span className="text-destructive font-medium">- {formatCurrency(result.inss)}</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-between py-2 border-b border-border/50"
                      >
                        <span className="text-muted-foreground">IRRF</span>
                        <span className="text-destructive font-medium">- {formatCurrency(result.irrf)}</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                        className="flex justify-between py-2 font-semibold"
                      >
                        <span className="text-foreground">Total Descontos</span>
                        <span className="text-destructive">- {formatCurrency(result.inss + result.irrf)}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Aviso */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Valores aproximados com base nas tabelas de INSS e IRRF de 2024. 
                      Consulte o RH da sua empresa para valores exatos.
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
