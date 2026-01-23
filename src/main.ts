/**
 * Demo application entry point
 *
 * This demonstrates the Phase 2 multi-slide navigation:
 * - Creating a deck with multiple slides
 * - Keyboard navigation between slides
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
import { layoutRegistry } from './lib/design-system/layout-registry';
import type { Deck } from './lib/types/deck';

// Register layouts in the global registry
layoutRegistry.registerLayout('title', titleLayout);
layoutRegistry.registerLayout('section', sectionLayout);
layoutRegistry.registerLayout('content', contentLayout);
layoutRegistry.registerLayout('two-column', twoColumnLayout);

// Create a demo deck with 5 slides
const demoDeck: Deck = {
  metadata: {
    title: 'Presentation Framework Demo',
    author: 'Demo Author',
    description: 'Phase 2 - Multi-slide navigation with keyboard controls',
    date: new Date().toISOString().split('T')[0],
  },
  theme: exampleTheme,
  slides: [
    {
      id: 'slide-1',
      layout: 'title',
      content: {
        title: 'Presentation Framework',
        subtitle: 'Phase 2: Multi-Slide Navigation ✨',
      },
    },
    {
      id: 'slide-2',
      layout: 'title',
      content: {
        title: 'Keyboard Navigation',
        subtitle: 'Use Arrow Keys, Space, or Page Up/Down to navigate',
      },
    },
    {
      id: 'slide-3',
      layout: 'title',
      content: {
        title: 'Features Implemented',
        subtitle: 'DeckNavigator • NavigationController • DeckRenderer',
      },
    },
    {
      id: 'slide-4',
      layout: 'title',
      content: {
        title: 'Progress Indicator',
        subtitle: 'See the slide counter in the bottom-right corner',
      },
    },
    {
      id: 'slide-5',
      layout: 'title',
      content: {
        title: 'Thank You!',
        subtitle: 'Try pressing Home or End to jump to first/last slide',
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
