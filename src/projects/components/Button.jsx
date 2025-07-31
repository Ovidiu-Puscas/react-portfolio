import React from 'react';

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'default',
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    warning: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 bg-transparent text-gray-700 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  };

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
