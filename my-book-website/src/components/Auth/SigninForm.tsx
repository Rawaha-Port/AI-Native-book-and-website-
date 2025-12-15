import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed
import { useHistory } from '@docusaurus/router'; // Docusaurus router for navigation

const SigninForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/signin', {
        email,
        password,
      });

      // Assuming the backend returns user data and a token
      const { user, token } = response.data;
      signIn(user, token);
      history.push('/profile'); // Redirect to profile page on success
    } catch (err: any) {
      console.error('Signin error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
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
        <button type="submit" disabled={loading} className="button button--primary button--action">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
