import { format } from "date-fns";

import { formatCurrency } from "./format";
import type { RescisaoResultType } from "@/types/types";

export function formatRescisaoCopy(result: RescisaoResultType): string {
  const lines = [
    "═══════════════════════════════════════",
    "📄 CÁLCULO DE RESCISÃO",
    "═══════════════════════════════════════",
    "",
    `💰 TOTAL LÍQUIDO ESTIMADO: ${formatCurrency(result.totalLiquido)}`,
    `📅 Admissão: ${format(new Date(result.dataAdmissao), "dd/MM/yyyy")}`,
    `📅 rescisao: ${format(new Date(result.datarescisao), "dd/MM/yyyy")}`,
    "",
    "───────────────────────────────────────",
    "📋 RESUMO",
    "───────────────────────────────────────",
    `Saldo de salário: ${formatCurrency(result.saldoSalario)}`,
    ...(result.avisoPrevioProvento > 0
      ? [`Aviso prévio: ${formatCurrency(result.avisoPrevioProvento)}`]
      : []),
    ...(result.avisoPrevioDesconto > 0
      ? [
          `Aviso prévio descontado: - ${formatCurrency(result.avisoPrevioDesconto)}`,
        ]
      : []),
    ...(result.feriasVencidasValor > 0
      ? [`Férias vencidas: ${formatCurrency(result.feriasVencidasValor)}`]
      : []),
    ...(result.feriasProporcionais > 0
      ? [`Férias proporcionais: ${formatCurrency(result.feriasProporcionais)}`]
      : []),
    ...(result.decimoTerceiroProporcional > 0
      ? [
          `13º proporcional: ${formatCurrency(result.decimoTerceiroProporcional)}`,
        ]
      : []),
    `Total Proventos: ${formatCurrency(result.totalProventos)}`,
    "",
    "───────────────────────────────────────",
    "📉 DESCONTOS",
    "───────────────────────────────────────",
    `INSS: - ${formatCurrency(result.inss)}`,
    `IRRF: - ${formatCurrency(result.irrf)}`,
    ...(result.descontoAdiantamentoDecimoTerceiro > 0
      ? [
          `Adiantamento do 13º: - ${formatCurrency(result.descontoAdiantamentoDecimoTerceiro)}`,
        ]
      : []),
    `Total Descontos: - ${formatCurrency(result.totalDescontos)}`,
    "",
    "═══════════════════════════════════════",
    "⚠️ AVISO IMPORTANTE",
    "═══════════════════════════════════════",
    "Cálculo estimado com base nas verbas mais comuns da rescisão CLT.",
    "Os valores de INSS e IRRF seguem as tabelas de 2026.",
    "Consulte o RH ou um contador para validação final.",
    "",
    "Gerado em: " + new Date().toLocaleString("pt-BR"),
  ];

  return lines.join("\n");
}
