import { describe, it, expect } from 'vitest';
import { imageRightLayout } from '@/lib/design-system/layouts/image-right';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Image-Right Layout', () => {
  it('should have correct name', () => {
    expect(imageRightLayout.name).toBe('image-right');
  });

  it('should have a description', () => {
    expect(imageRightLayout.description).toBeDefined();
    expect(imageRightLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title, content, and image zones', () => {
    expect(imageRightLayout.zones).toHaveLength(3);

    const zoneNames = imageRightLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('content');
    expect(zoneNames).toContain('image');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = imageRightLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have content zone with correct grid area', () => {
    const contentZone = imageRightLayout.zones.find((z) => z.name === 'content');
    expect(contentZone).toBeDefined();
    expect(contentZone?.gridArea).toBe('content');
  });

  it('should have image zone with correct grid area', () => {
    const imageZone = imageRightLayout.zones.find((z) => z.name === 'image');
    expect(imageZone).toBeDefined();
    expect(imageZone?.gridArea).toBe('image');
  });

  it('should have CSS grid template areas defined', () => {
    expect(imageRightLayout.gridTemplateAreas).toBeDefined();
    expect(imageRightLayout.gridTemplateAreas).toContain('title');
    expect(imageRightLayout.gridTemplateAreas).toContain('content');
    expect(imageRightLayout.gridTemplateAreas).toContain('image');
  });

  it('should have CSS grid template columns for 60/40 split', () => {
    expect(imageRightLayout.gridTemplateColumns).toBeDefined();
    // 3fr (60%) for content, 2fr (40%) for image
    expect(imageRightLayout.gridTemplateColumns).toBe('3fr 2fr');
  });

  it('should have CSS grid template rows', () => {
    expect(imageRightLayout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, content area should fill remaining space
    expect(imageRightLayout.gridTemplateRows).toContain('auto');
    expect(imageRightLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('image-right', imageRightLayout)
    ).not.toThrow();

    const retrieved = registry.getLayout('image-right');
    expect(retrieved).toEqual(imageRightLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = imageRightLayout.zones.find((z) => z.name === 'title');
    const contentZone = imageRightLayout.zones.find((z) => z.name === 'content');
    const imageZone = imageRightLayout.zones.find((z) => z.name === 'image');

    expect(titleZone?.description).toBeDefined();
    expect(contentZone?.description).toBeDefined();
    expect(imageZone?.description).toBeDefined();
  });
});
