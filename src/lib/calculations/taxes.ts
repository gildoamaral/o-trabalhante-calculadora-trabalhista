const INSS_FAIXAS = [
  { limite: 1621.00, aliquota: 0.075, deducao: 0 },
  { limite: 2902.84, aliquota: 0.09,  deducao: 24.32 },
  { limite: 4354.27, aliquota: 0.12,  deducao: 111.40 },
  { limite: 8475.55, aliquota: 0.14,  deducao: 198.49 },
] as const;
const TETO_INSS_CONTRIBUICAO = 988.09;

// Tabela Progressiva Base de 2026 (para rendas acima de R$ 7.350 ou base de cálculo inicial)
export const IRRF_TABELA_2026 = [
  { limite: 2428.80, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 182.16 },
  { limite: 3751.05, aliquota: 0.15, deducao: 394.16 },
  { limite: 4664.68, aliquota: 0.225, deducao: 675.49 },
  { limite: Infinity, aliquota: 0.275, deducao: 908.73 },
] as const;

// Constantes da Nova Regra de 2026
export const IRRF_CONFIG_2026 = {
  ISENCAO_TOTAL: 5000.00,
  FAIXA_TRANSICAO_MAX: 7350.00,
  DESCONTO_SIMPLIFICADO: 607.20, // Opção padrão caso não use deduções legais
  DEDUCAO_POR_DEPENDENTE: 189.59,
};

/**
 * Calcula o INSS de forma simplificada usando a fórmula:
 * (Salário * Alíquota) - Parcela a Deduzir
 */
export function calcularINSS(salario: number): number {
  const limiteMaximo = INSS_FAIXAS[INSS_FAIXAS.length - 1].limite;
  if (salario >= limiteMaximo) return TETO_INSS_CONTRIBUICAO;

  const faixa = INSS_FAIXAS.find((f) => salario <= f.limite) || INSS_FAIXAS[INSS_FAIXAS.length - 1];

  const resultado = (salario * faixa.aliquota) - faixa.deducao;
  
  return Number(resultado.toFixed(2));
}

/**
 * Calcula o desconto de IRRF com base na base de cálculo
 * A base de cálculo é o valor bruto menos o INSS
 */
export function calcularIRRF(
  salarioBruto: number, 
  descontoINSS: number, 
  numeroDependentes: number = 0
): number {
  if (salarioBruto <= IRRF_CONFIG_2026.ISENCAO_TOTAL) return 0;

  const deducoesLegais = descontoINSS + (numeroDependentes * IRRF_CONFIG_2026.DEDUCAO_POR_DEPENDENTE);
  const baseCalculo = salarioBruto - Math.max(deducoesLegais, IRRF_CONFIG_2026.DESCONTO_SIMPLIFICADO);

  const faixa = IRRF_TABELA_2026.find(f => baseCalculo <= f.limite)!;
  let imposto = Math.max(0, (baseCalculo * faixa.aliquota) - faixa.deducao);

  if (salarioBruto > IRRF_CONFIG_2026.ISENCAO_TOTAL && 
      salarioBruto <= IRRF_CONFIG_2026.FAIXA_TRANSICAO_MAX) {
    imposto = Math.max(0, imposto - Math.max(0, 978.62 - (0.133145 * salarioBruto)));
  }

  return Number(imposto.toFixed(2));
}
