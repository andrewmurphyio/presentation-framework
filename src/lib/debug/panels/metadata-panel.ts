import type {
  DebugSlideInfo,
  DebugLayoutInfo,
  DebugPanelPosition,
} from '../../types/debug';

/**
 * MetadataPanel displays slide metadata in the debug overlay
 *
 * Shows:
 * - Slide number (human-readable, 1-based)
 * - Slide ID
 * - Layout name
 * - Zone population status (filled vs total)
 *
 * Features:
 * - Collapsible panel
 * - Configurable position
 * - Auto-updates on navigation
 */
export class MetadataPanel {
  private container: HTMLElement | null = null;
  private position: DebugPanelPosition;
  private collapsed: boolean = false;

  /**
   * Create a new MetadataPanel
   *
   * @param position - Panel position (top-left, top-right, bottom-left, bottom-right)
   */
  constructor(position: DebugPanelPosition = 'bottom-left') {
    this.position = position;
  }

  /**
   * Render the panel and return the DOM element
   *
   * @param slideInfo - Slide debug information to display
   * @param layoutInfo - Layout debug information to display
   * @returns Panel container element
   */
  render(slideInfo: DebugSlideInfo, layoutInfo: DebugLayoutInfo): HTMLElement {
    this.container = this.createPanelContainer();
    this.updateContent(slideInfo, layoutInfo);
    return this.container;
  }

  /**
   * Update panel content with new slide and layout info
   *
   * @param slideInfo - New slide information
   * @param layoutInfo - New layout information
   */
  update(slideInfo: DebugSlideInfo, layoutInfo: DebugLayoutInfo): void {
    if (!this.container) return;
    this.updateContent(slideInfo, layoutInfo);
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
    panel.className = 'pf-debug-panel pf-debug-metadata-panel';
    panel.setAttribute('data-position', this.position);

    // Apply base panel styles
    panel.style.position = 'absolute';
    panel.style.background = 'rgba(0, 0, 0, 0.85)';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'Monaco, Courier New, monospace';
    panel.style.fontSize = '12px';
    panel.style.padding = '12px';
    panel.style.borderRadius = '4px';
    panel.style.maxWidth = '300px';
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
   * Update panel content with slide and layout information
   */
  private updateContent(
    slideInfo: DebugSlideInfo,
    layoutInfo: DebugLayoutInfo
  ): void {
    if (!this.container) return;

    const header = this.createHeader();
    const content = this.createContent(slideInfo, layoutInfo);

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
    header.textContent = 'Slide Metadata';

    header.addEventListener('click', () => this.toggleCollapse());

    return header;
  }

  /**
   * Create panel content
   */
  private createContent(
    slideInfo: DebugSlideInfo,
    layoutInfo: DebugLayoutInfo
  ): HTMLElement {
    const content = document.createElement('div');
    content.className = 'pf-debug-panel-content';
    content.style.display = this.collapsed ? 'none' : 'block';

    // Slide number (human-readable, 1-based)
    const slideNumber = document.createElement('div');
    slideNumber.style.marginBottom = '8px';
    slideNumber.innerHTML = `<strong>Slide:</strong> ${slideInfo.index + 1} of ${slideInfo.total}`;
    content.appendChild(slideNumber);

    // Slide ID
    const slideId = document.createElement('div');
    slideId.style.marginBottom = '8px';
    slideId.style.fontSize = '11px';
    slideId.style.color = '#aaa';
    slideId.innerHTML = `<strong>ID:</strong> ${slideInfo.id}`;
    content.appendChild(slideId);

    // Layout name
    const layoutName = document.createElement('div');
    layoutName.style.marginBottom = '8px';
    layoutName.innerHTML = `<strong>Layout:</strong> ${layoutInfo.name}`;
    content.appendChild(layoutName);

    // Zone population status
    const populatedZones = layoutInfo.zones.filter((z) => z.populated).length;
    const totalZones = layoutInfo.zones.length;

    const zoneStatus = document.createElement('div');
    zoneStatus.style.marginBottom = '4px';
    zoneStatus.innerHTML = `<strong>Zones:</strong> ${populatedZones} / ${totalZones} filled`;
    content.appendChild(zoneStatus);

    // Zone breakdown
    if (layoutInfo.zones.length > 0) {
      const zoneList = document.createElement('div');
      zoneList.style.marginTop = '4px';
      zoneList.style.paddingLeft = '8px';
      zoneList.style.fontSize = '11px';

      layoutInfo.zones.forEach((zone) => {
        const zoneItem = document.createElement('div');
        zoneItem.style.marginBottom = '2px';
        zoneItem.style.color = zone.populated ? '#50fa7b' : '#6272a4';

        const status = zone.populated ? '✓' : '○';
        const contentInfo = zone.populated && zone.contentLength
          ? ` (${zone.contentLength} chars)`
          : '';

        zoneItem.textContent = `${status} ${zone.name}${contentInfo}`;
        zoneList.appendChild(zoneItem);
      });

      content.appendChild(zoneList);
    }

    return content;
  }
}
