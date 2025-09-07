import React from "react";
import { motion } from "framer-motion";

const BikeBearText = ({ children, className = "", delay = 0, duration = 0.6 }) => {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

const AppleRevealText = ({ children, className = "", delay = 0, duration = 0.8 }) => {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

export { BikeBearText, AppleRevealText };