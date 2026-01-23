import type { PresentationComponent } from '../types/component';

/**
 * Component renderer function type
 * Takes a component and returns HTML string
 */
export type ComponentRenderer<T extends PresentationComponent = PresentationComponent> = (
  component: T
) => string;

/**
 * ComponentRegistry manages component renderers
 *
 * This class provides a centralized registry for component renderer functions,
 * allowing components to be registered with their type and then resolved
 * to render them to HTML.
 */
export class ComponentRegistry {
  private renderers: Map<string, ComponentRenderer> = new Map();

  /**
   * Register a component renderer by type
   * If a renderer for this type already exists, it will be overwritten
   */
  registerRenderer<T extends PresentationComponent>(
    type: string,
    renderer: ComponentRenderer<T>
  ): void {
    this.renderers.set(type, renderer as ComponentRenderer);
  }

  /**
   * Get a component renderer by type
   * @throws Error if renderer is not registered for this type
   */
  getRenderer(type: string): ComponentRenderer {
    const renderer = this.renderers.get(type);
    if (!renderer) {
      throw new Error(
        `No renderer registered for component type "${type}". Available types: ${Array.from(
          this.renderers.keys()
        ).join(', ')}`
      );
    }
    return renderer;
  }

  /**
   * Check if a renderer is registered for a component type
   */
  hasRenderer(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * Get all registered component types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * Clear all registered renderers
   */
  clear(): void {
    this.renderers.clear();
  }

  /**
   * Get the total number of registered renderers
   */
  count(): number {
    return this.renderers.size;
  }
}

/**
 * Global singleton instance of ComponentRegistry
 * Most applications will use this shared instance
 */
export const componentRegistry = new ComponentRegistry();
