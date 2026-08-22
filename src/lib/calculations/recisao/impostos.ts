import { calcularINSS, calcularIRRF } from '../taxes';

export interface ImpostosCalculo {
  baseCalculoTributos: number;
  inss: number;
  irrf: number;
}

export function calcularImpostosRescisao(
  saldoSalario: number,
  decimoTerceiroProporcional: number,
  numeroDependentes: number,
): ImpostosCalculo {
  // Férias indenizadas não entram na base de INSS/IRRF da rescisão.
  const baseCalculoTributos = saldoSalario;
  const inssSaldoSalario = calcularINSS(baseCalculoTributos);
  const irrfSaldoSalario = Math.max(0, calcularIRRF(baseCalculoTributos, inssSaldoSalario, numeroDependentes));

  // O 13º possui tributação exclusiva e deve ser calculado em separado.
  const inssDecimoTerceiro = decimoTerceiroProporcional > 0
    ? calcularINSS(decimoTerceiroProporcional)
    : 0;
  const irrfDecimoTerceiro = decimoTerceiroProporcional > 0
    ? Math.max(0, calcularIRRF(decimoTerceiroProporcional, inssDecimoTerceiro, numeroDependentes))
    : 0;

  const inss = Number((inssSaldoSalario + inssDecimoTerceiro).toFixed(2));
  const irrf = Number((irrfSaldoSalario + irrfDecimoTerceiro).toFixed(2));

  return {
    baseCalculoTributos,
    inss,
    irrf,
  };
}
