import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DeckRenderer } from '../../src/lib/rendering/deck-renderer';
import { ThemeClass } from '../../src/lib/theming/theme-class';
import { defaultTokens } from '../../src/lib/design-system/default-tokens';
import { layoutRegistry } from '../../src/lib/design-system/layout-registry';
import { titleLayout } from '../../src/lib/design-system/layouts/title';
import type { Deck } from '../../src/lib/types/deck';

describe('DeckRenderer', () => {
  let container: HTMLElement;
  let mockDeck: Deck;
  let renderer: DeckRenderer;

  beforeEach(() => {
    // Register title layout
    layoutRegistry.registerLayout('title', titleLayout);

    // Create a container for testing
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create a mock deck
    const theme = new ThemeClass('test-theme', defaultTokens);
    mockDeck = {
      metadata: {
        title: 'Test Presentation',
        author: 'Test Author',
      },
      theme,
      slides: [
        {
          id: 'slide-1',
          layout: 'title',
          content: {
            title: 'First Slide',
            subtitle: 'Introduction',
          },
        },
        {
          id: 'slide-2',
          layout: 'title',
          content: {
            title: 'Second Slide',
          },
        },
        {
          id: 'slide-3',
          layout: 'title',
          content: {
            title: 'Third Slide',
            subtitle: 'Conclusion',
          },
        },
      ],
    };
  });

  afterEach(() => {
    if (renderer) {
      renderer.destroy();
    }
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should create renderer with custom container', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      expect(renderer).toBeInstanceOf(DeckRenderer);
    });

    it('should create default container if none provided', () => {
      renderer = new DeckRenderer(mockDeck);
      expect(renderer).toBeInstanceOf(DeckRenderer);
    });

    it('should initialize navigator', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      const navigator = renderer.getNavigator();
      expect(navigator).toBeDefined();
      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should initialize controller', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      const controller = renderer.getController();
      expect(controller).toBeDefined();
    });
  });

  describe('render', () => {
    it('should render all slides to container', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const slides = container.querySelectorAll('.slide');
      expect(slides.length).toBe(3);
    });

    it('should apply theme CSS variables to document root', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const rootStyle = document.documentElement.style;
      expect(rootStyle.getPropertyValue('--color-primary')).toBeTruthy();
      expect(rootStyle.getPropertyValue('--font-family-sans')).toBeTruthy();
    });

    it('should show only first slide initially', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const slides = container.querySelectorAll('.slide');
      expect(slides[0].style.display).toBe('grid');
      expect(slides[1].style.display).toBe('none');
      expect(slides[2].style.display).toBe('none');
    });

    it('should add correct data attributes to slides', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const slide1 = container.querySelector('[data-slide-id="slide-1"]');
      expect(slide1).toBeTruthy();
      expect(slide1?.getAttribute('data-slide-index')).toBe('0');
      expect(slide1?.getAttribute('data-layout')).toBe('title');
    });

    it('should render slide content in zones', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const titleZone = container.querySelector('.zone-title');
      expect(titleZone?.textContent).toBe('First Slide');

      const subtitleZone = container.querySelector('.zone-subtitle');
      expect(subtitleZone?.textContent).toBe('Introduction');
    });

    it('should not render empty zones', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      // Slide 2 has no subtitle
      const slides = container.querySelectorAll('.slide');
      const slide2Zones = slides[1].querySelectorAll('.slide-zone');
      expect(slide2Zones.length).toBe(1); // Only title zone
    });
  });

  describe('navigation integration', () => {
    it('should update visible slide on navigation', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const navigator = renderer.getNavigator();
      navigator.next();

      const slides = container.querySelectorAll('.slide');
      expect(slides[0].style.display).toBe('none');
      expect(slides[1].style.display).toBe('grid');
      expect(slides[2].style.display).toBe('none');
    });

    it('should handle navigation to specific slide', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const navigator = renderer.getNavigator();
      navigator.goToSlide(2);

      const slides = container.querySelectorAll('.slide');
      expect(slides[0].style.display).toBe('none');
      expect(slides[1].style.display).toBe('none');
      expect(slides[2].style.display).toBe('grid');
    });

    it('should handle keyboard navigation', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);

      const slides = container.querySelectorAll('.slide');
      expect(slides[0].style.display).toBe('none');
      expect(slides[1].style.display).toBe('grid');
    });
  });

  describe('layout application', () => {
    it('should apply grid layout styles to slides', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const slide = container.querySelector('.slide') as HTMLElement;
      expect(slide.style.display).toBe('grid');
      expect(slide.style.width).toBe('100%');
      expect(slide.style.height).toBe('100%');
    });

    it('should apply zone-specific styles', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      const titleZone = container.querySelector('.zone-title') as HTMLElement;
      expect(titleZone.style.fontSize).toBe('var(--font-size-4xl)');
      expect(titleZone.style.fontWeight).toBe('var(--font-weight-bold)');
      expect(titleZone.style.color).toBe('var(--color-primary)');
    });
  });

  describe('destroy', () => {
    it('should clean up container', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();

      expect(container.children.length).toBeGreaterThan(0);

      renderer.destroy();

      expect(container.innerHTML).toBe('');
    });

    it('should unsubscribe from navigation events', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();
      renderer.destroy();

      const navigator = renderer.getNavigator();
      navigator.next();

      // Should not crash or update DOM after destroy
      expect(container.innerHTML).toBe('');
    });

    it('should destroy controller', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      renderer.render();
      renderer.destroy();

      // Keyboard events should not work after destroy
      const navigator = renderer.getNavigator();
      const initialIndex = navigator.getCurrentIndex();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(initialIndex);
    });
  });

  describe('getters', () => {
    it('should return navigator instance', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      const navigator = renderer.getNavigator();

      expect(navigator).toBeDefined();
      expect(navigator.getTotalSlides()).toBe(3);
    });

    it('should return controller instance', () => {
      renderer = new DeckRenderer(mockDeck, { container });
      const controller = renderer.getController();

      expect(controller).toBeDefined();
    });
  });
});
