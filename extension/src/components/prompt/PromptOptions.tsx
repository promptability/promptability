import React, { useState, useRef, useEffect } from 'react';
import { Wand, Briefcase, MessageCircle, Edit, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './PromptOptions.css';

interface PromptOption {
  id: string;
  name: string;
}

interface PromptOptionsProps {
  platforms: PromptOption[];
  roleIndustries: PromptOption[];
  tones: PromptOption[];
  selectedOptions: {
    platform: string;
    role: string;
    industry: string;
    tone: string;
    context: string;
  };
  onOptionChange: (type: string, value: string) => void;
  onContextChange: (value: string) => void;
}

const PromptOptions: React.FC<PromptOptionsProps> = ({
  platforms,
  roleIndustries,
  tones,
  selectedOptions,
  onOptionChange,
  onContextChange
}) => {
  const { theme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [contextText, setContextText] = useState(selectedOptions.context);

  // click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setContextText(selectedOptions.context);
  }, [selectedOptions.context]);

  const toggleDropdown = (type: string) =>
    setActiveDropdown(current => (current === type ? null : type));

  const handleSelect = (type: string, value: string) => {
    onOptionChange(type, value);
    setActiveDropdown(null);
  };

  const saveContext = () => {
    onContextChange(contextText);
    setActiveDropdown(null);
  };

  const renderButton = (
    type: string,
    icon: React.ReactNode,
    label: string,
    display: string
  ) => (
    <div className="prompt-options__wrapper" ref={type === activeDropdown ? dropdownRef : null}>
      <button
        onClick={() => toggleDropdown(type)}
        className={`prompt-options__btn ${theme} ${
          activeDropdown === type ? 'prompt-options__btn--active' : ''
        }`}
      >
        {icon}
        <span>{display || label}</span>
      </button>

      {activeDropdown === type && (
        <div className={`prompt-options__menu ${theme}`}>
          <div className="prompt-options__menu-header">{label}</div>
          <div className="prompt-options__menu-list">
            {type === 'platform' &&
              platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect('platform', p.id)}
                  className={`prompt-options__menu-item ${
                    selectedOptions.platform === p.id ? 'prompt-options__menu-item--checked' : ''
                  }`}
                >
                  <span>{p.name}</span>
                  {selectedOptions.platform === p.id && <Check size={12} />}
                </button>
              ))}

            {type === 'role' &&
              roleIndustries.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelect('role', r.id)}
                  className={`prompt-options__menu-item ${
                    `${selectedOptions.role}-${selectedOptions.industry}` === r.id
                      ? 'prompt-options__menu-item--checked'
                      : ''
                  }`}
                >
                  <span>{r.name}</span>
                  {`${selectedOptions.role}-${selectedOptions.industry}` === r.id && (
                    <Check size={12} />
                  )}
                </button>
              ))}

            {type === 'tone' &&
              tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect('tone', t.id)}
                  className={`prompt-options__menu-item ${
                    selectedOptions.tone === t.id ? 'prompt-options__menu-item--checked' : ''
                  }`}
                >
                  <span>{t.name}</span>
                  {selectedOptions.tone === t.id && <Check size={12} />}
                </button>
              ))}

            {type === 'context' && (
              <>
                <textarea
                  className="prompt-options__textarea"
                  value={contextText}
                  onChange={e => setContextText(e.target.value)}
                />
                <div className="prompt-options__menu-actions">
                  <button onClick={() => setActiveDropdown(null)}>Cancel</button>
                  <button onClick={saveContext}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const displayName = (type: string) => {
    if (type === 'platform') {
      return platforms.find(p => p.id === selectedOptions.platform)?.name;
    }
    if (type === 'role') {
      return roleIndustries.find(r => r.id === `${selectedOptions.role}-${selectedOptions.industry}`)?.name;
    }
    if (type === 'tone') {
      return tones.find(t => t.id === selectedOptions.tone)?.name;
    }
    return selectedOptions.context || 'Context';
  };

  return (
    <div className="prompt-options">
      {renderButton('platform', <Wand size={12} />, 'AI Platform', displayName('platform')!)}
      {renderButton('role', <Briefcase size={12} />, 'Role & Industry', displayName('role')!)}
      {renderButton('tone', <MessageCircle size={12} />, 'Tone', displayName('tone')!)}
      {renderButton('context', <Edit size={12} />, 'Context', displayName('context')!)}
    </div>
  );
};

export default PromptOptions;
