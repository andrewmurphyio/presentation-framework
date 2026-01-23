import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LayoutInfoPanel } from '@/lib/debug/panels/layout-info-panel';
import type { DebugLayoutInfo } from '@/lib/types/debug';

describe('LayoutInfoPanel', () => {
  let panel: LayoutInfoPanel;
  let container: HTMLElement;

  const mockLayoutInfo: DebugLayoutInfo = {
    name: 'two-column',
    description: 'Two column layout',
    zones: [
      { name: 'title', gridArea: 'title', populated: true, contentLength: 10 },
      { name: 'left', gridArea: 'left', populated: true, contentLength: 50 },
      { name: 'right', gridArea: 'right', populated: false },
    ],
    gridTemplateAreas: '"title title" "left right"',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto 1fr',
  };

  beforeEach(() => {
    panel = new LayoutInfoPanel('top-left');
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    panel.destroy();
    document.body.removeChild(container);
  });

  describe('Rendering', () => {
    it('should render panel with layout info', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element).toBeDefined();
      expect(element.className).toContain('pf-debug-layout-info-panel');
    });

    it('should display layout name', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.textContent).toContain('two-column');
    });

    it('should display layout description', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.textContent).toContain('Two column layout');
    });

    it('should display all zones', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.textContent).toContain('title');
      expect(element.textContent).toContain('left');
      expect(element.textContent).toContain('right');
    });

    it('should display grid columns', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.textContent).toContain('Columns');
      expect(element.textContent).toContain('1fr 1fr');
    });

    it('should display grid rows', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.textContent).toContain('Rows');
      expect(element.textContent).toContain('auto 1fr');
    });

    it('should handle layout without description', () => {
      const layoutWithoutDesc: DebugLayoutInfo = {
        ...mockLayoutInfo,
        description: '',
      };

      const element = panel.render(layoutWithoutDesc);
      expect(element).toBeDefined();
    });

    it('should handle layout without grid config', () => {
      const layoutWithoutGrid: DebugLayoutInfo = {
        ...mockLayoutInfo,
        gridTemplateColumns: '',
        gridTemplateRows: '',
      };

      const element = panel.render(layoutWithoutGrid);
      expect(element).toBeDefined();
      expect(element.textContent).not.toContain('Grid:');
    });
  });

  describe('Positioning', () => {
    it('should position at top-left', () => {
      panel = new LayoutInfoPanel('top-left');
      const element = panel.render(mockLayoutInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at top-right', () => {
      panel = new LayoutInfoPanel('top-right');
      const element = panel.render(mockLayoutInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should position at bottom-left', () => {
      panel = new LayoutInfoPanel('bottom-left');
      const element = panel.render(mockLayoutInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at bottom-right', () => {
      panel = new LayoutInfoPanel('bottom-right');
      const element = panel.render(mockLayoutInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should have position absolute', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.position).toBe('absolute');
    });

    it('should have high z-index', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.zIndex).toBe('10000');
    });
  });

  describe('Styling', () => {
    it('should have dark background', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.background).toBe('rgba(0, 0, 0, 0.85)');
    });

    it('should have monospace font', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.fontFamily).toContain('Monaco');
    });

    it('should have pointer events enabled', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.pointerEvents).toBe('auto');
    });

    it('should have rounded corners', () => {
      const element = panel.render(mockLayoutInfo);

      expect(element.style.borderRadius).toBe('4px');
    });
  });

  describe('Updates', () => {
    it('should update content when update() is called', () => {
      const element = panel.render(mockLayoutInfo);
      container.appendChild(element);

      const newLayoutInfo: DebugLayoutInfo = {
        ...mockLayoutInfo,
        name: 'updated-layout',
      };

      panel.update(newLayoutInfo);

      expect(element.textContent).toContain('updated-layout');
    });

    it('should handle update when not rendered', () => {
      expect(() => panel.update(mockLayoutInfo)).not.toThrow();
    });
  });

  describe('Collapse/Expand', () => {
    it('should start expanded', () => {
      const element = panel.render(mockLayoutInfo);
      const content = element.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;

      expect(content.style.display).toBe('block');
    });

    it('should collapse when toggle is called', () => {
      const element = panel.render(mockLayoutInfo);
      panel.toggleCollapse();

      const content = element.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;
      expect(content.style.display).toBe('none');
    });

    it('should expand when toggle is called again', () => {
      const element = panel.render(mockLayoutInfo);
      panel.toggleCollapse();
      panel.toggleCollapse();

      const content = element.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;
      expect(content.style.display).toBe('block');
    });

    it('should toggle via header click', () => {
      const element = panel.render(mockLayoutInfo);
      const header = element.querySelector(
        '.pf-debug-panel-header'
      ) as HTMLElement;

      header.click();

      const content = element.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;
      expect(content.style.display).toBe('none');
    });
  });

  describe('Lifecycle', () => {
    it('should return container element', () => {
      const element = panel.render(mockLayoutInfo);

      expect(panel.getContainer()).toBe(element);
    });

    it('should return null before rendering', () => {
      expect(panel.getContainer()).toBeNull();
    });

    it('should destroy and remove from DOM', () => {
      const element = panel.render(mockLayoutInfo);
      container.appendChild(element);

      panel.destroy();

      expect(container.children.length).toBe(0);
      expect(panel.getContainer()).toBeNull();
    });

    it('should handle destroy when not in DOM', () => {
      panel.render(mockLayoutInfo);

      expect(() => panel.destroy()).not.toThrow();
    });
  });
});
