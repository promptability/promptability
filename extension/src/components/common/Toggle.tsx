import React from 'react';
import './Toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  size = 'sm'
}) => {
  const handleToggle = () => onChange(!checked);
  const classes = [
    'toggle',
    `toggle--${size}`,
    checked ? 'toggle--checked' : ''
  ].join(' ');

  return (
    <div className={classes} onClick={handleToggle}>
      <div className="toggle__thumb" />
    </div>
  );
};

export default Toggle;
