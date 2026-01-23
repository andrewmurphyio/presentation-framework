import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ZoneBoundaries } from '@/lib/debug/panels/zone-boundaries';
import type { DebugZoneInfo } from '@/lib/types/debug';

describe('ZoneBoundaries', () => {
  let zoneBoundaries: ZoneBoundaries;
  let slideElement: HTMLElement;
  let parentContainer: HTMLElement;

  const mockZones: DebugZoneInfo[] = [
    { name: 'title', gridArea: 'title', populated: true, contentLength: 10 },
    { name: 'content', gridArea: 'content', populated: true, contentLength: 50 },
    { name: 'footer', gridArea: 'footer', populated: false },
  ];

  beforeEach(() => {
    zoneBoundaries = new ZoneBoundaries();

    // Create slide element with zones
    slideElement = document.createElement('div');
    slideElement.style.position = 'relative';
    slideElement.style.width = '800px';
    slideElement.style.height = '600px';

    // Create zone elements
    const titleZone = document.createElement('div');
    titleZone.setAttribute('data-zone', 'title');
    titleZone.style.width = '100px';
    titleZone.style.height = '50px';
    slideElement.appendChild(titleZone);

    const contentZone = document.createElement('div');
    contentZone.setAttribute('data-zone', 'content');
    contentZone.style.width = '200px';
    contentZone.style.height = '150px';
    slideElement.appendChild(contentZone);

    const footerZone = document.createElement('div');
    footerZone.setAttribute('data-zone', 'footer');
    footerZone.style.width = '100px';
    footerZone.style.height = '30px';
    slideElement.appendChild(footerZone);

    parentContainer = document.createElement('div');
    parentContainer.appendChild(slideElement);
    document.body.appendChild(parentContainer);
  });

  afterEach(() => {
    zoneBoundaries.destroy();
    document.body.removeChild(parentContainer);
  });

  describe('Rendering', () => {
    it('should render container element', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(container).toBeDefined();
      expect(container.className).toBe('pf-debug-zone-boundaries');
    });

    it('should render boundaries for all zones', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const boundaries = container.querySelectorAll('.pf-debug-zone-boundary');
      expect(boundaries.length).toBe(3);
    });

    it('should render boundary for each zone name', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const titleBoundary = container.querySelector('[data-zone="title"]');
      const contentBoundary = container.querySelector('[data-zone="content"]');
      const footerBoundary = container.querySelector('[data-zone="footer"]');

      expect(titleBoundary).toBeDefined();
      expect(contentBoundary).toBeDefined();
      expect(footerBoundary).toBeDefined();
    });

    it('should render zone labels', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const labels = container.querySelectorAll('.pf-debug-zone-label');
      expect(labels.length).toBe(3);
    });

    it('should display zone names in labels', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const titleLabel = container.querySelector(
        '[data-zone="title"] .pf-debug-zone-label'
      ) as HTMLElement;
      const contentLabel = container.querySelector(
        '[data-zone="content"] .pf-debug-zone-label'
      ) as HTMLElement;

      expect(titleLabel?.textContent).toBe('title');
      expect(contentLabel?.textContent).toBe('content');
    });
  });

  describe('Color Assignment', () => {
    it('should assign different colors to different zones', () => {
      zoneBoundaries.render(mockZones, slideElement);

      const titleColor = zoneBoundaries.getZoneColor('title');
      const contentColor = zoneBoundaries.getZoneColor('content');
      const footerColor = zoneBoundaries.getZoneColor('footer');

      expect(titleColor).toBeDefined();
      expect(contentColor).toBeDefined();
      expect(footerColor).toBeDefined();
      expect(titleColor).not.toBe(contentColor);
      expect(contentColor).not.toBe(footerColor);
    });

    it('should maintain consistent colors across updates', () => {
      zoneBoundaries.render(mockZones, slideElement);

      const initialTitleColor = zoneBoundaries.getZoneColor('title');

      zoneBoundaries.update(mockZones, slideElement);

      const updatedTitleColor = zoneBoundaries.getZoneColor('title');
      expect(updatedTitleColor).toBe(initialTitleColor);
    });

    it('should cycle through color palette for many zones', () => {
      const manyZones: DebugZoneInfo[] = Array.from({ length: 10 }, (_, i) => ({
        name: `zone-${i}`,
        gridArea: `zone-${i}`,
        populated: true,
        contentLength: 10,
      }));

      // Create corresponding zone elements
      manyZones.forEach((zone) => {
        const el = document.createElement('div');
        el.setAttribute('data-zone', zone.name);
        slideElement.appendChild(el);
      });

      zoneBoundaries.render(manyZones, slideElement);

      const colors = manyZones.map((zone) => zoneBoundaries.getZoneColor(zone.name));
      const uniqueColors = new Set(colors);

      // Should have assigned colors (may repeat if more zones than colors)
      expect(colors.every((c) => c !== undefined)).toBe(true);
      expect(uniqueColors.size).toBeGreaterThan(0);
    });
  });

  describe('Positioning', () => {
    it('should position container absolutely', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(container.style.position).toBe('absolute');
    });

    it('should cover full slide area', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(container.style.top).toBe('0px');
      expect(container.style.left).toBe('0px');
      expect(container.style.width).toBe('100%');
      expect(container.style.height).toBe('100%');
    });

    it('should have high z-index below overlay', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(container.style.zIndex).toBe('9998');
    });

    it('should have pointer-events none', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(container.style.pointerEvents).toBe('none');
    });

    it('should position boundaries absolutely within container', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const boundary = container.querySelector('.pf-debug-zone-boundary') as HTMLElement;
      expect(boundary.style.position).toBe('absolute');
    });
  });

  describe('Styling', () => {
    it('should apply dashed border to boundaries', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const boundary = container.querySelector('.pf-debug-zone-boundary') as HTMLElement;
      expect(boundary.style.border).toContain('dashed');
    });

    it('should apply zone color to border', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const titleBoundary = container.querySelector(
        '[data-zone="title"]'
      ) as HTMLElement;

      // Browser converts hex to rgb format
      expect(titleBoundary.style.border).toContain('dashed');
      expect(titleBoundary.style.border).toContain('rgb');
    });

    it('should apply zone color to label background', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const label = container.querySelector('.pf-debug-zone-label') as HTMLElement;

      // Browser converts hex to rgb format
      expect(label.style.background).toContain('rgb');
    });

    it('should use monospace font for labels', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const label = container.querySelector('.pf-debug-zone-label') as HTMLElement;
      expect(label.style.fontFamily).toContain('Monaco');
    });

    it('should have pointer-events none on labels', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const label = container.querySelector('.pf-debug-zone-label') as HTMLElement;
      expect(label.style.pointerEvents).toBe('none');
    });
  });

  describe('Updates', () => {
    it('should update boundaries when zones change', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      const newZones: DebugZoneInfo[] = [
        { name: 'header', gridArea: 'header', populated: true, contentLength: 5 },
      ];

      // Add new zone element
      const headerZone = document.createElement('div');
      headerZone.setAttribute('data-zone', 'header');
      slideElement.appendChild(headerZone);

      zoneBoundaries.update(newZones, slideElement);

      const boundaries = container.querySelectorAll('.pf-debug-zone-boundary');
      expect(boundaries.length).toBe(1);
      expect(boundaries[0].getAttribute('data-zone')).toBe('header');
    });

    it('should handle update when not rendered', () => {
      expect(() => zoneBoundaries.update(mockZones, slideElement)).not.toThrow();
    });

    it('should handle missing zone elements gracefully', () => {
      const zonesWithMissing: DebugZoneInfo[] = [
        ...mockZones,
        { name: 'nonexistent', gridArea: 'none', populated: false },
      ];

      const container = zoneBoundaries.render(zonesWithMissing, slideElement);

      // Should only render boundaries for zones that exist in DOM
      const boundaries = container.querySelectorAll('.pf-debug-zone-boundary');
      expect(boundaries.length).toBe(3); // Only the 3 zones that exist
    });
  });

  describe('Clear', () => {
    it('should clear all boundaries', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      zoneBoundaries.clear();

      const boundaries = container.querySelectorAll('.pf-debug-zone-boundary');
      expect(boundaries.length).toBe(0);
    });

    it('should handle clear when not rendered', () => {
      expect(() => zoneBoundaries.clear()).not.toThrow();
    });
  });

  describe('Lifecycle', () => {
    it('should return container element', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);

      expect(zoneBoundaries.getContainer()).toBe(container);
    });

    it('should return null before rendering', () => {
      expect(zoneBoundaries.getContainer()).toBeNull();
    });

    it('should destroy and remove from DOM', () => {
      const container = zoneBoundaries.render(mockZones, slideElement);
      parentContainer.appendChild(container);

      zoneBoundaries.destroy();

      expect(parentContainer.contains(container)).toBe(false);
      expect(zoneBoundaries.getContainer()).toBeNull();
    });

    it('should handle destroy when not in DOM', () => {
      zoneBoundaries.render(mockZones, slideElement);

      expect(() => zoneBoundaries.destroy()).not.toThrow();
    });

    it('should clear zone colors on destroy', () => {
      zoneBoundaries.render(mockZones, slideElement);

      zoneBoundaries.destroy();

      expect(zoneBoundaries.getZoneColor('title')).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty zones array', () => {
      const container = zoneBoundaries.render([], slideElement);

      const boundaries = container.querySelectorAll('.pf-debug-zone-boundary');
      expect(boundaries.length).toBe(0);
    });

    it('should handle zone with special characters in name', () => {
      const specialZones: DebugZoneInfo[] = [
        { name: 'zone-with-dash', gridArea: 'zone', populated: true, contentLength: 1 },
      ];

      const specialZone = document.createElement('div');
      specialZone.setAttribute('data-zone', 'zone-with-dash');
      slideElement.appendChild(specialZone);

      const container = zoneBoundaries.render(specialZones, slideElement);

      const boundary = container.querySelector('[data-zone="zone-with-dash"]');
      expect(boundary).toBeDefined();
    });
  });
});
