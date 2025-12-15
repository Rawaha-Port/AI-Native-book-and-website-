import React, {type ReactNode} from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@site/src/contexts/AuthContext'; // Import AuthProvider
import Chatbot from '@site/src/components/Chatbot'; // Import Chatbot

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <AuthProvider>
      <Layout {...props} />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Chatbot selectedText={''} /> {/* Add Chatbot here */}
    </AuthProvider>
  );
}
