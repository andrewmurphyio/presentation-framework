import type { Slide } from '../types/slide';
import type { LayoutDefinition } from '../types/layout';
import type { Theme } from '../types/theme';
import type {
  DebugInfo,
  DebugSlideInfo,
  DebugLayoutInfo,
  DebugThemeInfo,
  DebugContentInfo,
  DebugZoneInfo,
} from '../types/debug';

/**
 * DebugDataCollector extracts debug information from slides, layouts, and themes
 *
 * This class analyzes the current presentation state and generates comprehensive
 * debug information for display in the debug overlay.
 */
export class DebugDataCollector {
  /**
   * Collect complete debug information for a slide
   *
   * @param slide - The slide to collect debug info from
   * @param layout - The layout definition being used
   * @param theme - The active theme
   * @param slideIndex - Current slide index (0-based)
   * @param totalSlides - Total number of slides in deck
   * @returns Complete debug information
   */
  collectSlideDebugInfo(
    slide: Slide,
    layout: LayoutDefinition,
    theme: Theme,
    slideIndex: number,
    totalSlides: number
  ): DebugInfo {
    return {
      slide: this.collectSlideInfo(slide, slideIndex, totalSlides),
      layout: this.collectLayoutInfo(layout, slide.content),
      theme: this.collectThemeInfo(theme),
      content: this.collectContentInfo(slide.content, layout),
    };
  }

  /**
   * Extract slide metadata
   */
  private collectSlideInfo(
    slide: Slide,
    index: number,
    total: number
  ): DebugSlideInfo {
    return {
      id: slide.id,
      index,
      total,
      layout: slide.layout,
    };
  }

  /**
   * Extract layout information with zone population status
   */
  private collectLayoutInfo(
    layout: LayoutDefinition,
    content: Record<string, string>
  ): DebugLayoutInfo {
    const zones: DebugZoneInfo[] = layout.zones.map((zone) => {
      const zoneContent = content[zone.name];
      const hasContent = zoneContent !== undefined && zoneContent.length > 0;

      return {
        name: zone.name,
        gridArea: zone.gridArea || zone.name,
        populated: hasContent,
        contentLength: zoneContent !== undefined ? zoneContent.length : undefined,
      };
    });

    return {
      name: layout.name,
      description: layout.description,
      zones,
      gridTemplateAreas: layout.gridTemplateAreas || '',
      gridTemplateColumns: layout.gridTemplateColumns || '',
      gridTemplateRows: layout.gridTemplateRows || '',
    };
  }

  /**
   * Extract theme information including token overrides
   */
  private collectThemeInfo(theme: Theme): DebugThemeInfo {
    const tokens = theme.getTokens();

    // Convert tokens to Record<string, string> format for debug display
    const colorTokens: Record<string, string> = {};
    Object.entries(tokens.colors).forEach(([key, value]) => {
      colorTokens[key] = String(value);
    });

    const typographyTokens: Record<string, string> = {};
    Object.entries(tokens.typography).forEach(([key, value]) => {
      typographyTokens[key] = typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
    });

    const spacingTokens: Record<string, string> = {};
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      spacingTokens[key] = typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
    });

    return {
      name: theme.getName(),
      tokens: {
        colors: colorTokens,
        typography: typographyTokens,
        spacing: spacingTokens,
      },
      overrides: [], // TODO: Implement override detection when theme inheritance is added
    };
  }

  /**
   * Map content to zones with metadata
   */
  private collectContentInfo(
    content: Record<string, string>,
    layout: LayoutDefinition
  ): Record<string, DebugContentInfo> {
    const contentInfo: Record<string, DebugContentInfo> = {};

    // Process each zone in the layout
    layout.zones.forEach((zone) => {
      const zoneName = zone.name;
      const value = content[zoneName] || '';

      contentInfo[zoneName] = {
        value,
        length: value.length,
        zone: zoneName,
      };
    });

    return contentInfo;
  }
}
