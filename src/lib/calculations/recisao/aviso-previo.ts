import { addDays, differenceInYears } from "date-fns";

import type { FormaAvisoPrevio, FormaRescisao } from "@/types/types";

export interface AvisoPrevioCalculo {
  diasAvisoPrevio: number;
  dataBaseParaDireitos: Date;
  avisoPrevioProvento: number;
  avisoPrevioDesconto: number;
}

// 1. Calcula quantos dias TOTAIS de aviso o funcionário tem direito/dever
function calcularDiasAvisoPrevio(
  dataAdmissao: Date,
  dataRescisao: Date,
  formaRescisao: FormaRescisao
): number {
  if (formaRescisao === "justa-causa") return 0;
  if (formaRescisao === "pedido") return 30;

  // Substituído para differenceInYears para pegar anos exatos de aniversário de contrato
  const anosCompletos = Math.max(
    0,
    differenceInYears(dataRescisao, dataAdmissao)
  );
  
  return Math.min(30 + anosCompletos * 3, 90);
}

// 2. Descobre quantos dias devem ser empurrados para o futuro (Projeção)
function calcularDiasProjecao(
  diasAvisoPrevio: number,
  formaAvisoPrevio: FormaAvisoPrevio,
  formaRescisao: FormaRescisao
): number {
  if (
    formaRescisao === "justa-causa" ||
    formaRescisao === "pedido" ||
    formaAvisoPrevio === "dispensado"
  ) {
    return 0; // Nenhum desses casos joga a data final para frente
  }

  if (formaAvisoPrevio === "indenizado") {
    return diasAvisoPrevio; // Projeta todos os dias (ex: 39)
  }

  if (formaAvisoPrevio === "trabalhado") {
    return Math.max(0, diasAvisoPrevio - 30); // Projeta apenas os dias proporcionais que não trabalhou (ex: 9)
  }

  return 0;
}

// 3. Função principal que orquestra tudo e retorna o seu objeto
export function calcularAvisoPrevioRescisao(
  salarioBruto: number,
  admissionDate: Date,
  dismissalDate: Date,
  formaAvisoPrevio: FormaAvisoPrevio,
  formaRescisao: FormaRescisao,
): AvisoPrevioCalculo {
  
  const diasAvisoPrevio = calcularDiasAvisoPrevio(
    admissionDate, 
    dismissalDate, 
    formaRescisao
  );

  const diasProjecao = calcularDiasProjecao(
    diasAvisoPrevio, 
    formaAvisoPrevio, 
    formaRescisao
  );

  // Aqui resolvemos o problema da Data Base com segurança
  const dataBaseParaDireitos = addDays(dismissalDate, diasProjecao);

  // Variáveis financeiras
  const valorPorDia = salarioBruto / 30;
  let avisoPrevioProvento = 0;
  let avisoPrevioDesconto = 0;

  // CÁLCULO DE PROVENTO (O que entra de dinheiro do aviso)
  if (
    formaRescisao === "justa-causa" || 
    formaRescisao === "pedido" || 
    formaAvisoPrevio === "dispensado"
  ) {
    avisoPrevioProvento = 0;
  } else if (formaRescisao === "acordo" && formaAvisoPrevio === "indenizado") {
    avisoPrevioProvento = (valorPorDia * diasAvisoPrevio) / 2;
  } else if (formaAvisoPrevio === "indenizado") {
    avisoPrevioProvento = valorPorDia * diasAvisoPrevio;
  } else if (formaAvisoPrevio === "trabalhado" && diasAvisoPrevio > 30) {
    // Paga em dinheiro apenas os dias proporcionais extras que ele não trabalhou
    avisoPrevioProvento = valorPorDia * (diasAvisoPrevio - 30);
  }

  // CÁLCULO DE DESCONTO (O que a empresa tira)
  if (formaRescisao === "pedido" && formaAvisoPrevio === "indenizado") {
    avisoPrevioDesconto = salarioBruto; // Desconta cravado 1 mês de salário
  }

  return {
    diasAvisoPrevio,
    dataBaseParaDireitos,
    avisoPrevioProvento,
    avisoPrevioDesconto,
  };
}