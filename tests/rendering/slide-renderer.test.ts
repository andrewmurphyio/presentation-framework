import { describe, it, expect, beforeEach } from 'vitest';
import { SlideRenderer } from '@/lib/rendering/slide-renderer';
import { Theme } from "@lib/theming/theme";
import { LayoutRegistry } from '@/lib/design-system/layout-registry';
import { layoutRegistry } from '@/lib/design-system/layout-registry';
import { titleLayout } from '@/lib/design-system/layouts/title';
import { defaultTokens } from '@/lib/design-system/default-tokens';
import { CustomLayoutBuilder } from '@/lib/design-system/custom-layout-builder';
import type { Slide } from '@/lib/types/slide';
import type { CustomLayoutDefinition } from '@/lib/types/deck';
import type { PresentationComponent } from '@/lib/types/component';

describe('SlideRenderer', () => {
  let renderer: SlideRenderer;
  let theme: Theme;
  let layoutReg: LayoutRegistry;
  let testSlide: Slide;

  beforeEach(() => {
    renderer = new SlideRenderer();
    theme = new Theme('test-theme', defaultTokens);
    layoutReg = new LayoutRegistry();
    layoutReg.registerLayout('title', titleLayout);

    testSlide = {
      id: 'slide-1',
      layout: 'title',
      content: {
        title: 'Welcome to the Presentation',
        subtitle: 'A Modern Presentation Framework',
      },
    };
  });

  describe('renderWithRegistry (backward compatibility)', () => {
    it('should render a complete HTML document', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    it('should include meta tags', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport"');
    });

    it('should set page title from slide content', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('<title>Welcome to the Presentation</title>');
    });

    it('should include slide container with data attributes', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('class="slide"');
      expect(html).toContain('data-slide-id="slide-1"');
      expect(html).toContain('data-layout="title"');
    });

    it('should inject content into correct zones', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('Welcome to the Presentation');
      expect(html).toContain('A Modern Presentation Framework');
      expect(html).toContain('zone-title');
      expect(html).toContain('zone-subtitle');
    });

    it('should escape HTML in content to prevent XSS', () => {
      const xssSlide: Slide = {
        id: 'xss-test',
        layout: 'title',
        content: {
          title: '<script>alert("XSS")</script>',
          subtitle: 'Safe & Sound',
        },
      };

      const html = renderer.renderWithRegistry(xssSlide, theme, layoutReg);

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('Safe &amp; Sound');
    });

    it('should handle missing content gracefully', () => {
      const sparseSlide: Slide = {
        id: 'sparse',
        layout: 'title',
        content: {
          title: 'Only Title',
        },
      };

      const html = renderer.renderWithRegistry(sparseSlide, theme, layoutReg);

      expect(html).toContain('Only Title');
      // Should not crash with missing subtitle
      expect(() => renderer.renderWithRegistry(sparseSlide, theme, layoutReg)).not.toThrow();
    });
  });

  describe('CSS variable injection', () => {
    it('should inject all color CSS variables', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('--color-primary: #3b82f6');
      expect(html).toContain('--color-secondary: #8b5cf6');
      expect(html).toContain('--color-background: #ffffff');
    });

    it('should inject typography CSS variables', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('--font-size-base: 1rem');
      expect(html).toContain('--font-family-sans:');
      expect(html).toContain('--font-weight-bold: 700');
    });

    it('should inject spacing CSS variables', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('--spacing-4: 1rem');
      expect(html).toContain('--spacing-6: 1.5rem');
      expect(html).toContain('--spacing-12: 3rem');
    });
  });

  describe('Layout application', () => {
    it('should apply grid template areas from layout', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-areas:');
      expect(html).toContain('header');
      expect(html).toContain('title');
      expect(html).toContain('subtitle');
      expect(html).toContain('footer-left');
      expect(html).toContain('footer-right');
    });

    it('should apply grid template columns from layout', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-columns: auto 1fr auto');
    });

    it('should apply grid template rows from layout', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-rows:');
      expect(html).toContain('auto 1fr auto auto 1fr auto');
    });

    it('should create CSS classes for each zone', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('.zone-title');
      expect(html).toContain('.zone-subtitle');
      expect(html).toContain('grid-area: title');
      expect(html).toContain('grid-area: subtitle');
    });
  });

  describe('Styling', () => {
    it('should include CSS reset', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('margin: 0');
      expect(html).toContain('padding: 0');
      expect(html).toContain('box-sizing: border-box');
    });

    it('should style body with theme tokens', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('font-family: var(--font-family-sans)');
      expect(html).toContain('color: var(--color-foreground)');
      expect(html).toContain('background-color: var(--color-background)');
    });

    it('should style title zone with theme tokens', () => {
      const html = renderer.renderWithRegistry(testSlide, theme, layoutReg);

      expect(html).toContain('font-size: var(--font-size-4xl)');
      expect(html).toContain('color: var(--color-primary)');
    });
  });

  describe('Error handling', () => {
    it('should throw error if layout not found', () => {
      const invalidSlide: Slide = {
        id: 'invalid',
        layout: 'nonexistent-layout',
        content: {},
      };

      expect(() => renderer.renderWithRegistry(invalidSlide, theme, layoutReg)).toThrow(
        'Layout "nonexistent-layout" not found'
      );
    });
  });

  describe('render with layout resolution', () => {
    beforeEach(() => {
      // Register title layout in global registry for resolution
      layoutRegistry.registerLayout('title', titleLayout);
    });

    it('should resolve system layout without deck or theme layouts', () => {
      const html = renderer.render(testSlide, theme);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Welcome to the Presentation');
      expect(html).toContain('A Modern Presentation Framework');
    });

    it('should use deck layout when provided', () => {
      const deckLayout = CustomLayoutBuilder.create('title', 'Custom title')
        .addZone('title', 'title-area', 'Custom title zone')
        .addZone('custom-zone', 'custom', 'New custom zone')
        .setGridTemplateAreas('"title-area" "custom"')
        .setCustomStyles('.custom-deck { color: blue; }')
        .build() as CustomLayoutDefinition;

      const slideWithCustom: Slide = {
        id: 'custom-slide',
        layout: 'title',
        content: {
          title: 'Custom Title',
          'custom-zone': 'Custom Content',
        },
      };

      const html = renderer.render(slideWithCustom, theme, [deckLayout]);

      expect(html).toContain('Custom Title');
      expect(html).toContain('Custom Content');
      expect(html).toContain('.custom-deck { color: blue; }');
      expect(html).toContain('zone-custom-zone');
    });

    it('should prioritize deck layout over theme layout', () => {
      const themeLayout = CustomLayoutBuilder.create('title', 'Theme title')
        .addZone('title', 'title', 'Theme title zone')
        .setGridTemplateAreas('"title"')
        .setCustomStyles('.theme-style { color: green; }')
        .build() as CustomLayoutDefinition;

      const deckLayout = CustomLayoutBuilder.create('title', 'Deck title')
        .addZone('title', 'title', 'Deck title zone')
        .setGridTemplateAreas('"title"')
        .setCustomStyles('.deck-style { color: red; }')
        .build() as CustomLayoutDefinition;

      const html = renderer.render(testSlide, theme, [deckLayout], [themeLayout]);

      // Should use deck layout styles
      expect(html).toContain('.deck-style { color: red; }');
      expect(html).not.toContain('.theme-style { color: green; }');
    });

    it('should handle extended layouts', () => {
      const extendedLayout = CustomLayoutBuilder.create('extended-title', 'Extended title')
        .extends('title')
        .addAdditionalZones([{ name: 'extra', gridArea: 'extra' }])
        .setGridTemplateAreas('"title" "subtitle" "extra"')
        .build() as CustomLayoutDefinition;

      const slideWithExtended: Slide = {
        id: 'extended-slide',
        layout: 'extended-title',
        content: {
          title: 'Main Title',
          subtitle: 'Subtitle',
          extra: 'Extra Content',
        },
      };

      const html = renderer.render(slideWithExtended, theme, [extendedLayout]);

      expect(html).toContain('Main Title');
      expect(html).toContain('Subtitle');
      expect(html).toContain('Extra Content');
      expect(html).toContain('zone-extra');
    });

    it('should handle composed layouts', () => {
      const composedLayout = CustomLayoutBuilder.create('composed', 'Composed layout')
        .composeFrom(['title'])
        .addAdditionalZones([{ name: 'sidebar', gridArea: 'sidebar' }])
        .setGridTemplateAreas('"title sidebar"')
        .setGridTemplateColumns('1fr 300px')
        .build() as CustomLayoutDefinition;

      const slideWithComposed: Slide = {
        id: 'composed-slide',
        layout: 'composed',
        content: {
          title: 'Main Content',
          sidebar: 'Sidebar Content',
        },
      };

      const html = renderer.render(slideWithComposed, theme, [composedLayout]);

      expect(html).toContain('Main Content');
      expect(html).toContain('Sidebar Content');
      expect(html).toContain('grid-template-columns: 1fr 300px');
    });

    it('should handle overridden layouts', () => {
      const overrideLayout = CustomLayoutBuilder.create('title-override', 'Override title')
        .overrides('title')
        .addZone('title', 'title', 'Override title')
        .addZone('subtitle', 'subtitle', 'Override subtitle')
        .setGridTemplateAreas('"title" "subtitle"')
        .setCustomStyles('.override { font-size: 3rem; }')
        .build() as CustomLayoutDefinition;

      const slideWithOverride: Slide = {
        id: 'override-slide',
        layout: 'title-override',
        content: {
          title: 'Overridden Title',
          subtitle: 'Overridden Subtitle',
        },
      };

      const html = renderer.render(slideWithOverride, theme, [overrideLayout]);

      expect(html).toContain('Overridden Title');
      expect(html).toContain('Overridden Subtitle');
      expect(html).toContain('.override { font-size: 3rem; }');
    });

    it('should throw error for unresolved layout', () => {
      const invalidSlide: Slide = {
        id: 'invalid',
        layout: 'non-existent',
        content: {},
      };

      expect(() => renderer.render(invalidSlide, theme)).toThrow();
    });
  });

  describe('component rendering', () => {
    beforeEach(() => {
      // Ensure title layout is registered
      layoutRegistry.registerLayout('title', titleLayout);
    });

    it('should render a slide with a CodeBlock component', () => {
      const slideWithCode: Slide = {
        id: 'code-slide',
        layout: 'title',
        content: {
          title: 'Code Example',
          subtitle: {
            type: 'code-block',
            language: 'javascript',
            code: 'console.log("Hello World");',
          },
        },
      };

      const html = renderer.render(slideWithCode, theme);

      expect(html).toContain('Code Example');
      expect(html).toContain('language-javascript');
      expect(html).toContain('console.log(&quot;Hello World&quot;);');
      expect(html).toContain('code-block-container');
    });

    it('should render a slide with a List component', () => {
      const slideWithList: Slide = {
        id: 'list-slide',
        layout: 'title',
        content: {
          title: 'Todo List',
          subtitle: {
            type: 'list',
            variant: 'checklist',
            items: [
              { text: 'Item 1', checked: true },
              { text: 'Item 2', checked: false },
            ],
          },
        },
      };

      const html = renderer.render(slideWithList, theme);

      expect(html).toContain('Todo List');
      expect(html).toContain('list-checklist');
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect(html).toContain('type="checkbox"');
    });

    it('should render a slide with a Callout component', () => {
      const slideWithCallout: Slide = {
        id: 'callout-slide',
        layout: 'title',
        content: {
          title: 'Important Notice',
          subtitle: {
            type: 'callout',
            calloutType: 'warning',
            title: 'Warning',
            content: 'Please read this carefully',
          },
        },
      };

      const html = renderer.render(slideWithCallout, theme);

      expect(html).toContain('Important Notice');
      expect(html).toContain('callout-warning');
      expect(html).toContain('Warning');
      expect(html).toContain('Please read this carefully');
    });

    it('should render a slide with an Image component', () => {
      const slideWithImage: Slide = {
        id: 'image-slide',
        layout: 'title',
        content: {
          title: 'Diagram',
          subtitle: {
            type: 'image',
            src: '/diagram.png',
            alt: 'Architecture diagram',
            fitMode: 'contain',
          },
        },
      };

      const html = renderer.render(slideWithImage, theme);

      expect(html).toContain('Diagram');
      expect(html).toContain('src="/diagram.png"');
      expect(html).toContain('alt="Architecture diagram"');
      expect(html).toContain('image-fit-contain');
    });

    it('should render a slide with multiple components in an array', () => {
      const slideWithMultiple: Slide = {
        id: 'multi-slide',
        layout: 'title',
        content: {
          title: 'Multiple Components',
          subtitle: [
            {
              type: 'callout',
              calloutType: 'info',
              content: 'First component',
            },
            {
              type: 'list',
              variant: 'bullet',
              items: [{ text: 'Item 1' }, { text: 'Item 2' }],
            },
          ],
        },
      };

      const html = renderer.render(slideWithMultiple, theme);

      expect(html).toContain('Multiple Components');
      expect(html).toContain('callout-info');
      expect(html).toContain('First component');
      expect(html).toContain('list-bullet');
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
    });

    it('should still support string content (backward compatibility)', () => {
      const slideWithStrings: Slide = {
        id: 'string-slide',
        layout: 'title',
        content: {
          title: 'String Title',
          subtitle: 'String Subtitle',
        },
      };

      const html = renderer.render(slideWithStrings, theme);

      expect(html).toContain('String Title');
      expect(html).toContain('String Subtitle');
    });

    it('should escape HTML in string content', () => {
      const slideWithHTML: Slide = {
        id: 'html-slide',
        layout: 'title',
        content: {
          title: '<script>alert("xss")</script>',
          subtitle: 'Safe subtitle',
        },
      };

      const html = renderer.render(slideWithHTML, theme);

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });

    it('should handle mix of strings and components', () => {
      const slideWithMix: Slide = {
        id: 'mix-slide',
        layout: 'title',
        content: {
          title: 'Mixed Content',
          subtitle: {
            type: 'code-block',
            language: 'python',
            code: 'print("test")',
          },
        },
      };

      const html = renderer.render(slideWithMix, theme);

      expect(html).toContain('Mixed Content'); // string
      expect(html).toContain('language-python'); // component
      expect(html).toContain('print(&quot;test&quot;)');
    });

    it('should handle unknown component types gracefully', () => {
      const slideWithUnknown: Slide = {
        id: 'unknown-slide',
        layout: 'title',
        content: {
          title: 'Title',
          subtitle: {
            type: 'unknown-component-type',
          } as unknown as PresentationComponent,
        },
      };

      const html = renderer.render(slideWithUnknown, theme);

      expect(html).toContain('Title');
      // Unknown component should be silently ignored (empty string)
      expect(html).not.toContain('unknown-component-type');
    });
  });
});
