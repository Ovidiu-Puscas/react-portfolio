import React, { useEffect, useRef } from 'react';
import LiquidBlob from './LiquidBlob';
import './ParallaxBlobBackground.css';

const ParallaxBlobBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      // Update CSS custom properties for smooth parallax
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const scrollProgress = scrolled / (document.body.scrollHeight - windowHeight);

      containerRef.current.style.setProperty('--scroll-progress', scrollProgress);
      containerRef.current.style.setProperty('--scroll-y', scrolled + 'px');
    };

    const updateAnimation = () => {
      handleScroll();
      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateAnimation();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax-blob-background">
      {/* Large ambient blobs */}
      <LiquidBlob
        size={800}
        color1="rgba(103, 126, 234, 0.4)"
        color2="rgba(118, 75, 162, 0.4)"
        color3="rgba(240, 147, 251, 0.4)"
        color4="rgba(245, 87, 108, 0.4)"
        animationDuration="40s"
        className="parallax-blob parallax-blob-large parallax-blob-1"
      />

      <LiquidBlob
        size={600}
        color1="rgba(6, 182, 212, 0.3)"
        color2="rgba(59, 130, 246, 0.3)"
        color3="rgba(139, 92, 246, 0.3)"
        color4="rgba(236, 72, 153, 0.3)"
        animationDuration="35s"
        className="parallax-blob parallax-blob-large parallax-blob-2"
      />

      <LiquidBlob
        size={700}
        color1="rgba(16, 185, 129, 0.25)"
        color2="rgba(245, 158, 11, 0.25)"
        color3="rgba(239, 68, 68, 0.25)"
        color4="rgba(139, 92, 246, 0.25)"
        animationDuration="45s"
        className="parallax-blob parallax-blob-large parallax-blob-3"
      />

      {/* Medium floating blobs */}
      <LiquidBlob
        size={400}
        color1="rgba(103, 126, 234, 0.2)"
        color2="rgba(240, 147, 251, 0.2)"
        color3="rgba(245, 87, 108, 0.2)"
        color4="rgba(6, 182, 212, 0.2)"
        animationDuration="30s"
        className="parallax-blob parallax-blob-medium parallax-blob-4"
      />

      <LiquidBlob
        size={350}
        color1="rgba(59, 130, 246, 0.18)"
        color2="rgba(139, 92, 246, 0.18)"
        color3="rgba(16, 185, 129, 0.18)"
        color4="rgba(245, 158, 11, 0.18)"
        animationDuration="25s"
        className="parallax-blob parallax-blob-medium parallax-blob-5"
      />

      <LiquidBlob
        size={300}
        color1="rgba(236, 72, 153, 0.15)"
        color2="rgba(239, 68, 68, 0.15)"
        color3="rgba(103, 126, 234, 0.15)"
        color4="rgba(118, 75, 162, 0.15)"
        animationDuration="28s"
        className="parallax-blob parallax-blob-medium parallax-blob-6"
      />

      {/* Small accent blobs */}
      <LiquidBlob
        size={200}
        color1="rgba(245, 87, 108, 0.12)"
        color2="rgba(240, 147, 251, 0.12)"
        color3="rgba(6, 182, 212, 0.12)"
        color4="rgba(59, 130, 246, 0.12)"
        animationDuration="20s"
        className="parallax-blob parallax-blob-small parallax-blob-7"
      />

      <LiquidBlob
        size={150}
        color1="rgba(16, 185, 129, 0.1)"
        color2="rgba(245, 158, 11, 0.1)"
        color3="rgba(139, 92, 246, 0.1)"
        color4="rgba(236, 72, 153, 0.1)"
        animationDuration="18s"
        className="parallax-blob parallax-blob-small parallax-blob-8"
      />

      <LiquidBlob
        size={180}
        color1="rgba(103, 126, 234, 0.08)"
        color2="rgba(118, 75, 162, 0.08)"
        color3="rgba(239, 68, 68, 0.08)"
        color4="rgba(245, 87, 108, 0.08)"
        animationDuration="22s"
        className="parallax-blob parallax-blob-small parallax-blob-9"
      />
    </div>
  );
};

export default ParallaxBlobBackground;
