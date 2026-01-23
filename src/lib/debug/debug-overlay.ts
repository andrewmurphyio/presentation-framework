import type { DebugInfo } from '../types/debug';
import { DebugMode } from './debug-mode';
import { LayoutInfoPanel } from './panels/layout-info-panel';
import { ZoneBoundaries } from './panels/zone-boundaries';
import { TokenInspector } from './panels/token-inspector';
import { MetadataPanel } from './panels/metadata-panel';

/**
 * DebugOverlay manages the debug overlay container and coordinates debug panels
 *
 * This component creates a fixed-position overlay layer above the presentation
 * that houses all debug UI components (layout info, token inspector, etc.).
 *
 * Features:
 * - Creates overlay container DOM structure
 * - Manages lifecycle (mount/unmount)
 * - Positions overlay as fixed layer above slides
 * - Coordinates panel rendering and updates
 */
export class DebugOverlay {
  private container: HTMLElement | null = null;
  private debugMode: DebugMode;
  private parentElement: HTMLElement;
  private mounted: boolean = false;

  // Panel instances
  private layoutPanel: LayoutInfoPanel;
  private zoneBoundaries: ZoneBoundaries;
  private tokenInspector: TokenInspector;
  private metadataPanel: MetadataPanel;

  // Panel elements
  private layoutPanelElement: HTMLElement | null = null;
  private zoneBoundariesElement: HTMLElement | null = null;
  private tokenInspectorElement: HTMLElement | null = null;
  private metadataPanelElement: HTMLElement | null = null;

  /**
   * Create a new DebugOverlay
   *
   * @param debugMode - DebugMode instance to manage state
   * @param parentElement - Parent element to append overlay to (usually document.body or #app)
   */
  constructor(debugMode: DebugMode, parentElement: HTMLElement) {
    this.debugMode = debugMode;
    this.parentElement = parentElement;

    // Initialize panels
    this.layoutPanel = new LayoutInfoPanel('top-left');
    this.zoneBoundaries = new ZoneBoundaries();
    this.tokenInspector = new TokenInspector('top-right');
    this.metadataPanel = new MetadataPanel('bottom-left');

    // Listen for debug mode state changes
    this.debugMode.addEventListener(this.handleDebugModeChange.bind(this));
  }

  /**
   * Mount the overlay to the DOM
   */
  mount(): void {
    if (this.mounted) return;

    this.container = this.createOverlayContainer();
    this.parentElement.appendChild(this.container);
    this.mounted = true;

    // Apply initial visibility based on debug mode state
    this.updateVisibility();
  }

  /**
   * Unmount the overlay from the DOM
   */
  unmount(): void {
    if (!this.mounted || !this.container) return;

    this.parentElement.removeChild(this.container);
    this.container = null;
    this.mounted = false;
  }

  /**
   * Check if overlay is currently mounted
   */
  isMounted(): boolean {
    return this.mounted;
  }

  /**
   * Get the overlay container element
   */
  getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * Update overlay with new debug information
   *
   * @param debugInfo - Debug information to display
   */
  update(debugInfo: DebugInfo): void {
    if (!this.container || !this.debugMode.isEnabled()) return;

    // Use requestAnimationFrame to ensure DOM is updated after slide visibility changes
    requestAnimationFrame(() => {
      if (!this.container) return;

      // Get the current slide element
      const slideElement = this.parentElement.querySelector('.slide[style*="display: grid"]') as HTMLElement;
      if (!slideElement) return;

      // Update or create layout panel
      if (this.layoutPanelElement) {
        this.layoutPanel.update(debugInfo.layout);
      } else {
        this.layoutPanelElement = this.layoutPanel.render(debugInfo.layout);
        this.container!.appendChild(this.layoutPanelElement);
      }

      // Update or create zone boundaries
      if (this.zoneBoundariesElement) {
        this.zoneBoundaries.update(debugInfo.layout.zones, slideElement);
      } else {
        this.zoneBoundariesElement = this.zoneBoundaries.render(debugInfo.layout.zones, slideElement);
        this.container!.appendChild(this.zoneBoundariesElement);
      }

      // Update or create token inspector
      if (this.tokenInspectorElement) {
        this.tokenInspector.update(debugInfo.theme);
      } else {
        this.tokenInspectorElement = this.tokenInspector.render(debugInfo.theme);
        this.container!.appendChild(this.tokenInspectorElement);
      }

      // Update or create metadata panel
      if (this.metadataPanelElement) {
        this.metadataPanel.update(debugInfo.slide, debugInfo.layout);
      } else {
        this.metadataPanelElement = this.metadataPanel.render(debugInfo.slide, debugInfo.layout);
        this.container!.appendChild(this.metadataPanelElement);
      }
    });
  }

  /**
   * Clear all debug information from overlay
   */
  clear(): void {
    if (!this.container) return;

    // Remove all panel elements
    if (this.layoutPanelElement) {
      this.container.removeChild(this.layoutPanelElement);
      this.layoutPanelElement = null;
    }
    if (this.zoneBoundariesElement) {
      this.container.removeChild(this.zoneBoundariesElement);
      this.zoneBoundariesElement = null;
    }
    if (this.tokenInspectorElement) {
      this.container.removeChild(this.tokenInspectorElement);
      this.tokenInspectorElement = null;
    }
    if (this.metadataPanelElement) {
      this.container.removeChild(this.metadataPanelElement);
      this.metadataPanelElement = null;
    }
  }

  /**
   * Destroy the overlay and clean up resources
   */
  destroy(): void {
    this.unmount();
    this.debugMode.removeEventListener(this.handleDebugModeChange.bind(this));
  }

  /**
   * Create the overlay container DOM element
   */
  private createOverlayContainer(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'pf-debug-overlay';
    overlay.setAttribute('data-debug-overlay', 'true');

    // Apply overlay styles
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    return overlay;
  }

  /**
   * Update overlay visibility based on debug mode state
   */
  private updateVisibility(): void {
    if (!this.container) return;

    if (this.debugMode.isEnabled()) {
      this.container.style.display = 'block';
    } else {
      this.container.style.display = 'none';
      this.clear();
    }
  }

  /**
   * Handle debug mode state changes
   */
  private handleDebugModeChange(): void {
    this.updateVisibility();
  }
}
