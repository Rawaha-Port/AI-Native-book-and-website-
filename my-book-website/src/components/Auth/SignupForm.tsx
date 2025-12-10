// src/components/Auth/SignupForm.tsx
import React, { useState } from 'react';
import Questionnaire from '../Questionnaire'; // Adjust path as necessary
import axios from 'axios'; // For API calls
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/auth'; // Adjust path as necessary
import { useHistory } from '@docusaurus/router'; // Assuming Docusaurus router for navigation

interface SignupFormProps {
  onSignupSuccess: (uid: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  const history = useHistory();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUid(userCredential.user.uid);
      setShowQuestionnaire(true);
      // Optionally navigate to a questionnaire page or dashboard after initial signup
      // navigate('/profile/onboarding'); 
    } catch (err: any) {
      setError(err.message);
      console.error("Email signup error:", err);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setCurrentUid(userCredential.user.uid);
      setShowQuestionnaire(true);
      // navigate('/profile/onboarding');
    } catch (err: any) {
      setError(err.message);
      console.error("Google signup error:", err);
    }
  };

  const handleQuestionnaireSubmit = async (data: Record<string, string>) => {
    if (!currentUid) {
        setError("User not authenticated for questionnaire submission.");
        return;
    }
    try {
        // Get Firebase ID token
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) {
            setError("Failed to get authentication token.");
            return;
        }

        // Make API call to backend
        await axios.post(
            `/api/user-profiles/${currentUid}`, // Assumes backend is on the same domain and mounted at /api
            data,
            {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        // Optionally navigate after successful questionnaire submission
        onSignupSuccess(currentUid); // Call original success handler
        history.push('/'); // Navigate to home or dashboard
    } catch (err: any) {
        setError(err.message || "Failed to save profile data.");
        console.error("Questionnaire submission error:", err);
    }
  };

  return (
    <>
      {showQuestionnaire && currentUid ? (
        <Questionnaire onSubmit={handleQuestionnaireSubmit} />
      ) : (
        <div>
          <h2>Sign Up</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleEmailSignup}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up with Email</button>
          </form>
          <button onClick={handleGoogleSignup}>Sign Up with Google</button>
        </div>
      )}
    </>
  );
};

export default SignupForm;
