import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from '@docusaurus/router';

interface ProfileData {
  languages: { language: string; level: string }[];
  frameworks: string[];
  experience_years: string;
  // devices: string[]; // Removed
  architecture_familiarity: string[];
}

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>(''); // New state for full name
  const [password, setPassword] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    languages: [{ language: '', level: 'Beginner' }],
    frameworks: [''],
    experience_years: '',
    // devices: [], // Removed
    architecture_familiarity: [''],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();
  const history = useHistory();

  const handleLanguageChange = (index: number, field: keyof (typeof profileData.languages)[0], value: string) => {
    const newLanguages = [...profileData.languages];
    newLanguages[index][field] = value;
    setProfileData({ ...profileData, languages: newLanguages });
  };

  const addLanguage = () => {
    setProfileData({ ...profileData, languages: [...profileData.languages, { language: '', level: 'Beginner' }] });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = profileData.languages.filter((_, i) => i !== index);
    setProfileData({ ...profileData, languages: newLanguages });
  };

  // handleArrayChange and addArrayItem/removeArrayItem are still generic but 'devices' won't use them
  const handleArrayChange = (field: Exclude<keyof ProfileData, 'languages'>, index: number, value: string) => {
    const currentArray = profileData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    setProfileData({ ...profileData, [field]: newArray });
  };

  const addArrayItem = (field: Exclude<keyof ProfileData, 'languages'>) => {
    const currentArray = profileData[field] as string[];
    setProfileData({ ...profileData, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: Exclude<keyof ProfileData, 'languages'>, index: number) => {
    const currentArray = profileData[field] as string[];
    const newArray = currentArray.filter((_, i) => i !== index);
    setProfileData({ ...profileData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/signup', {
        email,
        full_name: fullName, // Include full_name
        password,
        profile_data: profileData,
      });

      const { user, token } = response.data;
      signIn(user, token);
      history.push('/profile');
    } catch (err: any) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-form-error">{error}</p>}
        <div className="auth-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="auth-form-group">
          <label htmlFor="fullName">Full Name:</label> {/* New Full Name field */}
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="auth-form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* User Profile Questions */}
        <h3>Tell us about your background:</h3>

        {/* Programming Languages (formerly Languages) */}
        <div className="auth-form-group">
          <label>Programming Languages:</label> {/* Changed label */}
          {profileData.languages.map((lang, index) => (
            <div key={index} className="auth-form-array-item">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                placeholder="Language"
                disabled={loading}
              />
              <select
                value={lang.level}
                onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                disabled={loading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button type="button" className="button button--sm button--danger" onClick={() => removeLanguage(index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" className="button button--sm button--secondary" onClick={addLanguage} disabled={loading}>Add Language</button>
        </div>

        {/* Frameworks */}
        <div className="auth-form-group">
          <label>Frameworks:</label>
          {profileData.frameworks.map((item, index) => (
            <div key={index} className="auth-form-array-item">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('frameworks', index, e.target.value)}
                placeholder="Framework"
                disabled={loading}
              />
              <button type="button" className="button button--sm button--danger" onClick={() => removeArrayItem('frameworks', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" className="button button--sm button--secondary" onClick={() => addArrayItem('frameworks')} disabled={loading}>Add Framework</button>
        </div>

        {/* Experience Years */}
        <div className="auth-form-group">
          <label htmlFor="experience_years">Years of Experience:</label>
          <input
            type="text"
            id="experience_years"
            value={profileData.experience_years}
            onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })}
            placeholder="e.g., 3-5, 6+"
            disabled={loading}
          />
        </div>

        {/* Devices (Removed) */}
        {/*
        <div className="auth-form-group">
          <label>Devices:</label>
          {profileData.devices.map((item, index) => (
            <div key={index} className="auth-form-array-item">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('devices', index, e.target.value)}
                placeholder="Device"
                disabled={loading}
              />
              <button type="button" className="button button--sm button--danger" onClick={() => removeArrayItem('devices', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" className="button button--sm button--secondary" onClick={() => addArrayItem('devices')} disabled={loading}>Add Device</button>
        </div>
        */}

        {/* Architecture Familiarity */}
        <div className="auth-form-group">
          <label>Architecture Familiarity:</label>
          {profileData.architecture_familiarity.map((item, index) => (
            <div key={index} className="auth-form-array-item">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('architecture_familiarity', index, e.target.value)}
                placeholder="Architecture (e.g., Microservices)"
                disabled={loading}
              />
              <button type="button" className="button button--sm button--danger" onClick={() => removeArrayItem('architecture_familiarity', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" className="button button--sm button--secondary" onClick={() => addArrayItem('architecture_familiarity')} disabled={loading}>Add Architecture</button>
        </div>


        <button type="submit" disabled={loading} className="button button--primary button--action">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
