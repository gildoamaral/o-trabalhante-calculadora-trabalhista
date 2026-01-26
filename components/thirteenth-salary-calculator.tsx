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
  Gift
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface ThirteenthResult {
  salarioBruto: number
  mesesTrabalhados: number
  valorProporcional: number
  primeiraParcelaBruta: number
  segundaParcelaBruta: number
  inss: number
  irrf: number
  totalLiquido: number
  parcelaUnica: boolean
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

function calcular13Salario(
  salarioBruto: number,
  mesesTrabalhados: number,
  parcelaUnica: boolean
): ThirteenthResult {
  const valorProporcional = (salarioBruto / 12) * mesesTrabalhados
  
  // Primeira parcela: 50% sem descontos (paga ate 30/nov)
  const primeiraParcelaBruta = valorProporcional / 2
  
  // Segunda parcela: 50% com descontos (paga ate 20/dez)
  const segundaParcelaBruta = valorProporcional / 2
  
  // Descontos incidem sobre o valor total na segunda parcela
  const inss = calcularINSS(valorProporcional)
  const irrf = Math.max(0, calcularIRRF(valorProporcional, inss))
  
  const totalLiquido = valorProporcional - inss - irrf
  
  return {
    salarioBruto,
    mesesTrabalhados,
    valorProporcional,
    primeiraParcelaBruta,
    segundaParcelaBruta,
    inss,
    irrf,
    totalLiquido,
    parcelaUnica
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const legislacao13 = [
  {
    titulo: "Direito ao 13o Salario",
    artigo: "Lei 4.090/1962 - Art. 1",
    conteudo: "No mes de dezembro de cada ano, a todo empregado sera paga, pelo empregador, uma gratificacao salarial, independentemente da remuneracao a que fizer jus."
  },
  {
    titulo: "Valor da Gratificacao",
    artigo: "Lei 4.090/1962 - Art. 1, 1",
    conteudo: "A gratificacao correspondera a 1/12 avos da remuneracao devida em dezembro, por mes de servico, do ano correspondente."
  },
  {
    titulo: "Fracao de 15 Dias",
    artigo: "Lei 4.090/1962 - Art. 1, 2",
    conteudo: "A fracao igual ou superior a 15 dias de trabalho sera havida como mes integral para os efeitos do paragrafo anterior."
  },
  {
    titulo: "Pagamento em Duas Parcelas",
    artigo: "Lei 4.749/1965 - Art. 1",
    conteudo: "A gratificacao salarial sera paga pelo empregador ate o dia 20 de dezembro de cada ano, compensada a importancia que, a titulo de adiantamento, o empregado houver recebido."
  },
  {
    titulo: "Primeira Parcela",
    artigo: "Lei 4.749/1965 - Art. 2",
    conteudo: "Entre os meses de fevereiro e novembro de cada ano, o empregador pagara, como adiantamento da gratificacao, de uma so vez, metade do salario recebido pelo empregado no mes anterior."
  },
  {
    titulo: "Adiantamento nas Ferias",
    artigo: "Lei 4.749/1965 - Art. 2, 2",
    conteudo: "O adiantamento sera pago ao ensejo das ferias do empregado, sempre que este o requerer no mes de janeiro do correspondente ano."
  },
  {
    titulo: "Incidencia de INSS",
    artigo: "Decreto 3.048/1999",
    conteudo: "O 13o salario integra o salario-de-contribuicao, exceto a parcela do adiantamento paga entre fevereiro e novembro. Os descontos de INSS e IRRF incidem apenas na segunda parcela."
  },
  {
    titulo: "Rescisao do Contrato",
    artigo: "Lei 4.090/1962 - Art. 3",
    conteudo: "Ocorrendo rescisao, sem justa causa, do contrato de trabalho, o empregado recebera a gratificacao devida, calculada sobre a remuneracao do mes da rescisao."
  },
  {
    titulo: "Justa Causa",
    artigo: "Decreto 57.155/1965 - Art. 7",
    conteudo: "O empregado que for dispensado por justa causa nao tera direito ao 13o salario do ano em curso."
  }
]

export function ThirteenthSalaryCalculator() {
  const [salario, setSalario] = React.useState("")
  const [mesesTrabalhados, setMesesTrabalhados] = React.useState("12")
  const [parcelaUnica, setParcelaUnica] = React.useState(false)
  const [result, setResult] = React.useState<ThirteenthResult | null>(null)
  const [isCalculating, setIsCalculating] = React.useState(false)

  const handleCalculate = () => {
    const salarioNum = parseFloat(salario.replace(/\D/g, '')) / 100
    const meses = parseInt(mesesTrabalhados)
    if (isNaN(salarioNum) || salarioNum <= 0 || isNaN(meses) || meses <= 0) return

    setIsCalculating(true)
    
    setTimeout(() => {
      const resultado = calcular13Salario(salarioNum, meses, parcelaUnica)
      setResult(resultado)
      setIsCalculating(false)
    }, 600)
  }

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      const numValue = parseInt(value) / 100
      value = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    setSalario(value)
  }

  const handleReset = () => {
    setSalario("")
    setMesesTrabalhados("12")
    setParcelaUnica(false)
    setResult(null)
  }

  const isFormValid = salario && parseInt(mesesTrabalhados) > 0

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Titulo e Helper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Calculadora de 13o Salario
            </h1>
            <p className="text-muted-foreground mt-1">
              Calcule o valor do seu decimo terceiro salario
            </p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-fit bg-transparent">
                <BookOpen className="h-4 w-4" />
                Legislacao
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Legislacao do 13o Salario
                </SheetTitle>
                <SheetDescription>
                  Principais artigos e leis sobre a gratificacao natalina
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-140px)] mt-6 pr-4">
                <div className="space-y-4">
                  {legislacao13.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-border/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-foreground">
                              {item.titulo}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {item.artigo}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.conteudo}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Dados para Calculo
                </CardTitle>
                <CardDescription>
                  Informe seu salario e meses trabalhados no ano
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Salario Bruto */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="salario">Salario Bruto Mensal</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>O salario bruto e o valor total antes dos descontos de INSS e IRRF.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salario"
                      placeholder="0,00"
                      value={salario}
                      onChange={handleSalarioChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Meses Trabalhados */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="meses">Meses Trabalhados no Ano</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Quantidade de meses trabalhados no ano atual. Fracoes iguais ou superiores a 15 dias contam como mes inteiro.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={mesesTrabalhados} onValueChange={setMesesTrabalhados}>
                    <SelectTrigger className="bg-transparent hover:bg-muted">
                      <SelectValue placeholder="Selecione os meses" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                        <SelectItem key={mes} value={mes.toString()}>
                          {mes} {mes === 1 ? 'mes' : 'meses'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Info sobre parcelas */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Sobre as parcelas</p>
                      <p>O 13o e pago em duas parcelas: a primeira (50%) ate 30/nov sem descontos, e a segunda (50%) ate 20/dez com INSS e IRRF.</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Botoes */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCalculate}
                    disabled={!isFormValid || isCalculating}
                    className="flex-1 gap-2"
                  >
                    {isCalculating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Calculator className="h-4 w-4" />
                        </motion.div>
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4" />
                        Calcular
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultado */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Resultado do Calculo
                      </CardTitle>
                      <CardDescription>
                        {result.mesesTrabalhados} {result.mesesTrabalhados === 1 ? 'mes trabalhado' : 'meses trabalhados'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Resumo das parcelas */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground mb-1">1a Parcela (ate 30/nov)</div>
                          <div className="text-lg font-semibold text-foreground">
                            {formatCurrency(result.primeiraParcelaBruta)}
                          </div>
                          <div className="text-xs text-muted-foreground">Sem descontos</div>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground mb-1">2a Parcela (ate 20/dez)</div>
                          <div className="text-lg font-semibold text-foreground">
                            {formatCurrency(result.segundaParcelaBruta - result.inss - result.irrf)}
                          </div>
                          <div className="text-xs text-muted-foreground">Com descontos</div>
                        </div>
                      </div>

                      <Separator />

                      {/* Proventos */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-foreground">Proventos</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">13o Proporcional ({result.mesesTrabalhados}/12)</span>
                            <span className="text-foreground">{formatCurrency(result.valorProporcional)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm font-medium mt-3 pt-2 border-t border-border">
                          <span className="text-foreground">Total Bruto</span>
                          <span className="text-foreground">{formatCurrency(result.valorProporcional)}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Descontos */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-foreground">Descontos</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">INSS</span>
                            <span className="text-destructive">- {formatCurrency(result.inss)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IRRF</span>
                            <span className="text-destructive">- {formatCurrency(result.irrf)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm font-medium mt-3 pt-2 border-t border-border">
                          <span className="text-foreground">Total Descontos</span>
                          <span className="text-destructive">- {formatCurrency(result.inss + result.irrf)}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Total Liquido */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-lg bg-primary/5 border border-primary/20 p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Total Liquido</div>
                            <div className="text-xs text-muted-foreground">(Soma das duas parcelas)</div>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {formatCurrency(result.totalLiquido)}
                          </div>
                        </div>
                      </motion.div>

                      {/* Dica */}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <p>Os descontos de INSS e IRRF sao aplicados integralmente na segunda parcela. A primeira parcela e paga sem nenhum desconto.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-sm h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
                      >
                        <Gift className="h-8 w-8 text-muted-foreground" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Preencha os dados
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Informe seu salario e meses trabalhados para calcular seu 13o salario
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                        <span>Preencha o formulario</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>Clique em Calcular</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>Veja o resultado</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
