import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // We define the sidebar manually
  tutorialSidebar: [
    'preface',
    'table-of-contents',
    {
      type: 'category',
      label: 'Chapters',
      items: [
        'chapter-1',
        'chapter-2',
        'chapter-3',
        'chapter-4',
        'chapter-5',
        'chapter-6',
        'chapter-7',
      ],
    },
    'glossary',
    'bibliography',
  ],
};

export default sidebars;