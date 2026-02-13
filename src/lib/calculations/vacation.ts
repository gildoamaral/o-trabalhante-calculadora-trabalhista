import type { VacationResultType } from "@/types/types";
import { calcularINSS, calcularIRRF } from "./taxes";

/**
 * Calcula os valores de férias CLT
 *
 * @param salarioBruto - Salário bruto mensal do funcionário
 * @param diasFerias - Número de dias de férias (máximo 30)
 * @param venderDias - Se true, calcula o abono pecuniário (venda de 10 dias)
 * @returns Objeto com todos os valores calculados
 */
export function calcularFerias(
  salarioBruto: number,
  diasFerias: number,
  venderDias: boolean,
): VacationResultType {

  const valorFerias = (salarioBruto / 30) * diasFerias;

  const tercoConstitucional = valorFerias / 3;

  let abonoPecuniario = 0;
  let tercoAbono = 0;

  if (venderDias) {
    abonoPecuniario = (salarioBruto / 30) * 10;
    tercoAbono = abonoPecuniario / 3;
  }

  const totalBruto =
    valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono;

  // Base de cálculo para descontos (não inclui abono, que é isento)
  const baseCalculoDesconto = valorFerias + tercoConstitucional;

  const inss = calcularINSS(baseCalculoDesconto);
  const irrf = Math.max(0, calcularIRRF(baseCalculoDesconto, inss));

  // Valor líquido a receber
  const totalLiquido = totalBruto - inss - irrf;

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
    totalLiquido,
  };
}
