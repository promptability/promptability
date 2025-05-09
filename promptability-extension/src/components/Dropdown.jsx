import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

const Dropdown = ({ 
  type, 
  options, 
  selectedValue, 
  onChange, 
  isOpen, 
  onToggle,
  icon,
  allowCustom = false
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={() => onToggle(type)} 
        className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-600"
      >
        {icon}
      </button>
      
      {isOpen && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 scale-75 dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-300 rounded p-2 w-32 max-h-48 overflow-y-auto z-20 origin-center shadow-lg">
          <div className="text-xs dark:text-gray-400 text-gray-600 sticky top-0 py-1 dark:bg-gray-800 bg-white capitalize font-medium">
            {type}
          </div>
          
          <div className="space-y-1 mt-1">
            {!allowCustom ? (
              options.map(option => (
                <button 
                  key={option.id} 
                  onClick={() => {
                    onChange(type, option.id);
                    onToggle(null);
                  }} 
                  className={classNames(
                    'w-full text-left px-2 py-1 text-xs rounded flex justify-between items-center',
                    {
                      'bg-blue-600 text-white': selectedValue === option.id,
                      'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 text-gray-800': selectedValue !== option.id
                    }
                  )}
                >
                  <span>{option.name}</span>
                  {selectedValue === option.id && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))
            ) : (
              <textarea 
                className="w-full h-20 p-1 text-xs rounded dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-800 dark:border-gray-700 border-gray-300 border" 
                placeholder={`${type}...`}
                value={selectedValue}
                onChange={e => onChange(type, e.target.value)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;