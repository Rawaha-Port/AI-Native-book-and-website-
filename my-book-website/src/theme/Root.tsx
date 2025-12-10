// my-book-website/src/theme/Root.tsx
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

// Default implementation, that you might want to customize
function Root({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default Root;
