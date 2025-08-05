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
    <div className={`${getVariantClass()} ${className}`} onClick={onClick} {...props}>
      {animated && <div className={styles.gradientOverlay} />}
      {children}
    </div>
  );
};

export default LiquidGlassCard;
