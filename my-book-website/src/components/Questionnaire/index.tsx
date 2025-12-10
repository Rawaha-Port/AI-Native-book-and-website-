// src/components/Questionnaire/index.tsx
import React, { useState } from 'react';
import styles from './styles.module.css';

interface QuestionnaireProps {
  onSubmit: (data: Record<string, string>) => void;
}

const osOptions = ['Windows', 'macOS', 'Linux'];
const languageOptions = ['Python', 'JavaScript', 'Java', 'C#', 'Other'];
const hardwareOptions = ['Laptop', 'Desktop', 'Tablet', 'IoT Device'];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onSubmit }) => {
  const [os, setOs] = useState('');
  const [language, setLanguage] = useState('');
  const [hardware, setHardware] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (os && language && hardware) {
      onSubmit({ os, language, hardware });
    } else {
      alert('Please answer all questions.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.questionnaireForm}>
      <h2>Tell us about your background</h2>
      <div className={styles.question}>
        <label>What is your primary Operating System?</label>
        <select value={os} onChange={(e) => setOs(e.target.value)} required>
          <option value="" disabled>Select OS</option>
          {osOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.question}>
        <label>What is your primary Programming Language?</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} required>
          <option value="" disabled>Select Language</option>
          {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.question}>
        <label>What is your primary Hardware?</label>
        <select value={hardware} onChange={(e) => setHardware(e.target.value)} required>
          <option value="" disabled>Select Hardware</option>
          {hardwareOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Questionnaire;
