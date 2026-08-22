# Fluxo de Cálculo da Rescisão Trabalhista

## Visão Geral

O cálculo da rescisão é orquestrado pela função `calcularRescisao()` em [src/lib/calculations/rescisao/orquestrador.ts](src/lib/calculations/rescisao/orquestrador.ts).

A função recebe os parâmetros básicos e executa **5 etapas de cálculo sequenciais** para chegar ao valor líquido final.

---

## Fluxo Detalhado

### **Entrada da Função**

```typescript
// src/lib/calculations/rescisao/orquestrador.ts - função calcularRescisao()
```

| Parâmetro                    | Tipo             | Significado                                                            |
| ---------------------------- | ---------------- | ---------------------------------------------------------------------- |
| `salarioBruto`               | number           | Valor do salário mensal bruto                                          |
| `dataAdmissao`               | string           | Data de contratação (ISO)                                              |
| `datarescisao`               | string           | Data da rescisão (ISO)                                                 |
| `formaAvisoPrevio`           | FormaAvisoPrevio | Como o aviso foi trabalhado: "dispensado", "trabalhado", "indenizado"  |
| `formaRescisao`              | FormaRescisao    | Tipo de rescisão: "sem-justa-causa", "pedido", "acordo", "justa-causa" |
| `feriasVencidas`             | boolean          | Funcionário tinha férias vencidas não gozadas?                         |
| `numeroDependentes`          | number           | Qtd de dependentes para cálculo de IRRF                                |
| `adiantamentoDecimoTerceiro` | boolean          | Recebeu 50% do 13º adiantado?                                          |

---

## **ETAPA 1: Saldo de Salário**

### Arquivo: [src/lib/calculations/rescisao/saldo-salario.ts](src/lib/calculations/rescisao/saldo-salario.ts)

**Função:** `calcularSaldoSalarioRescisao()`

**O que calcula:** Os dias trabalhados no mês de rescisao e o valor proporcional do salário.

**Lógica:**

```
1. Identifica o primeiro dia do mês de rescisao
2. Conta os dias do 1º até o dia da rescisao (inclusive)
3. Calcula proporcional: (salarioBruto / 30) * diasTrabalhadosNoMes
```

**Variáveis de saída:**

- `diasTrabalhadosNoMes` → quantidade de dias trabalhados
- `saldoSalario` → valor proporcional do salário

**Exemplo:**

```
Salário: R$ 3.000
rescisao: 15 de agosto
Dias trabalhados: 15
Saldo: R$ 1.500
```

---

## **ETAPA 2: Aviso Prévio**

### Arquivo: [src/lib/calculations/rescisao/aviso-previo.ts](src/lib/calculations/rescisao/aviso-previo.ts)

**Função:** `calcularAvisoPrevioRescisao()`

**O que calcula:** Dias de aviso, projeção de direitos e valores (provento/desconto).

**Lógica:**

**Passo 2.1 - Cálculo dos dias de aviso:**

```
anosCompletos = anos entre admissão e rescisao
diasAvisoPrevio = MIN(30 + (anosCompletos × 3), 90)

Mínimo: 30 dias
Máximo: 90 dias
Acréscimo: +3 dias por ano completo
```

**Passo 2.2 - Data base para direitos:**

```
Se aviso = "dispensado" → dataBaseParaDireitos = datarescisao
Se aviso = "trabalhado" OU "indenizado" (em certos casos)
  → dataBaseParaDireitos = datarescisao + diasAvisoPrevio

Isso projeta os direitos como se trabalhasse até fim do aviso
```

**Passo 2.3 - Cálculo dos valores:**

```
avisoBase = (salarioBruto / 30) × diasAvisoPrevio

avisoPrevioProvento:
  - Justa causa → 0
  - Dispensado → 0
  - Pedido + Indenizado → 0
  - Acordo + Indenizado → avisoBase / 2
  - Sem justa causa + Indenizado → avisoBase

avisoPrevioDesconto:
  - Se aviso "trabalhado" → desconta (salarioBruto / 30) × diasAvisoPrevio
  - Senão → 0
```

**Variáveis de saída:**

- `diasAvisoPrevio` → dias de aviso prévio
- `dataBaseParaDireitos` → data para calcular férias e 13º ✅ **IMPORTANTE**
- `avisoPrevioProvento` → valor a adicionar
- `avisoPrevioDesconto` → valor a descontar

---

