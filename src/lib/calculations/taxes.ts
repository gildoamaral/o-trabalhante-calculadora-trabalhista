/**
 * Cálculos de impostos trabalhistas (INSS e IRRF)
 * Baseado nas tabelas de 2024
 */

// Faixas INSS 2024
const INSS_FAIXAS = [
  { limite: 1412.0, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 },
] as const;

// Faixas IRRF 2024
const IRRF_FAIXAS = [
  { limite: 2259.2, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.0 },
] as const;

/**
 * Calcula o desconto de INSS com base no salário
 * Utiliza alíquotas progressivas conforme tabela de 2024
 */
export function calcularINSS(salario: number): number {
  if (salario <= INSS_FAIXAS[0].limite) {
    return salario * INSS_FAIXAS[0].aliquota;
  } else if (salario <= INSS_FAIXAS[1].limite) {
    return (
      INSS_FAIXAS[0].limite * INSS_FAIXAS[0].aliquota +
      (salario - INSS_FAIXAS[0].limite) * INSS_FAIXAS[1].aliquota
    );
  } else if (salario <= INSS_FAIXAS[2].limite) {
    return (
      INSS_FAIXAS[0].limite * INSS_FAIXAS[0].aliquota +
      (INSS_FAIXAS[1].limite - INSS_FAIXAS[0].limite) *
        INSS_FAIXAS[1].aliquota +
      (salario - INSS_FAIXAS[1].limite) * INSS_FAIXAS[2].aliquota
    );
  } else if (salario <= INSS_FAIXAS[3].limite) {
    return (
      INSS_FAIXAS[0].limite * INSS_FAIXAS[0].aliquota +
      (INSS_FAIXAS[1].limite - INSS_FAIXAS[0].limite) *
        INSS_FAIXAS[1].aliquota +
      (INSS_FAIXAS[2].limite - INSS_FAIXAS[1].limite) *
        INSS_FAIXAS[2].aliquota +
      (salario - INSS_FAIXAS[2].limite) * INSS_FAIXAS[3].aliquota
    );
  } else {
    // Teto do INSS
    return (
      INSS_FAIXAS[0].limite * INSS_FAIXAS[0].aliquota +
      (INSS_FAIXAS[1].limite - INSS_FAIXAS[0].limite) *
        INSS_FAIXAS[1].aliquota +
      (INSS_FAIXAS[2].limite - INSS_FAIXAS[1].limite) *
        INSS_FAIXAS[2].aliquota +
      (INSS_FAIXAS[3].limite - INSS_FAIXAS[2].limite) * INSS_FAIXAS[3].aliquota
    );
  }
}

/**
 * Calcula o desconto de IRRF com base na base de cálculo
 * A base de cálculo é o valor bruto menos o INSS
 */
export function calcularIRRF(baseCalculo: number, inss: number): number {
  const base = baseCalculo - inss;

  for (const faixa of IRRF_FAIXAS) {
    if (base <= faixa.limite) {
      return base * faixa.aliquota - faixa.deducao;
    }
  }

  // Última faixa (maior que todos os limites)
  const ultimaFaixa = IRRF_FAIXAS[IRRF_FAIXAS.length - 1];
  return base * ultimaFaixa.aliquota - ultimaFaixa.deducao;
}
