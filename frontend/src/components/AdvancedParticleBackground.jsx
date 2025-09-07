import React, { useEffect, useRef, useState } from "react";

const AdvancedParticleBackground = ({ theme = "dark" }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(theme === "dark");

  // Update isDark when theme prop changes
  useEffect(() => {
    console.log("Theme changed to:", theme);
    setIsDark(theme === "dark");
  }, [theme]);

  // Update particle colors when isDark changes
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      console.log("Updating particle colors, isDark:", isDark);
      
      // Define color schemes
      const darkColors = {
        star: "#60a5fa",
        hexagon: "#a78bfa", 
        circle: "#34d399",
        diamond: "#fbbf24",
        default: "#f472b6"
      };
      
      const lightColors = {
        star: "#3b82f6",
        hexagon: "#8b5cf6",
        circle: "#10b981", 
        diamond: "#f59e0b",
        default: "#ec4899"
      };
      
      const colors = isDark ? darkColors : lightColors;
      
      particlesRef.current.forEach(particle => {
        particle.color = colors[particle.type] || colors.default;
        console.log(`Updated ${particle.type} particle color to:`, particle.color);
      });
    }
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create different types of particles
    const createParticle = (type = "default") => {
      const baseParticle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        originalSize: Math.random() * 4 + 1,
        type: type,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: "#60a5fa" // Default color, will be updated by theme effect
      };

      // Add type-specific properties
      switch (type) {
        case "star":
          return {
            ...baseParticle,
            points: 5,
            innerRadius: baseParticle.size * 0.4,
            outerRadius: baseParticle.size,
          };
        case "hexagon":
          return {
            ...baseParticle,
            sides: 6,
          };
        case "diamond":
          return {
            ...baseParticle,
          };
        default:
          return baseParticle;
      }
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleTypes = ["star", "hexagon", "circle", "diamond", "default"];
      
      for (let i = 0; i < 80; i++) {
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particlesRef.current.push(createParticle(type));
      }
      console.log("Particles initialized, isDark:", isDark);
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.pulsePhase += particle.pulseSpeed;

        // Mouse interaction with different effects for different types
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const force = (120 - distance) / 120;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
          particle.size = particle.originalSize + force * 3;
          particle.opacity = Math.min(0.9, particle.opacity + force * 0.4);
        } else {
          particle.size = Math.max(particle.originalSize, particle.size - 0.05);
          particle.opacity = Math.max(0.2, particle.opacity - 0.01);
        }

        // Boundary check with bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
      });
    };

    const drawParticle = (particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      const pulse = Math.sin(particle.pulsePhase) * 0.3 + 1;
      const currentSize = particle.size * pulse;
      
      ctx.globalAlpha = particle.opacity;
      
      // Use the particle's current color directly
      ctx.fillStyle = particle.color;
      
      switch (particle.type) {
        case "star":
          drawStar(ctx, 0, 0, particle.points, currentSize, particle.innerRadius);
          break;
        case "hexagon":
          drawHexagon(ctx, 0, 0, currentSize);
          break;
        case "diamond":
          drawDiamond(ctx, 0, 0, currentSize);
          break;
        default:
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.restore();
    };

    const drawStar = (ctx, x, y, points, outerRadius, innerRadius) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawHexagon = (ctx, x, y, radius) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawDiamond = (ctx, x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particlesRef.current.forEach((particle) => {
        drawParticle(particle);
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            const opacity = Math.max(0, 0.3 - distance / 500);
            ctx.strokeStyle = isDark 
              ? `rgba(99, 102, 241, ${opacity})`
              : `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default AdvancedParticleBackground;