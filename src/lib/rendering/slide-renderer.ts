import type { Slide } from '../types/slide';
import type { Theme, CSSVariables } from '../types/theme';
import type { LayoutDefinition } from '../types/layout';
import type { CustomLayoutDefinition } from '../types/deck';
import type { PresentationComponent } from '../types/component';
import { layoutRegistry } from '../design-system/layout-registry';
import { LayoutResolver } from '../design-system/layout-resolver';
import { componentRegistry } from '../components/component-registry';

// Import component renderers to ensure they're registered
import '../components/code-block';
import '../components/list';
import '../components/callout';
import '../components/image';

/**
 * SlideRenderer converts slide definitions to HTML
 *
 * This class takes a slide object and theme, applies the appropriate
 * layout, injects content into zones, and generates styled HTML output.
 */
export class SlideRenderer {
  private layoutResolver: LayoutResolver;

  constructor() {
    this.layoutResolver = new LayoutResolver(layoutRegistry);
  }

  /**
   * Render a slide to HTML
   *
   * @param slide - The slide to render
   * @param theme - The theme to apply
   * @param deckLayouts - Optional deck-specific layouts
   * @param themeLayouts - Optional theme-specific layouts
   * @returns HTML string with inline styles
   */
  render(
    slide: Slide,
    theme: Theme,
    deckLayouts?: CustomLayoutDefinition[],
    themeLayouts?: CustomLayoutDefinition[]
  ): string {
    // Resolve layout through three-tier hierarchy
    const layout = this.layoutResolver.resolveLayout(
      slide.layout,
      deckLayouts,
      themeLayouts
    );

    // Generate CSS variables from theme
    const cssVars = theme.getCSSVariables();

    // Build the HTML
    const styleTag = this.generateStyleTag(cssVars, layout);
    const slideContent = this.generateSlideContent(slide, layout);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(typeof slide.content.title === 'string' ? slide.content.title : 'Slide')}</title>
  ${styleTag}
</head>
<body>
  <div class="slide" data-slide-id="${this.escapeHtml(slide.id)}" data-layout="${this.escapeHtml(slide.layout)}">
    ${slideContent}
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate style tag with CSS variables and layout styles
   */
  private generateStyleTag(
    cssVars: CSSVariables,
    layout: LayoutDefinition
  ): string {
    const varsString = Object.entries(cssVars)
      .map(([key, value]) => `    ${key}: ${value};`)
      .join('\n');

    return `<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
${varsString}
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: var(--font-family-sans);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-foreground);
    background-color: var(--color-background);
  }

  .slide {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas: ${layout.gridTemplateAreas};
    grid-template-columns: ${layout.gridTemplateColumns || '1fr'};
    grid-template-rows: ${layout.gridTemplateRows || 'auto'};
    padding: var(--spacing-12);
    gap: var(--spacing-6);
  }

  .slide-zone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  ${layout.zones
    .map(
      (zone) => `
  .zone-${zone.name} {
    grid-area: ${zone.gridArea || zone.name};
  }`
    )
    .join('')}

  .zone-title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .zone-subtitle {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-muted);
    margin-top: var(--spacing-4);
  }

  /* Custom layout styles */
  ${layout.customStyles || ''}
</style>`;
  }

  /**
   * Render a slide to HTML using a custom layout registry (backward compatibility)
   *
   * @param slide - The slide to render
   * @param theme - The theme to apply
   * @param customLayoutRegistry - Custom layout registry to use
   * @returns HTML string with inline styles
   */
  renderWithRegistry(
    slide: Slide,
    theme: Theme,
    customLayoutRegistry = layoutRegistry
  ): string {
    // Get the layout definition directly from registry
    const layout = customLayoutRegistry.getLayout(slide.layout);

    // Generate CSS variables from theme
    const cssVars = theme.getCSSVariables();

    // Build the HTML
    const styleTag = this.generateStyleTag(cssVars, layout);
    const slideContent = this.generateSlideContent(slide, layout);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(typeof slide.content.title === 'string' ? slide.content.title : 'Slide')}</title>
  ${styleTag}
</head>
<body>
  <div class="slide" data-slide-id="${this.escapeHtml(slide.id)}" data-layout="${this.escapeHtml(slide.layout)}">
    ${slideContent}
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate slide content HTML with zone mapping
   * Supports both string content and component objects
   */
  private generateSlideContent(
    slide: Slide,
    layout: LayoutDefinition
  ): string {
    return layout.zones
      .map((zone) => {
        const content = slide.content[zone.name];
        if (!content) return '';

        // Render the zone content (string or component/components)
        const renderedContent = this.renderZoneContent(content);

        return `
    <div class="slide-zone zone-${zone.name}">
      ${renderedContent}
    </div>`;
      })
      .join('');
  }

  /**
   * Render zone content - handles strings, components, and arrays of components
   */
  private renderZoneContent(
    content: string | PresentationComponent | PresentationComponent[]
  ): string {
    // Handle array of components
    if (Array.isArray(content)) {
      return content.map((item) => this.renderZoneContent(item)).join('\n');
    }

    // Handle single component object
    if (typeof content === 'object' && content !== null && 'type' in content) {
      if (componentRegistry.hasRenderer(content.type)) {
        const renderer = componentRegistry.getRenderer(content.type);
        return renderer(content);
      }
      // Fallback: if no renderer found, return empty string
      return '';
    }

    // Handle string content (legacy)
    return this.escapeHtml(content);
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/**
 * Global singleton instance
 */
export const slideRenderer = new SlideRenderer();
