import { describe, it, expect, beforeEach } from 'vitest';
import { SlideRenderer } from '@/lib/rendering/slide-renderer';
import { ThemeClass } from '@/lib/theming/theme-class';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';
import { titleLayout } from '@/lib/design-system/layouts/title';
import { defaultTokens } from '@/lib/design-system/default-tokens';
import type { Slide } from '@/lib/types/slide';

describe('SlideRenderer', () => {
  let renderer: SlideRenderer;
  let theme: ThemeClass;
  let layoutReg: LayoutRegistry;
  let testSlide: Slide;

  beforeEach(() => {
    renderer = new SlideRenderer();
    theme = new ThemeClass('test-theme', defaultTokens);
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

  describe('render', () => {
    it('should render a complete HTML document', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    it('should include meta tags', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport"');
    });

    it('should set page title from slide content', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('<title>Welcome to the Presentation</title>');
    });

    it('should include slide container with data attributes', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('class="slide"');
      expect(html).toContain('data-slide-id="slide-1"');
      expect(html).toContain('data-layout="title"');
    });

    it('should inject content into correct zones', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

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

      const html = renderer.render(xssSlide, theme, layoutReg);

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

      const html = renderer.render(sparseSlide, theme, layoutReg);

      expect(html).toContain('Only Title');
      // Should not crash with missing subtitle
      expect(() => renderer.render(sparseSlide, theme, layoutReg)).not.toThrow();
    });
  });

  describe('CSS variable injection', () => {
    it('should inject all color CSS variables', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('--color-primary: #3b82f6');
      expect(html).toContain('--color-secondary: #8b5cf6');
      expect(html).toContain('--color-background: #ffffff');
    });

    it('should inject typography CSS variables', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('--font-size-base: 1rem');
      expect(html).toContain('--font-family-sans:');
      expect(html).toContain('--font-weight-bold: 700');
    });

    it('should inject spacing CSS variables', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('--spacing-4: 1rem');
      expect(html).toContain('--spacing-6: 1.5rem');
      expect(html).toContain('--spacing-12: 3rem');
    });
  });

  describe('Layout application', () => {
    it('should apply grid template areas from layout', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-areas:');
      expect(html).toContain('header');
      expect(html).toContain('title');
      expect(html).toContain('subtitle');
      expect(html).toContain('footer-left');
      expect(html).toContain('footer-right');
    });

    it('should apply grid template columns from layout', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-columns: auto 1fr auto');
    });

    it('should apply grid template rows from layout', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('grid-template-rows:');
      expect(html).toContain('auto 1fr auto auto 1fr auto');
    });

    it('should create CSS classes for each zone', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('.zone-title');
      expect(html).toContain('.zone-subtitle');
      expect(html).toContain('grid-area: title');
      expect(html).toContain('grid-area: subtitle');
    });
  });

  describe('Styling', () => {
    it('should include CSS reset', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('margin: 0');
      expect(html).toContain('padding: 0');
      expect(html).toContain('box-sizing: border-box');
    });

    it('should style body with theme tokens', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

      expect(html).toContain('font-family: var(--font-family-sans)');
      expect(html).toContain('color: var(--color-foreground)');
      expect(html).toContain('background-color: var(--color-background)');
    });

    it('should style title zone with theme tokens', () => {
      const html = renderer.render(testSlide, theme, layoutReg);

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

      expect(() => renderer.render(invalidSlide, theme, layoutReg)).toThrow(
        'Layout "nonexistent-layout" not found'
      );
    });
  });
});
