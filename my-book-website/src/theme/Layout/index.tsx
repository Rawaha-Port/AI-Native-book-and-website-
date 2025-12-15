import React, {type ReactNode, useState, useEffect} from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useKeyboardNavigation} from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type {Props} from '@theme/Layout';
import styles from './styles.module.css';
import Chatbot from '../../components/Chatbot'; // Import the Chatbot component
import { AuthProvider } from '../../contexts/AuthContext'; // NEW IMPORT

export default function Layout(props: Props): ReactNode {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;

  useKeyboardNavigation();

  const [selectedText, setSelectedText] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <AuthProvider> {/* Wrap the entire application with AuthProvider */}
      <LayoutProvider>
        <PageMetadata title={title} description={description} />

        <SkipToContent />

        <AnnouncementBar />

        <Navbar />

        <div
          id={SkipToContentFallbackId}
          className={clsx(
            ThemeClassNames.layout.main.container,
            ThemeClassNames.wrapper.main,
            styles.mainWrapper,
            wrapperClassName,
          )}>
          <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
            {children}
          </ErrorBoundary>
        </div>

        {!noFooter && <Footer />}
        <Chatbot selectedText={selectedText} /> {/* Pass selectedText to Chatbot */}
      </LayoutProvider>
    </AuthProvider>
  );
}
