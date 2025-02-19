"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
export default function PageTransition({ children, classNames }: { children: React.ReactNode; classNames?: string }) {
  const pathname = usePathname();

  return (
    <motion.main
      key={pathname}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.5,
      }}
      variants={{
        initialState: {
          opacity: 0,
        },
        animateState: {
          opacity: 1,
        },
        exitState: {
          opacity: 0,
        },
      }}
      className={classNames}>
      {children}
    </motion.main>
  );
}
