import type { FormaRescisao } from '@/types/types';

import { calcularMesesFeriasProporcionais } from './utils/dates';

export interface FeriasCalculo {
  mesesProporcionais: number;
  feriasVencidasValor: number;
  feriasProporcionais: number;
}

export function calcularFeriasRescisao(
  salarioBruto: number,
  admissionDate: Date,
  rightsBaseDate: Date,
  formaRescisao: FormaRescisao,
  feriasVencidas: boolean,
): FeriasCalculo {
  const mesesProporcionais = calcularMesesFeriasProporcionais(admissionDate, rightsBaseDate);
  const feriasVencidasValor = feriasVencidas ? salarioBruto + (salarioBruto / 3) : 0;

  const feriasProporcionais =
    formaRescisao === 'justa-causa'
      ? 0
      : (salarioBruto / 12) * mesesProporcionais + ((salarioBruto / 12) * mesesProporcionais) / 3;

  return {
    mesesProporcionais,
    feriasVencidasValor,
    feriasProporcionais,
  };
}
