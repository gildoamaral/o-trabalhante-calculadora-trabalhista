import { differenceInCalendarDays, startOfMonth } from 'date-fns';

export interface SaldoSalarioCalculo {
  diasTrabalhadosNoMes: number;
  saldoSalario: number;
}

export function calcularSaldoSalarioRescisao(
  salarioBruto: number, 
  dismissalDate: Date
): SaldoSalarioCalculo {
  const diasTrabalhadosNoMes = differenceInCalendarDays(dismissalDate, startOfMonth(dismissalDate)) + 1;
  
  // Limita a 30 dias na hora de calcular para não pagar mais do que o salário base em meses de 31 dias
  const diasParaCalculo = Math.min(diasTrabalhadosNoMes, 30);
  const saldoSalario = (salarioBruto / 30) * diasParaCalculo;

  return {
    diasTrabalhadosNoMes,
    saldoSalario,
  };
}