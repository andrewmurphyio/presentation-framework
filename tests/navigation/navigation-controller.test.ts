import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavigationController } from '../../src/lib/navigation/navigation-controller';
import { DeckNavigator } from '../../src/lib/navigation/deck-navigator';
import type { Deck } from '../../src/lib/types/deck';

describe('NavigationController', () => {
  let mockDeck: Deck;
  let navigator: DeckNavigator;
  let controller: NavigationController;
  let mockTarget: EventTarget;

  beforeEach(() => {
    mockDeck = {
      metadata: { title: 'Test', author: 'Test' },
      theme: {
        name: 'test',
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
      },
      slides: [
        { id: 'slide-1', layout: 'title', content: { title: 'Slide 1' } },
        { id: 'slide-2', layout: 'title', content: { title: 'Slide 2' } },
        { id: 'slide-3', layout: 'title', content: { title: 'Slide 3' } },
      ],
    };

    navigator = new DeckNavigator(mockDeck);
    mockTarget = new EventTarget();
    controller = new NavigationController(navigator, { target: mockTarget });
  });

  describe('constructor', () => {
    it('should attach keyboard listener by default', () => {
      const addEventListenerSpy = vi.spyOn(mockTarget, 'addEventListener');
      new NavigationController(navigator, { target: mockTarget });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not attach listener if disabled', () => {
      const addEventListenerSpy = vi.spyOn(mockTarget, 'addEventListener');
      new NavigationController(navigator, { target: mockTarget, enabled: false });

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation - forward', () => {
    it('should navigate next on ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should navigate next on ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
    });

    it('should navigate next on Space', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
    });

    it('should navigate next on PageDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageDown' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
    });
  });

  describe('keyboard navigation - backward', () => {
    beforeEach(() => {
      navigator.goToSlide(1);
    });

    it('should navigate previous on ArrowLeft', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should navigate previous on ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should navigate previous on PageUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageUp' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
    });
  });

  describe('keyboard navigation - jump', () => {
    it('should navigate to first slide on Home', () => {
      navigator.goToSlide(2);
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should navigate to last slide on End', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(2);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('enable/disable', () => {
    it('should not respond to keyboard when disabled', () => {
      controller.disable();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
    });

    it('should respond to keyboard when re-enabled', () => {
      controller.disable();
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
    });

    it('should be idempotent when calling enable multiple times', () => {
      const addEventListenerSpy = vi.spyOn(mockTarget, 'addEventListener');

      controller.enable();
      controller.enable();

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should be idempotent when calling disable multiple times', () => {
      const removeEventListenerSpy = vi.spyOn(mockTarget, 'removeEventListener');

      controller.disable();
      controller.disable();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should remove keyboard listener', () => {
      const removeEventListenerSpy = vi.spyOn(mockTarget, 'removeEventListener');

      controller.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not respond to keyboard after destroy', () => {
      controller.destroy();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
    });
  });

  describe('ignored keys', () => {
    it('should ignore other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('presenter remote support', () => {
    it('should support standard clicker forward navigation', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(1);
    });

    it('should support standard clicker backward navigation', () => {
      navigator.goToSlide(1);
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      mockTarget.dispatchEvent(event);

      expect(navigator.getCurrentIndex()).toBe(0);
    });
  });
});
