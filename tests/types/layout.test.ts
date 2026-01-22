import { describe, it, expect } from 'vitest';
import type { LayoutDefinition, LayoutZone } from '@/lib/types/layout';

describe('Layout Types', () => {
  it('should accept a valid LayoutZone object', () => {
    const zone: LayoutZone = {
      name: 'title',
      gridArea: 'title',
      description: 'Main title area',
    };

    expect(zone.name).toBe('title');
    expect(zone.gridArea).toBe('title');
  });

  it('should accept a valid LayoutDefinition object', () => {
    const layout: LayoutDefinition = {
      name: 'title',
      description: 'Title slide layout with title and subtitle zones',
      zones: [
        { name: 'title', gridArea: 'title' },
        { name: 'subtitle', gridArea: 'subtitle' },
      ],
      gridTemplateAreas: `
        "title"
        "subtitle"
      `,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto auto',
    };

    expect(layout.name).toBe('title');
    expect(layout.zones).toHaveLength(2);
    expect(layout.zones[0]?.name).toBe('title');
  });
});
