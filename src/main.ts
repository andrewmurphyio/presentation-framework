/**
 * Demo application entry point
 *
 * This demonstrates Phase 7 - Reusable Components:
 * - All 11 layout types (5 core + 6 advanced)
 * - Deck-specific custom layouts (Phase 6)
 * - Reusable components: CodeBlock, List, Callout, Image (Phase 7)
 * - Multi-slide navigation with keyboard controls
 * - Progress indicator
 * - Theme application
 * - Debug mode with layout info, zone boundaries, and token inspector
 */

import { DeckRenderer } from './lib/rendering/deck-renderer';
import { ProgressIndicator } from './lib/ui/progress-indicator';
// import { exampleTheme } from '@examples/themes/example';
import { debuggingLeadershipTheme } from '@examples/themes/debugging-leadership';
import { debuggingLeadershipBaseLayout, debuggingLeadershipTitleLayout, debuggingLeadershipAgendaLayout } from '@examples/themes/debugging-leadership/layouts';
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
import { CustomLayoutBuilder } from './lib/design-system/custom-layout-builder';
import type { Deck } from './lib/types/deck';
import type { CustomLayoutDefinition } from './lib/types/deck';

// Register layouts in the global registry
layoutRegistry.registerLayout('title', titleLayout);
layoutRegistry.registerLayout('debugging-leadership-base', debuggingLeadershipBaseLayout);
layoutRegistry.registerLayout('debugging-leadership-title', debuggingLeadershipTitleLayout);
layoutRegistry.registerLayout('debugging-leadership-agenda', debuggingLeadershipAgendaLayout);
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

// Create deck-specific custom layouts
// 1. Title with tagline - extends system 'title' layout with additional tagline zone
const titleWithTaglineLayout = CustomLayoutBuilder.create('title-with-tagline', 'Title layout extended with tagline')
  .extends('title')
  .addZone('tagline', 'tagline', 'Small tagline text below subtitle')
  .setGridTemplateAreas(`
    "title"
    "subtitle"
    "tagline"
  `)
  .setGridTemplateRows('1fr auto auto 1fr')
  .setCustomStyles(`
    .slide[data-layout="title-with-tagline"] .zone-tagline {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-accent);
      margin-top: var(--spacing-8);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.8;
    }
  `)
  .build();

// 2. Three column data - completely custom layout for data presentations
const threeColumnDataLayout = CustomLayoutBuilder.create('three-column-data', 'Three column layout for data display')
  .addZone('heading', 'heading', 'Section heading')
  .addZone('metric1', 'metric1', 'First metric/data point')
  .addZone('metric2', 'metric2', 'Second metric/data point')
  .addZone('metric3', 'metric3', 'Third metric/data point')
  .addZone('footnote', 'footnote', 'Optional footnote')
  .setGridTemplateAreas(`
    "heading heading heading"
    ". . ."
    "metric1 metric2 metric3"
    ". . ."
    "footnote footnote footnote"
  `)
  .setGridTemplateColumns('1fr 1fr 1fr')
  .setGridTemplateRows('auto 1fr auto 1fr auto')
  .setCustomStyles(`
    .slide[data-layout="three-column-data"] {
      padding: var(--spacing-12);
      background: linear-gradient(to bottom, var(--color-background), #f8f9fa);
    }

    .slide[data-layout="three-column-data"] .zone-heading {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .slide[data-layout="three-column-data"] [class*="zone-metric"] {
      text-align: center;
      padding: var(--spacing-8);
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .slide[data-layout="three-column-data"] [class*="zone-metric"] strong {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-secondary);
      display: block;
      margin-bottom: var(--spacing-2);
    }

    .slide[data-layout="three-column-data"] .zone-footnote {
      font-size: var(--font-size-sm);
      color: var(--color-muted);
      text-align: center;
      font-style: italic;
      margin-top: var(--spacing-4);
    }
  `)
  .build();

// 3. Content with sidebar - extends system 'content' layout with sidebar
const contentWithSidebarLayout = CustomLayoutBuilder.create('content-with-sidebar', 'Content layout extended with sidebar')
  .extends('content')
  .addZone('sidebar', 'sidebar', 'Sidebar for additional info')
  .setGridTemplateAreas(`
    "title title"
    "content sidebar"
  `)
  .setGridTemplateColumns('2fr 1fr')
  .setGridTemplateRows('auto 1fr')
  .setCustomStyles(`
    .slide[data-layout="content-with-sidebar"] {
      padding: var(--spacing-12);
      gap: var(--spacing-8);
    }

    .slide[data-layout="content-with-sidebar"] .zone-sidebar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: var(--spacing-6);
      border-radius: var(--border-radius-lg);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: var(--font-size-sm);
      box-shadow: var(--shadow-lg);
    }

    .slide[data-layout="content-with-sidebar"] .zone-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
    }
  `)
  .build();

// Array of deck-specific custom layouts
const customLayouts: CustomLayoutDefinition[] = [
  titleWithTaglineLayout,
  threeColumnDataLayout,
  contentWithSidebarLayout
];

