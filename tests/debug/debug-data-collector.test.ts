import { describe, it, expect } from 'vitest';
import { DebugDataCollector } from '@/lib/debug/debug-data-collector';
import { Theme } from "@lib/theming/theme";
import { defaultTokens } from '@/lib/design-system/default-tokens';
import type { Slide } from '@/lib/types/slide';
import type { LayoutDefinition } from '@/lib/types/layout';

describe('DebugDataCollector', () => {
  const collector = new DebugDataCollector();

  const mockLayout: LayoutDefinition = {
    name: 'test-layout',
    description: 'Test layout for debugging',
    zones: [
      { name: 'title', gridArea: 'title', description: 'Title zone' },
      { name: 'content', gridArea: 'content', description: 'Content zone' },
    ],
    gridTemplateAreas: '"title" "content"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr',
  };

  const mockSlide: Slide = {
    id: 'test-slide-1',
    layout: 'test-layout',
    content: {
      title: 'Test Title',
      content: 'This is test content for the slide.',
    },
  };

  const mockTheme = new Theme('Test Theme', defaultTokens);

  describe('collectSlideDebugInfo', () => {
    it('should collect complete debug info for a slide', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        2,
        10
      );

      expect(debugInfo).toBeDefined();
      expect(debugInfo.slide).toBeDefined();
      expect(debugInfo.layout).toBeDefined();
      expect(debugInfo.theme).toBeDefined();
      expect(debugInfo.content).toBeDefined();
    });

    it('should collect correct slide info', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        2,
        10
      );

      expect(debugInfo.slide.id).toBe('test-slide-1');
      expect(debugInfo.slide.index).toBe(2);
      expect(debugInfo.slide.total).toBe(10);
      expect(debugInfo.slide.layout).toBe('test-layout');
    });

    it('should collect correct layout info', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      expect(debugInfo.layout.name).toBe('test-layout');
      expect(debugInfo.layout.description).toBe('Test layout for debugging');
      expect(debugInfo.layout.zones).toHaveLength(2);
      expect(debugInfo.layout.gridTemplateAreas).toBe('"title" "content"');
      expect(debugInfo.layout.gridTemplateColumns).toBe('1fr');
      expect(debugInfo.layout.gridTemplateRows).toBe('auto 1fr');
    });

    it('should collect zone population status', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      const titleZone = debugInfo.layout.zones.find((z) => z.name === 'title');
      const contentZone = debugInfo.layout.zones.find(
        (z) => z.name === 'content'
      );

      expect(titleZone?.populated).toBe(true);
      expect(titleZone?.contentLength).toBe('Test Title'.length);

      expect(contentZone?.populated).toBe(true);
      expect(contentZone?.contentLength).toBe(
        'This is test content for the slide.'.length
      );
    });

    it('should mark empty zones as not populated', () => {
      const emptySlide: Slide = {
        id: 'empty-slide',
        layout: 'test-layout',
        content: {
          title: 'Only Title',
        },
      };

      const debugInfo = collector.collectSlideDebugInfo(
        emptySlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      const titleZone = debugInfo.layout.zones.find((z) => z.name === 'title');
      const contentZone = debugInfo.layout.zones.find(
        (z) => z.name === 'content'
      );

      expect(titleZone?.populated).toBe(true);
      expect(contentZone?.populated).toBe(false);
    });

    it('should collect theme info', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      expect(debugInfo.theme.name).toBe('Test Theme');
      expect(debugInfo.theme.tokens).toBeDefined();
      expect(debugInfo.theme.tokens.colors).toBeDefined();
      expect(debugInfo.theme.tokens.typography).toBeDefined();
      expect(debugInfo.theme.tokens.spacing).toBeDefined();
    });

    it('should collect color tokens', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      const colors = debugInfo.theme.tokens.colors;
      expect(Object.keys(colors).length).toBeGreaterThan(0);
      expect(colors).toHaveProperty('primary');
    });

    it('should collect typography tokens', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      const typography = debugInfo.theme.tokens.typography;
      expect(Object.keys(typography).length).toBeGreaterThan(0);
      expect(typography).toHaveProperty('fontFamily');
    });

    it('should collect spacing tokens', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      const spacing = debugInfo.theme.tokens.spacing;
      expect(Object.keys(spacing).length).toBeGreaterThan(0);
      expect(spacing).toHaveProperty('4');
    });

    it('should collect content info for all zones', () => {
      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      expect(debugInfo.content).toHaveProperty('title');
      expect(debugInfo.content).toHaveProperty('content');

      expect(debugInfo.content.title.value).toBe('Test Title');
      expect(debugInfo.content.title.length).toBe('Test Title'.length);
      expect(debugInfo.content.title.zone).toBe('title');

      expect(debugInfo.content.content.value).toBe(
        'This is test content for the slide.'
      );
      expect(debugInfo.content.content.length).toBe(
        'This is test content for the slide.'.length
      );
      expect(debugInfo.content.content.zone).toBe('content');
    });

    it('should handle zones with no content', () => {
      const partialSlide: Slide = {
        id: 'partial-slide',
        layout: 'test-layout',
        content: {
          title: 'Title Only',
        },
      };

      const debugInfo = collector.collectSlideDebugInfo(
        partialSlide,
        mockLayout,
        mockTheme,
        0,
        1
      );

      expect(debugInfo.content.title.value).toBe('Title Only');
      expect(debugInfo.content.content.value).toBe('');
      expect(debugInfo.content.content.length).toBe(0);
    });

    it('should handle layout with no grid template values', () => {
      const minimalLayout: LayoutDefinition = {
        name: 'minimal',
        description: 'Minimal layout',
        zones: [{ name: 'main', gridArea: 'main' }],
      };

      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        minimalLayout,
        mockTheme,
        0,
        1
      );

      expect(debugInfo.layout.gridTemplateAreas).toBe('');
      expect(debugInfo.layout.gridTemplateColumns).toBe('');
      expect(debugInfo.layout.gridTemplateRows).toBe('');
    });

    it('should use zone name as gridArea fallback', () => {
      const layoutNoGridArea: LayoutDefinition = {
        name: 'no-grid-area',
        description: 'Layout without gridArea',
        zones: [{ name: 'title' }, { name: 'content' }],
      };

      const debugInfo = collector.collectSlideDebugInfo(
        mockSlide,
        layoutNoGridArea,
        mockTheme,
        0,
        1
      );

      const titleZone = debugInfo.layout.zones.find((z) => z.name === 'title');
      expect(titleZone?.gridArea).toBe('title');
    });
  });
});
