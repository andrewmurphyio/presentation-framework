import { describe, it, expect } from 'vitest';
import { imageLeftLayout } from '@/lib/design-system/layouts/image-left';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Image-Left Layout', () => {
  it('should have correct name', () => {
    expect(imageLeftLayout.name).toBe('image-left');
  });

  it('should have a description', () => {
    expect(imageLeftLayout.description).toBeDefined();
    expect(imageLeftLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title, image, and content zones', () => {
    expect(imageLeftLayout.zones).toHaveLength(3);

    const zoneNames = imageLeftLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('image');
    expect(zoneNames).toContain('content');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = imageLeftLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have image zone with correct grid area', () => {
    const imageZone = imageLeftLayout.zones.find((z) => z.name === 'image');
    expect(imageZone).toBeDefined();
    expect(imageZone?.gridArea).toBe('image');
  });

  it('should have content zone with correct grid area', () => {
    const contentZone = imageLeftLayout.zones.find((z) => z.name === 'content');
    expect(contentZone).toBeDefined();
    expect(contentZone?.gridArea).toBe('content');
  });

  it('should have CSS grid template areas defined', () => {
    expect(imageLeftLayout.gridTemplateAreas).toBeDefined();
    expect(imageLeftLayout.gridTemplateAreas).toContain('title');
    expect(imageLeftLayout.gridTemplateAreas).toContain('image');
    expect(imageLeftLayout.gridTemplateAreas).toContain('content');
  });

  it('should have CSS grid template columns for 40/60 split', () => {
    expect(imageLeftLayout.gridTemplateColumns).toBeDefined();
    // 2fr (40%) for image, 3fr (60%) for content
    expect(imageLeftLayout.gridTemplateColumns).toBe('2fr 3fr');
  });

  it('should have CSS grid template rows', () => {
    expect(imageLeftLayout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, content area should fill remaining space
    expect(imageLeftLayout.gridTemplateRows).toContain('auto');
    expect(imageLeftLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('image-left', imageLeftLayout)
    ).not.toThrow();

    const retrieved = registry.getLayout('image-left');
    expect(retrieved).toEqual(imageLeftLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = imageLeftLayout.zones.find((z) => z.name === 'title');
    const imageZone = imageLeftLayout.zones.find((z) => z.name === 'image');
    const contentZone = imageLeftLayout.zones.find((z) => z.name === 'content');

    expect(titleZone?.description).toBeDefined();
    expect(imageZone?.description).toBeDefined();
    expect(contentZone?.description).toBeDefined();
  });
});
