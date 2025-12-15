import React from 'react';
import Layout from '@theme/Layout'; // Docusaurus Layout
import { useAuth } from '../contexts/AuthContext'; // Adjust path as needed
import { Redirect } from '@docusaurus/router'; // For redirection
import ProfileForm from '../components/Auth/ProfileForm'; // Import ProfileForm

function Profile() {
  // Only useAuth if window is defined (client-side), otherwise provide default values for SSG
  const { isAuthenticated, isLoading, currentUser, signOut } =
    typeof window !== 'undefined'
      ? useAuth()
      : { isAuthenticated: false, isLoading: true, currentUser: null, signOut: () => {} };

  if (isLoading) {
    return (
      <Layout title="Loading Profile" description="Loading user profile">
        <main style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          fontSize: '20px',
        }}>
          Loading Profile...
        </main>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    // Only redirect on the client side, during SSG we just render the component normally
    // or provide a fallback
    if (typeof window !== 'undefined') {
      return <Redirect to="/signin" />;
    } else {
      return (
        <Layout title="Sign In Required" description="Please sign in to view this page.">
          <main style={{ textAlign: 'center', padding: '20px' }}>
            <p>Please sign in to view your profile.</p>
            {/* Optionally add a link to signin if not redirected */}
            {/* <a href="/signin">Sign In</a> */}
          </main>
        </Layout>
      );
    }
  }

  return (
    <Layout title="User Profile" description="View and edit your profile">
      <main>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1>Welcome, {currentUser?.email}!</h1>
          {currentUser && <ProfileForm />} {/* Integrate ProfileForm */}
          <button
            onClick={signOut}
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </main>
    </Layout>
  );
}

export default Profile;


