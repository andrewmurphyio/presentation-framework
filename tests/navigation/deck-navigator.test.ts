import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeckNavigator } from '../../src/lib/navigation/deck-navigator';
import type { Deck } from '../../src/lib/types/deck';
import type { Theme } from '../../src/lib/types/theme';
import type { Slide } from '../../src/lib/types/slide';

describe('DeckNavigator', () => {
  let mockDeck: Deck;
  let navigator: DeckNavigator;

  beforeEach(() => {
    const mockTheme: Theme = {
      name: 'test-theme',
      tokens: {
        colors: {
          primary: '#000',
          secondary: '#fff',
          accent: '#f00',
          background: '#fff',
          foreground: '#000',
          muted: '#999',
          border: '#ccc',
          error: '#f00',
        },
        typography: {
          fontFamily: { sans: 'Arial', mono: 'Courier' },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
          },
          fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
          lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
        },
        spacing: {
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
          6: '1.5rem',
          8: '2rem',
          12: '3rem',
          16: '4rem',
        },
        borders: {
          radius: { none: '0', sm: '2px', base: '4px', lg: '8px', full: '9999px' },
          width: { thin: '1px', base: '2px', thick: '4px' },
        },
        shadows: {
          sm: '0 1px 2px rgba(0,0,0,0.05)',
          base: '0 1px 3px rgba(0,0,0,0.1)',
          lg: '0 4px 6px rgba(0,0,0,0.1)',
          xl: '0 10px 15px rgba(0,0,0,0.1)',
        },
      },
    };

    const slides: Slide[] = [
      { id: 'slide-1', layout: 'title', content: { title: 'Slide 1' } },
      { id: 'slide-2', layout: 'title', content: { title: 'Slide 2' } },
      { id: 'slide-3', layout: 'title', content: { title: 'Slide 3' } },
    ];

    mockDeck = {
      metadata: { title: 'Test Deck', author: 'Test Author' },
      theme: mockTheme,
      slides,
    };

    navigator = new DeckNavigator(mockDeck);
  });

  describe('constructor', () => {
    it('should throw error for deck with no slides', () => {
      const emptyDeck: Deck = {
        ...mockDeck,
        slides: [],
      };

      expect(() => new DeckNavigator(emptyDeck)).toThrow(
        'Cannot navigate a deck with no slides'
      );
    });

    it('should initialize at first slide', () => {
      expect(navigator.getCurrentIndex()).toBe(0);
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[0]);
    });
  });

  describe('getCurrentSlide', () => {
    it('should return the current slide', () => {
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[0]);
    });

    it('should return updated slide after navigation', () => {
      navigator.next();
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[1]);
    });
  });

  describe('getCurrentIndex', () => {
    it('should return current index', () => {
      expect(navigator.getCurrentIndex()).toBe(0);
      navigator.next();
      expect(navigator.getCurrentIndex()).toBe(1);
    });
  });

  describe('getTotalSlides', () => {
    it('should return total number of slides', () => {
      expect(navigator.getTotalSlides()).toBe(3);
    });
  });

  describe('next', () => {
    it('should move to next slide', () => {
      const result = navigator.next();
      expect(result).toBe(true);
      expect(navigator.getCurrentIndex()).toBe(1);
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[1]);
    });

    it('should not move past last slide', () => {
      navigator.goToSlide(2); // Move to last slide
      const result = navigator.next();
      expect(result).toBe(false);
      expect(navigator.getCurrentIndex()).toBe(2);
    });

    it('should emit navigation event', () => {
      const listener = vi.fn();
      navigator.onNavigate(listener);

      navigator.next();

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith({
        previousIndex: 0,
        currentIndex: 1,
        slide: mockDeck.slides[1],
      });
    });
  });

  describe('previous', () => {
    it('should move to previous slide', () => {
      navigator.goToSlide(1);
      const result = navigator.previous();
      expect(result).toBe(true);
      expect(navigator.getCurrentIndex()).toBe(0);
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[0]);
    });

    it('should not move before first slide', () => {
      const result = navigator.previous();
      expect(result).toBe(false);
      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should emit navigation event', () => {
      navigator.goToSlide(1);
      const listener = vi.fn();
      navigator.onNavigate(listener);

      navigator.previous();

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith({
        previousIndex: 1,
        currentIndex: 0,
        slide: mockDeck.slides[0],
      });
    });
  });

  describe('goToSlide', () => {
    it('should jump to specific slide', () => {
      const result = navigator.goToSlide(2);
      expect(result).toBe(true);
      expect(navigator.getCurrentIndex()).toBe(2);
      expect(navigator.getCurrentSlide()).toBe(mockDeck.slides[2]);
    });

    it('should reject negative index', () => {
      const result = navigator.goToSlide(-1);
      expect(result).toBe(false);
      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should reject index beyond slides array', () => {
      const result = navigator.goToSlide(10);
      expect(result).toBe(false);
      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should allow navigation to same slide', () => {
      const result = navigator.goToSlide(0);
      expect(result).toBe(true);
      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should not emit event when navigating to same slide', () => {
      const listener = vi.fn();
      navigator.onNavigate(listener);

      navigator.goToSlide(0);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should emit navigation event for valid navigation', () => {
      const listener = vi.fn();
      navigator.onNavigate(listener);

      navigator.goToSlide(2);

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith({
        previousIndex: 0,
        currentIndex: 2,
        slide: mockDeck.slides[2],
      });
    });
  });

  describe('onNavigate', () => {
    it('should register navigation listener', () => {
      const listener = vi.fn();
      navigator.onNavigate(listener);

      navigator.next();

      expect(listener).toHaveBeenCalled();
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      navigator.onNavigate(listener1);
      navigator.onNavigate(listener2);

      navigator.next();

      expect(listener1).toHaveBeenCalledOnce();
      expect(listener2).toHaveBeenCalledOnce();
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = navigator.onNavigate(listener);

      unsubscribe();
      navigator.next();

      expect(listener).not.toHaveBeenCalled();
    });

    it('should only unsubscribe specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const unsubscribe1 = navigator.onNavigate(listener1);
      navigator.onNavigate(listener2);

      unsubscribe1();
      navigator.next();

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledOnce();
    });
  });

  describe('boundary conditions', () => {
    it('should handle single slide deck', () => {
      const singleSlideDeck: Deck = {
        ...mockDeck,
        slides: [mockDeck.slides[0]],
      };
      const singleNavigator = new DeckNavigator(singleSlideDeck);

      expect(singleNavigator.next()).toBe(false);
      expect(singleNavigator.previous()).toBe(false);
      expect(singleNavigator.getCurrentIndex()).toBe(0);
    });

    it('should handle navigation through entire deck', () => {
      expect(navigator.next()).toBe(true); // 0 -> 1
      expect(navigator.next()).toBe(true); // 1 -> 2
      expect(navigator.next()).toBe(false); // Can't go past 2
      expect(navigator.previous()).toBe(true); // 2 -> 1
      expect(navigator.previous()).toBe(true); // 1 -> 0
      expect(navigator.previous()).toBe(false); // Can't go before 0
    });
  });
});
