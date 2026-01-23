import { DebugMode } from './debug-mode';

/**
 * Callback function for keyboard events
 */
export type KeyboardCallback = () => void;

/**
 * DebugKeyboardController manages keyboard shortcuts for debug mode
 *
 * Keyboard shortcuts:
 * - 'D' - Toggle debug mode on/off
 * - 'Shift+D' - Toggle specific panels (future use)
 * - 'Alt+Z' - Toggle zone boundaries only
 * - 'Alt+T' - Toggle token inspector only
 *
 * Features:
 * - Enable/disable listeners
 * - Prevent default browser behavior for shortcuts
 * - Support multiple callbacks per shortcut
 */
export class DebugKeyboardController {
  private debugMode: DebugMode;
  private enabled: boolean = false;
  private handleKeyDown: ((event: KeyboardEvent) => void) | null = null;

  // Callback maps for different shortcuts
  private callbacks: {
    toggleDebugMode: KeyboardCallback[];
    togglePanels: KeyboardCallback[];
    toggleZoneBoundaries: KeyboardCallback[];
    toggleTokenInspector: KeyboardCallback[];
  } = {
    toggleDebugMode: [],
    togglePanels: [],
    toggleZoneBoundaries: [],
    toggleTokenInspector: [],
  };

  /**
   * Create a new DebugKeyboardController
   *
   * @param debugMode - DebugMode instance to control
   */
  constructor(debugMode: DebugMode) {
    this.debugMode = debugMode;
  }

  /**
   * Enable keyboard listeners
   */
  enable(): void {
    if (this.enabled) return;

    this.handleKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
    this.enabled = true;
  }

  /**
   * Disable keyboard listeners
   */
  disable(): void {
    if (!this.enabled || !this.handleKeyDown) return;

    document.removeEventListener('keydown', this.handleKeyDown);
    this.handleKeyDown = null;
    this.enabled = false;
  }

  /**
   * Check if keyboard listeners are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Register a callback for the toggle debug mode shortcut (D)
   *
   * @param callback - Function to call when shortcut is triggered
   */
  onToggleDebugMode(callback: KeyboardCallback): void {
    this.callbacks.toggleDebugMode.push(callback);
  }

  /**
   * Register a callback for the toggle panels shortcut (Shift+D)
   *
   * @param callback - Function to call when shortcut is triggered
   */
  onTogglePanels(callback: KeyboardCallback): void {
    this.callbacks.togglePanels.push(callback);
  }

  /**
   * Register a callback for the toggle zone boundaries shortcut (Alt+Z)
   *
   * @param callback - Function to call when shortcut is triggered
   */
  onToggleZoneBoundaries(callback: KeyboardCallback): void {
    this.callbacks.toggleZoneBoundaries.push(callback);
  }

  /**
   * Register a callback for the toggle token inspector shortcut (Alt+T)
   *
   * @param callback - Function to call when shortcut is triggered
   */
  onToggleTokenInspector(callback: KeyboardCallback): void {
    this.callbacks.toggleTokenInspector.push(callback);
  }

  /**
   * Clear all registered callbacks
   */
  clearCallbacks(): void {
    this.callbacks.toggleDebugMode = [];
    this.callbacks.togglePanels = [];
    this.callbacks.toggleZoneBoundaries = [];
    this.callbacks.toggleTokenInspector = [];
  }

  /**
   * Destroy the controller and clean up
   */
  destroy(): void {
    this.disable();
    this.clearCallbacks();
  }

  /**
   * Handle keydown events
   */
  private onKeyDown(event: KeyboardEvent): void {
    // Ignore if user is typing in an input field
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // D key - Toggle debug mode
    if (event.key === 'd' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.debugMode.toggle();
      this.callbacks.toggleDebugMode.forEach((cb) => cb());
      return;
    }

    // Shift+D - Toggle specific panels
    if (event.key === 'D' && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.callbacks.togglePanels.forEach((cb) => cb());
      return;
    }

    // Alt+Z - Toggle zone boundaries
    if (event.key === 'z' && event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.callbacks.toggleZoneBoundaries.forEach((cb) => cb());
      return;
    }

    // Alt+T - Toggle token inspector
    if (event.key === 't' && event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.callbacks.toggleTokenInspector.forEach((cb) => cb());
      return;
    }
  }
}
