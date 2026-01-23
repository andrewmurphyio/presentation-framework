import type { LayoutDefinition } from '../types/layout';
import { LayoutSource } from '../types/layout';
import type { CustomLayoutDefinition } from '../types/deck';

/**
 * LayoutRegistry manages layout definitions with three-tier hierarchy support
 *
 * Layouts define the structure and positioning of content zones on slides.
 * This registry maintains separate stores for system, theme, and deck layouts,
 * allowing proper hierarchy and isolation of layout sources.
 */
export class LayoutRegistry {
  // Legacy storage for backward compatibility
  private layouts: Map<string, LayoutDefinition> = new Map();

  // Hierarchical storage
  private systemLayouts: Map<string, LayoutDefinition> = new Map();
  private themeLayouts: Map<string, LayoutDefinition> = new Map();
  private deckLayouts: Map<string, CustomLayoutDefinition> = new Map();

  /**
   * Register a layout definition (backward compatibility - registers as system layout)
   * If a layout with the same name exists, it will be overwritten
   */
  registerLayout(name: string, definition: LayoutDefinition): void {
    // Store in both legacy and system maps for compatibility
    this.layouts.set(name, definition);
    this.systemLayouts.set(name, {
      ...definition,
      source: LayoutSource.SYSTEM,
      priority: definition.priority ?? 0,
    });
  }

  /**
   * Register system layouts (built-in framework layouts)
   */
  registerSystemLayouts(layouts: LayoutDefinition[]): void {
    for (const layout of layouts) {
      this.systemLayouts.set(layout.name, {
        ...layout,
        source: LayoutSource.SYSTEM,
        priority: layout.priority ?? 0,
      });
      // Also store in legacy map for backward compatibility
      this.layouts.set(layout.name, layout);
    }
  }

  /**
   * Register theme layouts
   */
  registerThemeLayouts(layouts: LayoutDefinition[]): void {
    for (const layout of layouts) {
      this.themeLayouts.set(layout.name, {
        ...layout,
        source: LayoutSource.THEME,
        priority: layout.priority ?? 50,
      });
    }
  }

  /**
   * Register deck layouts
   */
  registerDeckLayouts(layouts: CustomLayoutDefinition[]): void {
    for (const layout of layouts) {
      this.deckLayouts.set(layout.name, {
        ...layout,
        source: LayoutSource.DECK,
        priority: layout.priority ?? 100,
      });
    }
  }

  /**
   * Clear deck layouts (useful when switching decks)
   */
  clearDeckLayouts(): void {
    this.deckLayouts.clear();
  }

  /**
   * Clear theme layouts (useful when switching themes)
   */
  clearThemeLayouts(): void {
    this.themeLayouts.clear();
  }

  /**
   * Get a layout definition by name (backward compatibility - checks system layouts)
   * @throws Error if layout is not registered
   */
  getLayout(name: string): LayoutDefinition {
    // First check legacy map
    const layout = this.layouts.get(name) || this.systemLayouts.get(name);
    if (!layout) {
      throw new Error(
        `Layout "${name}" not found. Available layouts: ${Array.from(
          this.systemLayouts.keys()
        ).join(', ')}`
      );
    }
    return layout;
  }

  /**
   * Get system layouts
   */
  getSystemLayouts(): LayoutDefinition[] {
    return Array.from(this.systemLayouts.values());
  }

  /**
   * Get theme layouts
   */
  getThemeLayouts(): LayoutDefinition[] {
    return Array.from(this.themeLayouts.values());
  }

  /**
   * Get deck layouts
   */
  getDeckLayouts(): CustomLayoutDefinition[] {
    return Array.from(this.deckLayouts.values());
  }

  /**
   * Check if a layout is registered (checks all sources)
   */
  hasLayout(name: string): boolean {
    return (
      this.layouts.has(name) ||
      this.systemLayouts.has(name) ||
      this.themeLayouts.has(name) ||
      this.deckLayouts.has(name)
    );
  }

  /**
   * Get all registered layout names (from all sources)
   */
  getLayoutNames(): string[] {
    const names = new Set<string>();

    // Add from all sources
    this.systemLayouts.forEach((_, name) => names.add(name));
    this.themeLayouts.forEach((_, name) => names.add(name));
    this.deckLayouts.forEach((_, name) => names.add(name));

    // Also include legacy layouts for backward compatibility
    this.layouts.forEach((_, name) => names.add(name));

    return Array.from(names);
  }

  /**
   * Clear all registered layouts (all sources)
   */
  clear(): void {
    this.layouts.clear();
    this.systemLayouts.clear();
    this.themeLayouts.clear();
    this.deckLayouts.clear();
  }

  /**
   * Get the total number of registered layouts (across all sources)
   */
  count(): number {
    const uniqueNames = new Set([
      ...this.systemLayouts.keys(),
      ...this.themeLayouts.keys(),
      ...this.deckLayouts.keys(),
      ...this.layouts.keys(),
    ]);
    return uniqueNames.size;
  }
}

/**
 * Global singleton instance of LayoutRegistry
 * Most applications will use this shared instance
 */
export const layoutRegistry = new LayoutRegistry();
