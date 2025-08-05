import React from 'react';
import styles from '../../styles/liquidGlass.module.css';

const LiquidGlassNav = ({ children, className = '', ...props }) => (
  <nav className={`${styles.glassNav} ${className}`} {...props}>
    {children}
  </nav>
);

export default LiquidGlassNav;
