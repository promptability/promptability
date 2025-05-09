import React from 'react';
import { Wand, X, Settings } from 'lucide-react';
import Toggle from '../common/Toggle';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

interface HeaderProps {
  onSettingsClick: () => void;
  onClose: () => void;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onClose,
  title = 'Promptability',
  showBackButton = false,
  onBackClick
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header ${theme}`}>
      <div className="header__left">
        {showBackButton ? (
          <button
            onClick={onBackClick}
            className="header__icon-button"
            aria-label="Back"
          >
            {/* simple left arrow */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <Wand className="header__logo" size={16} />
        )}
        <span className="header__title">{title}</span>
      </div>

      <div className="header__right">
        <button
          onClick={onSettingsClick}
          className="header__icon-button"
          aria-label="Settings"
        >
          <Settings size={14} />
        </button>

        <div className="header__icon-button">
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} size="sm" />
        </div>

        <button
          onClick={onClose}
          className="header__icon-button"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;
