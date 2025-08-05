import React from 'react';
import styles from '../../styles/liquidGlass.module.css';

const LiquidGlassCard = ({
  children,
  className = '',
  variant = 'default',
  animated = false,
  onClick,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return styles.glassPrimary;
      case 'success':
        return styles.glassSuccess;
      case 'danger':
        return styles.glassDanger;
      default:
        return styles.glassCard;
    }
  };

  return (
    <div
      className={`${getVariantClass()} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {animated && <div className={styles.gradientOverlay} />}
      {children}
    </div>
  );
};

export default LiquidGlassCard;
