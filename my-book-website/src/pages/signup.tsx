// my-book-website/src/pages/signup.tsx
import React from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../components/Auth/SignupForm';
import { useHistory } from '@docusaurus/router';

function Signup() {
  const history = useHistory();
  const handleSignupSuccess = (uid: string) => {
    console.log("Signup successful for UID:", uid);
    // Optionally redirect after successful signup and questionnaire
    // navigate('/');
  };
  return (
    <Layout title="Sign Up">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default Signup;
