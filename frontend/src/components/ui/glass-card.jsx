import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const GlassCard = React.forwardRef(({ className, children, hover = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none before:opacity-0 before:transition-all before:duration-500",
      "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/5 after:to-transparent after:pointer-events-none after:opacity-0 after:transition-all after:duration-500",
      hover ? "hover:before:opacity-100 hover:after:opacity-100 hover:shadow-3xl hover:shadow-black/30 hover:border-white/40 hover:bg-white/15" : "",
      "transition-all duration-500 ease-out",
      className
    )}
    whileHover={hover ? { 
      scale: 1.02, 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    } : {}}
    whileTap={hover ? { 
      scale: 0.98, 
      y: -4,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      } 
    } : {}}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    {...props}
  >
    {/* Animated background gradient */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0"
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    
    {/* Shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0"
      whileHover={{
        x: ["-100%", "100%"],
        opacity: [0, 1, 0],
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    />
    
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
));

GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    {...props}
  />
));

GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <motion.h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight text-white", className)}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    {...props}
  />
));

GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <motion.p
    ref={ref}
    className={cn("text-sm text-white/70", className)}
    whileHover={{ y: -1 }}
    transition={{ duration: 0.2 }}
    {...props}
  />
));

GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    {...props} 
  />
));

GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    {...props}
  />
));

GlassCardFooter.displayName = "GlassCardFooter";

export { GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent };