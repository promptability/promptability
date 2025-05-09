import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.css';
import { LucideIcon } from 'lucide-react';

export interface DropdownOption {
  id: string;
  name: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selected: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  label: string;
  isTextArea?: boolean;
  textValue?: string;
  onTextChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  icon: Icon,
  label,
  isTextArea = false,
  textValue = '',
  onTextChange = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={() => setIsOpen(o => !o)}
      >
        <Icon size={14} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-label">{label}</div>
          <div className="dropdown-content">
            {!isTextArea
              ? options.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={
                      opt.id === selected
                        ? 'dropdown-item selected'
                        : 'dropdown-item'
                    }
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                  >
                    <span>{opt.name}</span>
                    {opt.id === selected && <span className="dropdown-check" />}
                  </button>
                ))
              : <textarea
                  className="dropdown-textarea"
                  placeholder={`${label}...`}
                  value={textValue}
                  onChange={e => onTextChange(e.target.value)}
                />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
