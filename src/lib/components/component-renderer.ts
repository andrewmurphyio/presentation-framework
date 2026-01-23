import type { PresentationComponent } from '../types/component';
import type { Theme } from '../types/theme';
import { componentRegistry, type ComponentRenderer as RendererFn } from './component-registry';

/**
 * ComponentRenderer orchestrates component rendering with theme support
 *
 * This class provides a high-level interface for rendering components to HTML,
 * automatically resolving the appropriate renderer from the registry and
 * providing theme context for styled output.
 */
export class ComponentRenderer {
  private theme: Theme | null = null;

  /**
   * Set the theme to use for rendering components
   * Theme tokens will be available to component renderers via CSS variables
   */
  setTheme(theme: Theme): void {
    this.theme = theme;
  }

  /**
   * Get the current theme
   */
  getTheme(): Theme | null {
    return this.theme;
  }

  /**
   * Render a single component to HTML
   *
   * @param component - The component to render
   * @returns HTML string
   * @throws Error if no renderer is registered for the component type
   */
  render(component: PresentationComponent): string {
    const renderer = componentRegistry.getRenderer(component.type);
    return renderer(component);
  }

  /**
   * Render multiple components to HTML
   *
   * @param components - Array of components to render
   * @returns HTML string with all components concatenated
   */
  renderMany(components: PresentationComponent[]): string {
    return components.map((component) => this.render(component)).join('\n');
  }

  /**
   * Check if a component type can be rendered
   */
  canRender(type: string): boolean {
    return componentRegistry.hasRenderer(type);
  }

  /**
   * Register a component renderer
   * This is a convenience method that delegates to the global registry
   */
  registerRenderer<T extends PresentationComponent>(
    type: string,
    renderer: RendererFn<T>
  ): void {
    componentRegistry.registerRenderer(type, renderer);
  }

  /**
   * Get all renderable component types
   */
  getRenderableTypes(): string[] {
    return componentRegistry.getRegisteredTypes();
  }

  /**
   * Clear the current theme
   */
  clearTheme(): void {
    this.theme = null;
  }
}

/**
 * Global singleton instance
 */
export const componentRenderer = new ComponentRenderer();
