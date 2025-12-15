import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed
import { useHistory } from '@docusaurus/router'; // Docusaurus router for navigation

interface ProfileData {
  languages: { language: string; level: string }[];
  frameworks: string[];
  experience_years: string;
  devices: string[];
  architecture_familiarity: string[];
}

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    languages: [{ language: '', level: 'Beginner' }],
    frameworks: [''],
    experience_years: '',
    devices: [''],
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

  const handleArrayChange = (field: keyof ProfileData, index: number, value: string) => {
    const newArray = [...(profileData[field] as string[])];
    newArray[index] = value;
    setProfileData({ ...profileData, [field]: newArray });
  };

  const addArrayItem = (field: keyof ProfileData) => {
    setProfileData({ ...profileData, [field]: [...(profileData[field] as string[]), ''] });
  };

  const removeArrayItem = (field: keyof ProfileData, index: number) => {
    const newArray = (profileData[field] as string[]).filter((_, i) => i !== index);
    setProfileData({ ...profileData, [field]: newArray });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/signup', {
        email,
        password,
        profile_data: profileData,
      });

      // Assuming the backend returns user data and a token
      const { user, token } = response.data;
      signIn(user, token);
      history.push('/profile'); // Redirect to profile page on success
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

        {/* Languages */}
        <div className="auth-form-group">
          <label>Languages:</label>
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

        {/* Devices */}
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
