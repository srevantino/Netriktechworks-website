import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const CursorReactiveBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });
  const { isDark, colors } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create dots
    const dotCount = 200;
    const dots = [];
    
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2,
        originalSize: 2,
        opacity: isDark ? 0.4 : 0.2,
        originalOpacity: isDark ? 0.4 : 0.2,
        velocity: {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3
        }
      });
    }
    
    dotsRef.current = dots;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient that adapts to theme
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isDark) {
        // Dark mode: Russian blue gradient
        gradient.addColorStop(0, '#1E3A8A');
        gradient.addColorStop(0.5, '#1e40af');
        gradient.addColorStop(1, '#1E3A8A');
      } else {
        // Light mode: white to light gray gradient
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f8f9fa');
        gradient.addColorStop(1, '#ffffff');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      dotsRef.current.forEach(dot => {
        // Always move the dots
        dot.x += dot.velocity.x;
        dot.y += dot.velocity.y;

        // Calculate distance from mouse
        const dx = mouseRef.current.x - dot.x;
        const dy = mouseRef.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        if (distance < maxDistance && mouseRef.current.isHovering) {
          // Repel effect when hovering
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          dot.x -= Math.cos(angle) * force * 4;
          dot.y -= Math.sin(angle) * force * 4;
          
          // Scale and opacity effects
          dot.size = dot.originalSize + force * 2.5;
          dot.opacity = Math.min(0.8, dot.originalOpacity + force * 0.5);
        } else {
          // Normal floating state
          dot.size = dot.originalSize;
          dot.opacity = dot.originalOpacity;
        }

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) {
          dot.velocity.x *= -1;
          dot.x = Math.max(0, Math.min(canvas.width, dot.x));
        }
        if (dot.y < 0 || dot.y > canvas.height) {
          dot.velocity.y *= -1;
          dot.y = Math.max(0, Math.min(canvas.height, dot.y));
        }

        // Draw dot with theme-appropriate color
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        
        if (isDark) {
          // Dark mode: white dots with subtle glow
          ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.shadowBlur = 3;
        } else {
          // Light mode: dark blue dots
          ctx.fillStyle = `rgba(12, 10, 62, ${dot.opacity})`;
          ctx.shadowColor = 'rgba(12, 10, 62, 0.2)';
          ctx.shadowBlur = 2;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark, colors]);

  const handleMouseMove = (e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  const handleMouseEnter = () => {
    mouseRef.current.isHovering = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 0,
        background: 'transparent'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default CursorReactiveBackground;