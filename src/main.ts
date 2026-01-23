/**
 * Demo application entry point
 *
 * This demonstrates the Phase 1 MVP:
 * - Creating a simple slide with title and subtitle
 * - Applying a theme
 * - Rendering to the DOM
 */

import { SlideRenderer } from './lib/rendering/slide-renderer';
import { exampleTheme } from './lib/theming/example-theme';
import { titleLayout } from './lib/design-system/layouts/title';
import { layoutRegistry } from './lib/design-system/layout-registry';
import type { Slide } from './lib/types/slide';

// Register the title layout in the global registry
layoutRegistry.registerLayout('title', titleLayout);

// Create a sample slide
const demoSlide: Slide = {
  id: 'demo-slide-1',
  layout: 'title',
  content: {
    title: 'Presentation Framework',
    subtitle: 'Phase 1 MVP - Single Static Slide with Theme ✨',
  },
  notes: 'This is a demo of the presentation framework MVP',
};

// Render the slide
const renderer = new SlideRenderer();
const html = renderer.render(demoSlide, exampleTheme);

// Inject into the DOM
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = html;
  console.log('✅ Slide rendered successfully!');
  console.log('Theme:', exampleTheme.getName());
  console.log('Layout:', demoSlide.layout);
  console.log('Slide ID:', demoSlide.id);
} else {
  console.error('❌ Could not find #app element');
}
