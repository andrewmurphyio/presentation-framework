import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DebugOverlay } from '@/lib/debug/debug-overlay';
import { DebugMode } from '@/lib/debug/debug-mode';
import type { DebugInfo } from '@/lib/types/debug';

describe('DebugOverlay', () => {
  let debugMode: DebugMode;
  let overlay: DebugOverlay;
  let parentElement: HTMLElement;

  const mockDebugInfo: DebugInfo = {
    slide: {
      id: 'test-slide',
      index: 0,
      total: 5,
      layout: 'title',
    },
    layout: {
      name: 'title',
      description: 'Title layout',
      zones: [
        { name: 'title', gridArea: 'title', populated: true, contentLength: 10 },
      ],
      gridTemplateAreas: '"title"',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
    },
    theme: {
      name: 'Test Theme',
      tokens: {
        colors: { primary: '#000' },
        typography: { fontFamily: 'Arial' },
        spacing: { 4: '1rem' },
      },
      overrides: [],
    },
    content: {
      title: { value: 'Test Title', length: 10, zone: 'title' },
    },
  };

  beforeEach(() => {
    debugMode = new DebugMode({}, false);
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);

    // Create a mock slide element for update() to work
    const slideElement = document.createElement('div');
    slideElement.className = 'slide';
    slideElement.style.display = 'grid';
    parentElement.appendChild(slideElement);

    overlay = new DebugOverlay(debugMode, parentElement);
  });

  afterEach(() => {
    overlay.destroy();
    document.body.removeChild(parentElement);
  });

  describe('Lifecycle', () => {
    it('should start unmounted', () => {
      expect(overlay.isMounted()).toBe(false);
    });

    it('should mount to parent element', () => {
      overlay.mount();

      expect(overlay.isMounted()).toBe(true);
      expect(parentElement.children.length).toBe(2); // slide + overlay
    });

    it('should unmount from parent element', () => {
      overlay.mount();
      overlay.unmount();

      expect(overlay.isMounted()).toBe(false);
      expect(parentElement.children.length).toBe(1); // just the slide element remains
    });

    it('should not mount twice', () => {
      overlay.mount();
      overlay.mount();

      expect(parentElement.children.length).toBe(2); // slide + overlay (not duplicated)
    });

    it('should handle unmount when not mounted', () => {
      expect(() => overlay.unmount()).not.toThrow();
    });

    it('should destroy and clean up', () => {
      overlay.mount();
      overlay.destroy();

      expect(overlay.isMounted()).toBe(false);
      expect(parentElement.children.length).toBe(1); // slide element remains
    });
  });

  describe('DOM structure', () => {
    it('should create overlay container with correct class', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container).toBeDefined();
      expect(container?.className).toBe('pf-debug-overlay');
    });

    it('should set data attribute on container', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.getAttribute('data-debug-overlay')).toBe('true');
    });

    it('should return null container when not mounted', () => {
      expect(overlay.getContainer()).toBeNull();
    });
  });

  describe('Positioning', () => {
    it('should position as fixed layer', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.position).toBe('fixed');
    });

    it('should cover entire viewport', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.top).toBe('0px');
      expect(container?.style.left).toBe('0px');
      expect(container?.style.right).toBe('0px');
      expect(container?.style.bottom).toBe('0px');
    });

    it('should have high z-index', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.zIndex).toBe('9999');
    });

    it('should have pointer-events none by default', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.pointerEvents).toBe('none');
    });
  });

  describe('Debug info management', () => {
    it('should update with debug info when enabled', () => {
      debugMode.enable();
      overlay.mount();
      overlay.update(mockDebugInfo);

      const container = overlay.getContainer();
      // Check that panels were created
      const panels = container?.querySelectorAll('.pf-debug-panel');
      expect(panels?.length).toBeGreaterThan(0);
    });

    it('should not update when debug mode is disabled', () => {
      overlay.mount();
      overlay.update(mockDebugInfo);

      const container = overlay.getContainer();
      const panels = container?.querySelectorAll('.pf-debug-panel');
      expect(panels?.length).toBe(0);
    });

    it('should clear debug info', () => {
      debugMode.enable();
      overlay.mount();
      overlay.update(mockDebugInfo);
      overlay.clear();

      const container = overlay.getContainer();
      const panels = container?.querySelectorAll('.pf-debug-panel');
      expect(panels?.length).toBe(0);
    });

    it('should handle update when not mounted', () => {
      expect(() => overlay.update(mockDebugInfo)).not.toThrow();
    });

    it('should handle clear when not mounted', () => {
      expect(() => overlay.clear()).not.toThrow();
    });
  });

  describe('Visibility control', () => {
    it('should be hidden when debug mode is disabled', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.display).toBe('none');
    });

    it('should be visible when debug mode is enabled', () => {
      debugMode.enable();
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.display).toBe('block');
    });

    it('should update visibility when debug mode is toggled', () => {
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.display).toBe('none');

      debugMode.enable();
      expect(container?.style.display).toBe('block');

      debugMode.disable();
      expect(container?.style.display).toBe('none');
    });

    it('should show immediately if debug mode is enabled before mount', () => {
      debugMode.enable();
      overlay.mount();
      const container = overlay.getContainer();

      expect(container?.style.display).toBe('block');
    });
  });
});
