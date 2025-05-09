import React from 'react';
import { Wand, Copy, Bookmark } from 'lucide-react';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import './PromptActions.css';

interface PromptActionsProps {
  onReplace: () => void;
  onCopy: () => void;
  onSave: () => void;
}

const PromptActions: React.FC<PromptActionsProps> = ({
  onReplace,
  onCopy,
  onSave
}) => {
  const { theme } = useTheme();

  return (
    <div className={`prompt-actions ${theme}`}>
      <Button
        variant="secondary"
        size="sm"
        icon={Wand}
        onClick={onReplace}
        className="prompt-actions__replace"
      >
        Replace
      </Button>

      <div className="prompt-actions__group">
        <Button
          variant="primary"
          size="sm"
          icon={Copy}
          onClick={onCopy}
        >
          Copy
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={Bookmark}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default PromptActions;
