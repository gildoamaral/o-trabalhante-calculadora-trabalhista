# 📊 O Trabalhante - Calculadora Trabalhista

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)

Uma aplicação web moderna e intuitiva para cálculo de verbas trabalhistas segundo a legislação CLT brasileira, incluindo férias, rescisão e décimo terceiro salário.

🔗 **Acesse em produção:** [https://otrabalhante.vercel.app](https://otrabalhante.vercel.app)

## ✨ Características Principais

### 🧮 Calculadoras Trabalhistas

- **Férias** (implementada)
  - Cálculo proporcional de dias de férias
  - Terço constitucional (1/3 adicional)
  - Abono pecuniário (venda de 1/3 das férias - 10 dias)
  - Descontos de INSS e IRRF com tabelas atualizadas (2024)
  - Seleção de período com calendário interativo
- **Rescisão** (em desenvolvimento)
- **Décimo Terceiro Salário** (em desenvolvimento)

### 📖 Legislação Integrada

- Botão flutuante com acesso à legislação CLT relevante
- Artigos da CLT e Constituição Federal organizados por tema
- Sheet lateral com scroll para fácil consulta
- Contextualizado por página (cada calculadora exibe sua legislação específica)

### 🎨 Interface & UX

- Design responsivo (mobile-first)
- Tema claro/escuro com persistência
- Animações suaves com Framer Motion
- Header com efeito de transparência e blur no scroll
- Feedback visual em tempo real
- Tooltips informativos para campos complexos

## 🛠️ Tecnologias & Ferramentas

### Core

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática

### Estilização

- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animações e transições
- **[shadcn/ui](https://ui.shadcn.com/)** - Sistema de componentes (baseado em Radix)
- **[Lucide React](https://lucide.dev/)** - Ícones

### Análise & Deploy

- **[Vercel](https://vercel.com/)** - Hospedagem

## 📁 Estrutura de Pastas

```
calculadora-trabalhista/
├── public/                      # Arquivos estáticos
│
└── src/
     ├── app/                     # App Router (Next.js 13+)
     │   ├── layout.tsx          # Layout raiz (providers, header, footer)
     │   ├── globals.css         # Estilos globais + variáveis CSS
     │   │
     │   ├── ferias/             # Página de cálculo de férias
     │   │   ├── page.tsx        # Componente principal da página
     │   │   └── components/     # Componentes específicos de férias
     │   │       ├── index.ts
     │   │       ├── vacation-card-form.tsx
     │   │       ├── vacation-card-header.tsx
     │   │       └── vacation-result.tsx
     │   ├── rescisao/
     │   └── decimo-terceiro/
     │
     ├── components/             # Componentes reutilizáveis
     │   ├── layout/             # Componentes de layout global
     │   └── ui/                 # Componentes UI (shadcn/ui)
     │
     ├── data/                   # Dados estáticos
     │
     ├── lib/                    # Utilitários e lógica de negócio
     │
     └── types/                  # Definições TypeScript
```

## 🎨 Decisões de Design

### Sistema de Temas

- Dark mode como padrão (melhor para visualização prolongada)
- Persistência de preferência com `next-themes`

### Animações

- Framer Motion para transições suaves
- Header com blur progressivo no scroll (UX premium)
- Carrossel de features (mobile) vs grid estático (desktop)
- Feedback visual nos cálculos (loading states)

### Responsividade

- Mobile-first approach
- Calendário otimizado para touch

## 📋 Roadmap

- [x] Calculadora de Férias completa
- [x] Legislação integrada (férias)
- [x] Tema claro/escuro
- [x] Design responsivo
- [ ] Calculadora de Rescisão
- [ ] Calculadora de 13º Salário
- [ ] Exportação de resultados (PDF)
- [ ] Histórico de cálculos (localStorage)
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários
- [ ] Internacionalização (i18n)

## ⚠️ Disclaimer

Os valores calculados são estimativas baseadas na legislação CLT vigente. Para valores exatos e informações personalizadas, consulte sempre o departamento de RH da sua empresa ou um contador especializado.

**Desenvolvido com ❤️ usando Next.js e TypeScript**
