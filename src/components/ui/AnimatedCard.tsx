import { motion } from 'framer-motion';
import { cardVariants } from '../../lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  className = '',
  onClick 
}: AnimatedCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}