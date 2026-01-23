import type { DebugZoneInfo } from '../../types/debug';

/**
 * ZoneBoundaries draws colored borders around layout zones for visual debugging
 *
 * Features:
 * - Renders borders around each zone in the slide layout
 * - Color-codes zones with distinct colors
 * - Shows zone name labels
 * - Updates when layout changes
 */
export class ZoneBoundaries {
  private container: HTMLElement | null = null;
  private slideElement: HTMLElement | null = null;
  private zoneColors: Map<string, string> = new Map();

  // Predefined colors for zone highlighting
  private readonly ZONE_COLOR_PALETTE = [
    '#ff6b6b', // red
    '#4ecdc4', // teal
    '#45b7d1', // blue
    '#f9ca24', // yellow
    '#6c5ce7', // purple
    '#fd79a8', // pink
    '#00b894', // green
    '#fdcb6e', // orange
  ];

  /**
   * Create a new ZoneBoundaries instance
   */
  constructor() {}

  /**
   * Render zone boundaries for the given zones
   *
   * @param zones - Array of zone information
   * @param slideElement - The slide element containing the zones
   * @returns Container element with zone boundaries
   */
  render(zones: DebugZoneInfo[], slideElement: HTMLElement): HTMLElement {
    this.slideElement = slideElement;
    this.container = this.createContainer();
    this.assignZoneColors(zones);
    this.renderZoneBoundaries(zones);
    return this.container;
  }

  /**
   * Update zone boundaries with new zone information
   *
   * @param zones - Updated array of zone information
   * @param slideElement - The slide element containing the zones
   */
  update(zones: DebugZoneInfo[], slideElement: HTMLElement): void {
    if (!this.container) return;
    this.slideElement = slideElement;
    this.renderZoneBoundaries(zones);
  }

  /**
   * Clear all zone boundaries
   */
  clear(): void {
    if (!this.container) return;
    this.container.innerHTML = '';
  }

  /**
   * Destroy the zone boundaries and clean up
   */
  destroy(): void {
    if (this.container?.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.container = null;
    this.slideElement = null;
    this.zoneColors.clear();
  }

  /**
   * Get the container element
   */
  getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * Get the assigned color for a zone
   *
   * @param zoneName - Name of the zone
   * @returns Hex color string
   */
  getZoneColor(zoneName: string): string | undefined {
    return this.zoneColors.get(zoneName);
  }

  /**
   * Create the container for zone boundaries
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'pf-debug-zone-boundaries';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9998';
    return container;
  }

  /**
   * Assign colors to zones
   */
  private assignZoneColors(zones: DebugZoneInfo[]): void {
    zones.forEach((zone, index) => {
      if (!this.zoneColors.has(zone.name)) {
        const color = this.ZONE_COLOR_PALETTE[index % this.ZONE_COLOR_PALETTE.length]!;
        this.zoneColors.set(zone.name, color);
      }
    });
  }

  /**
   * Render zone boundaries
   */
  private renderZoneBoundaries(zones: DebugZoneInfo[]): void {
    if (!this.container || !this.slideElement) return;

    this.container.innerHTML = '';

    zones.forEach((zone) => {
      const zoneElement = this.findZoneElement(zone.name);
      if (zoneElement) {
        const boundary = this.createZoneBoundary(zone, zoneElement);
        this.container!.appendChild(boundary);
      }
    });
  }

  /**
   * Find the DOM element for a zone
   */
  private findZoneElement(zoneName: string): HTMLElement | null {
    if (!this.slideElement) return null;

    // Try to find by data-zone attribute
    const zoneElement = this.slideElement.querySelector(
      `[data-zone="${zoneName}"]`
    ) as HTMLElement;

    return zoneElement;
  }

  /**
   * Create a boundary overlay for a zone
   */
  private createZoneBoundary(
    zone: DebugZoneInfo,
    zoneElement: HTMLElement
  ): HTMLElement {
    const boundary = document.createElement('div');
    boundary.className = 'pf-debug-zone-boundary';
    boundary.setAttribute('data-zone', zone.name);

    const color = this.zoneColors.get(zone.name) || '#fff';
    const rect = zoneElement.getBoundingClientRect();
    const containerRect = this.slideElement!.getBoundingClientRect();

    // Position relative to slide container
    boundary.style.position = 'absolute';
    boundary.style.top = `${rect.top - containerRect.top}px`;
    boundary.style.left = `${rect.left - containerRect.left}px`;
    boundary.style.width = `${rect.width}px`;
    boundary.style.height = `${rect.height}px`;
    boundary.style.border = `2px dashed ${color}`;
    boundary.style.pointerEvents = 'none';

    // Create label
    const label = this.createZoneLabel(zone, color);
    boundary.appendChild(label);

    return boundary;
  }

  /**
   * Create a label for a zone
   */
  private createZoneLabel(zone: DebugZoneInfo, color: string): HTMLElement {
    const label = document.createElement('div');
    label.className = 'pf-debug-zone-label';
    label.textContent = zone.name;

    label.style.position = 'absolute';
    label.style.top = '0';
    label.style.left = '0';
    label.style.background = color;
    label.style.color = '#fff';
    label.style.padding = '2px 6px';
    label.style.fontSize = '10px';
    label.style.fontFamily = 'Monaco, Courier New, monospace';
    label.style.fontWeight = 'bold';
    label.style.borderBottomRightRadius = '3px';
    label.style.pointerEvents = 'none';

    return label;
  }
}
