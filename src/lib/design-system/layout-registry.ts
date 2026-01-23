import type { LayoutDefinition } from '../types/layout';

/**
 * LayoutRegistry manages layout definitions
 *
 * Layouts define the structure and positioning of content zones on slides.
 * This registry allows layouts to be registered by name and retrieved for rendering.
 */
export class LayoutRegistry {
  private layouts: Map<string, LayoutDefinition> = new Map();

  /**
   * Register a layout definition
   * If a layout with the same name exists, it will be overwritten
   */
  registerLayout(name: string, definition: LayoutDefinition): void {
    this.layouts.set(name, definition);
  }

  /**
   * Get a layout definition by name
   * @throws Error if layout is not registered
   */
  getLayout(name: string): LayoutDefinition {
    const layout = this.layouts.get(name);
    if (!layout) {
      throw new Error(
        `Layout "${name}" not found. Available layouts: ${Array.from(
          this.layouts.keys()
        ).join(', ')}`
      );
    }
    return layout;
  }

  /**
   * Check if a layout is registered
   */
  hasLayout(name: string): boolean {
    return this.layouts.has(name);
  }

  /**
   * Get all registered layout names
   */
  getLayoutNames(): string[] {
    return Array.from(this.layouts.keys());
  }

  /**
   * Clear all registered layouts
   */
  clear(): void {
    this.layouts.clear();
  }

  /**
   * Get the number of registered layouts
   */
  count(): number {
    return this.layouts.size;
  }
}

/**
 * Global singleton instance of LayoutRegistry
 * Most applications will use this shared instance
 */
export const layoutRegistry = new LayoutRegistry();
