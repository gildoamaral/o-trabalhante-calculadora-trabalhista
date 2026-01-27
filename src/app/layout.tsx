import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/layout/theme-provider'
import './globals.css'
import { Header } from '@/components/layout/header'
import { FeaturesBeneficios } from '@/components/layout/features-beneficios'
import { FloatingLegislationButton } from '@/components/layout/floating-legislation-button'



const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CalcTrab - Calculadora Trabalhista CLT',
  description: 'Calcule suas verbas trabalhistas: férias, rescisão e mais. Simples, rápido e preciso.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-12">

              {/* Hero Section */}
              <section className="text-center mb-3">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Calculadora de Verbas Trabalhistas</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">Baseado na legislação trabalhista brasileira.</p>
              </section>

              <FeaturesBeneficios />

              {children}
            </main>

            {/* Botão flutuante de legislação */}
            <FloatingLegislationButton />

            {/* Footer info */}
            <footer className="mt-16 text-center border-t border-border py-8" >
              <p className="text-sm text-muted-foreground">
                Desenvolvido com base na legislação CLT brasileira.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Os valores apresentados são estimativas. Consulte o RH da sua empresa para valores exatos.
              </p>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