## **ETAPA 3: Férias**

### Arquivo: [src/lib/calculations/rescisao/ferias.ts](src/lib/calculations/rescisao/ferias.ts)

**Função:** `calcularFeriasRescisao()`

**Entrada crítica:** `dataBaseParaDireitos` (vem do aviso prévio)

**O que calcula:** Férias vencidas e férias proporcionais.

**Lógica:**

**Passo 3.1 - Meses de férias proporcionais:**

```
Arquivo: src/lib/calculations/rescisao/utils/dates.ts
Função: calcularMesesFeriasProporcionais()

Conta meses com 15+ dias trabalhados entre:
  - Início: dataAdmissao
  - Fim: dataBaseParaDireitos (que inclui projeção de aviso)
```

**Passo 3.2 - Férias vencidas:**

```
Se feriasVencidas === true:
  feriasVencidasValor = salarioBruto + (salarioBruto / 3)
Senão:
  feriasVencidasValor = 0

(30 dias + 1/3 de adicional)
```

**Passo 3.3 - Férias proporcionais:**

```
Se formaRescisao === "justa-causa":
  feriasProporcionais = 0
Senão:
  feriasProporcionais = (salarioBruto / 12) × mesesProporcionais
                        + [(salarioBruto / 12) × mesesProporcionais] / 3

(30 dias + 1/3 de adicional, proporcionalizados pelos meses)
```

**Variáveis de saída:**

- `mesesProporcionais` → quantidade de meses com direito
- `feriasVencidasValor` → férias vencidas + 1/3
- `feriasProporcionais` → férias proporcionais + 1/3

---

## **ETAPA 4: Décimo Terceiro**

### Arquivo: [src/lib/calculations/rescisao/decimo-terceiro.ts](src/lib/calculations/rescisao/decimo-terceiro.ts)

**Função:** `calcularDecimoTerceiroRescisao()`

**Entrada crítica:** `dataBaseParaDireitos` (vem do aviso prévio)

**O que calcula:** Meses de 13º e seus descontos.

**Lógica:**

**Passo 4.1 - Meses de direito ao 13º:**

```
Arquivo: src/lib/calculations/rescisao/utils/dates.ts
Função: calcularMesesDecimoTerceiro()

Começando de:
  - 1º de janeiro do ano da rescisão, OU
  - Data de admissão (se for mais próxima)

Conta meses com 15+ dias até dataBaseParaDireitos
```

**Passo 4.2 - Valor proporcional do 13º:**

```
decimoTerceiroProporcional = (salarioBruto / 12) × mesesDecimoTerceiro
```

**Passo 4.3 - Desconto do adiantamento:**

```
Se adiantamentoDecimoTerceiro === true:
  descontoAdiantamentoDecimoTerceiro = decimoTerceiroProporcional / 2
Senão:
  descontoAdiantamentoDecimoTerceiro = 0

(Se recebeu 50% adiantado em junho, desconta 50% na rescisão)
```

**Variáveis de saída:**

- `mesesDecimoTerceiro` → meses de direito
- `decimoTerceiroProporcional` → valor bruto do 13º
- `descontoAdiantamentoDecimoTerceiro` → desconto do 50% adiantado

---

## **ETAPA 5: Impostos (INSS e IRRF)**

### Arquivo: [src/lib/calculations/rescisao/impostos.ts](src/lib/calculations/rescisao/impostos.ts)

**Função:** `calcularImpostosRescisao()`

**O que calcula:** INSS e IRRF sobre o saldo de salário e 13º.

**Lógica:**

**Importante:** Férias NÃO entram na base de cálculo de impostos na rescisão.

**Passo 5.1 - INSS e IRRF do saldo de salário:**

```
baseCalculoTributos = saldoSalario

inssSaldoSalario = calcularINSS(baseCalculoTributos)
  → Arquivo: src/lib/calculations/taxes.ts
  → Alíquota: 8% a 11% (conforme faixa)

irrfSaldoSalario = calcularIRRF(baseCalculoTributos, inssSaldoSalario, numeroDependentes)
  → Arquivo: src/lib/calculations/taxes.ts
  → Alíquota: 0% a 27,5% (conforme faixa, após deduções)
```

**Passo 5.2 - INSS e IRRF do 13º (tributação exclusiva):**

