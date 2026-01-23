import { describe, it, expect, beforeEach } from 'vitest';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';
import type { LayoutDefinition } from '@/lib/types/layout';
import { LayoutSource } from '@/lib/types/layout';
import type { CustomLayoutDefinition } from '@/lib/types/deck';

describe('LayoutRegistry', () => {
  let registry: LayoutRegistry;
  let mockLayout: LayoutDefinition;

  beforeEach(() => {
    registry = new LayoutRegistry();
    mockLayout = {
      name: 'test-layout',
      description: 'A test layout',
      zones: [
        { name: 'title', gridArea: 'title' },
        { name: 'content', gridArea: 'content' },
      ],
      gridTemplateAreas: `
        "title"
        "content"
      `,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr',
    };
  });

  describe('registerLayout', () => {
    it('should register a layout successfully', () => {
      expect(() => registry.registerLayout('test', mockLayout)).not.toThrow();
      expect(registry.hasLayout('test')).toBe(true);
    });

    it('should overwrite existing layout with same name', () => {
      registry.registerLayout('test', mockLayout);

      const newLayout: LayoutDefinition = {
        ...mockLayout,
        description: 'Updated layout',
      };

      registry.registerLayout('test', newLayout);
      const retrieved = registry.getLayout('test');

      expect(retrieved.description).toBe('Updated layout');
    });

    it('should allow multiple layouts to be registered', () => {
      const layout2: LayoutDefinition = {
        name: 'layout-2',
        description: 'Second layout',
        zones: [{ name: 'main', gridArea: 'main' }],
      };

      registry.registerLayout('layout-1', mockLayout);
      registry.registerLayout('layout-2', layout2);

      expect(registry.count()).toBe(2);
      expect(registry.hasLayout('layout-1')).toBe(true);
      expect(registry.hasLayout('layout-2')).toBe(true);
    });
  });

  describe('getLayout', () => {
    it('should return registered layout', () => {
      registry.registerLayout('test', mockLayout);
      const layout = registry.getLayout('test');

      expect(layout).toEqual(mockLayout);
      expect(layout.name).toBe('test-layout');
    });

    it('should throw error when layout not found', () => {
      expect(() => registry.getLayout('nonexistent')).toThrow(
        'Layout "nonexistent" not found'
      );
    });

    it('should list available layouts in error message', () => {
      registry.registerLayout('layout-1', mockLayout);
      registry.registerLayout('layout-2', mockLayout);

      try {
        registry.getLayout('layout-3');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect((error as Error).message).toContain('Available layouts:');
        expect((error as Error).message).toContain('layout-1');
        expect((error as Error).message).toContain('layout-2');
      }
    });
  });

  describe('hasLayout', () => {
    it('should return false when layout not registered', () => {
      expect(registry.hasLayout('test')).toBe(false);
    });

    it('should return true when layout is registered', () => {
      registry.registerLayout('test', mockLayout);
      expect(registry.hasLayout('test')).toBe(true);
    });
  });

  describe('getLayoutNames', () => {
    it('should return empty array when no layouts registered', () => {
      expect(registry.getLayoutNames()).toEqual([]);
    });

    it('should return all registered layout names', () => {
      registry.registerLayout('layout-1', mockLayout);
      registry.registerLayout('layout-2', mockLayout);
      registry.registerLayout('layout-3', mockLayout);

      const names = registry.getLayoutNames();
      expect(names).toHaveLength(3);
      expect(names).toContain('layout-1');
      expect(names).toContain('layout-2');
      expect(names).toContain('layout-3');
    });
  });

  describe('clear', () => {
    it('should remove all registered layouts', () => {
      registry.registerLayout('layout-1', mockLayout);
      registry.registerLayout('layout-2', mockLayout);

      expect(registry.count()).toBe(2);

      registry.clear();

      expect(registry.count()).toBe(0);
      expect(registry.hasLayout('layout-1')).toBe(false);
      expect(registry.hasLayout('layout-2')).toBe(false);
    });
  });

  describe('count', () => {
    it('should return 0 when no layouts registered', () => {
      expect(registry.count()).toBe(0);
    });

    it('should return correct count of registered layouts', () => {
      expect(registry.count()).toBe(0);

      registry.registerLayout('layout-1', mockLayout);
      expect(registry.count()).toBe(1);

      registry.registerLayout('layout-2', mockLayout);
      expect(registry.count()).toBe(2);

      registry.registerLayout('layout-3', mockLayout);
      expect(registry.count()).toBe(3);
    });
  });

  describe('hierarchy support', () => {
    const systemLayout1: LayoutDefinition = {
      name: 'system-1',
      description: 'System layout 1',
      zones: [{ name: 'sys1', gridArea: 'sys1' }],
    };

    const systemLayout2: LayoutDefinition = {
      name: 'system-2',
      description: 'System layout 2',
      zones: [{ name: 'sys2', gridArea: 'sys2' }],
    };

    const themeLayout1: LayoutDefinition = {
      name: 'theme-1',
      description: 'Theme layout 1',
      zones: [{ name: 'theme1', gridArea: 'theme1' }],
    };

    const themeLayout2: LayoutDefinition = {
      name: 'theme-2',
      description: 'Theme layout 2',
      zones: [{ name: 'theme2', gridArea: 'theme2' }],
    };

    const deckLayout1: CustomLayoutDefinition = {
      name: 'deck-1',
      description: 'Deck layout 1',
      zones: [{ name: 'deck1', gridArea: 'deck1' }],
    };

    const deckLayout2: CustomLayoutDefinition = {
      name: 'deck-2',
      description: 'Deck layout 2',
      zones: [{ name: 'deck2', gridArea: 'deck2' }],
    };

    describe('registerSystemLayouts', () => {
      it('should register multiple system layouts', () => {
        registry.registerSystemLayouts([systemLayout1, systemLayout2]);

        const layouts = registry.getSystemLayouts();
        expect(layouts).toHaveLength(2);
        expect(layouts[0].source).toBe(LayoutSource.SYSTEM);
        expect(layouts[0].priority).toBe(0);
      });

      it('should make system layouts accessible via getLayout', () => {
        registry.registerSystemLayouts([systemLayout1]);

        const layout = registry.getLayout('system-1');
        expect(layout).toBeDefined();
        expect(layout.description).toBe('System layout 1');
      });
    });

    describe('registerThemeLayouts', () => {
      it('should register multiple theme layouts', () => {
        registry.registerThemeLayouts([themeLayout1, themeLayout2]);

        const layouts = registry.getThemeLayouts();
        expect(layouts).toHaveLength(2);
        expect(layouts[0].source).toBe(LayoutSource.THEME);
        expect(layouts[0].priority).toBe(50);
      });

      it('should include theme layouts in hasLayout check', () => {
        registry.registerThemeLayouts([themeLayout1]);

        expect(registry.hasLayout('theme-1')).toBe(true);
      });
    });

    describe('registerDeckLayouts', () => {
      it('should register multiple deck layouts', () => {
        registry.registerDeckLayouts([deckLayout1, deckLayout2]);

        const layouts = registry.getDeckLayouts();
        expect(layouts).toHaveLength(2);
        expect(layouts[0].source).toBe(LayoutSource.DECK);
        expect(layouts[0].priority).toBe(100);
      });

      it('should include deck layouts in hasLayout check', () => {
        registry.registerDeckLayouts([deckLayout1]);

        expect(registry.hasLayout('deck-1')).toBe(true);
      });
    });

    describe('clearDeckLayouts', () => {
      it('should clear only deck layouts', () => {
        registry.registerSystemLayouts([systemLayout1]);
        registry.registerThemeLayouts([themeLayout1]);
        registry.registerDeckLayouts([deckLayout1]);

        expect(registry.count()).toBe(3);

        registry.clearDeckLayouts();

        expect(registry.getDeckLayouts()).toHaveLength(0);
        expect(registry.getSystemLayouts()).toHaveLength(1);
        expect(registry.getThemeLayouts()).toHaveLength(1);
        expect(registry.count()).toBe(2);
        expect(registry.hasLayout('deck-1')).toBe(false);
        expect(registry.hasLayout('system-1')).toBe(true);
        expect(registry.hasLayout('theme-1')).toBe(true);
      });
    });

    describe('clearThemeLayouts', () => {
      it('should clear only theme layouts', () => {
        registry.registerSystemLayouts([systemLayout1]);
        registry.registerThemeLayouts([themeLayout1]);
        registry.registerDeckLayouts([deckLayout1]);

        expect(registry.count()).toBe(3);

        registry.clearThemeLayouts();

        expect(registry.getThemeLayouts()).toHaveLength(0);
        expect(registry.getSystemLayouts()).toHaveLength(1);
        expect(registry.getDeckLayouts()).toHaveLength(1);
        expect(registry.count()).toBe(2);
        expect(registry.hasLayout('theme-1')).toBe(false);
        expect(registry.hasLayout('system-1')).toBe(true);
        expect(registry.hasLayout('deck-1')).toBe(true);
      });
    });

    describe('multi-source registration', () => {
      it('should handle layouts with same name in different sources', () => {
        const sharedName = 'shared-layout';

        registry.registerSystemLayouts([
          { ...systemLayout1, name: sharedName },
        ]);
        registry.registerThemeLayouts([
          { ...themeLayout1, name: sharedName },
        ]);
        registry.registerDeckLayouts([
          { ...deckLayout1, name: sharedName },
        ]);

        // All three should be registered
        expect(registry.getSystemLayouts()).toHaveLength(1);
        expect(registry.getThemeLayouts()).toHaveLength(1);
        expect(registry.getDeckLayouts()).toHaveLength(1);

        // hasLayout should return true
        expect(registry.hasLayout(sharedName)).toBe(true);

        // getLayoutNames should only list the name once
        const names = registry.getLayoutNames();
        const sharedCount = names.filter(n => n === sharedName).length;
        expect(sharedCount).toBe(1);
      });

      it('should count unique layout names across all sources', () => {
        registry.registerSystemLayouts([systemLayout1, systemLayout2]);
        registry.registerThemeLayouts([themeLayout1, themeLayout2]);
        registry.registerDeckLayouts([deckLayout1, deckLayout2]);

        expect(registry.count()).toBe(6);

        // Add layouts with duplicate names
        registry.registerThemeLayouts([
          { ...themeLayout1, name: 'system-1' }, // Same as system layout
        ]);

        // Count should still be 6 unique names
        expect(registry.count()).toBe(6);
      });

      it('should return all unique layout names', () => {
        registry.registerSystemLayouts([systemLayout1, systemLayout2]);
        registry.registerThemeLayouts([themeLayout1]);
        registry.registerDeckLayouts([deckLayout1]);

        const names = registry.getLayoutNames();
        expect(names).toContain('system-1');
        expect(names).toContain('system-2');
        expect(names).toContain('theme-1');
        expect(names).toContain('deck-1');
        expect(names).toHaveLength(4);
      });
    });

    describe('backward compatibility', () => {
      it('should treat registerLayout as system layout registration', () => {
        registry.registerLayout('test', mockLayout);

        const systemLayouts = registry.getSystemLayouts();
        expect(systemLayouts).toHaveLength(1);
        expect(systemLayouts[0].source).toBe(LayoutSource.SYSTEM);
        expect(systemLayouts[0].priority).toBe(0);
      });

      it('should maintain legacy behavior for getLayout', () => {
        registry.registerLayout('legacy', mockLayout);

        const layout = registry.getLayout('legacy');
        expect(layout).toBeDefined();
        expect(layout.name).toBe('test-layout');
      });

      it('should clear all sources including legacy when clear() is called', () => {
        registry.registerLayout('legacy', mockLayout);
        registry.registerSystemLayouts([systemLayout1]);
        registry.registerThemeLayouts([themeLayout1]);
        registry.registerDeckLayouts([deckLayout1]);

        expect(registry.count()).toBeGreaterThan(0);

        registry.clear();

        expect(registry.count()).toBe(0);
        expect(registry.getSystemLayouts()).toHaveLength(0);
        expect(registry.getThemeLayouts()).toHaveLength(0);
        expect(registry.getDeckLayouts()).toHaveLength(0);
        expect(registry.hasLayout('legacy')).toBe(false);
      });
    });
  });
});
