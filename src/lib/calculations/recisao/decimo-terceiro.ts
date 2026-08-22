import type { FormaRescisao } from '@/types/types';
import { calcularMesesDecimoTerceiro } from './utils/dates';

export interface DecimoTerceiroCalculo {
  mesesDecimoTerceiro: number;
  decimoTerceiroProporcional: number;
  descontoAdiantamentoDecimoTerceiro: number;
}

export function calcularDecimoTerceiroRescisao(
  salarioBruto: number,
  admissionDate: Date,
  rightsBaseDate: Date,
  adiantamentoDecimoTerceiro: boolean,
  formaRescisao: FormaRescisao, // <-- Adicionamos a forma de rescisão aqui
): DecimoTerceiroCalculo {
  
  // Se for justa causa, não recebe nada de 13º
  if (formaRescisao === 'justa-causa') {
    return {
      mesesDecimoTerceiro: 0,
      decimoTerceiroProporcional: 0,
      descontoAdiantamentoDecimoTerceiro: 0,
    };
  }

  const mesesDecimoTerceiro = calcularMesesDecimoTerceiro(admissionDate, rightsBaseDate);
  const decimoTerceiroProporcional = (salarioBruto / 12) * mesesDecimoTerceiro;

  // O adiantamento é sempre metade do salário bruto.
  // Usamos Math.min para garantir que a empresa não desconte MAIS do que ele tem a receber de 13º,
  // pois não se pode negativar a rubrica de 13º na rescisão.
  const descontoAdiantamentoDecimoTerceiro = adiantamentoDecimoTerceiro
    ? Math.min(salarioBruto / 2, decimoTerceiroProporcional)
    : 0;

  return {
    mesesDecimoTerceiro,
    decimoTerceiroProporcional,
    descontoAdiantamentoDecimoTerceiro,
  };
}