import { parseISO } from "date-fns";

import { calcularAvisoPrevioRescisao } from "./aviso-previo";
import { calcularDecimoTerceiroRescisao } from "./decimo-terceiro";
import { calcularFeriasRescisao } from "./ferias";
import { calcularImpostosRescisao } from "./impostos";
import { calcularSaldoSalarioRescisao } from "./saldo-salario";
import type {
  FormaAvisoPrevio,
  FormaRescisao,
  RescisaoResultType,
} from "@/types/types";

function criarResultadoVazio(
  salarioBruto: number,
  dataAdmissao: string,
  datarescisao: string,
  formaAvisoPrevio: FormaAvisoPrevio,
  formaRescisao: FormaRescisao,
  feriasVencidas: boolean,
  numeroDependentes: number,
  adiantamentoDecimoTerceiro: boolean,
): RescisaoResultType {
  return {
    salarioBruto,
    dataAdmissao,
    datarescisao,
    formaAvisoPrevio,
    formaRescisao,
    feriasVencidas,
    numeroDependentes,
    adiantamentoDecimoTerceiro,
    diasAvisoPrevio: 0,
    diasTrabalhadosNoMes: 0,
    mesesProporcionais: 0,
    mesesDecimoTerceiro: 0,
    saldoSalario: 0,
    avisoPrevioProvento: 0,
    avisoPrevioDesconto: 0,
    feriasVencidasValor: 0,
    feriasProporcionais: 0,
    decimoTerceiroProporcional: 0,
    descontoAdiantamentoDecimoTerceiro: 0,
    baseCalculoTributos: 0,
    inss: 0,
    irrf: 0,
    totalProventos: 0,
    totalDescontos: 0,
    totalLiquido: 0,
  };
}

/**
 * Calcula a rescisao trabalhista com base nas verbas mais comuns de desligamento.
 */
export function calcularRescisao(
  salarioBruto: number,
  dataAdmissao: string,
  datarescisao: string,
  formaAvisoPrevio: FormaAvisoPrevio,
  formaRescisao: FormaRescisao,
  feriasVencidas: boolean,
  numeroDependentes: number = 0,
  adiantamentoDecimoTerceiro: boolean = false,
): RescisaoResultType {
  const admissionDate = parseISO(dataAdmissao);
  const dismissalDate = parseISO(datarescisao);

  if (
    Number.isNaN(admissionDate.getTime()) ||
    Number.isNaN(dismissalDate.getTime()) ||
    dismissalDate < admissionDate
  ) {
    return criarResultadoVazio(
      salarioBruto,
      dataAdmissao,
      datarescisao,
      formaAvisoPrevio,
      formaRescisao,
      feriasVencidas,
      numeroDependentes,
      adiantamentoDecimoTerceiro,
    );
  }

  const { diasTrabalhadosNoMes, saldoSalario } = calcularSaldoSalarioRescisao(
    salarioBruto,
    dismissalDate,
  );

  const {
    diasAvisoPrevio,
    dataBaseParaDireitos,
    avisoPrevioProvento,
    avisoPrevioDesconto,
  } = calcularAvisoPrevioRescisao(
    salarioBruto,
    admissionDate,
    dismissalDate,
    formaAvisoPrevio,
    formaRescisao,
  );
  console.log("dataBaseParaDireitos", dataBaseParaDireitos);
  console.log("diasAvisoPrevio", diasAvisoPrevio);
  console.log("avisoPrevioProvento", avisoPrevioProvento);
  console.log("avisoPrevioDesconto", avisoPrevioDesconto);

  const { mesesProporcionais, feriasVencidasValor, feriasProporcionais } =
    calcularFeriasRescisao(
      salarioBruto,
      admissionDate,
      dataBaseParaDireitos,
      formaRescisao,
      feriasVencidas,
    );

  const {
    mesesDecimoTerceiro,
    decimoTerceiroProporcional,
    descontoAdiantamentoDecimoTerceiro,
  } = calcularDecimoTerceiroRescisao(
    salarioBruto,
    admissionDate,
    dataBaseParaDireitos,
    adiantamentoDecimoTerceiro,
    formaRescisao,
  );

  const { baseCalculoTributos, inss, irrf } = calcularImpostosRescisao(
    saldoSalario,
    decimoTerceiroProporcional,
    numeroDependentes,
  );

  const totalProventos =
    saldoSalario +
    avisoPrevioProvento +
    feriasVencidasValor +
    feriasProporcionais +
    decimoTerceiroProporcional;

  const totalDescontos =
    avisoPrevioDesconto + inss + irrf + descontoAdiantamentoDecimoTerceiro;
  const totalLiquido = totalProventos - totalDescontos;

  return {
    salarioBruto,
    dataAdmissao,
    datarescisao,
    formaAvisoPrevio,
    formaRescisao,
    feriasVencidas,
    numeroDependentes,
    adiantamentoDecimoTerceiro,
    diasAvisoPrevio,
    diasTrabalhadosNoMes,
    mesesProporcionais,
    mesesDecimoTerceiro,
    saldoSalario,
    avisoPrevioProvento,
    avisoPrevioDesconto,
    feriasVencidasValor,
    feriasProporcionais,
    decimoTerceiroProporcional,
    descontoAdiantamentoDecimoTerceiro,
    baseCalculoTributos,
    inss,
    irrf,
    totalProventos,
    totalDescontos,
    totalLiquido,
  };
}
