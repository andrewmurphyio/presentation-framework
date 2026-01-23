import { describe, it, expect, beforeEach } from 'vitest';
import { LayoutResolver } from '../../src/lib/design-system/layout-resolver';
import { LayoutRegistry } from '../../src/lib/design-system/layout-registry';
import { LayoutSource } from '../../src/lib/types/layout';
import type { LayoutDefinition } from '../../src/lib/types/layout';
import type { CustomLayoutDefinition } from '../../src/lib/types/deck';

describe('LayoutResolver', () => {
  let resolver: LayoutResolver;
  let registry: LayoutRegistry;

  const systemLayout: LayoutDefinition = {
    name: 'system-layout',
    description: 'A system layout',
    zones: [
      { name: 'title', gridArea: 'title' },
      { name: 'content', gridArea: 'content' },
    ],
    gridTemplateAreas: '"title" "content"',
  };

  const themeLayout: LayoutDefinition = {
    name: 'theme-layout',
    description: 'A theme layout',
    zones: [
      { name: 'header', gridArea: 'header' },
      { name: 'main', gridArea: 'main' },
    ],
    gridTemplateAreas: '"header" "main"',
  };

  const deckLayout: CustomLayoutDefinition = {
    name: 'deck-layout',
    description: 'A deck layout',
    zones: [
      { name: 'top', gridArea: 'top' },
      { name: 'bottom', gridArea: 'bottom' },
    ],
    gridTemplateAreas: '"top" "bottom"',
  };

  beforeEach(() => {
    registry = new LayoutRegistry();
    registry.registerLayout('system-layout', systemLayout);
    resolver = new LayoutResolver(registry);
  });

  describe('resolveLayout', () => {
    it('should resolve system layout when no other sources provided', () => {
      const resolved = resolver.resolveLayout('system-layout');
      expect(resolved.name).toBe('system-layout');
      expect(resolved.source).toBe(LayoutSource.SYSTEM);
      expect(resolved.priority).toBe(0);
    });

    it('should resolve theme layout over system layout', () => {
      registry.registerLayout('shared', systemLayout);
      const themeLayouts = [
        {
          ...themeLayout,
          name: 'shared',
        },
      ];

      const resolved = resolver.resolveLayout('shared', undefined, themeLayouts);
      expect(resolved.name).toBe('shared');
      expect(resolved.source).toBe(LayoutSource.THEME);
      expect(resolved.priority).toBe(50);
      expect(resolved.zones[0].name).toBe('header'); // Theme layout zones
    });

    it('should resolve deck layout over theme and system layouts', () => {
      registry.registerLayout('shared', systemLayout);
      const themeLayouts = [
        {
          ...themeLayout,
          name: 'shared',
        },
      ];
      const deckLayouts = [
        {
          ...deckLayout,
          name: 'shared',
        },
      ];

      const resolved = resolver.resolveLayout('shared', deckLayouts, themeLayouts);
      expect(resolved.name).toBe('shared');
      expect(resolved.source).toBe(LayoutSource.DECK);
      expect(resolved.priority).toBe(100);
      expect(resolved.zones[0].name).toBe('top'); // Deck layout zones
    });

    it('should throw error when layout not found in any tier', () => {
      expect(() => resolver.resolveLayout('nonexistent')).toThrow(
        'Layout "nonexistent" not found in any tier'
      );
    });

    it('should cache resolved layouts', () => {
      // First call
      const resolved1 = resolver.resolveLayout('system-layout');

      // Modify the registry (this shouldn't affect cached result)
      registry.registerLayout('system-layout', {
        ...systemLayout,
        description: 'Modified description',
      });

      // Second call should return cached result
      const resolved2 = resolver.resolveLayout('system-layout');
      expect(resolved2).toBe(resolved1); // Same reference
      expect(resolved2.description).toBe('A system layout'); // Original description
    });

    it('should clear cache when requested', () => {
      // First call
      const resolved1 = resolver.resolveLayout('system-layout');

      // Clear cache
      resolver.clearCache();

      // Second call should create new object
      const resolved2 = resolver.resolveLayout('system-layout');
      expect(resolved2).not.toBe(resolved1); // Different reference
      expect(resolved2).toEqual(resolved1); // But same content
    });
  });

  describe('layout inheritance (extends)', () => {
    it('should extend a base layout with additional zones', () => {
      const extendedLayout: CustomLayoutDefinition = {
        name: 'extended',
        description: 'Extended layout',
        zones: [],
        extends: 'system-layout',
        additionalZones: [
          { name: 'footer', gridArea: 'footer' },
        ],
      };

      const resolved = resolver.resolveLayout('extended', [extendedLayout]);
      expect(resolved.zones).toHaveLength(3);
      expect(resolved.zones.map(z => z.name)).toContain('title');
      expect(resolved.zones.map(z => z.name)).toContain('content');
      expect(resolved.zones.map(z => z.name)).toContain('footer');
    });

    it('should remove zones when extending', () => {
      const extendedLayout: CustomLayoutDefinition = {
        name: 'extended',
        description: 'Extended layout',
        zones: [],
        extends: 'system-layout',
        removeZones: ['content'],
      };

      const resolved = resolver.resolveLayout('extended', [extendedLayout]);
      expect(resolved.zones).toHaveLength(1);
      expect(resolved.zones[0].name).toBe('title');
    });

    it('should modify zones when extending', () => {
      const extendedLayout: CustomLayoutDefinition = {
        name: 'extended',
        description: 'Extended layout',
        zones: [],
        extends: 'system-layout',
        modifyZones: {
          title: {
            gridArea: 'header',
            description: 'Modified title zone',
          },
        },
      };

      const resolved = resolver.resolveLayout('extended', [extendedLayout]);
      const titleZone = resolved.zones.find(z => z.name === 'title');
      expect(titleZone?.gridArea).toBe('header');
      expect(titleZone?.description).toBe('Modified title zone');
    });

    it('should handle all modifications together', () => {
      const extendedLayout: CustomLayoutDefinition = {
        name: 'extended',
        description: 'Extended layout',
        zones: [
          { name: 'sidebar', gridArea: 'sidebar' },
        ],
        extends: 'system-layout',
        removeZones: ['content'],
        modifyZones: {
          title: {
            gridArea: 'header',
          },
        },
        additionalZones: [
          { name: 'footer', gridArea: 'footer' },
        ],
      };

      const resolved = resolver.resolveLayout('extended', [extendedLayout]);
      expect(resolved.zones).toHaveLength(3); // title (modified), sidebar, footer

      const zoneNames = resolved.zones.map(z => z.name);
      expect(zoneNames).toContain('title');
      expect(zoneNames).toContain('sidebar');
      expect(zoneNames).toContain('footer');
      expect(zoneNames).not.toContain('content');

      const titleZone = resolved.zones.find(z => z.name === 'title');
      expect(titleZone?.gridArea).toBe('header');
    });
  });

  describe('layout composition (composeFrom)', () => {
    it('should compose multiple layouts', () => {
      registry.registerLayout('layout1', {
        name: 'layout1',
        description: 'Layout 1',
        zones: [
          { name: 'zone1', gridArea: 'zone1' },
          { name: 'zone2', gridArea: 'zone2' },
        ],
        gridTemplateAreas: '"zone1" "zone2"',
      });

      registry.registerLayout('layout2', {
        name: 'layout2',
        description: 'Layout 2',
        zones: [
          { name: 'zone3', gridArea: 'zone3' },
          { name: 'zone4', gridArea: 'zone4' },
        ],
        gridTemplateAreas: '"zone3" "zone4"',
      });

      const composedLayout: CustomLayoutDefinition = {
        name: 'composed',
        description: 'Composed layout',
        zones: [],
        composeFrom: ['layout1', 'layout2'],
      };

      const resolved = resolver.resolveLayout('composed', [composedLayout]);
      expect(resolved.zones).toHaveLength(4);

      const zoneNames = resolved.zones.map(z => z.name);
      expect(zoneNames).toContain('zone1');
      expect(zoneNames).toContain('zone2');
      expect(zoneNames).toContain('zone3');
      expect(zoneNames).toContain('zone4');
    });

    it('should handle composition with modifications', () => {
      registry.registerLayout('base1', {
        name: 'base1',
        description: 'Base 1',
        zones: [
          { name: 'header', gridArea: 'header' },
          { name: 'content', gridArea: 'content' },
        ],
        gridTemplateAreas: '"header" "content"',
      });

      registry.registerLayout('base2', {
        name: 'base2',
        description: 'Base 2',
        zones: [
          { name: 'sidebar', gridArea: 'sidebar' },
          { name: 'footer', gridArea: 'footer' },
        ],
        gridTemplateAreas: '"sidebar" "footer"',
      });

      const composedLayout: CustomLayoutDefinition = {
        name: 'composed',
        description: 'Composed layout',
        zones: [
          { name: 'custom', gridArea: 'custom' },
        ],
        composeFrom: ['base1', 'base2'],
        removeZones: ['footer'],
        modifyZones: {
          header: {
            gridArea: 'top',
          },
        },
        additionalZones: [
          { name: 'bottom', gridArea: 'bottom' },
        ],
      };

      const resolved = resolver.resolveLayout('composed', [composedLayout]);

      const zoneNames = resolved.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('content');
      expect(zoneNames).toContain('sidebar');
      expect(zoneNames).toContain('custom');
      expect(zoneNames).toContain('bottom');
      expect(zoneNames).not.toContain('footer');

      const headerZone = resolved.zones.find(z => z.name === 'header');
      expect(headerZone?.gridArea).toBe('top');
    });

    it('should deduplicate zones when composing', () => {
      registry.registerLayout('base1', {
        name: 'base1',
        description: 'Base 1',
        zones: [
          { name: 'shared', gridArea: 'shared1' },
          { name: 'unique1', gridArea: 'unique1' },
        ],
        gridTemplateAreas: '"shared1" "unique1"',
      });

      registry.registerLayout('base2', {
        name: 'base2',
        description: 'Base 2',
        zones: [
          { name: 'shared', gridArea: 'shared2' },
          { name: 'unique2', gridArea: 'unique2' },
        ],
        gridTemplateAreas: '"shared2" "unique2"',
      });

      const composedLayout: CustomLayoutDefinition = {
        name: 'composed',
        description: 'Composed layout',
        zones: [],
        composeFrom: ['base1', 'base2'],
      };

      const resolved = resolver.resolveLayout('composed', [composedLayout]);
      expect(resolved.zones).toHaveLength(3); // shared (first occurrence), unique1, unique2

      const zoneNames = resolved.zones.map(z => z.name);
      expect(zoneNames).toEqual(['shared', 'unique1', 'unique2']);

      const sharedZone = resolved.zones.find(z => z.name === 'shared');
      expect(sharedZone?.gridArea).toBe('shared1'); // Should use first occurrence
    });
  });

  describe('complex scenarios', () => {
    it('should handle extending a composed layout', () => {
      registry.registerLayout('base1', {
        name: 'base1',
        description: 'Base 1',
        zones: [
          { name: 'zone1', gridArea: 'zone1' },
        ],
        gridTemplateAreas: '"zone1"',
      });

      registry.registerLayout('base2', {
        name: 'base2',
        description: 'Base 2',
        zones: [
          { name: 'zone2', gridArea: 'zone2' },
        ],
        gridTemplateAreas: '"zone2"',
      });

      const composedLayout: CustomLayoutDefinition = {
        name: 'composed',
        description: 'Composed layout',
        zones: [],
        composeFrom: ['base1', 'base2'],
      };

      const extendedLayout: CustomLayoutDefinition = {
        name: 'extended',
        description: 'Extended composed layout',
        zones: [],
        extends: 'composed',
        additionalZones: [
          { name: 'zone3', gridArea: 'zone3' },
        ],
      };

      const deckLayouts = [composedLayout, extendedLayout];
      const resolved = resolver.resolveLayout('extended', deckLayouts);

      expect(resolved.zones).toHaveLength(3);
      const zoneNames = resolved.zones.map(z => z.name);
      expect(zoneNames).toContain('zone1');
      expect(zoneNames).toContain('zone2');
      expect(zoneNames).toContain('zone3');
    });

    it('should handle circular references gracefully', () => {
      const layout1: CustomLayoutDefinition = {
        name: 'layout1',
        description: 'Layout 1',
        zones: [],
        extends: 'layout2',
      };

      const layout2: CustomLayoutDefinition = {
        name: 'layout2',
        description: 'Layout 2',
        zones: [],
        extends: 'layout1',
      };

      const deckLayouts = [layout1, layout2];

      // This will eventually hit max call stack, but should not crash
      expect(() => resolver.resolveLayout('layout1', deckLayouts)).toThrow();
    });
  });
});