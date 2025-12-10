// src/components/Auth/SigninForm.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/auth'; // Adjust path as necessary
import { useHistory } from '@docusaurus/router'; // Assuming Docusaurus router for navigation

interface SigninFormProps {
  onSigninSuccess: (uid: string) => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSigninSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleEmailSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSigninSuccess(userCredential.user.uid);
      history.push('/'); // Navigate to home or dashboard after successful signin
    } catch (err: any) {
      setError(err.message);
      console.error("Email signin error:", err);
    }
  };

  const handleGoogleSignin = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      onSigninSuccess(userCredential.user.uid);
      history.push('/'); // Navigate to home or dashboard after successful signin
    } catch (err: any) {
      setError(err.message);
      console.error("Google signin error:", err);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleEmailSignin}>
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
        <button type="submit">Sign In with Email</button>
      </form>
      <button onClick={handleGoogleSignin}>Sign In with Google</button>
      {/* Link to password reset will be added here in a later task */}
    </div>
  );
};

export default SigninForm;
