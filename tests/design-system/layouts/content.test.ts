import { describe, it, expect } from 'vitest';
import { contentLayout } from '@/lib/design-system/layouts/content';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Content Layout', () => {
  it('should have correct name', () => {
    expect(contentLayout.name).toBe('content');
  });

  it('should have a description', () => {
    expect(contentLayout.description).toBeDefined();
    expect(contentLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title and content zones', () => {
    expect(contentLayout.zones).toHaveLength(2);

    const zoneNames = contentLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('content');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = contentLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have content zone with correct grid area', () => {
    const contentZone = contentLayout.zones.find((z) => z.name === 'content');
    expect(contentZone).toBeDefined();
    expect(contentZone?.gridArea).toBe('content');
  });

  it('should have CSS grid template areas defined', () => {
    expect(contentLayout.gridTemplateAreas).toBeDefined();
    expect(contentLayout.gridTemplateAreas).toContain('title');
    expect(contentLayout.gridTemplateAreas).toContain('content');
  });

  it('should have CSS grid template columns', () => {
    expect(contentLayout.gridTemplateColumns).toBeDefined();
    expect(contentLayout.gridTemplateColumns).toBe('1fr');
  });

  it('should have CSS grid template rows', () => {
    expect(contentLayout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, content should fill remaining space
    expect(contentLayout.gridTemplateRows).toContain('auto');
    expect(contentLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() => registry.registerLayout('content', contentLayout)).not.toThrow();

    const retrieved = registry.getLayout('content');
    expect(retrieved).toEqual(contentLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = contentLayout.zones.find((z) => z.name === 'title');
    const contentZone = contentLayout.zones.find((z) => z.name === 'content');

    expect(titleZone?.description).toBeDefined();
    expect(contentZone?.description).toBeDefined();
  });
});
