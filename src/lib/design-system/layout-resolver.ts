import type { LayoutDefinition, LayoutZone } from '../types/layout';
import { LayoutSource } from '../types/layout';
import type { CustomLayoutDefinition } from '../types/deck';
import { LayoutRegistry } from './layout-registry';

/**
 * LayoutResolver handles the three-tier layout resolution system
 *
 * Resolves layouts in priority order:
 * 1. Deck-specific layouts (highest priority)
 * 2. Theme-provided layouts
 * 3. System/built-in layouts (lowest priority)
 *
 * Also handles layout inheritance and composition.
 */
export class LayoutResolver {
  private layoutRegistry: LayoutRegistry;
  private cache: Map<string, LayoutDefinition> = new Map();

  constructor(layoutRegistry: LayoutRegistry) {
    this.layoutRegistry = layoutRegistry;
  }

  /**
   * Resolve a layout by name, checking all three tiers
   *
   * @param name - Layout name to resolve
   * @param deckLayouts - Optional deck-specific layouts
   * @param themeLayouts - Optional theme-provided layouts
   * @returns The resolved layout definition
   * @throws Error if layout cannot be found in any tier
   */
  resolveLayout(
    name: string,
    deckLayouts?: CustomLayoutDefinition[],
    themeLayouts?: LayoutDefinition[]
  ): LayoutDefinition {
    // Check cache first
    const cacheKey = this.getCacheKey(name, deckLayouts, themeLayouts);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let layout: LayoutDefinition | undefined;

    // 1. Check deck layouts (highest priority)
    if (deckLayouts) {
      const deckLayout = deckLayouts.find((l) => l.name === name);
      if (deckLayout) {
        layout = this.processCustomLayout(deckLayout, deckLayouts, themeLayouts);
      }
    }

    // 2. Check theme layouts
    if (!layout && themeLayouts) {
      layout = themeLayouts.find((l) => l.name === name);
      if (layout) {
        layout = { ...layout, source: LayoutSource.THEME, priority: 50 };
      }
    }

    // 3. Check system layouts (lowest priority)
    if (!layout) {
      try {
        layout = this.layoutRegistry.getLayout(name);
        if (layout) {
          layout = { ...layout, source: LayoutSource.SYSTEM, priority: 0 };
        }
      } catch {
        // Layout not found in system registry
      }
    }

    if (!layout) {
      throw new Error(`Layout "${name}" not found in any tier (deck, theme, or system)`);
    }

    // Cache the resolved layout
    this.cache.set(cacheKey, layout);
    return layout;
  }

  /**
   * Process a custom layout definition, handling inheritance and composition
   */
  private processCustomLayout(
    customLayout: CustomLayoutDefinition,
    deckLayouts?: CustomLayoutDefinition[],
    themeLayouts?: LayoutDefinition[]
  ): LayoutDefinition {
    let result: LayoutDefinition = {
      name: customLayout.name,
      description: customLayout.description,
      zones: [...customLayout.zones],
      gridTemplateAreas: customLayout.gridTemplateAreas,
      gridTemplateColumns: customLayout.gridTemplateColumns,
      gridTemplateRows: customLayout.gridTemplateRows,
      customStyles: customLayout.customStyles,
      source: LayoutSource.DECK,
      priority: customLayout.priority || 100,
    };

    // Handle inheritance
    if (customLayout.extends) {
      const baseLayout = this.resolveLayout(customLayout.extends, deckLayouts, themeLayouts);
      result = this.extendLayout(baseLayout, customLayout);
    }

    // Handle composition
    if (customLayout.composeFrom && customLayout.composeFrom.length > 0) {
      const composedLayouts = customLayout.composeFrom.map((layoutName) =>
        this.resolveLayout(layoutName, deckLayouts, themeLayouts)
      );
      result = this.composeLayouts(composedLayouts, customLayout);
    }

    return result;
  }

