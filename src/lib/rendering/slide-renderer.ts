import type { Slide } from '../types/slide';
import type { ThemeClass } from '../theming/theme-class';
import type { LayoutDefinition } from '../types/layout';
import { layoutRegistry } from '../design-system/layout-registry';

/**
 * SlideRenderer converts slide definitions to HTML
 *
 * This class takes a slide object and theme, applies the appropriate
 * layout, injects content into zones, and generates styled HTML output.
 */
export class SlideRenderer {
  /**
   * Render a slide to HTML
   *
   * @param slide - The slide to render
   * @param theme - The theme to apply
   * @param customLayoutRegistry - Optional custom layout registry (defaults to global)
   * @returns HTML string with inline styles
   */
  render(
    slide: Slide,
    theme: ThemeClass,
    customLayoutRegistry = layoutRegistry
  ): string {
    // Get the layout definition
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
  <title>${this.escapeHtml(slide.content.title || 'Slide')}</title>
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
    cssVars: Record<string, string>,
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
</style>`;
  }

  /**
   * Generate slide content HTML with zone mapping
   */
  private generateSlideContent(
    slide: Slide,
    layout: LayoutDefinition
  ): string {
    return layout.zones
      .map((zone) => {
        const content = slide.content[zone.name] || '';
        if (!content) return '';

        return `
    <div class="slide-zone zone-${zone.name}">
      ${this.escapeHtml(content)}
    </div>`;
      })
      .join('');
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
