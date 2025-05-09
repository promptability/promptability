import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import './ProfileSettings.css';

interface ProfileData {
  full_name: string;
  job_type: string;
  experience_level: string;
  preferred_tone: string;
  language: string;
  custom_context: string;
}

const jobTypes = [
  { id: 'engineering', name: 'Engineering' },
  { id: 'marketing',   name: 'Marketing' },
  { id: 'design',      name: 'Design' },
  { id: 'writing',     name: 'Writing' },
  { id: 'research',    name: 'Research' },
  { id: 'business',    name: 'Business' },
  { id: 'education',   name: 'Education' },
  { id: 'other',       name: 'Other' }
];

const experienceLevels = [
  { id: 'beginner',     name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced',     name: 'Advanced' },
  { id: 'expert',       name: 'Expert' }
];

const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual',       name: 'Casual' },
  { id: 'friendly',     name: 'Friendly' },
  { id: 'persuasive',   name: 'Persuasive' },
  { id: 'formal',       name: 'Formal' },
  { id: 'technical',    name: 'Technical' }
];

const languages = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'zh', name: 'Chinese' },
  { id: 'hi', name: 'Hindi' },
  { id: 'ar', name: 'Arabic' },
  { id: 'ru', name: 'Russian' },
  { id: 'pt', name: 'Portuguese' },
  { id: 'ja', name: 'Japanese' }
];

const ProfileSettings: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [message,   setMessage]   = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    job_type: 'engineering',
    experience_level: 'intermediate',
    preferred_tone: 'professional',
    language: 'en',
    custom_context: ''
  });

  // Simulate loading existing profile
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    setTimeout(() => {
      setProfile({
        full_name: 'John Doe',
        job_type: 'engineering',
        experience_level: 'advanced',
        preferred_tone: 'professional',
        language: 'en',
        custom_context: 'AI researcher specializing in NLP and prompt engineering.'
      });
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage({ text: 'Profile saved successfully!', type: 'success' });
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="profile-settings__loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`profile-settings ${theme}`}>
      <h3 className="profile-settings__title">Your Profile</h3>
      {message && (
        <div className={`profile-settings__message profile-settings__message--${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSave}>
        <div className="profile-settings__row">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="profile-settings__input"
          />
        </div>
        <div className="profile-settings__row">
          <label>Job Type</label>
          <select
            name="job_type"
            value={profile.job_type}
            onChange={handleChange}
            className="profile-settings__select"
          >
            {jobTypes.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        </div>
        <div className="profile-settings__row">
          <label>Experience Level</label>
          <select
            name="experience_level"
            value={profile.experience_level}
            onChange={handleChange}
            className="profile-settings__select"
          >
            {experienceLevels.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="profile-settings__row">
          <label>Preferred Tone</label>
          <select
            name="preferred_tone"
            value={profile.preferred_tone}
            onChange={handleChange}
            className="profile-settings__select"
          >
            {tones.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="profile-settings__row">
          <label>Language</label>
          <select
            name="language"
            value={profile.language}
            onChange={handleChange}
            className="profile-settings__select"
          >
            {languages.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="profile-settings__row profile-settings__row--textarea">
          <label>Custom Context</label>
          <textarea
            name="custom_context"
            value={profile.custom_context}
            onChange={handleChange}
            className="profile-settings__textarea"
          />
        </div>
        <button
          type="submit"
          className="profile-settings__save"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