  /**
   * Extend a base layout with custom modifications
   */
  private extendLayout(
    baseLayout: LayoutDefinition,
    customLayout: CustomLayoutDefinition
  ): LayoutDefinition {
    // Start with the base layout
    let zones = [...baseLayout.zones];

    // Remove zones if specified
    if (customLayout.removeZones) {
      zones = zones.filter((z) => !customLayout.removeZones!.includes(z.name));
    }

    // Modify zones if specified
    if (customLayout.modifyZones) {
      zones = zones.map((zone) => {
        const modifications = customLayout.modifyZones![zone.name];
        if (modifications) {
          return { ...zone, ...modifications };
        }
        return zone;
      });
    }

    // Add additional zones
    if (customLayout.additionalZones) {
      zones.push(...customLayout.additionalZones);
    }

    // Add any zones from customLayout that aren't already present
    for (const zone of customLayout.zones) {
      if (!zones.find((z) => z.name === zone.name)) {
        zones.push(zone);
      }
    }

    return {
      name: customLayout.name,
      description: customLayout.description || baseLayout.description,
      zones,
      gridTemplateAreas: customLayout.gridTemplateAreas || baseLayout.gridTemplateAreas,
      gridTemplateColumns: customLayout.gridTemplateColumns || baseLayout.gridTemplateColumns,
      gridTemplateRows: customLayout.gridTemplateRows || baseLayout.gridTemplateRows,
      customStyles: customLayout.customStyles || baseLayout.customStyles,
      source: LayoutSource.DECK,
      priority: customLayout.priority || 100,
    };
  }

  /**
   * Compose multiple layouts into a single layout
   */
  private composeLayouts(
    layouts: LayoutDefinition[],
    customLayout: CustomLayoutDefinition
  ): LayoutDefinition {
    // Merge zones from all layouts
    const zonesMap = new Map<string, LayoutZone>();

    for (const layout of layouts) {
      for (const zone of layout.zones) {
        if (!zonesMap.has(zone.name)) {
          zonesMap.set(zone.name, zone);
        }
      }
    }

    // Add custom zones
    for (const zone of customLayout.zones) {
      zonesMap.set(zone.name, zone);
    }

    // Apply modifications
    if (customLayout.removeZones) {
      for (const zoneName of customLayout.removeZones) {
        zonesMap.delete(zoneName);
      }
    }

    if (customLayout.modifyZones) {
      for (const [zoneName, modifications] of Object.entries(customLayout.modifyZones)) {
        const zone = zonesMap.get(zoneName);
        if (zone) {
          zonesMap.set(zoneName, { ...zone, ...modifications });
        }
      }
    }

    if (customLayout.additionalZones) {
      for (const zone of customLayout.additionalZones) {
        zonesMap.set(zone.name, zone);
      }
    }

    return {
      name: customLayout.name,
      description: customLayout.description,
      zones: Array.from(zonesMap.values()),
      gridTemplateAreas: customLayout.gridTemplateAreas || layouts[0]?.gridTemplateAreas,
      gridTemplateColumns: customLayout.gridTemplateColumns || layouts[0]?.gridTemplateColumns,
      gridTemplateRows: customLayout.gridTemplateRows || layouts[0]?.gridTemplateRows,
      customStyles: customLayout.customStyles || layouts[0]?.customStyles,
      source: LayoutSource.DECK,
      priority: customLayout.priority || 100,
    };
  }

  /**
   * Clear the cache (useful when deck changes)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Generate a cache key for a specific resolution context
   */
  private getCacheKey(
    name: string,
    deckLayouts?: CustomLayoutDefinition[],
    themeLayouts?: LayoutDefinition[]
  ): string {
    // Create a simple hash based on layout counts and name
    const deckCount = deckLayouts?.length || 0;
    const themeCount = themeLayouts?.length || 0;
    return `${name}_d${deckCount}_t${themeCount}`;
  }
}