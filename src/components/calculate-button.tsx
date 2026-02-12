import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './ui/button'
import { Calculator } from 'lucide-react'

interface CalculateButtonProps {
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function CalculateButton({
  onClick,
  disabled,
  children,
}: CalculateButtonProps) {
  const [internalIsCalculating, setInternalIsCalculating] = useState(false);

  const handleInternalClick = async () => {
    setInternalIsCalculating(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    await onClick();

    setInternalIsCalculating(false);
  };

  return (
    <Button 
      onClick={handleInternalClick} 
      disabled={disabled || internalIsCalculating} 
      className="w-full" 
      size="lg"
    >
      <AnimatePresence mode="wait">
        {internalIsCalculating ? (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Calculator className="h-5 w-5" />
            </motion.div>
            Calculando...
          </motion.div>
        ) : (
          <motion.div
            key="calculate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}