```
Se decimoTerceiroProporcional > 0:
  inssDecimoTerceiro = calcularINSS(decimoTerceiroProporcional)
  irrfDecimoTerceiro = calcularIRRF(decimoTerceiroProporcional, inssDecimoTerceiro, numeroDependentes)
Senão:
  inssDecimoTerceiro = 0
  irrfDecimoTerceiro = 0
```

**Passo 5.3 - Totais:**

```
inss = inssSaldoSalario + inssDecimoTerceiro
irrf = irrfSaldoSalario + irrfDecimoTerceiro
```

**Variáveis de saída:**

- `baseCalculoTributos` → base para impostos
- `inss` → total de INSS
- `irrf` → total de IRRF

---

## **ETAPA 6: Cálculo do Líquido**

### Arquivo: [src/lib/calculations/rescisao/orquestrador.ts](src/lib/calculations/rescisao/orquestrador.ts)

**Proventos (o que entra):**

```
totalProventos = saldoSalario
               + avisoPrevioProvento
               + feriasVencidasValor
               + feriasProporcionais
               + decimoTerceiroProporcional
```

**Descontos (o que sai):**

```
totalDescontos = avisoPrevioDesconto
               + inss
               + irrf
               + descontoAdiantamentoDecimoTerceiro
```

**Resultado Final:**

```
totalLiquido = totalProventos - totalDescontos
```

---

## Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────┐
│  Entrada: salário, datas, formas, dependentes      │
└────────────────────┬────────────────────────────────┘
                     ▼
      ┌──────────────────────────────────┐
      │ 1. SALDO DE SALÁRIO              │
      │ → diasTrabalhadosNoMes           │
      │ → saldoSalario                   │
      └────────────────┬───────────────────┘
                       ▼
      ┌──────────────────────────────────┐
      │ 2. AVISO PRÉVIO                  │
      │ → diasAvisoPrevio                │
      │ → dataBaseParaDireitos ✅        │
      │ → avisoPrevioProvento            │
      │ → avisoPrevioDesconto            │
      └────────────┬──────────────────────┘
                   ▼
      ┌─────────────────────────────────────────┐
      │ 3. FÉRIAS                               │
      │ (Usa dataBaseParaDireitos)              │
      │ → mesesProporcionais                    │
      │ → feriasVencidasValor                   │
      │ → feriasProporcionais                   │
      └────────────┬────────────────────────────┘
                   ▼
      ┌─────────────────────────────────────────┐
      │ 4. DÉCIMO TERCEIRO                      │
      │ (Usa dataBaseParaDireitos)              │
      │ → mesesDecimoTerceiro                   │
      │ → decimoTerceiroProporcional            │
      │ → descontoAdiantamentoDecimoTerceiro    │
      └────────────┬────────────────────────────┘
                   ▼
      ┌─────────────────────────────────────────┐
      │ 5. IMPOSTOS (INSS + IRRF)               │
      │ → inss                                  │
      │ → irrf                                  │
      └────────────┬────────────────────────────┘
                   ▼
      ┌─────────────────────────────────────────┐
      │ 6. CÁLCULO DO LÍQUIDO                   │
      │ Proventos - Descontos = Total Líquido   │
      └─────────────────────────────────────────┘
```

---

## Pontos-Chave para Entender

### ✅ `dataBaseParaDireitos` é FUNDAMENTAL

- É calculada no **aviso prévio**
- Determina o cálculo de **férias** e **13º**
- Se há aviso indenizado/trabalhado, **projeta os direitos para frente**
- Se há aviso dispensado, é igual à data de rescisao

### ✅ Férias NÃO ENTRAM em INSS/IRRF na rescisão

- Apenas saldo de salário e 13º são tributados
- Férias vencidas e proporcionais vão inteiras para o líquido

### ✅ 13º recebe tributação exclusiva

- É calculado separadamente para INSS e IRRF
- Não influencia a alíquota do saldo de salário

### ✅ Justa causa ANULA alguns direitos

- Aviso prévio: 0
- Férias proporcionais: 0
- 13º: Pode ser zero dependendo da legislação

---

## Referência de Tipos

```typescript
// src/types/types.ts

type FormaAvisoPrevio = "dispensado" | "trabalhado" | "indenizado";
type FormaRescisao = "sem-justa-causa" | "pedido" | "acordo" | "justa-causa";

interface RescisaoResultType {
  // Entrada
  salarioBruto: number;
  dataAdmissao: string;
  datarescisao: string;
  formaAvisoPrevio: FormaAvisoPrevio;
  formaRescisao: FormaRescisao;
  feriasVencidas: boolean;
  numeroDependentes: number;
  adiantamentoDecimoTerceiro: boolean;

