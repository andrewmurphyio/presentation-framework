import { describe, it, expect } from 'vitest';
import {
  mergeLayouts,
  extendLayout,
  overrideLayout,
  cloneLayout,
  hasRequiredZones,
  getZoneNames,
  findZone,
  checkLayoutCompatibility,
} from '../../src/lib/design-system/layout-utils';
import type { LayoutDefinition } from '../../src/lib/types/layout';
import { LayoutSource } from '../../src/lib/types/layout';

describe('Layout Utils', () => {
  const createTestLayout = (name: string, zones: string[]): LayoutDefinition => ({
    name,
    description: `Test layout ${name}`,
    zones: zones.map(z => ({ name: z, gridArea: z })),
    gridTemplateAreas: zones.map(z => `"${z}"`).join(' '),
    source: LayoutSource.SYSTEM,
    priority: 0,
  });

  describe('mergeLayouts', () => {
    it('should merge two layouts preserving all unique zones', () => {
      const layout1 = createTestLayout('layout1', ['header', 'content']);
      const layout2 = createTestLayout('layout2', ['sidebar', 'footer']);

      const merged = mergeLayouts([layout1, layout2]);

      expect(merged.zones).toHaveLength(4);
      const zoneNames = merged.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('content');
      expect(zoneNames).toContain('sidebar');
      expect(zoneNames).toContain('footer');
    });

    it('should handle duplicate zones with first conflict resolution', () => {
      const layout1 = createTestLayout('layout1', ['header', 'main']);
      const layout2 = createTestLayout('layout2', ['main', 'footer']);

      // Modify main zone in layout2 to have different properties
      layout2.zones[0].description = 'Different main';

      const merged = mergeLayouts([layout1, layout2], { conflictResolution: 'first' });

      expect(merged.zones).toHaveLength(3);
      const mainZone = merged.zones.find(z => z.name === 'main');
      expect(mainZone?.description).toBeUndefined(); // Should keep first (no description)
    });

    it('should handle duplicate zones with last conflict resolution', () => {
      const layout1 = createTestLayout('layout1', ['header', 'main']);
      const layout2 = createTestLayout('layout2', ['main', 'footer']);

      // Modify main zone in layout2 to have different properties
      layout2.zones[0].description = 'Different main';

      const merged = mergeLayouts([layout1, layout2], { conflictResolution: 'last' });

      expect(merged.zones).toHaveLength(3);
      const mainZone = merged.zones.find(z => z.name === 'main');
      expect(mainZone?.description).toBe('Different main'); // Should keep last
    });

    it('should use custom name and description', () => {
      const layout1 = createTestLayout('layout1', ['zone1']);
      const layout2 = createTestLayout('layout2', ['zone2']);

      const merged = mergeLayouts([layout1, layout2], {
        name: 'custom-merged',
        description: 'Custom description',
      });

      expect(merged.name).toBe('custom-merged');
      expect(merged.description).toBe('Custom description');
    });

    it('should throw error when no layouts provided', () => {
      expect(() => mergeLayouts([])).toThrow('mergeLayouts requires at least one layout');
    });

    it('should use first layout as base for grid properties', () => {
      const layout1: LayoutDefinition = {
        ...createTestLayout('layout1', ['zone1']),
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        customStyles: '.custom1 {}',
      };
      const layout2: LayoutDefinition = {
        ...createTestLayout('layout2', ['zone2']),
        gridTemplateColumns: '2fr',
        gridTemplateRows: '1fr',
        customStyles: '.custom2 {}',
      };

      const merged = mergeLayouts([layout1, layout2]);

      expect(merged.gridTemplateColumns).toBe('1fr');
      expect(merged.gridTemplateRows).toBe('auto');
      expect(merged.customStyles).toBe('.custom1 {}');
    });
  });

  describe('extendLayout', () => {
    it('should add zones to existing layout', () => {
      const base = createTestLayout('base', ['header', 'content']);
      const extended = extendLayout(base, {
        addZones: [
          { name: 'footer', gridArea: 'footer' },
          { name: 'sidebar', gridArea: 'sidebar' },
        ],
      });

      expect(extended.zones).toHaveLength(4);
      const zoneNames = extended.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('content');
      expect(zoneNames).toContain('footer');
      expect(zoneNames).toContain('sidebar');
    });

    it('should remove zones from layout', () => {
      const base = createTestLayout('base', ['header', 'content', 'footer']);
      const extended = extendLayout(base, {
        removeZones: ['footer'],
      });

      expect(extended.zones).toHaveLength(2);
      const zoneNames = extended.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('content');
      expect(zoneNames).not.toContain('footer');
    });

    it('should modify existing zones', () => {
      const base = createTestLayout('base', ['header', 'content']);
      const extended = extendLayout(base, {
        modifyZones: {
          header: {
            gridArea: 'top-header',
            description: 'Modified header',
          },
        },
      });

      const headerZone = extended.zones.find(z => z.name === 'header');
      expect(headerZone?.gridArea).toBe('top-header');
      expect(headerZone?.description).toBe('Modified header');
    });

    it('should combine add, remove, and modify operations', () => {
      const base = createTestLayout('base', ['header', 'content', 'sidebar']);
      const extended = extendLayout(base, {
        removeZones: ['sidebar'],
        modifyZones: {
          header: { gridArea: 'top' },
        },
        addZones: [{ name: 'footer', gridArea: 'footer' }],
      });

      expect(extended.zones).toHaveLength(3);
      const zoneNames = extended.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('content');
      expect(zoneNames).toContain('footer');
      expect(zoneNames).not.toContain('sidebar');

      const headerZone = extended.zones.find(z => z.name === 'header');
      expect(headerZone?.gridArea).toBe('top');
    });

    it('should throw error when adding duplicate zone', () => {
      const base = createTestLayout('base', ['header', 'content']);
      expect(() =>
        extendLayout(base, {
          addZones: [{ name: 'header', gridArea: 'new-header' }],
        })
      ).toThrow('Zone "header" already exists');
    });

    it('should override grid properties', () => {
      const base = createTestLayout('base', ['zone1']);
      const extended = extendLayout(base, {
        gridTemplateAreas: '"new-area"',
        gridTemplateColumns: '2fr',
        gridTemplateRows: '100px',
        customStyles: '.new {}',
      });

      expect(extended.gridTemplateAreas).toBe('"new-area"');
      expect(extended.gridTemplateColumns).toBe('2fr');
      expect(extended.gridTemplateRows).toBe('100px');
      expect(extended.customStyles).toBe('.new {}');
    });
  });

  describe('overrideLayout', () => {
    it('should override existing zones', () => {
      const base = createTestLayout('base', ['header', 'content']);
      const overridden = overrideLayout(base, {
        zones: {
          header: { name: 'header', gridArea: 'top', description: 'New header' },
        },
      });

      const headerZone = overridden.zones.find(z => z.name === 'header');
      expect(headerZone?.gridArea).toBe('top');
      expect(headerZone?.description).toBe('New header');

      // Content zone should remain unchanged
      const contentZone = overridden.zones.find(z => z.name === 'content');
      expect(contentZone?.gridArea).toBe('content');
    });

    it('should add new zones', () => {
      const base = createTestLayout('base', ['header']);
      const overridden = overrideLayout(base, {
        zones: {
          footer: { name: 'footer', gridArea: 'footer' },
        },
      });

      expect(overridden.zones).toHaveLength(2);
      const zoneNames = overridden.zones.map(z => z.name);
      expect(zoneNames).toContain('header');
      expect(zoneNames).toContain('footer');
    });

    it('should override layout properties', () => {
      const base = createTestLayout('base', ['zone1']);
      const overridden = overrideLayout(base, {
        name: 'overridden',
        description: 'Overridden layout',
        gridTemplateAreas: '"override"',
      });

      expect(overridden.name).toBe('overridden');
      expect(overridden.description).toBe('Overridden layout');
      expect(overridden.gridTemplateAreas).toBe('"override"');
    });
  });

  describe('cloneLayout', () => {
    it('should create a deep copy of layout', () => {
      const original = createTestLayout('original', ['zone1', 'zone2']);
      const cloned = cloneLayout(original);

      expect(cloned).not.toBe(original);
      expect(cloned.zones).not.toBe(original.zones);
      expect(cloned.zones[0]).not.toBe(original.zones[0]);

      // Content should be the same
      expect(cloned).toEqual(original);
    });

    it('should allow modifications without affecting original', () => {
      const original = createTestLayout('original', ['zone1']);
      const cloned = cloneLayout(original);

      cloned.name = 'modified';
      cloned.zones[0].name = 'modified-zone';

      expect(original.name).toBe('original');
      expect(original.zones[0].name).toBe('zone1');
    });
  });

  describe('hasRequiredZones', () => {
    it('should return true when all required zones present', () => {
      const layout = createTestLayout('test', ['header', 'content', 'footer']);
      expect(hasRequiredZones(layout, ['header', 'content'])).toBe(true);
    });

    it('should return false when required zone missing', () => {
      const layout = createTestLayout('test', ['header', 'footer']);
      expect(hasRequiredZones(layout, ['header', 'content'])).toBe(false);
    });

    it('should return true for empty required zones', () => {
      const layout = createTestLayout('test', ['header']);
      expect(hasRequiredZones(layout, [])).toBe(true);
    });
  });

  describe('getZoneNames', () => {
    it('should return all zone names', () => {
      const layout = createTestLayout('test', ['zone1', 'zone2', 'zone3']);
      const names = getZoneNames(layout);
      expect(names).toEqual(['zone1', 'zone2', 'zone3']);
    });

    it('should return empty array for layout with no zones', () => {
      const layout: LayoutDefinition = {
        name: 'empty',
        description: 'Empty layout',
        zones: [],
      };
      expect(getZoneNames(layout)).toEqual([]);
    });
  });

  describe('findZone', () => {
    it('should find existing zone', () => {
      const layout = createTestLayout('test', ['header', 'content']);
      const zone = findZone(layout, 'header');
      expect(zone).toBeDefined();
      expect(zone?.name).toBe('header');
      expect(zone?.gridArea).toBe('header');
    });

    it('should return undefined for non-existent zone', () => {
      const layout = createTestLayout('test', ['header']);
      const zone = findZone(layout, 'footer');
      expect(zone).toBeUndefined();
    });
  });

  describe('checkLayoutCompatibility', () => {
    it('should report layouts as compatible when no conflicts', () => {
      const layout1 = createTestLayout('layout1', ['header', 'content']);
      const layout2 = createTestLayout('layout2', ['sidebar', 'footer']);

      const result = checkLayoutCompatibility(layout1, layout2);
      expect(result.compatible).toBe(true);
      expect(result.conflicts).toEqual([]);
    });

    it('should report layouts as compatible when same zones have same gridArea', () => {
      const layout1 = createTestLayout('layout1', ['header', 'content']);
      const layout2 = createTestLayout('layout2', ['header', 'footer']);

      const result = checkLayoutCompatibility(layout1, layout2);
      expect(result.compatible).toBe(true);
      expect(result.conflicts).toEqual([]);
    });

    it('should detect conflicting gridArea for same zone', () => {
      const layout1 = createTestLayout('layout1', ['header']);
      const layout2 = createTestLayout('layout2', ['header']);

      // Modify header in layout2 to have different gridArea
      layout2.zones[0].gridArea = 'top-header';

      const result = checkLayoutCompatibility(layout1, layout2);
      expect(result.compatible).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0]).toContain('Zone "header" has conflicting gridArea');
    });

    it('should handle layouts with no gridArea defined', () => {
      const layout1: LayoutDefinition = {
        name: 'layout1',
        description: 'Layout 1',
        zones: [{ name: 'zone1' }],
      };
      const layout2: LayoutDefinition = {
        name: 'layout2',
        description: 'Layout 2',
        zones: [{ name: 'zone1', gridArea: 'area1' }],
      };

      const result = checkLayoutCompatibility(layout1, layout2);
      expect(result.compatible).toBe(true);
      expect(result.conflicts).toEqual([]);
    });
  });
});