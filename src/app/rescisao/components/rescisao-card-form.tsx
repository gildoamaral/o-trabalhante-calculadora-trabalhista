import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import { CalculateButton } from '@/components/features/calculate-button'
import { LabelWithTooltip } from '@/components/ui/label-with-tooltip'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { formatCurrencyInput } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { FormaAvisoPrevio, FormaRescisao } from '@/types/types'

interface RescisaoCardFormProps {
  salario: string
  setSalario: (value: string) => void
  dataAdmissao: string
  setDataAdmissao: (value: string) => void
  dataRescisao: string
  setDataRescisao: (value: string) => void
  formaAvisoPrevio: FormaAvisoPrevio
  setFormaAvisoPrevio: (value: FormaAvisoPrevio) => void
  formaRescisao: FormaRescisao
  setFormaRescisao: (value: FormaRescisao) => void
  feriasVencidas: boolean
  setFeriasVencidas: (value: boolean) => void
  numeroDependentes: number
  setNumeroDependentes: (value: number) => void
  adiantamentoDecimoTerceiro: boolean
  setAdiantamentoDecimoTerceiro: (value: boolean) => void
  handleCalculate: () => void
  isFormValid: boolean
}

const tipoRescisaoOptions: Array<{ value: FormaRescisao; label: string }> = [
  { value: 'sem-justa-causa', label: 'Sem justa causa' },
  { value: 'justa-causa', label: 'Justa causa' },
  { value: 'pedido', label: 'Pedido de rescisao' },
  { value: 'acordo', label: 'Acordo entre as partes' },
]

const formaAvisoOptions: Array<{ value: FormaAvisoPrevio; label: string }> = [
  { value: 'trabalhado', label: 'Trabalhado' },
  { value: 'indenizado', label: 'Indenizado' },
  { value: 'nao-aplicavel', label: 'Não se aplica' },
  // { value: 'dispensado', label: 'Dispensado' },
]

export function RescisaoCardForm({
  salario,
  setSalario,
  dataAdmissao,
  setDataAdmissao,
  dataRescisao,
  setDataRescisao,
  formaAvisoPrevio,
  setFormaAvisoPrevio,
  formaRescisao,
  setFormaRescisao,
  feriasVencidas,
  setFeriasVencidas,
  numeroDependentes,
  setNumeroDependentes,
  adiantamentoDecimoTerceiro,
  setAdiantamentoDecimoTerceiro,
  handleCalculate,
  isFormValid,
}: RescisaoCardFormProps) {
  const [openOptions, setOpenOptions] = React.useState(false)

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalario(formatCurrencyInput(e.target.value))
  }

  const handleDependentesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    if (Number.isNaN(value) || value < 0) {
      setNumeroDependentes(0)
      return
    }

    setNumeroDependentes(value)
  }

  return (
    <CardContent className="space-y-5">
      <div className="space-y-2">
        <LabelWithTooltip
          label="Último Salário Bruto"
          tooltipText="Informe o último salário bruto mensal para calcular as verbas rescisórias."
          htmlFor="salario-rescisao"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            R$
          </span>
          <Input
            id="salario-rescisao"
            type="text"
            placeholder="0,00"
            value={salario}
            onChange={handleSalarioChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <LabelWithTooltip
            label="Data de Admissão"
            tooltipText="Data em que o vínculo empregatício começou."
            htmlFor="data-admissao"
          />
          <Input
            id="data-admissao"
            type="date"
            value={dataAdmissao}
            onChange={(e) => setDataAdmissao(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <LabelWithTooltip
            label="Data da Rescisão"
            tooltipText="Data do desligamento ou do último dia do contrato."
            htmlFor="data-rescisao"
          />
          <Input
            id="data-rescisao"
            type="date"
            value={dataRescisao}
            onChange={(e) => setDataRescisao(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <LabelWithTooltip
            label="Forma da Rescisão"
            tooltipText="Selecione o tipo de desligamento para aplicar as verbas corretas."
            htmlFor="forma-rescisao"
          />
          <div className="relative">
            <select
              id="forma-rescisao"
              value={formaRescisao}
              onChange={(e) => setFormaRescisao(e.target.value as FormaRescisao)}
              className={cn(
                'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
            >
              {tipoRescisaoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <LabelWithTooltip
            label="Forma do Aviso Prévio"
            tooltipText="Informe como o aviso prévio foi trabalhado para ajustar a projeção e os descontos."
            htmlFor="forma-aviso"
          />
          <div className="relative">
            <select
              id="forma-aviso"
              value={formaAvisoPrevio}
              onChange={(e) => setFormaAvisoPrevio(e.target.value as FormaAvisoPrevio)}
              className={cn(
                'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
            >
              {formaAvisoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="w-full flex items-center justify-between py-1 px-1 text-sm font-medium text-foreground hover:cursor-pointer hover:bg-muted/30"
          onClick={() => setOpenOptions((value) => !value)}
          aria-expanded={openOptions}
        >
          <span>Opções adicionais</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${openOptions ? 'rotate-180' : ''}`} />
        </button>

        <hr className="border-border" />

        <AnimatePresence>
          {openOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col py-2 bg-muted/80">
                <div className="flex items-center justify-between p-2 mb-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Férias vencidas"
                      tooltipText="Marque se houver férias vencidas a receber na rescisão."
                      htmlFor="ferias-vencidas"
                    />
                  </div>
                  <Switch
                    id="ferias-vencidas"
                    checked={feriasVencidas}
                    onCheckedChange={setFeriasVencidas}
                  />
                </div>

                <div className="flex flex-col space-y-2 p-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Dependentes"
                      tooltipText="Quantidade de dependentes usados para dedução do IRRF."
                      htmlFor="dependentes-rescisao"
                    />
                  </div>

                  <div>
                    <Input
                      id="dependentes-rescisao"
                      type="number"
                      min={0}
                      className="bg-foreground/10 hover:bg-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/20"
                      value={numeroDependentes}
                      onChange={handleDependentesChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="space-y-0.5 flex-1">
                    <LabelWithTooltip
                      label="Adiantamento do 13º"
                      tooltipText="Marque se o adiantamento do 13º já foi pago e deve ser descontado da rescisão."
                      htmlFor="adiantamento-13"
                    />
                  </div>
                  <Switch
                    id="adiantamento-13"
                    checked={adiantamentoDecimoTerceiro}
                    onCheckedChange={setAdiantamentoDecimoTerceiro}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CalculateButton onClick={handleCalculate} disabled={!isFormValid}>
        Calcular Rescisão
      </CalculateButton>
    </CardContent>
  )
}