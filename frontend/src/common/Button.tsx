// src/components/common/Button.tsx
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  // Classes for loading and disabled states
  const stateClasses = loading || disabled 
    ? 'opacity-70 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    widthClass,
    className
  ].join(' ');
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
    </button>
  );
};

export default Button;