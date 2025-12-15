import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  languages: { language: string; level: string }[];
  frameworks: string[];
  experience_years: string;
  devices: string[];
  architecture_familiarity: string[];
}

const ProfileForm: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    languages: [],
    frameworks: [],
    experience_years: '',
    devices: [],
    architecture_familiarity: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        languages: currentUser.languages || [],
        frameworks: currentUser.frameworks || [],
        experience_years: currentUser.experience_years || '',
        devices: currentUser.devices || [],
        architecture_familiarity: currentUser.architecture_familiarity || [],
      });
    }
  }, [currentUser]);

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
    setMessage(null);
    try {
      const response = await axios.put('/api/v1/users/me', profileData);
      updateProfile(response.data); // Update context with new profile data
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        {/* Languages */}
        <div>
          <label>Languages:</label>
          {profileData.languages.map((lang, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
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
              <button type="button" onClick={() => removeLanguage(index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addLanguage} disabled={loading}>Add Language</button>
        </div>

        {/* Frameworks */}
        <div>
          <label>Frameworks:</label>
          {profileData.frameworks.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('frameworks', index, e.target.value)}
                placeholder="Framework"
                disabled={loading}
              />
              <button type="button" onClick={() => removeArrayItem('frameworks', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('frameworks')} disabled={loading}>Add Framework</button>
        </div>

        {/* Experience Years */}
        <div>
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
        <div>
          <label>Devices:</label>
          {profileData.devices.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('devices', index, e.target.value)}
                placeholder="Device"
                disabled={loading}
              />
              <button type="button" onClick={() => removeArrayItem('devices', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('devices')} disabled={loading}>Add Device</button>
        </div>

        {/* Architecture Familiarity */}
        <div>
          <label>Architecture Familiarity:</label>
          {profileData.architecture_familiarity.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('architecture_familiarity', index, e.target.value)}
                placeholder="Architecture (e.g., Microservices)"
                disabled={loading}
              />
              <button type="button" onClick={() => removeArrayItem('architecture_familiarity', index)} disabled={loading}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('architecture_familiarity')} disabled={loading}>Add Architecture</button>
        </div>


        <button type="submit" disabled={loading} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
