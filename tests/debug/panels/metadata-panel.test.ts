import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MetadataPanel } from '@/lib/debug/panels/metadata-panel';
import type { DebugSlideInfo, DebugLayoutInfo } from '@/lib/types/debug';

describe('MetadataPanel', () => {
  let panel: MetadataPanel;
  let container: HTMLElement;

  const mockSlideInfo: DebugSlideInfo = {
    id: 'slide-1',
    index: 0,
    total: 10,
    layout: 'two-column',
  };

  const mockLayoutInfo: DebugLayoutInfo = {
    name: 'two-column',
    description: 'Two column layout',
    zones: [
      { name: 'title', gridArea: 'title', populated: true, contentLength: 15 },
      { name: 'left', gridArea: 'left', populated: true, contentLength: 100 },
      { name: 'right', gridArea: 'right', populated: false },
    ],
    gridTemplateAreas: '"title title" "left right"',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto 1fr',
  };

  beforeEach(() => {
    panel = new MetadataPanel('bottom-left');
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    panel.destroy();
    document.body.removeChild(container);
  });

  describe('Rendering', () => {
    it('should render panel with metadata', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element).toBeDefined();
      expect(element.className).toContain('pf-debug-metadata-panel');
    });

    it('should display slide number (1-based)', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.textContent).toContain('Slide: 1 of 10');
    });

    it('should display correct slide number for different indices', () => {
      const slideInfo = { ...mockSlideInfo, index: 5 };
      const element = panel.render(slideInfo, mockLayoutInfo);

      expect(element.textContent).toContain('Slide: 6 of 10');
    });

    it('should display slide ID', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.textContent).toContain('ID: slide-1');
    });

  });

  describe('Positioning', () => {
    it('should position at bottom-left', () => {
      panel = new MetadataPanel('bottom-left');
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at top-left', () => {
      panel = new MetadataPanel('top-left');
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at top-right', () => {
      panel = new MetadataPanel('top-right');
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should position at bottom-right', () => {
      panel = new MetadataPanel('bottom-right');
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should have position absolute', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.position).toBe('absolute');
    });

    it('should have high z-index', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.zIndex).toBe('10000');
    });
  });

  describe('Styling', () => {
    it('should have dark background', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.background).toBe('rgba(0, 0, 0, 0.85)');
    });

    it('should have monospace font', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.fontFamily).toContain('Monaco');
    });

    it('should have pointer events enabled', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.pointerEvents).toBe('auto');
    });

    it('should have rounded corners', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(element.style.borderRadius).toBe('4px');
    });
  });

  describe('Updates', () => {
    it('should update content when update() is called', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      container.appendChild(element);

      const newSlideInfo: DebugSlideInfo = {
        ...mockSlideInfo,
        index: 2,
        id: 'slide-3',
      };

      panel.update(newSlideInfo, mockLayoutInfo);

      expect(element.textContent).toContain('Slide: 3 of 10');
      expect(element.textContent).toContain('ID: slide-3');
    });


    it('should handle update when not rendered', () => {
      expect(() => panel.update(mockSlideInfo, mockLayoutInfo)).not.toThrow();
    });
  });

  describe('Collapse/Expand', () => {
    it('should start expanded', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;

      expect(content.style.display).toBe('block');
    });

    it('should collapse when toggle is called', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      panel.toggleCollapse();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('none');
    });

    it('should expand when toggle is called again', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      panel.toggleCollapse();
      panel.toggleCollapse();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('block');
    });

    it('should toggle via header click', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      const header = element.querySelector('.pf-debug-panel-header') as HTMLElement;

      header.click();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('none');
    });
  });

  describe('Lifecycle', () => {
    it('should return container element', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);

      expect(panel.getContainer()).toBe(element);
    });

    it('should return null before rendering', () => {
      expect(panel.getContainer()).toBeNull();
    });

    it('should destroy and remove from DOM', () => {
      const element = panel.render(mockSlideInfo, mockLayoutInfo);
      container.appendChild(element);

      panel.destroy();

      expect(container.children.length).toBe(0);
      expect(panel.getContainer()).toBeNull();
    });

    it('should handle destroy when not in DOM', () => {
      panel.render(mockSlideInfo, mockLayoutInfo);

      expect(() => panel.destroy()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {

    it('should handle first slide', () => {
      const firstSlide: DebugSlideInfo = {
        ...mockSlideInfo,
        index: 0,
      };

      const element = panel.render(firstSlide, mockLayoutInfo);

      expect(element.textContent).toContain('Slide: 1 of 10');
    });

    it('should handle last slide', () => {
      const lastSlide: DebugSlideInfo = {
        ...mockSlideInfo,
        index: 9,
        total: 10,
      };

      const element = panel.render(lastSlide, mockLayoutInfo);

      expect(element.textContent).toContain('Slide: 10 of 10');
    });


    it('should handle long slide IDs', () => {
      const longIdSlide: DebugSlideInfo = {
        ...mockSlideInfo,
        id: 'very-long-slide-id-with-many-characters-and-dashes',
      };

      const element = panel.render(longIdSlide, mockLayoutInfo);

      expect(element.textContent).toContain('very-long-slide-id-with-many-characters-and-dashes');
    });
  });
});
