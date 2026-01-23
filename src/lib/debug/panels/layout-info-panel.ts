import type { DebugLayoutInfo, DebugPanelPosition } from '../../types/debug';

/**
 * LayoutInfoPanel displays layout metadata in the debug overlay
 *
 * Shows:
 * - Layout name
 * - List of zones
 * - Grid configuration (template-areas, columns, rows)
 *
 * Features:
 * - Collapsible panel
 * - Configurable position
 * - Auto-updates on layout change
 */
export class LayoutInfoPanel {
  private container: HTMLElement | null = null;
  private position: DebugPanelPosition;
  private collapsed: boolean = false;

  /**
   * Create a new LayoutInfoPanel
   *
   * @param position - Panel position (top-left, top-right, bottom-left, bottom-right)
   */
  constructor(position: DebugPanelPosition = 'top-left') {
    this.position = position;
  }

  /**
   * Render the panel and return the DOM element
   *
   * @param layoutInfo - Layout debug information to display
   * @returns Panel container element
   */
  render(layoutInfo: DebugLayoutInfo): HTMLElement {
    this.container = this.createPanelContainer();
    this.updateContent(layoutInfo);
    return this.container;
  }

  /**
   * Update panel content with new layout info
   *
   * @param layoutInfo - New layout information
   */
  update(layoutInfo: DebugLayoutInfo): void {
    if (!this.container) return;
    this.updateContent(layoutInfo);
  }

  /**
   * Toggle panel collapsed state
   */
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    if (this.container) {
      const content = this.container.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;
      if (content) {
        content.style.display = this.collapsed ? 'none' : 'block';
      }
    }
  }

  /**
   * Destroy the panel and clean up
   */
  destroy(): void {
    if (this.container?.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.container = null;
  }

  /**
   * Get the panel container element
   */
  getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * Create the panel container with base styles
   */
  private createPanelContainer(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'pf-debug-panel pf-debug-layout-info-panel';
    panel.setAttribute('data-position', this.position);

    // Apply base panel styles
    panel.style.position = 'absolute';
    panel.style.background = 'rgba(0, 0, 0, 0.85)';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'Monaco, Courier New, monospace';
    panel.style.fontSize = '12px';
    panel.style.padding = '12px';
    panel.style.borderRadius = '4px';
    panel.style.maxWidth = '400px';
    panel.style.pointerEvents = 'auto';
    panel.style.zIndex = '10000';

    // Position based on setting
    this.applyPosition(panel);

    return panel;
  }

  /**
   * Apply position styles to panel
   */
  private applyPosition(panel: HTMLElement): void {
    switch (this.position) {
      case 'top-left':
        panel.style.top = '12px';
        panel.style.left = '12px';
        break;
      case 'top-right':
        panel.style.top = '12px';
        panel.style.right = '12px';
        break;
      case 'bottom-left':
        panel.style.bottom = '12px';
        panel.style.left = '12px';
        break;
      case 'bottom-right':
        panel.style.bottom = '12px';
        panel.style.right = '12px';
        break;
    }
  }

  /**
   * Update panel content with layout information
   */
  private updateContent(layoutInfo: DebugLayoutInfo): void {
    if (!this.container) return;

    const header = this.createHeader();
    const content = this.createContent(layoutInfo);

    this.container.innerHTML = '';
    this.container.appendChild(header);
    this.container.appendChild(content);
  }

  /**
   * Create panel header
   */
  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'pf-debug-panel-header';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '8px';
    header.style.cursor = 'pointer';
    header.textContent = 'Layout Info';

    header.addEventListener('click', () => this.toggleCollapse());

    return header;
  }

  /**
   * Create panel content
   */
  private createContent(layoutInfo: DebugLayoutInfo): HTMLElement {
    const content = document.createElement('div');
    content.className = 'pf-debug-panel-content';
    content.style.display = this.collapsed ? 'none' : 'block';

    // Layout name
    const name = document.createElement('div');
    name.style.marginBottom = '8px';
    name.innerHTML = `<strong>Layout:</strong> ${layoutInfo.name}`;
    content.appendChild(name);

    // Description
    if (layoutInfo.description) {
      const desc = document.createElement('div');
      desc.style.marginBottom = '8px';
      desc.style.color = '#aaa';
      desc.style.fontSize = '11px';
      desc.textContent = layoutInfo.description;
      content.appendChild(desc);
    }

    // Zones
    const zonesTitle = document.createElement('div');
    zonesTitle.style.marginTop = '8px';
    zonesTitle.style.marginBottom = '4px';
    zonesTitle.innerHTML = '<strong>Zones:</strong>';
    content.appendChild(zonesTitle);

    const zonesList = document.createElement('ul');
    zonesList.style.margin = '0';
    zonesList.style.paddingLeft = '16px';
    zonesList.style.listStyle = 'disc';

    layoutInfo.zones.forEach((zone) => {
      const li = document.createElement('li');
      li.style.marginBottom = '2px';
      li.textContent = zone.name;
      zonesList.appendChild(li);
    });
    content.appendChild(zonesList);

    // Grid configuration
    if (layoutInfo.gridTemplateColumns || layoutInfo.gridTemplateRows) {
      const gridTitle = document.createElement('div');
      gridTitle.style.marginTop = '8px';
      gridTitle.style.marginBottom = '4px';
      gridTitle.innerHTML = '<strong>Grid:</strong>';
      content.appendChild(gridTitle);

      if (layoutInfo.gridTemplateColumns) {
        const cols = document.createElement('div');
        cols.style.fontSize = '11px';
        cols.style.color = '#aaa';
        cols.innerHTML = `Columns: <code style="color: #fff;">${layoutInfo.gridTemplateColumns}</code>`;
        content.appendChild(cols);
      }

      if (layoutInfo.gridTemplateRows) {
        const rows = document.createElement('div');
        rows.style.fontSize = '11px';
        rows.style.color = '#aaa';
        rows.innerHTML = `Rows: <code style="color: #fff;">${layoutInfo.gridTemplateRows}</code>`;
        content.appendChild(rows);
      }
    }

    return content;
  }
}
