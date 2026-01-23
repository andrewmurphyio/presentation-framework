import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TokenInspector } from '@/lib/debug/panels/token-inspector';
import type { DebugThemeInfo } from '@/lib/types/debug';

describe('TokenInspector', () => {
  let inspector: TokenInspector;
  let container: HTMLElement;

  const mockThemeInfo: DebugThemeInfo = {
    name: 'Test Theme',
    tokens: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
      },
      typography: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      spacing: {
        4: '1rem',
        8: '2rem',
        12: '3rem',
      },
    },
    overrides: ['primary', 'fontFamily'],
  };

  const mockThemeWithBase: DebugThemeInfo = {
    ...mockThemeInfo,
    baseTheme: 'Base Theme',
  };

  beforeEach(() => {
    inspector = new TokenInspector('top-right');
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    inspector.destroy();
    document.body.removeChild(container);
  });

  describe('Rendering', () => {
    it('should render panel with theme info', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element).toBeDefined();
      expect(element.className).toContain('pf-debug-token-inspector');
    });

    it('should display theme name', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).toContain('Test Theme');
    });

    it('should display base theme if present', () => {
      const element = inspector.render(mockThemeWithBase);

      expect(element.textContent).toContain('Extends: Base Theme');
    });

    it('should not display base theme if not present', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).not.toContain('Extends:');
    });

    it('should render all token categories', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).toContain('Colors');
      expect(element.textContent).toContain('Typography');
      expect(element.textContent).toContain('Spacing');
    });

    it('should display token counts', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).toContain('Colors (3)');
      expect(element.textContent).toContain('Typography (3)');
      expect(element.textContent).toContain('Spacing (3)');
    });

    it('should display all token names', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).toContain('primary');
      expect(element.textContent).toContain('fontFamily');
      expect(element.textContent).toContain('4');
    });

    it('should display all token values', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.textContent).toContain('#007bff');
      expect(element.textContent).toContain('Arial, sans-serif');
      expect(element.textContent).toContain('1rem');
    });
  });

  describe('Positioning', () => {
    it('should position at top-right', () => {
      inspector = new TokenInspector('top-right');
      const element = inspector.render(mockThemeInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should position at top-left', () => {
      inspector = new TokenInspector('top-left');
      const element = inspector.render(mockThemeInfo);

      expect(element.style.top).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at bottom-left', () => {
      inspector = new TokenInspector('bottom-left');
      const element = inspector.render(mockThemeInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.left).toBe('12px');
    });

    it('should position at bottom-right', () => {
      inspector = new TokenInspector('bottom-right');
      const element = inspector.render(mockThemeInfo);

      expect(element.style.bottom).toBe('12px');
      expect(element.style.right).toBe('12px');
    });

    it('should have position absolute', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.position).toBe('absolute');
    });

    it('should have high z-index', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.zIndex).toBe('10000');
    });
  });

  describe('Styling', () => {
    it('should have dark background', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.background).toBe('rgba(0, 0, 0, 0.85)');
    });

    it('should have monospace font', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.fontFamily).toContain('Monaco');
    });

    it('should have pointer events enabled', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.pointerEvents).toBe('auto');
    });

    it('should have rounded corners', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.borderRadius).toBe('4px');
    });

    it('should have scrollable overflow', () => {
      const element = inspector.render(mockThemeInfo);

      expect(element.style.overflowY).toBe('auto');
      expect(element.style.maxHeight).toBe('600px');
    });
  });

  describe('Token Highlighting', () => {
    it('should highlight overridden tokens', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const overriddenItems = Array.from(tokenItems).filter((item) => {
        const el = item as HTMLElement;
        return el.style.borderLeft !== '';
      });

      expect(overriddenItems.length).toBeGreaterThan(0);
    });

    it('should apply special styling to overridden tokens', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const overriddenItem = Array.from(tokenItems).find((item) => {
        return item.textContent?.includes('primary');
      }) as HTMLElement;

      // Browser converts hex to rgb format
      expect(overriddenItem.style.borderLeft).toContain('solid');
      expect(overriddenItem.style.borderLeft).toContain('rgb');
    });

    it('should not highlight non-overridden tokens', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const nonOverriddenItem = Array.from(tokenItems).find((item) => {
        return item.textContent?.includes('secondary');
      }) as HTMLElement;

      expect(nonOverriddenItem.style.borderLeft).toBe('');
    });
  });

  describe('Section Collapse/Expand', () => {
    it('should start with all sections expanded', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenLists = element.querySelectorAll('.pf-debug-token-list');
      tokenLists.forEach((list) => {
        const el = list as HTMLElement;
        expect(el.style.display).toBe('block');
      });
    });

    it('should collapse section when header clicked', () => {
      const element = inspector.render(mockThemeInfo);

      const sectionHeaders = element.querySelectorAll('.pf-debug-section-header');
      const colorsHeader = sectionHeaders[0] as HTMLElement;
      colorsHeader.click();

      expect(inspector.isSectionCollapsed('colors')).toBe(true);
    });

    it('should expand section when header clicked again', () => {
      const element = inspector.render(mockThemeInfo);

      const sectionHeaders = element.querySelectorAll('.pf-debug-section-header');
      const colorsHeader = sectionHeaders[0] as HTMLElement;

      colorsHeader.click();
      expect(inspector.isSectionCollapsed('colors')).toBe(true);

      colorsHeader.click();
      expect(inspector.isSectionCollapsed('colors')).toBe(false);
    });

    it('should update arrow indicator when collapsed', () => {
      const element = inspector.render(mockThemeInfo);

      const sectionHeaders = element.querySelectorAll('.pf-debug-section-header');
      const colorsHeader = sectionHeaders[0] as HTMLElement;

      expect(colorsHeader.textContent).toContain('▼');

      colorsHeader.click();

      expect(colorsHeader.textContent).toContain('▶');
    });
  });

  describe('Panel Collapse/Expand', () => {
    it('should start expanded', () => {
      const element = inspector.render(mockThemeInfo);
      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;

      expect(content.style.display).toBe('block');
    });

    it('should collapse when toggle is called', () => {
      const element = inspector.render(mockThemeInfo);
      inspector.toggleCollapse();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('none');
    });

    it('should expand when toggle is called again', () => {
      const element = inspector.render(mockThemeInfo);
      inspector.toggleCollapse();
      inspector.toggleCollapse();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('block');
    });

    it('should toggle via header click', () => {
      const element = inspector.render(mockThemeInfo);
      const header = element.querySelector('.pf-debug-panel-header') as HTMLElement;

      header.click();

      const content = element.querySelector('.pf-debug-panel-content') as HTMLElement;
      expect(content.style.display).toBe('none');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy to clipboard successfully', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      await inspector.copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should handle copy errors gracefully', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Copy failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      // Mock document.execCommand for fallback
      const mockExecCommand = vi.fn().mockReturnValue(true);
      Object.assign(document, {
        execCommand: mockExecCommand,
      });

      await inspector.copyToClipboard('test text');

      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });

    it('should make token names clickable', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const firstItem = tokenItems[0];
      const nameEl = firstItem.querySelector('div:first-child') as HTMLElement;

      expect(nameEl.style.cursor).toBe('pointer');
      expect(nameEl.title).toContain('copy');
    });

    it('should make token values clickable', () => {
      const element = inspector.render(mockThemeInfo);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const firstItem = tokenItems[0];
      const valueEl = firstItem.querySelector('div:last-child') as HTMLElement;

      expect(valueEl.style.cursor).toBe('pointer');
      expect(valueEl.title).toContain('copy');
    });
  });

  describe('Updates', () => {
    it('should update content when update() is called', () => {
      const element = inspector.render(mockThemeInfo);
      container.appendChild(element);

      const newThemeInfo: DebugThemeInfo = {
        ...mockThemeInfo,
        name: 'Updated Theme',
      };

      inspector.update(newThemeInfo);

      expect(element.textContent).toContain('Updated Theme');
    });

    it('should handle update when not rendered', () => {
      expect(() => inspector.update(mockThemeInfo)).not.toThrow();
    });

    it('should preserve section collapsed state on update', () => {
      const element = inspector.render(mockThemeInfo);

      const sectionHeaders = element.querySelectorAll('.pf-debug-section-header');
      const colorsHeader = sectionHeaders[0] as HTMLElement;
      colorsHeader.click();

      expect(inspector.isSectionCollapsed('colors')).toBe(true);

      inspector.update(mockThemeInfo);

      expect(inspector.isSectionCollapsed('colors')).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    it('should return container element', () => {
      const element = inspector.render(mockThemeInfo);

      expect(inspector.getContainer()).toBe(element);
    });

    it('should return null before rendering', () => {
      expect(inspector.getContainer()).toBeNull();
    });

    it('should destroy and remove from DOM', () => {
      const element = inspector.render(mockThemeInfo);
      container.appendChild(element);

      inspector.destroy();

      expect(container.children.length).toBe(0);
      expect(inspector.getContainer()).toBeNull();
    });

    it('should handle destroy when not in DOM', () => {
      inspector.render(mockThemeInfo);

      expect(() => inspector.destroy()).not.toThrow();
    });

    it('should clear collapsed sections on destroy', () => {
      const element = inspector.render(mockThemeInfo);

      const sectionHeaders = element.querySelectorAll('.pf-debug-section-header');
      const colorsHeader = sectionHeaders[0] as HTMLElement;
      colorsHeader.click();

      inspector.destroy();

      // Create new instance - collapsed sections should be cleared
      inspector = new TokenInspector('top-right');
      inspector.render(mockThemeInfo);

      expect(inspector.isSectionCollapsed('colors')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty token categories', () => {
      const emptyTheme: DebugThemeInfo = {
        name: 'Empty Theme',
        tokens: {
          colors: {},
          typography: {},
          spacing: {},
        },
        overrides: [],
      };

      const element = inspector.render(emptyTheme);

      expect(element.textContent).toContain('Colors (0)');
      expect(element.textContent).toContain('Typography (0)');
      expect(element.textContent).toContain('Spacing (0)');
    });

    it('should handle theme with no overrides', () => {
      const noOverridesTheme: DebugThemeInfo = {
        ...mockThemeInfo,
        overrides: [],
      };

      const element = inspector.render(noOverridesTheme);

      const tokenItems = element.querySelectorAll('.pf-debug-token-item');
      const overriddenItems = Array.from(tokenItems).filter((item) => {
        const el = item as HTMLElement;
        return el.style.borderLeft !== '';
      });

      expect(overriddenItems.length).toBe(0);
    });

    it('should handle long token values', () => {
      const longValueTheme: DebugThemeInfo = {
        name: 'Test',
        tokens: {
          colors: {
            gradient: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
          },
          typography: {},
          spacing: {},
        },
        overrides: [],
      };

      const element = inspector.render(longValueTheme);

      expect(element.textContent).toContain('linear-gradient');
    });
  });
});
