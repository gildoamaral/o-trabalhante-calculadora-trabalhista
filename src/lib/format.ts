/**
 * Funções de formatação para valores monetários e outros
 */

/**
 * Formata um número para moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Converte uma string de moeda brasileira para número
 * Ex: "1.234,56" -> 1234.56
 */
export function parseCurrency(value: string): number {
  const numericValue = value.replace(/\D/g, "");
  return parseInt(numericValue) / 100;
}

/**
 * Formata um input de moeda enquanto o usuário digita
 * Retorna a string formatada para exibição
 */
export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";

  const numValue = parseInt(numericValue) / 100;
  return numValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
