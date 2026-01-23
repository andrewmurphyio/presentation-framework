import { describe, it, expect } from 'vitest';
import { comparisonLayout } from '@/lib/design-system/layouts/comparison';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Comparison Layout', () => {
  it('should have correct name', () => {
    expect(comparisonLayout.name).toBe('comparison');
  });

  it('should have a description', () => {
    expect(comparisonLayout.description).toBeDefined();
    expect(comparisonLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title, left-label, left, right-label, and right zones', () => {
    expect(comparisonLayout.zones).toHaveLength(5);

    const zoneNames = comparisonLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('left-label');
    expect(zoneNames).toContain('left');
    expect(zoneNames).toContain('right-label');
    expect(zoneNames).toContain('right');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = comparisonLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have left-label zone with correct grid area', () => {
    const leftLabelZone = comparisonLayout.zones.find(
      (z) => z.name === 'left-label'
    );
    expect(leftLabelZone).toBeDefined();
    expect(leftLabelZone?.gridArea).toBe('left-label');
  });

  it('should have left zone with correct grid area', () => {
    const leftZone = comparisonLayout.zones.find((z) => z.name === 'left');
    expect(leftZone).toBeDefined();
    expect(leftZone?.gridArea).toBe('left');
  });

  it('should have right-label zone with correct grid area', () => {
    const rightLabelZone = comparisonLayout.zones.find(
      (z) => z.name === 'right-label'
    );
    expect(rightLabelZone).toBeDefined();
    expect(rightLabelZone?.gridArea).toBe('right-label');
  });

  it('should have right zone with correct grid area', () => {
    const rightZone = comparisonLayout.zones.find((z) => z.name === 'right');
    expect(rightZone).toBeDefined();
    expect(rightZone?.gridArea).toBe('right');
  });

  it('should have CSS grid template areas defined', () => {
    expect(comparisonLayout.gridTemplateAreas).toBeDefined();
    expect(comparisonLayout.gridTemplateAreas).toContain('title');
    expect(comparisonLayout.gridTemplateAreas).toContain('left-label');
    expect(comparisonLayout.gridTemplateAreas).toContain('left');
    expect(comparisonLayout.gridTemplateAreas).toContain('right-label');
    expect(comparisonLayout.gridTemplateAreas).toContain('right');
  });

  it('should have CSS grid template columns for equal split', () => {
    expect(comparisonLayout.gridTemplateColumns).toBeDefined();
    // Equal columns for comparison
    expect(comparisonLayout.gridTemplateColumns).toBe('1fr 1fr');
  });

  it('should have CSS grid template rows', () => {
    expect(comparisonLayout.gridTemplateRows).toBeDefined();
    // Title and labels should be auto-sized, content should fill remaining space
    expect(comparisonLayout.gridTemplateRows).toContain('auto');
    expect(comparisonLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('comparison', comparisonLayout)
    ).not.toThrow();

    const retrieved = registry.getLayout('comparison');
    expect(retrieved).toEqual(comparisonLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = comparisonLayout.zones.find((z) => z.name === 'title');
    const leftLabelZone = comparisonLayout.zones.find(
      (z) => z.name === 'left-label'
    );
    const leftZone = comparisonLayout.zones.find((z) => z.name === 'left');
    const rightLabelZone = comparisonLayout.zones.find(
      (z) => z.name === 'right-label'
    );
    const rightZone = comparisonLayout.zones.find((z) => z.name === 'right');

    expect(titleZone?.description).toBeDefined();
    expect(leftLabelZone?.description).toBeDefined();
    expect(leftZone?.description).toBeDefined();
    expect(rightLabelZone?.description).toBeDefined();
    expect(rightZone?.description).toBeDefined();
  });
});
