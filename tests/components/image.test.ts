import { describe, it, expect, beforeEach } from 'vitest';
import { renderImage, registerImageRenderer } from '@/lib/components/image';
import { componentRegistry } from '@/lib/components/component-registry';
import type { Image } from '@/lib/types/component';

describe('Image Component', () => {
  beforeEach(() => {
    componentRegistry.clear();
    registerImageRenderer();
  });

  describe('renderImage - basic rendering', () => {
    it('should render basic image with src and alt', () => {
      const component: Image = {
        type: 'image',
        src: '/path/to/image.jpg',
        alt: 'Test image',
      };

      const result = renderImage(component);

      expect(result).toContain('src="/path/to/image.jpg"');
      expect(result).toContain('alt="Test image"');
      expect(result).toContain('<figure');
      expect(result).toContain('<img');
    });

    it('should use figure element for semantic HTML', () => {
      const component: Image = {
        type: 'image',
        src: '/image.png',
        alt: 'Image',
      };

      const result = renderImage(component);

      expect(result).toContain('<figure');
      expect(result).toContain('</figure>');
    });

    it('should escape HTML in src attribute', () => {
      const component: Image = {
        type: 'image',
        src: '"/><script>alert("xss")</script>',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain('&quot;');
      expect(result).not.toContain('<script>');
    });

    it('should escape HTML in alt attribute', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: '<script>alert("xss")</script>',
      };

      const result = renderImage(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('alt="<script>');
    });
  });

  describe('fit modes', () => {
    it('should default to contain fit mode', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain('image-fit-contain');
      expect(result).toContain('image-contain');
    });

    it('should render with contain fit mode', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        fitMode: 'contain',
      };

      const result = renderImage(component);

      expect(result).toContain('image-fit-contain');
      expect(result).toContain('image-contain');
    });

    it('should render with cover fit mode', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        fitMode: 'cover',
      };

      const result = renderImage(component);

      expect(result).toContain('image-fit-cover');
      expect(result).toContain('image-cover');
    });

    it('should render with original fit mode', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        fitMode: 'original',
      };

      const result = renderImage(component);

      expect(result).toContain('image-fit-original');
      expect(result).toContain('image-original');
    });
  });

  describe('lazy loading', () => {
    it('should not add loading attribute by default', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).not.toContain('loading=');
    });

    it('should not add loading attribute when lazyLoad is false', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        lazyLoad: false,
      };

      const result = renderImage(component);

      expect(result).not.toContain('loading=');
    });

    it('should add loading="lazy" when lazyLoad is true', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        lazyLoad: true,
      };

      const result = renderImage(component);

      expect(result).toContain('loading="lazy"');
    });
  });

  describe('caption', () => {
    it('should not render caption by default', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).not.toContain('figcaption');
      expect(result).not.toContain('image-caption');
    });

    it('should render caption when provided', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        caption: 'Figure 1: Example image',
      };

      const result = renderImage(component);

      expect(result).toContain('<figcaption');
      expect(result).toContain('image-caption');
      expect(result).toContain('Figure 1: Example image');
    });

    it('should escape HTML in caption', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        caption: '<script>alert("xss")</script>',
      };

      const result = renderImage(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('<script>alert');
    });

    it('should render caption inside figcaption element', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        caption: 'Test caption',
      };

      const result = renderImage(component);

      expect(result).toMatch(/<figcaption[^>]*>Test caption<\/figcaption>/);
    });
  });

  describe('custom attributes', () => {
    it('should include custom id if provided', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        id: 'my-image',
      };

      const result = renderImage(component);

      expect(result).toContain('id="my-image"');
    });

    it('should include custom className if provided', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        className: 'custom-image-style',
      };

      const result = renderImage(component);

      expect(result).toContain('custom-image-style');
    });

    it('should escape HTML in custom id', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        id: '<script>alert("xss")</script>',
      };

      const result = renderImage(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('id="<script>');
    });
  });

  describe('registry integration', () => {
    it('should register renderer with component registry', () => {
      expect(componentRegistry.hasRenderer('image')).toBe(true);
    });

    it('should render via component registry', () => {
      const component: Image = {
        type: 'image',
        src: '/test.jpg',
        alt: 'Registry test',
      };

      const renderer = componentRegistry.getRenderer('image');
      const result = renderer(component);

      expect(result).toContain('/test.jpg');
      expect(result).toContain('Registry test');
    });
  });

  describe('HTML structure', () => {
    it('should have proper container wrapper', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain('image-container');
    });

    it('should have image class on img element', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain('class="image image-contain"');
    });

    it('should combine fit mode classes correctly', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test',
        fitMode: 'cover',
      };

      const result = renderImage(component);

      expect(result).toContain('image-fit-cover');
      expect(result).toContain('image-cover');
    });
  });

  describe('edge cases', () => {
    it('should handle empty src', () => {
      const component: Image = {
        type: 'image',
        src: '',
        alt: 'Empty source',
      };

      const result = renderImage(component);

      expect(result).toContain('src=""');
      expect(result).toContain('alt="Empty source"');
    });

    it('should handle empty alt', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: '',
      };

      const result = renderImage(component);

      expect(result).toContain('alt=""');
    });

    it('should handle special characters in src', () => {
      const component: Image = {
        type: 'image',
        src: '/images/test & <special>.jpg',
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should handle special characters in alt', () => {
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Image with & < > " \' characters',
      };

      const result = renderImage(component);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#039;');
    });

    it('should handle very long src path', () => {
      const longPath = '/very/long/path/' + 'a'.repeat(500) + '/image.jpg';
      const component: Image = {
        type: 'image',
        src: longPath,
        alt: 'Test',
      };

      const result = renderImage(component);

      expect(result).toContain(longPath);
    });

    it('should handle very long alt text', () => {
      const longAlt = 'A'.repeat(1000);
      const component: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: longAlt,
      };

      const result = renderImage(component);

      expect(result).toContain(longAlt);
    });
  });

  describe('complete examples', () => {
    it('should render with all features (contain mode)', () => {
      const component: Image = {
        type: 'image',
        src: '/images/diagram.png',
        alt: 'System architecture diagram',
        fitMode: 'contain',
        caption: 'Figure 1: System Architecture',
        lazyLoad: true,
        id: 'arch-diagram',
        className: 'featured-image',
      };

      const result = renderImage(component);

      expect(result).toContain('src="/images/diagram.png"');
      expect(result).toContain('alt="System architecture diagram"');
      expect(result).toContain('image-fit-contain');
      expect(result).toContain('image-contain');
      expect(result).toContain('Figure 1: System Architecture');
      expect(result).toContain('loading="lazy"');
      expect(result).toContain('id="arch-diagram"');
      expect(result).toContain('featured-image');
    });

    it('should render with all features (cover mode)', () => {
      const component: Image = {
        type: 'image',
        src: '/photos/hero.jpg',
        alt: 'Hero image',
        fitMode: 'cover',
        caption: 'Background photo by Author',
        lazyLoad: true,
        id: 'hero-image',
        className: 'full-bleed',
      };

      const result = renderImage(component);

      expect(result).toContain('src="/photos/hero.jpg"');
      expect(result).toContain('alt="Hero image"');
      expect(result).toContain('image-fit-cover');
      expect(result).toContain('image-cover');
      expect(result).toContain('Background photo by Author');
      expect(result).toContain('loading="lazy"');
      expect(result).toContain('id="hero-image"');
      expect(result).toContain('full-bleed');
    });

    it('should render with all features (original mode)', () => {
      const component: Image = {
        type: 'image',
        src: '/screenshots/ui.png',
        alt: 'User interface screenshot',
        fitMode: 'original',
        caption: 'Screenshot: Login page',
        lazyLoad: false,
        id: 'ui-screenshot',
        className: 'pixel-perfect',
      };

      const result = renderImage(component);

      expect(result).toContain('src="/screenshots/ui.png"');
      expect(result).toContain('alt="User interface screenshot"');
      expect(result).toContain('image-fit-original');
      expect(result).toContain('image-original');
      expect(result).toContain('Screenshot: Login page');
      expect(result).not.toContain('loading=');
      expect(result).toContain('id="ui-screenshot"');
      expect(result).toContain('pixel-perfect');
    });

    it('should render minimal image (only required fields)', () => {
      const component: Image = {
        type: 'image',
        src: '/minimal.jpg',
        alt: 'Minimal',
      };

      const result = renderImage(component);

      expect(result).toContain('src="/minimal.jpg"');
      expect(result).toContain('alt="Minimal"');
      expect(result).toContain('image-fit-contain'); // default
      expect(result).not.toContain('loading=');
      expect(result).not.toContain('figcaption');
      expect(result).not.toContain('id=');
    });
  });

  describe('all fit modes', () => {
    it('should render all three fit modes correctly', () => {
      const fitModes: Array<Image['fitMode']> = ['contain', 'cover', 'original'];

      fitModes.forEach((fitMode) => {
        const component: Image = {
          type: 'image',
          src: '/test.jpg',
          alt: 'Test',
          fitMode,
        };

        const result = renderImage(component);

        expect(result).toContain(`image-fit-${fitMode}`);
        expect(result).toContain(`image-${fitMode}`);
      });
    });
  });
});
