import React, { useState, useRef } from "react";

const LiquidGlassCard = React.forwardRef(({ className, children, ...props }, ref) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate blur intensity - more subtle
  const centerX = 200;
  const centerY = 150;
  const distance = Math.sqrt(Math.pow(mousePosition.x - centerX, 2) + Math.pow(mousePosition.y - centerY, 2));
  const maxDistance = 150;
  const blurIntensity = isHovered ? Math.min(40, 25 + (distance / maxDistance) * 15) : 25;

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border shadow-2xl shadow-indigo-500/10 transition-all duration-300 ease-out ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isHovered 
          ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)`
          : 'rgba(255, 255, 255, 0.05)',
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
        backdropFilter: `blur(${blurIntensity}px) saturate(${isHovered ? 130 : 110}%)`,
      }}
      {...props}
    >
      {/* Very subtle liquid glass distortion */}
      <div
        className="absolute inset-0 transition-all duration-200"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04) 0%, transparent 60%)`,
          backdropFilter: `blur(${blurIntensity * 0.3}px) saturate(140%)`,
        }}
      />
      
      {/* Subtle ripple - very small */}
      <div
        className="absolute rounded-full border border-white/10 transition-all duration-600"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          width: '16px',
          height: '16px',
          opacity: isHovered ? [0, 0.5, 0] : 0,
          transform: `scale(${isHovered ? 1.2 : 0})`,
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
LiquidGlassCard.displayName = "LiquidGlassCard";

const LiquidGlassButton = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "relative overflow-hidden rounded-xl font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
  
  const variants = {
    default: "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-indigo-500/10",
    primary: "bg-[#0C0A3E] backdrop-blur-xl border border-[#0C0A3E]/30 text-white hover:bg-[#0C0A3E]/90 shadow-lg shadow-[#0C0A3E]/20", // FIXED: Button color to #0C0A3E
    ghost: "bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-white/20"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 ${className || ''}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
});
LiquidGlassButton.displayName = "LiquidGlassButton";

const LiquidGlassCardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const LiquidGlassCardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const LiquidGlassCardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

const LiquidGlassCardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const LiquidGlassCardFooter = ({ children, className = "", ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export { 
  LiquidGlassCard, 
  LiquidGlassButton,
  LiquidGlassCardHeader, 
  LiquidGlassCardFooter, 
  LiquidGlassCardTitle, 
  LiquidGlassCardDescription, 
  LiquidGlassCardContent 
};