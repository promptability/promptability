import React from 'react';
import classNames from 'classnames';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  icon,
  className,
  ...props 
}) => {
  const buttonClasses = classNames(
    'flex items-center justify-center rounded-lg focus:outline-none transition-colors',
    {
      // Variants
      'bg-blue-600 hover:bg-blue-500 text-white': variant === 'primary',
      'dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 bg-gray-200 hover:bg-gray-300 text-gray-800': variant === 'secondary',
      'bg-red-600 hover:bg-red-500 text-white': variant === 'danger',
      
      // Sizes
      'px-2 py-1 text-xs': size === 'small',
      'px-3 py-1 text-xs': size === 'medium',
      'px-4 py-2 text-sm': size === 'large',
    },
    className
  );

  return (
    <button 
      className={buttonClasses} 
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;