import { Header } from "@/components/header"
import { ThirteenthSalaryCalculator } from "@/components/thirteenth-salary-calculator"

export const metadata = {
  title: "Calculadora de 13o Salario - CalcTrab",
  description: "Calcule o valor do seu decimo terceiro salario de forma simples e precisa.",
}

export default function ThirteenthSalaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header activePage="13-salario" />
      
      <main className="container mx-auto px-4 py-8">
        <ThirteenthSalaryCalculator />
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Os calculos sao baseados nas tabelas de INSS e IRRF de 2024. 
            Consulte um contador para situacoes especificas.
          </p>
        </div>
      </footer>
    </div>
  )
}
