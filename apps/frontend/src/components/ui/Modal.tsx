import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, titulo, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
              className={clsx(
                'w-full bg-white dark:bg-grafite-900 rounded-2xl shadow-2xl',
                'border border-grafite-200 dark:border-grafite-700 overflow-hidden',
                sizes[size],
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 
                              border-b border-grafite-200 dark:border-grafite-700">
                <h2 className="font-semibold text-grafite-900 dark:text-white">{titulo}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-grafite-400 hover:text-grafite-700 
                             dark:hover:text-grafite-200 hover:bg-grafite-100 dark:hover:bg-grafite-800
                             transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
