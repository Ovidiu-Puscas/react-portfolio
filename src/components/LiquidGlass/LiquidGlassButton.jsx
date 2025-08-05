import React from 'react';
import styles from '../../styles/liquidGlass.module.css';

const LiquidGlassButton = ({ children, onClick, className = '', disabled = false, ...props }) => (
  <button
    className={`${styles.glassButton} ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default LiquidGlassButton;