  // Saída (todos os campos calculados)
  diasAvisoPrevio: number;
  diasTrabalhadosNoMes: number;
  mesesProporcionais: number;
  mesesDecimoTerceiro: number;
  saldoSalario: number;
  avisoPrevioProvento: number;
  avisoPrevioDesconto: number;
  feriasVencidasValor: number;
  feriasProporcionais: number;
  decimoTerceiroProporcional: number;
  descontoAdiantamentoDecimoTerceiro: number;
  baseCalculoTributos: number;
  inss: number;
  irrf: number;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
}
```

---

## Exemplo Prático Completo

```
Dados de Entrada:
- Salário bruto: R$ 3.000
- Admissão: 2024-01-15
- rescisao: 2026-08-14 (hoje)
- Forma aviso: "dispensado"
- Forma rescisão: "sem-justa-causa"
- Férias vencidas: true
- Dependentes: 2
- Adiantamento 13º: false

ETAPA 1 - Saldo de Salário:
  diasTrabalhadosNoMes = 14 (1º a 14 de agosto)
  saldoSalario = (3000 / 30) × 14 = R$ 1.400

ETAPA 2 - Aviso Prévio:
  anosCompletos = 2
  diasAvisoPrevio = 30 + (2 × 3) = 36 dias
  dataBaseParaDireitos = 2026-08-14 (dispensado, sem projeção)
  avisoPrevioProvento = 0 (dispensado = sem provento)
  avisoPrevioDesconto = 0

ETAPA 3 - Férias:
  mesesProporcionais = 8 meses (jan-aug, sem contar janeiro completo)
  feriasVencidasValor = 3000 + (3000/3) = R$ 4.000
  feriasProporcionais = (3000/12) × 8 + [(3000/12) × 8] / 3 ≈ R$ 2.222

ETAPA 4 - Décimo Terceiro:
  mesesDecimoTerceiro = 8 meses
  decimoTerceiroProporcional = (3000 / 12) × 8 = R$ 2.000
  descontoAdiantamentoDecimoTerceiro = 0

ETAPA 5 - Impostos:
  inssSaldoSalario ≈ R$ 154 (8% de 1400)
  irrfSaldoSalario ≈ R$ 0 (faixa isenta com dependentes)
  inssDecimoTerceiro ≈ R$ 220 (8% de 2000)
  irrfDecimoTerceiro ≈ R$ 125 (com dependentes)
  TOTAL INSS ≈ R$ 374
  TOTAL IRRF ≈ R$ 125

ETAPA 6 - Líquido:
  totalProventos = 1400 + 0 + 4000 + 2222 + 2000 = R$ 9.622
  totalDescontos = 0 + 374 + 125 + 0 = R$ 499
  totalLiquido = 9.622 - 499 = R$ 9.123
```

---

## Arquivos Relacionados

| Arquivo                                                                                              | Função                        |
| ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| [src/lib/calculations/rescisao/orquestrador.ts](src/lib/calculations/rescisao/orquestrador.ts)       | Orquestra todo o fluxo        |
| [src/lib/calculations/rescisao/saldo-salario.ts](src/lib/calculations/rescisao/saldo-salario.ts)     | Cálculo do saldo proporcional |
| [src/lib/calculations/rescisao/aviso-previo.ts](src/lib/calculations/rescisao/aviso-previo.ts)       | Cálculo de aviso prévio       |
| [src/lib/calculations/rescisao/ferias.ts](src/lib/calculations/rescisao/ferias.ts)                   | Cálculo de férias             |
| [src/lib/calculations/rescisao/decimo-terceiro.ts](src/lib/calculations/rescisao/decimo-terceiro.ts) | Cálculo de 13º                |
| [src/lib/calculations/rescisao/impostos.ts](src/lib/calculations/rescisao/impostos.ts)               | Cálculo de INSS/IRRF          |
| [src/lib/calculations/rescisao/utils/dates.ts](src/lib/calculations/rescisao/utils/dates.ts)         | Funções auxiliares de datas   |
| [src/lib/calculations/taxes.ts](src/lib/calculations/taxes.ts)                                       | Cálculo de INSS e IRRF        |
| [src/types/types.ts](src/types/types.ts)                                                             | Definição de tipos            |
