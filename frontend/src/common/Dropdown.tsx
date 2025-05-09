// src/components/common/Dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedId?: string;
  placeholder?: string;
  onChange: (option: DropdownOption) => void;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedId,
  placeholder = 'Select an option',
  onChange,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find the selected option
  const selectedOption = options.find(option => option.id === selectedId);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
      className={`relative ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`
          w-full px-4 py-2 text-left bg-white border border-gray-300 rounded shadow-sm
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? (
          <div className="flex items-center">
            {selectedOption.icon && (
              <span className="mr-2">{selectedOption.icon}</span>
            )}
            <span>{selectedOption.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.id}
                className={`
                  px-4 py-2 cursor-pointer hover:bg-blue-50 flex items-center
                  ${option.id === selectedId ? 'bg-blue-100' : ''}
                `}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.id === selectedId}
              >
                {option.icon && (
                  <span className="mr-2">{option.icon}</span>
                )}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;