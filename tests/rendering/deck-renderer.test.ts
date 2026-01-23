import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DeckRenderer } from '../../src/lib/rendering/deck-renderer';
import { Theme } from "@lib/theming/theme";
import { defaultTokens } from '../../src/lib/design-system/default-tokens';
import { layoutRegistry } from '../../src/lib/design-system/layout-registry';
import { titleLayout } from '../../src/lib/design-system/layouts/title';
import { CustomLayoutBuilder } from '../../src/lib/design-system/custom-layout-builder';
import type { Deck } from '../../src/lib/types/deck';
import type { CustomLayoutDefinition } from '../../src/lib/types/deck';

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
    const theme = new Theme('test-theme', defaultTokens);
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

  describe('custom layouts', () => {
    it('should register deck custom layouts', () => {
      // Create custom layout
      const customLayout = CustomLayoutBuilder.create('custom-hero', 'Hero layout')
        .addZone('hero-title', 'hero-title', 'Big title')
        .addZone('hero-subtitle', 'hero-subtitle', 'Subtitle')
        .setGridTemplateAreas('"hero-title" "hero-subtitle"')
        .setGridTemplateRows('2fr 1fr')
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
      };

      const registerSpy = vi.spyOn(layoutRegistry, 'registerDeckLayouts');
      renderer = new DeckRenderer(deckWithCustomLayouts, { container });

      expect(registerSpy).toHaveBeenCalledWith([customLayout]);
      registerSpy.mockRestore();
    });

    it('should use custom layout for rendering slides', () => {
      // Create custom layout with custom styles
      const customLayout = CustomLayoutBuilder.create('deck-custom', 'Custom deck layout')
        .addZone('main-content', 'main', 'Main content area')
        .setGridTemplateAreas('"main"')
        .setCustomStyles(`
          .slide[data-layout="deck-custom"] {
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          }
          .slide[data-layout="deck-custom"] .zone-main-content {
            font-size: 2rem;
            color: white;
          }
        `)
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
        slides: [
          {
            id: 'custom-slide',
            layout: 'deck-custom',
            content: {
              'main-content': 'Custom layout content',
            },
          },
        ],
      };

      renderer = new DeckRenderer(deckWithCustomLayouts, { container });
      renderer.render();

      // Check layout is applied
      const slide = container.querySelector('[data-layout="deck-custom"]');
      expect(slide).toBeTruthy();

      // Check zone is rendered
      const zone = container.querySelector('.zone-main-content');
      expect(zone).toBeTruthy();
      expect(zone?.textContent).toBe('Custom layout content');
    });

    it('should inject custom layout styles', () => {
      const customLayout = CustomLayoutBuilder.create('styled-layout', 'Layout with custom styles')
        .addZone('content', 'content')
        .setGridTemplateAreas('"content"')
        .setCustomStyles('.custom-class { color: red; }')
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
        slides: [
          {
            id: 'slide-1',
            layout: 'styled-layout',
            content: { content: 'Test' },
          },
        ],
      };

      renderer = new DeckRenderer(deckWithCustomLayouts, { container });
      renderer.render();

      // Check style element is injected
      const styleEl = document.querySelector('style[data-layout="styled-layout"]');
      expect(styleEl).toBeTruthy();
      expect(styleEl?.textContent).toContain('.custom-class { color: red; }');
    });

    it('should clean up deck layouts on destroy', () => {
      const customLayout = CustomLayoutBuilder.create('temp-layout', 'Temporary layout')
        .addZone('zone1', 'zone1')
        .setGridTemplateAreas('"zone1"')
        .setCustomStyles('.temp { color: blue; }')
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
      };

      const clearSpy = vi.spyOn(layoutRegistry, 'clearDeckLayouts');
      const clearCacheSpy = vi.fn();

      renderer = new DeckRenderer(deckWithCustomLayouts, { container });
      renderer.render();

      // Mock the clearCache method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (renderer as any).layoutResolver.clearCache = clearCacheSpy;

      renderer.destroy();

      expect(clearSpy).toHaveBeenCalled();
      expect(clearCacheSpy).toHaveBeenCalled();

      // Check style element is removed
      const styleEl = document.querySelector('style[data-layout="temp-layout"]');
      expect(styleEl).toBeFalsy();

      clearSpy.mockRestore();
    });

    it('should not inject duplicate layout styles', () => {
      const customLayout = CustomLayoutBuilder.create('no-dup', 'No duplicate styles')
        .addZone('content', 'content')
        .setGridTemplateAreas('"content"')
        .setCustomStyles('.no-dup { color: green; }')
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
        slides: [
          {
            id: 'slide-1',
            layout: 'no-dup',
            content: { content: 'Slide 1' },
          },
          {
            id: 'slide-2',
            layout: 'no-dup',
            content: { content: 'Slide 2' },
          },
        ],
      };

      renderer = new DeckRenderer(deckWithCustomLayouts, { container });
      renderer.render();

      // Should only have one style element for the layout
      const styleElements = document.querySelectorAll('style[data-layout="no-dup"]');
      expect(styleElements.length).toBe(1);
    });

    it('should skip default styles when custom styles are present', () => {
      const customLayout = CustomLayoutBuilder.create('override-defaults', 'Override default styles')
        .addZone('content', 'content')
        .setGridTemplateAreas('"content"')
        .setCustomStyles(`
          .slide[data-layout="override-defaults"] {
            padding: 2rem;
            gap: 1rem;
          }
          .slide[data-layout="override-defaults"] .zone-content {
            text-align: left;
          }
        `)
        .build();

      const deckWithCustomLayouts: Deck = {
        ...mockDeck,
        customLayouts: [customLayout as CustomLayoutDefinition],
        slides: [
          {
            id: 'slide-1',
            layout: 'override-defaults',
            content: { content: 'Custom styled' },
          },
        ],
      };

      renderer = new DeckRenderer(deckWithCustomLayouts, { container });
      renderer.render();

      const slide = container.querySelector('.slide') as HTMLElement;
      // Should not have default inline styles when custom styles present
      expect(slide.style.padding).not.toBe('var(--spacing-12)');
      expect(slide.style.gap).not.toBe('var(--spacing-6)');

      const zone = container.querySelector('.zone-content') as HTMLElement;
      // Zone should not have default inline styles
      expect(zone.style.textAlign).not.toBe('center');
    });
  });
});
