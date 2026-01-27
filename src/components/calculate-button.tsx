
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './ui/button'
import { Calculator } from 'lucide-react'

export function CalculateButton({
  onClick,
  disabled,
  isCalculating,
  label
}: {
  onClick: () => void
  disabled: boolean
  isCalculating: boolean
  label: string
}) {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full" size="lg">
      <AnimatePresence mode="wait">
        {isCalculating ? (
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
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}