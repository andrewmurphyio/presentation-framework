import { describe, it, expect, beforeEach } from 'vitest';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';
import type { LayoutDefinition } from '@/lib/types/layout';

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
});
