import { formatCurrency } from "./format";
import type { DecimoTerceiroResultType } from "@/types/types";

export function formatDecimoTerceiroCopy(
  result: DecimoTerceiroResultType,
): string {
  const lines = [
    "═══════════════════════════════════════",
    "📊 CÁLCULO 13º SALÁRIO",
    "═══════════════════════════════════════",
    "",
    `💰 TOTAL LÍQUIDO A RECEBER: ${formatCurrency(result.totalLiquido)}`,
    `📅 Período: ${result.mesesTrabalhados === 12 ? "13º completo (12 meses)" : `Proporcional a ${result.mesesTrabalhados}/12 meses`}`,
    "",
    "───────────────────────────────────────",
    "📋 RESUMO POR PARCELAS",
    "───────────────────────────────────────",
    `1ª Parcela: ${formatCurrency(result.primeiraParcelaLiquida)} (até 30 de novembro)`,
    `2ª Parcela: ${formatCurrency(result.segundaParcela)} (até 20 de dezembro)`,
    "",
    "───────────────────────────────────────",
    "📈 PROVENTOS",
    "───────────────────────────────────────",
    `13º Salário Bruto: ${formatCurrency(result.valorBruto)}`,
    ...(result.rendaVariavel !== undefined && result.rendaVariavel > 0
      ? [`Renda Variável: ${formatCurrency(result.rendaVariavel)}`]
      : []),
    `1ª Parcela (adiantamento): ${formatCurrency(result.primeiraParcelaLiquida)}`,
    `Total Bruto: ${formatCurrency(result.valorBruto)}`,
    "",
    "───────────────────────────────────────",
    "📉 DESCONTOS (aplicados na 2ª parcela)",
    "───────────────────────────────────────",
    `INSS: - ${formatCurrency(result.inss)}`,
    `IRRF: - ${formatCurrency(result.irrf)}`,
    `Total Descontos: - ${formatCurrency(result.inss + result.irrf)}`,
    "",
    "═══════════════════════════════════════",
    "⚠️ AVISO IMPORTANTE",
    "═══════════════════════════════════════",
    "Valores aproximados com base nas tabelas de INSS e IRRF de 2026.",
    "O IRRF do 13º usa tabela exclusiva, calculado sobre o total bruto.",
    "Consulte o RH da sua empresa para valores exatos.",
    "",
    "Gerado em: " + new Date().toLocaleString("pt-BR"),
  ];

  return lines.join("\n");
}
