/**
 * Demo application entry point
 *
 * This demonstrates Phase 5 - Debug Mode:
 * - All 11 layout types (5 core + 6 advanced)
 * - Multi-slide navigation with keyboard controls
 * - Progress indicator
 * - Theme application
 * - Debug mode with layout info, zone boundaries, and token inspector
 */

import { DeckRenderer } from './lib/rendering/deck-renderer';
import { ProgressIndicator } from './lib/ui/progress-indicator';
// import { exampleTheme } from '@examples/themes/example';
import { debuggingLeadershipTheme } from '@examples/themes/debugging-leadership';
import { debuggingLeadershipTitleLayout } from '@examples/themes/debugging-leadership/layouts';
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
layoutRegistry.registerLayout('debugging-leadership-title', debuggingLeadershipTitleLayout);
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

// Create a demo deck showcasing all 11 layouts
const demoDeck: Deck = {
  metadata: {
    title: 'Presentation Framework Demo',
    author: 'Demo Author',
    description: 'Phase 5 - Debug Mode Showcase',
    date: new Date().toISOString().split('T')[0],
  },
  theme: debuggingLeadershipTheme,
  slides: [
    {
      id: 'slide-1',
      layout: 'debugging-leadership-title',
      content: {
        'logo': 'Debugging Leadership',
        'title-line-1': '9 Management Habits',
        'title-line-2': 'Quietly Burning Out',
        'title-line-3': 'Your Best Engineers',
        'presenter-label': 'Presented By :',
        'presenter-name': 'Andrew Murphy',
        'website': 'debuggingleadership.com',
      },
    },
    {
      id: 'slide-2',
      layout: 'section',
      content: {
        heading: 'Advanced Layouts',
      },
    },
    {
      id: 'slide-3',
      layout: 'image-left',
      content: {
        title: 'Image-Left Layout',
        image: '[Image 40%]',
        content:
          'Content on the right (60%). Great for product demos with screenshots or diagrams with descriptions.',
      },
    },
    {
      id: 'slide-4',
      layout: 'image-right',
      content: {
        title: 'Image-Right Layout',
        content:
          'Content on the left (60%). Perfect for text-heavy content with supporting visuals on the side.',
        image: '[Image 40%]',
      },
    },
    {
      id: 'slide-5',
      layout: 'split-40-60',
      content: {
        title: 'Split 40-60 Layout',
        left: 'Left column (40%). Supporting points or summary.',
        right:
          'Right column (60%). Main content with emphasis. Asymmetric split creates visual hierarchy.',
      },
    },
    {
      id: 'slide-6',
      layout: 'split-60-40',
      content: {
        title: 'Split 60-40 Layout',
        left: 'Left column (60%). Main content with emphasis. Inverse of 40-60 layout.',
        right: 'Right column (40%). Supporting content or sidebar.',
      },
    },
    {
      id: 'slide-7',
      layout: 'quote',
      content: {
        quote:
          'This is a large, impactful quote perfect for testimonials or key takeaways.',
        attribution: '— Attribution or Source',
      },
    },
    {
      id: 'slide-8',
      layout: 'comparison',
      content: {
        title: 'Comparison Layout',
        'left-label': 'Before',
        left: 'Old approach or original state. Perfect for vs. slides.',
        'right-label': 'After',
        right: 'New approach or improved state. Structured comparison.',
      },
    },
    {
      id: 'slide-9',
      layout: 'section',
      content: {
        heading: 'Navigation',
      },
    },
    {
      id: 'slide-10',
      layout: 'content',
      content: {
        title: 'Keyboard Controls',
        content:
          'Navigation: Arrow Keys, Space, or Page Up/Down. Press Home to jump to first slide, End to jump to last slide. Debug: Press D to toggle debug mode.',
      },
    },
    {
      id: 'slide-11',
      layout: 'title',
      content: {
        title: 'Thank You!',
        subtitle: 'All 11 layouts are now implemented (5 core + 6 advanced)',
      },
    },
  ],
};

// Get the app container
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  // Create and render the deck with debug mode enabled
  const renderer = new DeckRenderer(demoDeck, {
    container: app,
    debug: {
      showLayout: true,
      showTokens: true,
      showZones: true,
      showMetadata: true,
      panelPosition: 'top-left',
      persistState: true,
    },
  });
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
  console.log('');
  console.log('Debug mode controls:');
  console.log('  D: Toggle debug mode on/off');
  console.log('  Shift+D: Toggle specific panels (future use)');
  console.log('  Alt+Z: Toggle zone boundaries only');
  console.log('  Alt+T: Toggle token inspector only');
} else {
  console.error('❌ Could not find #app element');
}
