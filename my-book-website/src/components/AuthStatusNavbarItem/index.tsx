// src/components/AuthStatusNavbarItem/index.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/auth';
import Link from '@docusaurus/Link';

const AuthStatusNavbarItem: React.FC = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect or show a message
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="navbar__item">Loading...</div>;
  }

  return (
    <div className="navbar__item">
      {user ? (
        <>
          <span className="navbar__link">Welcome, {user.email || user.displayName || 'User'}!</span>
          <button className="button button--danger button--sm margin-left--sm" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className="button button--primary button--sm"
            to="/signup" // Assuming you create a /signup page
            style={{ marginRight: '0.5rem' }}
          >
            Sign Up
          </Link>
          <Link
            className="button button--secondary button--sm"
            to="/signin" // Assuming you create a /signin page
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthStatusNavbarItem;
