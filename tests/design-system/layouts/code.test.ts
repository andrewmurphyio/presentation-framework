import { describe, it, expect } from 'vitest';
import { codeLayout } from '@/lib/design-system/layouts/code';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Code Layout', () => {
  it('should have correct name', () => {
    expect(codeLayout.name).toBe('code');
  });

  it('should have a description', () => {
    expect(codeLayout.description).toBeDefined();
    expect(codeLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title and code zones', () => {
    expect(codeLayout.zones).toHaveLength(2);

    const zoneNames = codeLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('code');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = codeLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have code zone with correct grid area', () => {
    const codeZone = codeLayout.zones.find((z) => z.name === 'code');
    expect(codeZone).toBeDefined();
    expect(codeZone?.gridArea).toBe('code');
  });

  it('should have CSS grid template areas defined', () => {
    expect(codeLayout.gridTemplateAreas).toBeDefined();
    expect(codeLayout.gridTemplateAreas).toContain('title');
    expect(codeLayout.gridTemplateAreas).toContain('code');
  });

  it('should have CSS grid template columns', () => {
    expect(codeLayout.gridTemplateColumns).toBeDefined();
    expect(codeLayout.gridTemplateColumns).toBe('1fr');
  });

  it('should have CSS grid template rows', () => {
    expect(codeLayout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, code should fill remaining space
    expect(codeLayout.gridTemplateRows).toContain('auto');
    expect(codeLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() => registry.registerLayout('code', codeLayout)).not.toThrow();

    const retrieved = registry.getLayout('code');
    expect(retrieved).toEqual(codeLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = codeLayout.zones.find((z) => z.name === 'title');
    const codeZone = codeLayout.zones.find((z) => z.name === 'code');

    expect(titleZone?.description).toBeDefined();
    expect(codeZone?.description).toBeDefined();
  });
});
