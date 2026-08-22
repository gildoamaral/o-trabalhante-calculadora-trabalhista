export interface VacationResultType {
  salarioBruto: number;
  rendaVariavel?: number;
  diasFerias: number;
  valorFerias: number;
  tercoConstitucional: number;
  abonoPecuniario: number;
  tercoAbono: number;
  totalBruto: number;
  inss: number;
  irrf: number;
  totalLiquido: number;
}

export interface DecimoTerceiroResultType {
  salarioBruto: number;
  rendaVariavel?: number;
  numeroDependentes?: number;
  mesesTrabalhados: number;
  valorBruto: number;
  primeiraParcelaLiquida: number;
  inss: number;
  irrf: number;
  segundaParcela: number;
  totalLiquido: number;
}

export type FormaAvisoPrevio = "trabalhado" | "indenizado" | "dispensado" | "nao-aplicavel";
export type FormaRescisao =
  | "justa-causa"
  | "sem-justa-causa"
  | "pedido"
  | "acordo";

export interface RescisaoResultType {
  salarioBruto: number;
  dataAdmissao: string;
  datarescisao: string;
  formaAvisoPrevio: FormaAvisoPrevio;
  formaRescisao: FormaRescisao;
  feriasVencidas: boolean;
  numeroDependentes: number;
  adiantamentoDecimoTerceiro: boolean;
  diasAvisoPrevio: number;
  diasTrabalhadosNoMes: number;
  mesesProporcionais: number;
  mesesDecimoTerceiro: number;
  saldoSalario: number;
  avisoPrevioProvento: number;
  avisoPrevioDesconto: number;
  feriasVencidasValor: number;
  feriasProporcionais: number;
  decimoTerceiroProporcional: number;
  descontoAdiantamentoDecimoTerceiro: number;
  baseCalculoTributos: number;
  inss: number;
  irrf: number;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
}
