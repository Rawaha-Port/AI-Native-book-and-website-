// src/pages/personalized-dashboard.tsx
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/userProfile';

interface ContentItem {
  id: string;
  title: string;
  tags: string[]; // Example tags for personalization
  link: string;
}

// Mock content data for demonstration. In a real scenario, this would come from an API or Docusaurus build data.
const allContent: ContentItem[] = [
  { id: 'preface', title: 'Preface', tags: ['beginner', 'overview'], link: '/preface' },
  { id: 'chapter-1', title: 'Chapter 1: Intro to AI', tags: ['AI', 'beginner'], link: '/chapter-1' },
  { id: 'chapter-2', title: 'Chapter 2: Robotics Hardware', tags: ['hardware', 'robotics'], link: '/chapter-2' },
  { id: 'chapter-3', title: 'Chapter 3: Software Stacks', tags: ['software', 'AI'], link: '/chapter-3' },
  { id: 'chapter-4', title: 'Chapter 4: Advanced Algorithms', tags: ['AI', 'advanced'], link: '/chapter-4' },
  { id: 'chapter-5', title: 'Chapter 5: Linux for Robotics', tags: ['OS', 'Linux', 'robotics'], link: '/chapter-5' },
  { id: 'chapter-6', title: 'Chapter 6: Windows Development', tags: ['OS', 'Windows', 'software'], link: '/chapter-6' },
  { id: 'chapter-7', title: 'Chapter 7: macOS Productivity', tags: ['OS', 'macOS', 'software'], link: '/chapter-7' },
];

const PersonalizedDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null); // Use 'any' for now due to JSONB flexibility
  const [personalizedContent, setPersonalizedContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const getProfileAndPersonalize = async () => {
      if (user && !loading) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);

        if (profile && profile.profile_data) {
          // Implement scoring and sorting logic based on profile_data
          const scoredContent = allContent.map(item => {
            let score = 0;
            const { os, language, hardware } = profile.profile_data;

            if (item.tags.includes(os)) score += 2;
            if (item.tags.includes(language)) score += 2;
            if (item.tags.includes(hardware)) score += 1;

            // More sophisticated scoring could be added here
            return { ...item, score };
          });

          // Sort in descending order of score
          const sortedContent = scoredContent.sort((a, b) => b.score - a.score);
          setPersonalizedContent(sortedContent);
        } else {
          // If no profile or no personalization data, show default order
          setPersonalizedContent(allContent);
        }
      } else if (!user && !loading) {
        // Not logged in, show default content
        setPersonalizedContent(allContent);
      }
    };

    getProfileAndPersonalize();
  }, [user, loading]);

  if (loading) {
    return <Layout><p>Loading authentication state...</p></Layout>;
  }

  return (
    <Layout
      title="Personalized Content Dashboard"
      description="Content tailored to your background."
    >
      <header className="hero hero--primary">
        <div className="container">
          <h1 className="hero__title">Your Personalized Content</h1>
          <p className="hero__subtitle">
            {userProfile ? 'Content sorted based on your background.' : 'Sign in to get personalized content.'}
          </p>
        </div>
      </header>
      <main>
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="row">
              <div className="col col--10 col--offset-1">
                {user ? (
                  <div>
                    {personalizedContent.length > 0 ? (
                      <ul>
                        {personalizedContent.map(item => (
                          <li key={item.id}>
                            <a href={item.link}>{item.title}</a> (Score: {item.score || 0})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No content available or being personalized.</p>
                    )}
                  </div>
                ) : (
                  <p>Please log in to see personalized content.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PersonalizedDashboard;
