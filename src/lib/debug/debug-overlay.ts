import type { DebugInfo } from '../types/debug';
import { DebugMode } from './debug-mode';

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

  /**
   * Create a new DebugOverlay
   *
   * @param debugMode - DebugMode instance to manage state
   * @param parentElement - Parent element to append overlay to (usually document.body or #app)
   */
  constructor(debugMode: DebugMode, parentElement: HTMLElement) {
    this.debugMode = debugMode;
    this.parentElement = parentElement;

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
    if (!this.container) return;

    // For now, just store the debug info as a data attribute
    // Individual panels will be implemented in subsequent tasks
    this.container.setAttribute('data-debug-info', JSON.stringify(debugInfo));
  }

  /**
   * Clear all debug information from overlay
   */
  clear(): void {
    if (!this.container) return;
    this.container.removeAttribute('data-debug-info');
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
    }
  }

  /**
   * Handle debug mode state changes
   */
  private handleDebugModeChange(): void {
    this.updateVisibility();
  }
}
