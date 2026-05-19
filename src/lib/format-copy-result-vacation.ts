import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { formatCurrency } from "./format";
import type { VacationResultType } from "@/types/types";

export function formatVacationCopy(
  result: VacationResultType,
  dateRange?: DateRange,
  diasFerias?: number,
): string {
  const lines = [
    "═══════════════════════════════════════",
    "🌴 CÁLCULO DE FÉRIAS",
    "═══════════════════════════════════════",
    "",
    `💰 VALOR LÍQUIDO A RECEBER: ${formatCurrency(result.totalLiquido)}`,
    ...(dateRange?.from && dateRange?.to
      ? [
          `📅 Período: ${format(dateRange.from, "dd/MM/yyyy")} a ${format(dateRange.to, "dd/MM/yyyy")}${diasFerias ? ` (${diasFerias} dias)` : ""}`,
        ]
      : []),
    "",
    "───────────────────────────────────────",
    "📋 RESUMO",
    "───────────────────────────────────────",
    `Férias: ${formatCurrency(result.valorFerias)}`,
    `1/3 Constitucional: ${formatCurrency(result.tercoConstitucional)}`,
    ...(result.abonoPecuniario > 0
      ? [
          `Abono Pecuniário (10 dias): ${formatCurrency(result.abonoPecuniario)}`,
          `1/3 sobre Abono: ${formatCurrency(result.tercoAbono)}`,
        ]
      : []),
    `Total Bruto: ${formatCurrency(result.totalBruto)}`,
    "",
    "───────────────────────────────────────",
    "📉 DESCONTOS",
    "───────────────────────────────────────",
    `INSS: - ${formatCurrency(result.inss)}`,
    `IRRF: - ${formatCurrency(result.irrf)}`,
    `Total Descontos: - ${formatCurrency(result.inss + result.irrf)}`,
    "",
    "═══════════════════════════════════════",
    "⚠️ AVISO IMPORTANTE",
    "═══════════════════════════════════════",
    "Valores aproximados com base nas tabelas de INSS e IRRF de 2026.",
    "Consulte o RH da sua empresa para valores exatos.",
    "",
    "Gerado em: " + new Date().toLocaleString("pt-BR"),
  ];

  return lines.join("\n");
}
