import React from 'react';
import { Wand, Briefcase, MessageCircle, Edit } from 'lucide-react';
import Dropdown from '../common/Dropdown';
import { useTheme } from '../../contexts/ThemeContext';
import './PromptEditor.css';

interface PromptEditorProps {
  promptText: string;
  platforms: { id: string; name: string }[];
  roleIndustries: { id: string; name: string }[];
  tones: { id: string; name: string }[];
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

const PromptEditor: React.FC<PromptEditorProps> = ({
  promptText,
  platforms,
  roleIndustries,
  tones,
  selectedOptions,
  onOptionChange,
  onContextChange
}) => {
  const { theme } = useTheme();

  return (
    <div className="prompt-editor">
      <div className={`prompt-editor__box ${theme}`}>
        <pre className="prompt-editor__text">{promptText}</pre>
      </div>

      <div className="prompt-editor__dropdowns">
        <Dropdown
          options={platforms}
          selected={selectedOptions.platform}
          onChange={v => onOptionChange('platform', v)}
          icon={Wand}
          label="AI Platform"
        />
        <Dropdown
          options={roleIndustries}
          selected={`${selectedOptions.role}-${selectedOptions.industry}`}
          onChange={v => onOptionChange('role', v)}
          icon={Briefcase}
          label="Role & Industry"
        />
        <Dropdown
          options={tones}
          selected={selectedOptions.tone}
          onChange={v => onOptionChange('tone', v)}
          icon={MessageCircle}
          label="Tone"
        />
        <Dropdown
          options={[]}
          selected={selectedOptions.context}
          onChange={() => {}}
          isTextArea
          textValue={selectedOptions.context}
          onTextChange={onContextChange}
          icon={Edit}
          label="Context"
        />
      </div>
    </div>
  );
};

export default PromptEditor;
