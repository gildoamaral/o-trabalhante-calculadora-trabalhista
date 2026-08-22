import { addDays, differenceInCalendarDays, endOfMonth, startOfMonth } from 'date-fns';

export function countMonthsWithFifteenDays(startDate: Date, endDate: Date): number {
  if (endDate < startDate) {
    return 0;
  }

  let monthCursor = startOfMonth(startDate);
  const lastMonth = startOfMonth(endDate);
  let months = 0;

  while (monthCursor <= lastMonth) {
    const monthStart = monthCursor < startDate ? startDate : monthCursor;
    const monthEnd = endOfMonth(monthCursor) > endDate ? endDate : endOfMonth(monthCursor);

    if (monthEnd >= monthStart) {
      const daysWorked = differenceInCalendarDays(monthEnd, monthStart) + 1;
      if (daysWorked >= 15) {
        months += 1;
      }
    }

    monthCursor = addDays(endOfMonth(monthCursor), 1);
  }

  return months;
}

export function calcularMesesFeriasProporcionais(admissionDate: Date, rightsBaseDate: Date): number {
  const mesesTotaisAquisitivos = countMonthsWithFifteenDays(admissionDate, rightsBaseDate);
  return mesesTotaisAquisitivos % 12;
}

export function calcularMesesDecimoTerceiro(admissionDate: Date, rightsBaseDate: Date): number {
  const inicioAnoBase = new Date(rightsBaseDate.getFullYear(), 0, 1);
  const inicioCalculo = admissionDate > inicioAnoBase ? admissionDate : inicioAnoBase;
  return countMonthsWithFifteenDays(inicioCalculo, rightsBaseDate);
}
