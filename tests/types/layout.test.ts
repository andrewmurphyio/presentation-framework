import { describe, it, expect } from 'vitest';
import type { LayoutDefinition, LayoutZone } from '../../src/lib/types/layout';
import { LayoutSource } from '../../src/lib/types/layout';

describe('Layout Types', () => {
  describe('LayoutSource enum', () => {
    it('should have correct source values', () => {
      expect(LayoutSource.SYSTEM).toBe('system');
      expect(LayoutSource.THEME).toBe('theme');
      expect(LayoutSource.DECK).toBe('deck');
    });

    it('should have all three hierarchy levels', () => {
      const sources = Object.values(LayoutSource);
      expect(sources).toHaveLength(3);
      expect(sources).toContain('system');
      expect(sources).toContain('theme');
      expect(sources).toContain('deck');
    });
  });

  describe('LayoutZone interface', () => {
    it('should accept valid zone definitions', () => {
      const zone: LayoutZone = {
        name: 'title',
        gridArea: 'title-area',
        description: 'Main slide title',
      };

      expect(zone.name).toBe('title');
      expect(zone.gridArea).toBe('title-area');
      expect(zone.description).toBe('Main slide title');
    });

    it('should allow minimal zone definition', () => {
      const zone: LayoutZone = {
        name: 'content',
      };

      expect(zone.name).toBe('content');
      expect(zone.gridArea).toBeUndefined();
      expect(zone.description).toBeUndefined();
    });
  });

  describe('LayoutDefinition interface', () => {
    it('should accept valid layout definitions', () => {
      const layout: LayoutDefinition = {
        name: 'custom-layout',
        description: 'A custom layout for special slides',
        zones: [
          { name: 'header', gridArea: 'header' },
          { name: 'main', gridArea: 'main' },
        ],
        gridTemplateAreas: '"header" "main"',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        customStyles: '.custom { color: red; }',
        source: LayoutSource.DECK,
        priority: 100,
      };

      expect(layout.name).toBe('custom-layout');
      expect(layout.source).toBe(LayoutSource.DECK);
      expect(layout.priority).toBe(100);
      expect(layout.zones).toHaveLength(2);
    });

    it('should allow minimal layout definition', () => {
      const layout: LayoutDefinition = {
        name: 'simple',
        description: 'A simple layout',
        zones: [{ name: 'content' }],
      };

      expect(layout.name).toBe('simple');
      expect(layout.description).toBe('A simple layout');
      expect(layout.zones).toHaveLength(1);
      expect(layout.source).toBeUndefined();
      expect(layout.priority).toBeUndefined();
    });

    it('should support layouts with different sources', () => {
      const systemLayout: LayoutDefinition = {
        name: 'title',
        description: 'System title layout',
        zones: [{ name: 'title' }],
        source: LayoutSource.SYSTEM,
        priority: 0,
      };

      const themeLayout: LayoutDefinition = {
        name: 'themed-title',
        description: 'Theme-specific title layout',
        zones: [{ name: 'title' }, { name: 'subtitle' }],
        source: LayoutSource.THEME,
        priority: 50,
      };

      const deckLayout: LayoutDefinition = {
        name: 'deck-title',
        description: 'Deck-specific title layout',
        zones: [{ name: 'title' }, { name: 'subtitle' }, { name: 'logo' }],
        source: LayoutSource.DECK,
        priority: 100,
      };

      expect(systemLayout.source).toBe(LayoutSource.SYSTEM);
      expect(themeLayout.source).toBe(LayoutSource.THEME);
      expect(deckLayout.source).toBe(LayoutSource.DECK);

      // Verify priority ordering (deck > theme > system)
      expect(deckLayout.priority).toBeGreaterThan(themeLayout.priority!);
      expect(themeLayout.priority).toBeGreaterThan(systemLayout.priority!);
    });
  });

  describe('Type Validation', () => {
    it('should compile with TypeScript strict mode', () => {
      // This test passes if TypeScript compilation succeeds
      // The presence of this test ensures our types are valid
      const testLayout: LayoutDefinition = {
        name: 'type-test',
        description: 'Testing type compilation',
        zones: [
          {
            name: 'test-zone',
            gridArea: 'test',
            description: 'A test zone',
          },
        ],
        gridTemplateAreas: '"test"',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        customStyles: '',
        source: LayoutSource.SYSTEM,
        priority: 0,
      };

      // TypeScript will validate these assignments at compile time
      const name: string = testLayout.name;
      const source: LayoutSource | undefined = testLayout.source;
      const priority: number | undefined = testLayout.priority;

      expect(name).toBe('type-test');
      expect(source).toBe(LayoutSource.SYSTEM);
      expect(priority).toBe(0);
    });
  });
});