import React from 'react';
import { Wand, Copy, Bookmark, History, Send } from 'lucide-react';
import './Footer.css';

interface FooterProps {
  onCopy: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  onViewHistory: () => void;
  onSendToAI?: () => void;
  isLoading?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  onCopy,
  onSave,
  onRegenerate,
  onViewHistory,
  onSendToAI,
  isLoading = false
}) => (
  <div className="footer">
    <div className="footer__left">
      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className={`footer__btn ${isLoading ? 'footer__btn--disabled' : ''}`}
      >
        <Wand size={12} className="footer__icon" />Regenerate
      </button>
      <button onClick={onViewHistory} className="footer__btn">
        <History size={12} className="footer__icon" />History
      </button>
    </div>

    <div className="footer__right">
      {onSendToAI && (
        <button onClick={onSendToAI} className="footer__btn footer__btn--accent">
          <Send size={12} className="footer__icon" />Send to AI
        </button>
      )}
      <button onClick={onCopy} className="footer__btn footer__btn--primary">
        <Copy size={12} className="footer__icon" />Copy
      </button>
      <button onClick={onSave} className="footer__btn">
        <Bookmark size={12} className="footer__icon" />Save
      </button>
    </div>
  </div>
);

export default Footer;
