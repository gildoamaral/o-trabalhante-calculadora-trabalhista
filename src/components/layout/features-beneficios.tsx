"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react"

const features = [
  { icon: Clock, text: "Cálculo instantâneo" },
  { icon: ShieldCheck, text: "Tabelas INSS/IRRF 2026" },
  { icon: CheckCircle2, text: "100% gratuito" },
]

export function FeaturesBeneficios() {
  const duplicatedFeatures = [...features, ...features];

  return (
    <div className="mb-10 w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {/* Mobile: Marquee Contínuo */}

        <div className="md:hidden flex ">
          <motion.div
            className="flex whitespace-nowrap gap-8"
            animate={{
              x: [0, "-50%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {duplicatedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Desktop: Lista estática (Mantida conforme seu código) */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <FeatureIcon className="h-4 w-4 text-primary" />
                <span>{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      );
}