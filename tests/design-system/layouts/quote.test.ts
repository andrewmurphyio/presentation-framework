import { describe, it, expect } from 'vitest';
import { quoteLayout } from '@/lib/design-system/layouts/quote';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Quote Layout', () => {
  it('should have correct name', () => {
    expect(quoteLayout.name).toBe('quote');
  });

  it('should have a description', () => {
    expect(quoteLayout.description).toBeDefined();
    expect(quoteLayout.description.length).toBeGreaterThan(0);
  });

  it('should have quote and attribution zones', () => {
    expect(quoteLayout.zones).toHaveLength(2);

    const zoneNames = quoteLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('quote');
    expect(zoneNames).toContain('attribution');
  });

  it('should have quote zone with correct grid area', () => {
    const quoteZone = quoteLayout.zones.find((z) => z.name === 'quote');
    expect(quoteZone).toBeDefined();
    expect(quoteZone?.gridArea).toBe('quote');
  });

  it('should have attribution zone with correct grid area', () => {
    const attributionZone = quoteLayout.zones.find(
      (z) => z.name === 'attribution'
    );
    expect(attributionZone).toBeDefined();
    expect(attributionZone?.gridArea).toBe('attribution');
  });

  it('should have CSS grid template areas defined', () => {
    expect(quoteLayout.gridTemplateAreas).toBeDefined();
    expect(quoteLayout.gridTemplateAreas).toContain('quote');
    expect(quoteLayout.gridTemplateAreas).toContain('attribution');
  });

  it('should have CSS grid template columns', () => {
    expect(quoteLayout.gridTemplateColumns).toBeDefined();
    expect(quoteLayout.gridTemplateColumns).toBe('1fr');
  });

  it('should have CSS grid template rows for vertical centering', () => {
    expect(quoteLayout.gridTemplateRows).toBeDefined();
    // Should have spacing before and after for vertical centering
    expect(quoteLayout.gridTemplateRows).toContain('1fr');
    expect(quoteLayout.gridTemplateRows).toContain('auto');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() => registry.registerLayout('quote', quoteLayout)).not.toThrow();

    const retrieved = registry.getLayout('quote');
    expect(retrieved).toEqual(quoteLayout);
  });

  it('should have zone descriptions', () => {
    const quoteZone = quoteLayout.zones.find((z) => z.name === 'quote');
    const attributionZone = quoteLayout.zones.find(
      (z) => z.name === 'attribution'
    );

    expect(quoteZone?.description).toBeDefined();
    expect(attributionZone?.description).toBeDefined();
  });
});
