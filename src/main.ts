/**
 * Demo application entry point
 *
 * This demonstrates the Phase 3 core layouts:
 * - All 5 core layout types (title, section, content, two-column, code)
 * - Multi-slide navigation with keyboard controls
 * - Progress indicator
 * - Theme application
 */

import { DeckRenderer } from './lib/rendering/deck-renderer';
import { ProgressIndicator } from './lib/ui/progress-indicator';
import { exampleTheme } from './lib/theming/example-theme';
import { titleLayout } from './lib/design-system/layouts/title';
import { sectionLayout } from './lib/design-system/layouts/section';
import { contentLayout } from './lib/design-system/layouts/content';
import { twoColumnLayout } from './lib/design-system/layouts/two-column';
import { codeLayout } from './lib/design-system/layouts/code';
import { imageLeftLayout } from './lib/design-system/layouts/image-left';
import { imageRightLayout } from './lib/design-system/layouts/image-right';
import { split4060Layout } from './lib/design-system/layouts/split-40-60';
import { split6040Layout } from './lib/design-system/layouts/split-60-40';
import { quoteLayout } from './lib/design-system/layouts/quote';
import { comparisonLayout } from './lib/design-system/layouts/comparison';
import { layoutRegistry } from './lib/design-system/layout-registry';
import type { Deck } from './lib/types/deck';

// Register layouts in the global registry
layoutRegistry.registerLayout('title', titleLayout);
layoutRegistry.registerLayout('section', sectionLayout);
layoutRegistry.registerLayout('content', contentLayout);
layoutRegistry.registerLayout('two-column', twoColumnLayout);
layoutRegistry.registerLayout('code', codeLayout);
layoutRegistry.registerLayout('image-left', imageLeftLayout);
layoutRegistry.registerLayout('image-right', imageRightLayout);
layoutRegistry.registerLayout('split-40-60', split4060Layout);
layoutRegistry.registerLayout('split-60-40', split6040Layout);
layoutRegistry.registerLayout('quote', quoteLayout);
layoutRegistry.registerLayout('comparison', comparisonLayout);

// Create a demo deck showcasing all 5 core layouts
const demoDeck: Deck = {
  metadata: {
    title: 'Presentation Framework Demo',
    author: 'Demo Author',
    description: 'Phase 3 - Core Layouts Showcase',
    date: new Date().toISOString().split('T')[0],
  },
  theme: exampleTheme,
  slides: [
    {
      id: 'slide-1',
      layout: 'title',
      content: {
        title: 'Presentation Framework',
        subtitle: 'Phase 3: Core Layouts Showcase',
      },
    },
    {
      id: 'slide-2',
      layout: 'section',
      content: {
        heading: 'Layout Types',
      },
    },
    {
      id: 'slide-3',
      layout: 'content',
      content: {
        title: 'Content Layout',
        content:
          'This is the content layout with a title zone and a main content area. Perfect for standard slides with bullet points, paragraphs, or lists.',
      },
    },
    {
      id: 'slide-4',
      layout: 'two-column',
      content: {
        title: 'Two-Column Layout',
        left: 'Left column content goes here. Great for comparisons and side-by-side presentations.',
        right:
          'Right column content goes here. Equal width columns using CSS Grid 1fr 1fr split.',
      },
    },
    {
      id: 'slide-5',
      layout: 'code',
      content: {
        title: 'Code Layout Example',
        code: 'function hello() {\n  return "Hello, World!";\n}\n\nconsole.log(hello());',
      },
    },
    {
      id: 'slide-6',
      layout: 'section',
      content: {
        heading: 'Navigation',
      },
    },
    {
      id: 'slide-7',
      layout: 'content',
      content: {
        title: 'Keyboard Controls',
        content:
          'Use Arrow Keys, Space, or Page Up/Down to navigate. Press Home to jump to first slide, End to jump to last slide.',
      },
    },
    {
      id: 'slide-8',
      layout: 'title',
      content: {
        title: 'Thank You!',
        subtitle: 'All 5 core layouts are now implemented',
      },
    },
  ],
};

// Get the app container
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  // Create and render the deck
  const renderer = new DeckRenderer(demoDeck, { container: app });
  renderer.render();

  // Create and render progress indicator
  const progressIndicator = new ProgressIndicator(renderer.getNavigator(), {
    style: 'text',
    position: 'bottom-right',
    container: app,
  });
  progressIndicator.render();

  console.log('✅ Presentation rendered successfully!');
  console.log('Deck:', demoDeck.metadata.title);
  console.log('Theme:', demoDeck.theme.getName());
  console.log('Total slides:', demoDeck.slides.length);
  console.log('');
  console.log('Navigation controls:');
  console.log('  → / ↓ / Space / Page Down: Next slide');
  console.log('  ← / ↑ / Page Up: Previous slide');
  console.log('  Home: First slide');
  console.log('  End: Last slide');
} else {
  console.error('❌ Could not find #app element');
}
