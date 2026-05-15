import type { VacationResultType } from "@/types/types";
import { calcularINSS, calcularIRRF } from "./taxes";

/**
 * Calcula os valores de férias CLT
 *
 * @param salarioBruto - Salário bruto mensal do funcionário
 * @param diasFerias - Número de dias de férias (máximo 30)
 * @param venderDias - Se true, calcula o abono pecuniário (venda de 10 dias)
 * @param numeroDependentes - Número de dependentes para dedução do IRRF
 * @returns Objeto com todos os valores calculados
 */
export function calcularFerias(
  salarioBruto: number,
  diasFerias: number,
  venderDias: boolean,
  numeroDependentes: number = 0,
  rendaVariavel: number = 0,
): VacationResultType {
  const baseMensal = salarioBruto + (rendaVariavel || 0);

  const valorFerias = (baseMensal / 30) * diasFerias;

  const tercoConstitucional = valorFerias / 3;

  let abonoPecuniario = 0;
  let tercoAbono = 0;

  if (venderDias) {
    abonoPecuniario = (baseMensal / 30) * 10;
    tercoAbono = abonoPecuniario / 3;
  }

  const totalBruto =
    valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono;

  // Base de cálculo para descontos (não inclui abono, que é isento)
  const baseCalculoDesconto = valorFerias + tercoConstitucional;

  const inss = calcularINSS(baseCalculoDesconto);
  const irrf = Math.max(
    0,
    calcularIRRF(baseCalculoDesconto, inss, numeroDependentes),
  );

  // Valor líquido a recebera
  const totalLiquido = totalBruto - inss - irrf;

  return {
    salarioBruto,
    rendaVariavel,
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
