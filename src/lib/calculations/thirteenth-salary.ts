import type { DecimoTerceiroResultType } from "@/types/types";
import { calcularINSS, calcularIRRF } from "./taxes";

/**
 * Calcula o 13º Salário (Gratificação Natalina) conforme a CLT e legislação vigente.
 *
 * Regras:
 * - Valor bruto proporcional: (salário / 12) * meses trabalhados
 * - Mês conta se o empregado trabalhou mais de 15 dias
 * - 1ª parcela: metade do bruto, sem descontos (INSS e IRRF)
 * - 2ª parcela: bruto - INSS - IRRF - 1ª parcela
 * - INSS e IRRF calculados sobre o total bruto (tabela exclusiva do 13º)
 *
 * @param salarioBruto - Salário bruto mensal do funcionário
 * @param mesesTrabalhados - Número de meses trabalhados no ano (1 a 12)
 * @returns Objeto com todos os valores calculados
 */
export function calcularDecimoTerceiro(
  salarioBruto: number,
  mesesTrabalhados: number,
  numeroDependentes: number = 0,
  rendaVariavel: number = 0,
): DecimoTerceiroResultType {
  const meses = Math.min(Math.max(Math.round(mesesTrabalhados), 1), 12);
  const baseMensal = salarioBruto + (rendaVariavel || 0);

  // Valor bruto proporcional
  const valorBruto = (baseMensal / 12) * meses;

  // 1ª parcela: metade do bruto, sem impostos
  const primeiraParcelaLiquida = valorBruto / 2;

  // Descontos calculados sobre o total bruto do 13º (tabela exclusiva)
  const inss = calcularINSS(valorBruto);
  const irrf = Math.max(0, calcularIRRF(valorBruto, inss, numeroDependentes));

  // 2ª parcela líquida = bruto - INSS - IRRF - 1ª parcela
  const segundaParcela = valorBruto - inss - irrf - primeiraParcelaLiquida;

  // Total líquido = 1ª + 2ª = bruto - INSS - IRRF
  const totalLiquido = primeiraParcelaLiquida + segundaParcela;

  return {
    salarioBruto,
    rendaVariavel,
    numeroDependentes,
    mesesTrabalhados: meses,
    valorBruto,
    primeiraParcelaLiquida,
    inss,
    irrf,
    segundaParcela,
    totalLiquido,
  };
}
