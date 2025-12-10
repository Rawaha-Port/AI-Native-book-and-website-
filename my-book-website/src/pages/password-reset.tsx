// my-book-website/src/pages/password-reset.tsx
import React from 'react';
import Layout from '@theme/Layout';
import PasswordReset from '../components/Auth/PasswordReset';

function PasswordResetPage() {
  return (
    <Layout title="Reset Password">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <PasswordReset />
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default PasswordResetPage;
