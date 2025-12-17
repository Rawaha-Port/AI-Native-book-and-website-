import React from 'react';
import Layout from '@theme/Layout'; // Docusaurus Layout
import SigninForm from '../components/Auth/SigninForm'; // Import SigninForm
import { AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider

function Signin() {
  return (
    <Layout title="Sign In" description="Sign in to your account">
      <main>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          padding: '20px',
          flexDirection: 'column',
        }}>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <SigninForm />
          </AuthProvider>
        </div>
      </main>
    </Layout>
  );
}

export default Signin;

