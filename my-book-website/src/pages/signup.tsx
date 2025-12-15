import React from 'react';
import Layout from '@theme/Layout'; // Docusaurus Layout
import SignupForm from '../components/Auth/SignupForm'; // Import SignupForm
import { AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider

function Signup() {
  return (
    <Layout title="Sign Up" description="Sign up for an account">
      <main>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh', // Changed height to minHeight to accommodate form
          padding: '20px',
          flexDirection: 'column', // Align form vertically
        }}>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <SignupForm />
          </AuthProvider>
        </div>
      </main>
    </Layout>
  );
}

export default Signup;

