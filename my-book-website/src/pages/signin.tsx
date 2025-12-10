// my-book-website/src/pages/signin.tsx
import React from 'react';
import Layout from '@theme/Layout';
import SigninForm from '../components/Auth/SigninForm';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';

function Signin() {
  const history = useHistory();
  const handleSigninSuccess = (uid: string) => {
    console.log("Signin successful for UID:", uid);
    history.push('/'); // Redirect to home or dashboard after signin
  };
  return (
    <Layout title="Sign In">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <SigninForm onSigninSuccess={handleSigninSuccess} />
            <div className="margin-top--md">
              <Link to="/password-reset">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default Signin;
