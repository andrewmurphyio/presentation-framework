import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProgressIndicator } from '../../src/lib/ui/progress-indicator';
import { DeckNavigator } from '../../src/lib/navigation/deck-navigator';
import type { Deck } from '../../src/lib/types/deck';
import { ThemeClass } from '../../src/lib/theming/theme-class';
import { defaultTokens } from '../../src/lib/design-system/default-tokens';

describe('ProgressIndicator', () => {
  let navigator: DeckNavigator;
  let indicator: ProgressIndicator;
  let mockDeck: Deck;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    const theme = new ThemeClass('test-theme', defaultTokens);
    mockDeck = {
      metadata: { title: 'Test', author: 'Test' },
      theme,
      slides: [
        { id: 'slide-1', layout: 'title', content: { title: 'Slide 1' } },
        { id: 'slide-2', layout: 'title', content: { title: 'Slide 2' } },
        { id: 'slide-3', layout: 'title', content: { title: 'Slide 3' } },
        { id: 'slide-4', layout: 'title', content: { title: 'Slide 4' } },
        { id: 'slide-5', layout: 'title', content: { title: 'Slide 5' } },
      ],
    };

    navigator = new DeckNavigator(mockDeck);
  });

  afterEach(() => {
    if (indicator) {
      indicator.destroy();
    }
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should create indicator with default options', () => {
      indicator = new ProgressIndicator(navigator);
      expect(indicator).toBeInstanceOf(ProgressIndicator);
    });

    it('should create indicator with custom style', () => {
      indicator = new ProgressIndicator(navigator, { style: 'bar' });
      const element = indicator.getElement();
      expect(element.dataset.style).toBe('bar');
    });

    it('should create indicator with custom position', () => {
      indicator = new ProgressIndicator(navigator, { position: 'top-left' });
      const element = indicator.getElement();
      expect(element.dataset.position).toBe('top-left');
    });

    it('should append to container if provided', () => {
      indicator = new ProgressIndicator(navigator, { container });
      expect(container.contains(indicator.getElement())).toBe(true);
    });

    it('should not append to DOM if no container provided', () => {
      indicator = new ProgressIndicator(navigator);
      expect(document.body.contains(indicator.getElement())).toBe(false);
    });
  });

  describe('render - text style', () => {
    beforeEach(() => {
      indicator = new ProgressIndicator(navigator, { style: 'text', container });
    });

    it('should show current slide on render', () => {
      indicator.render();
      const element = indicator.getElement();
      expect(element.textContent).toBe('Slide 1 of 5');
    });

    it('should update on navigation', () => {
      indicator.render();
      navigator.next();
      const element = indicator.getElement();
      expect(element.textContent).toBe('Slide 2 of 5');
    });

    it('should update when jumping to slide', () => {
      indicator.render();
      navigator.goToSlide(4);
      const element = indicator.getElement();
      expect(element.textContent).toBe('Slide 5 of 5');
    });
  });

  describe('render - bar style', () => {
    beforeEach(() => {
      indicator = new ProgressIndicator(navigator, { style: 'bar', container });
    });

    it('should render progress bar', () => {
      indicator.render();
      const element = indicator.getElement();
      expect(element.innerHTML).toContain('width: 20%'); // 1/5 = 20%
    });

    it('should update bar width on navigation', () => {
      indicator.render();
      navigator.goToSlide(2); // Slide 3 of 5
      const element = indicator.getElement();
      expect(element.innerHTML).toContain('width: 60%'); // 3/5 = 60%
    });

    it('should show full bar on last slide', () => {
      indicator.render();
      navigator.goToSlide(4); // Slide 5 of 5
      const element = indicator.getElement();
      expect(element.innerHTML).toContain('width: 100%');
    });
  });

  describe('render - dots style', () => {
    beforeEach(() => {
      indicator = new ProgressIndicator(navigator, { style: 'dots', container });
    });

    it('should render dots for each slide', () => {
      indicator.render();
      const element = indicator.getElement();
      const dots = element.querySelectorAll('span');
      expect(dots.length).toBe(5);
    });

    it('should highlight active dot', () => {
      indicator.render();
      const element = indicator.getElement();
      expect(element.innerHTML).toContain('var(--color-primary)');
    });

    it('should update active dot on navigation', () => {
      indicator.render();
      const initialHTML = indicator.getElement().innerHTML;

      navigator.next();
      const updatedHTML = indicator.getElement().innerHTML;

      expect(updatedHTML).not.toBe(initialHTML);
    });
  });

  describe('positioning', () => {
    it('should apply top position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'top' });
      const element = indicator.getElement();
      expect(element.style.top).toBe('0px');
      expect(element.style.left).toBe('50%');
    });

    it('should apply bottom position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'bottom' });
      const element = indicator.getElement();
      expect(element.style.bottom).toBe('0px');
      expect(element.style.left).toBe('50%');
    });

    it('should apply top-left position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'top-left' });
      const element = indicator.getElement();
      expect(element.style.top).toBe('0px');
      expect(element.style.left).toBe('0px');
    });

    it('should apply top-right position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'top-right' });
      const element = indicator.getElement();
      expect(element.style.top).toBe('0px');
      expect(element.style.right).toBe('0px');
    });

    it('should apply bottom-left position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'bottom-left' });
      const element = indicator.getElement();
      expect(element.style.bottom).toBe('0px');
      expect(element.style.left).toBe('0px');
    });

    it('should apply bottom-right position styles', () => {
      indicator = new ProgressIndicator(navigator, { position: 'bottom-right' });
      const element = indicator.getElement();
      expect(element.style.bottom).toBe('0px');
      expect(element.style.right).toBe('0px');
    });

    it('should apply fixed positioning', () => {
      indicator = new ProgressIndicator(navigator);
      const element = indicator.getElement();
      expect(element.style.position).toBe('fixed');
    });
  });

  describe('destroy', () => {
    it('should remove element from DOM', () => {
      indicator = new ProgressIndicator(navigator, { container });
      indicator.render();

      expect(container.contains(indicator.getElement())).toBe(true);

      indicator.destroy();

      expect(container.contains(indicator.getElement())).toBe(false);
    });

    it('should unsubscribe from navigation events', () => {
      indicator = new ProgressIndicator(navigator, { style: 'text', container });
      indicator.render();

      const initialText = indicator.getElement().textContent;

      indicator.destroy();
      navigator.next();

      // Text should not change after destroy
      expect(indicator.getElement().textContent).toBe(initialText);
    });

    it('should not throw if element not in DOM', () => {
      indicator = new ProgressIndicator(navigator);
      expect(() => indicator.destroy()).not.toThrow();
    });
  });

  describe('getElement', () => {
    it('should return the indicator element', () => {
      indicator = new ProgressIndicator(navigator);
      const element = indicator.getElement();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toBe('progress-indicator');
    });
  });
});
