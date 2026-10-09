import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks';

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  className = '',
  cascade = false,
  ...props
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  const variants = cascade
    ? {
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.215, 0.61, 0.355, 1],
            staggerChildren: 0.1,
          },
        },
      }
    : {
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

