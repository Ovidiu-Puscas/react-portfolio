import React, { useEffect, useRef } from 'react';
import './LiquidBlob.css';

const LiquidBlob = ({ 
  size = 400, 
  color1 = '#667eea',
  color2 = '#764ba2',
  color3 = '#f093fb',
  color4 = '#f5576c',
  animationDuration = '20s',
  className = ''
}) => {
  const blobRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let lastScrollY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // Calculate depth-based speeds based on blob size
    const getDepthSpeeds = (blobSize) => {
      if (blobSize >= 380) {
        return { scrollSpeed: 0.1, mouseSpeed: 0.02, rotationSpeed: 0.5 }; // Far background
      } else if (blobSize >= 340) {
        return { scrollSpeed: 0.2, mouseSpeed: 0.04, rotationSpeed: 0.8 }; // Mid-far
      } else if (blobSize >= 320) {
        return { scrollSpeed: 0.3, mouseSpeed: 0.06, rotationSpeed: 1.0 }; // Mid
      } else if (blobSize >= 280) {
        return { scrollSpeed: 0.5, mouseSpeed: 0.08, rotationSpeed: 1.2 }; // Mid-close
      } else {
        return { scrollSpeed: 0.7, mouseSpeed: 0.1, rotationSpeed: 1.5 }; // Foreground
      }
    };

    const { scrollSpeed, mouseSpeed, rotationSpeed } = getDepthSpeeds(size);
    
    const updateBlob = () => {
      if (!blobRef.current) return;
      
      const currentScrollY = window.pageYOffset;
      
      // Mouse position
      const mouseX = lastMouseX * mouseSpeed * 50;
      const mouseY = lastMouseY * mouseSpeed * 50;
      const mouseRotate = (lastMouseX + lastMouseY) * rotationSpeed;
      
      // Scroll-based translation (different for each blob)
      const scrollTranslateY = currentScrollY * scrollSpeed * -0.3;
      const scrollRotate = (currentScrollY * 0.001) * rotationSpeed;
      
      // Combine transforms
      const finalTransform = `
        translate(${mouseX}px, ${mouseY + scrollTranslateY}px) 
        rotate(${mouseRotate + scrollRotate}deg)
      `;
      
      blobRef.current.style.transform = finalTransform;
      
      lastScrollY = currentScrollY;
      animationFrameId = requestAnimationFrame(updateBlob);
    };
    
    const handleMouseMove = (e) => {
      lastMouseX = (e.clientX / window.innerWidth) - 0.5;
      lastMouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Start animation loop
    updateBlob();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [size]);

  return (
    <div className={`liquid-blob-container ${className}`}>
      <div 
        ref={blobRef}
        className="liquid-blob"
        style={{
          '--blob-size': `${size}px`,
          '--color-1': color1,
          '--color-2': color2,
          '--color-3': color3,
          '--color-4': color4,
          '--animation-duration': animationDuration
        }}
      >
        <div className="blob-gradient blob-gradient-1"></div>
        <div className="blob-gradient blob-gradient-2"></div>
        <div className="blob-gradient blob-gradient-3"></div>
        <div className="blob-gradient blob-gradient-4"></div>
      </div>
      
      {/* SVG Filter for gooey effect */}
      <svg className="liquid-blob-filter">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
              result="gooey" 
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default LiquidBlob;