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
