import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import styles from './styles.module.css';
import { useAuth } from '@site/src/contexts/AuthContext'; // Import useAuth hook
import { toast } from 'react-toastify'; // Import toast
import { useDoc } from '@docusaurus/plugin-content-docs/client'; // Import useDoc
import MDXContent from '@theme/MDXContent'; // To render raw markdown

// Helper function to dynamically render markdown
// This is a simplified approach and might need more robust error handling
async function renderMarkdownToHtml(markdown: string): Promise<string> {
  // In a real Docusaurus setup, you'd ideally compile MDX or use a dedicated component
  // For now, we'll use a basic markdown parser if available, or just return as is
  // A robust solution might involve:
  // 1. A client-side markdown-to-html library (e.g., 'marked', 'markdown-it')
  // 2. Or, more complex: sending the raw markdown to a temporary backend endpoint to compile to MDX/HTML
  // For this context, we will simply wrap it in a div for now as a placeholder
  // This will NOT render as full Docusaurus MDX, but will show the raw text.
  // Full Docusaurus MDX rendering requires build-time processing or a complex runtime compiler.
  // For the purpose of this exercise, we will simulate the dynamic replacement.
  const MDX = await import('@mdx-js/react').then(mdx => mdx.MDXProvider);
  return (
    // @ts-ignore
    <MDX>
      <MDXContent>{markdown}</MDXContent>
    </MDX>
  ).toString();
}


export default function TranslateButton() {
  const { isAuthenticated, isLoading } = useAuth(); // Use the useAuth hook
  const [isTranslated, setIsTranslated] = useState(false); // New state for tracking translation status
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false); // New state for loading status
  const [originalHtml, setOriginalHtml] = useState<string | null>(null); // To store original content's HTML string
  const [currentContentElement, setCurrentContentElement] = useState<HTMLElement | null>(null); // To store the actual content div

  const { metadata } = useDoc(); // Use the useDoc hook

  useEffect(() => {
    // Identify the main content element once the component mounts
    const contentElement = document.querySelector('.theme-doc-markdown'); // Or a more specific selector if needed
    if (contentElement && !currentContentElement) {
      setCurrentContentElement(contentElement as HTMLElement);
      setOriginalHtml(contentElement.innerHTML); // Store initial HTML
    }
  }, [currentContentElement]); // Ensure this only runs once or when contentElement changes

  const handleTranslate = async () => {
    if (!currentContentElement || isLoadingTranslation) {
      return;
    }

    setIsLoadingTranslation(true);
    if (!isTranslated) {
      // Logic for translating
      try {
        const currentDocPath = metadata.permalink; // e.g., /docs/chapter-1
        const docFileName = currentDocPath.split('/').pop(); // e.g., chapter-1
        // Docusaurus serves static files from the static folder
        // For translated MD files, we need to adjust the path to fetch them
        // Assuming docs are served directly, we might need to adjust for base URL too
        const translatedFileUrl = `/docs/${docFileName}.ur.md`; // This is how Docusaurus fetches content

        const response = await fetch(translatedFileUrl);
        if (!response.ok) {
          throw new Error(`Failed to load translated content from ${translatedFileUrl}`);
        }
        const rawTranslatedMd = await response.text();

        // Dynamically render the markdown content
        // IMPORTANT: Directly setting innerHTML with raw markdown string is not ideal for Docusaurus MDX.
        // Docusaurus MDX is pre-compiled. For a full solution, one would need:
        // 1. A runtime MDX compiler, or
        // 2. Fetch pre-compiled HTML/JSX, or
        // 3. Rerender the Docusaurus <Content /> component with the new source.
        // For the purpose of this task, we will simulate by replacing innerHTML.
        // This will show plain markdown, not fully styled MDX.

        if (originalHtml === null) {
          setOriginalHtml(currentContentElement.innerHTML); // Capture original HTML if not already done
        }
        currentContentElement.innerHTML = `<div>${rawTranslatedMd}</div>`; // Simulate rendering
        setIsTranslated(true);
        toast.success('Chapter translated to Urdu!');

      } catch (error) {
        console.error('Translation error:', error);
        toast.error('Translation not available for this chapter.'); // FR-009
      }
    } else {
      // Logic for showing original
      if (originalHtml !== null) {
        currentContentElement.innerHTML = originalHtml;
        setIsTranslated(false);
        toast.info('Reverted to original content.');
      }
    }
    setIsLoadingTranslation(false);
  };

  const handleClick = () => {
    if (isLoading || isLoadingTranslation) {
      return;
    }

    if (!isAuthenticated) {
      toast.info('You need to log in first');
      return;
    }

    handleTranslate();
  };


  return (
    <button
      type="button"
      className={styles.translateButton}
      onClick={handleClick}
      disabled={isLoading || isLoadingTranslation || !currentContentElement} // Disable button while auth or translation is loading
    >
      {isTranslated ? 'Show Original' : 'Translate to Urdu (اردو)'}
    </button>
  );
}