// Create a demo deck showcasing all layouts including custom ones
const demoDeck: Deck = {
  metadata: {
    title: 'Presentation Framework Demo',
    author: 'Demo Author',
    description: 'Phase 7 - Reusable Components Showcase',
    date: new Date().toISOString().split('T')[0],
  },
  theme: debuggingLeadershipTheme,
  customLayouts: customLayouts,
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
      layout: 'debugging-leadership-agenda',
      content: {
        'logo': 'Debugging Leadership',
        'content': `
          <ul>
            <li>Why are we talking about this?</li>
            <li>What are the 9 habits?</li>
            <li>What do we do about it?</li>
            <li>Q&A</li>
          </ul>
        `,
        'image': '<img src="/examples/themes/debugging-leadership/media/barista.png" alt="Agenda illustration" />',
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
    // New slides demonstrating deck-specific custom layouts
    {
      id: 'slide-12',
      layout: 'section',
      content: {
        heading: 'Custom Deck Layouts',
      },
    },
    {
      id: 'slide-13',
      layout: 'title-with-tagline',
      content: {
        title: 'Extended Title Layout',
        subtitle: 'Demonstrating layout inheritance',
        tagline: 'Extends system title layout',
      },
    },
    {
      id: 'slide-14',
      layout: 'three-column-data',
      content: {
        heading: 'Performance Metrics',
        metric1: '<strong>98%</strong>Uptime',
        metric2: '<strong>1.2s</strong>Load Time',
        metric3: '<strong>50ms</strong>Response Time',
        footnote: '* Data collected over the last 30 days',
      },
    },
    {
      id: 'slide-15',
      layout: 'content-with-sidebar',
      content: {
        title: 'Extended Content Layout',
        content: 'This layout extends the system content layout by adding a sidebar zone. Perfect for additional context, notes, or related information.',
        sidebar: '<strong>💡 Sidebar</strong><br><br>This demonstrates extending a system layout with additional zones.',
      },
    },
    {
      id: 'slide-16',
      layout: 'content',
      content: {
        title: 'Three-Tier Layout System',
        content: `
          <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
            <li><strong>System Layouts:</strong> Core layouts provided by the framework</li>
            <li><strong>Theme Layouts:</strong> Brand-specific layouts for all decks using the theme</li>
            <li><strong>Deck Layouts:</strong> Presentation-specific custom layouts</li>
          </ul>
          <p style="margin-top: 2rem;">Resolution priority: Deck → Theme → System</p>
        `,
      },
    },
    // Component showcase slides
    {
      id: 'slide-17',
      layout: 'section',
      content: {
        heading: 'Component Library',
      },
    },
    {
      id: 'slide-18',
      layout: 'content',
      content: {
        title: 'CodeBlock Component',
        content: {
          type: 'code-block',
          language: 'typescript',
          code: `interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    name: data.name ?? 'Anonymous',
    email: data.email ?? 'noreply@example.com',
  };
}`,
          showLineNumbers: true,
          highlightLines: [1, 2, 3, 4],
        },
      },
    },
    {
      id: 'slide-19',
      layout: 'two-column',
      content: {
        title: 'List Component - All Variants',
        left: [
          {
            type: 'list',
            variant: 'bullet',
            items: [
              { text: 'Bullet list item 1' },
              { text: 'Bullet list item 2' },
              {
                text: 'Nested bullet list',
                children: [
                  { text: 'Nested item A' },
                  { text: 'Nested item B' },
                ],
              },
            ],
          },
        ],
        right: [
          {
            type: 'list',
            variant: 'numbered',
            items: [
              { text: 'First numbered item' },
              { text: 'Second numbered item' },
              { text: 'Third numbered item' },
            ],
          },
          {
            type: 'list',
            variant: 'checklist',
            items: [
              { text: 'Completed task', checked: true },
              { text: 'Pending task', checked: false },
              { text: 'Another completed task', checked: true },
            ],
          },
        ],
      },
    },
    {
      id: 'slide-20',
      layout: 'two-column',
      content: {
        title: 'Callout Component - All Types',
        left: [
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Information',
            content: 'This is an informational callout with helpful context.',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Success',
            content: 'Operation completed successfully!',
          },
        ],
        right: [
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Warning',
            content: 'This action may have unintended consequences.',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Error',
            content: 'An error occurred. Please try again.',
          },
        ],
      },
    },
    {
      id: 'slide-21',
      layout: 'content',
      content: {
        title: 'Image Component',
        content: {
          type: 'image',
          src: '/examples/themes/debugging-leadership/media/barista.png',
          alt: 'Example image demonstration',
          fitMode: 'contain',
          caption: 'Image with contain fit mode and caption',
          lazyLoad: true,
        },
      },
    },
    {
      id: 'slide-22',
      layout: 'content',
      content: {
        title: 'Mixed Content Example',
        content: [
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Components can be combined',
            content: 'This slide demonstrates multiple components in a single zone.',
          },
          {
            type: 'list',
            variant: 'bullet',
            items: [
              { text: 'Components are composable' },
              { text: 'Multiple components in one zone' },
              { text: 'Rich content support' },
            ],
          },
          {
            type: 'code-block',
            language: 'javascript',
            code: `const components = ['CodeBlock', 'List', 'Callout', 'Image'];
console.log('All components available:', components);`,
          },
        ],
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
