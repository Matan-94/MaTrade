import { motion } from 'framer-motion';
import { containerVariants } from '../../lib/animations';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedContainer({ 
  children, 
  className = '',
  delay = 0 
}: AnimatedContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}