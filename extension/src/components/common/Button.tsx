import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LucideIcon } from 'lucide-react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon: Icon,
  onClick,
  className = '',
  disabled = false
}) => {
  const { theme } = useTheme();
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    theme === 'dark' ? 'btn--dark' : 'btn--light',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={ size==='sm'?12: size==='md'?16:20 } className="btn__icon" />}
      {children}
    </button>
  );
};

export default Button;
