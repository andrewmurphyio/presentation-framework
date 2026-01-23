import type { DebugOptions } from '../types/debug';

/**
 * Event types emitted by DebugMode
 */
export type DebugModeEvent = 'enabled' | 'disabled' | 'options-changed';

/**
 * Event listener function for debug mode state changes
 */
export type DebugModeListener = (event: DebugModeEvent) => void;

/**
 * Default debug options
 */
const DEFAULT_OPTIONS: Required<DebugOptions> = {
  showLayout: true,
  showTokens: true,
  showZones: true,
  showMetadata: true,
  showContentMapping: true,
  zoneHighlightColor: 'rgba(255, 99, 71, 0.3)',
  overlayOpacity: 0.85,
  panelPosition: 'top-left',
  persistState: true,
  keyboardShortcut: 'D',
  hoverToInspect: true,
};

/**
 * localStorage key for persisting debug mode state
 */
const STORAGE_KEY = 'pf-debug-mode';

/**
 * DebugMode manages the enabled/disabled state and configuration options
 * for the debug overlay system.
 *
 * Features:
 * - Enable/disable debug mode
 * - Configure debug options (which panels to show, visual settings)
 * - Persist state to localStorage
 * - Emit events on state changes
 */
export class DebugMode {
  private enabled: boolean = false;
  private options: Required<DebugOptions>;
  private listeners: Set<DebugModeListener> = new Set();

  /**
   * Create a new DebugMode instance
   *
   * @param options - Initial debug options (merged with defaults)
   * @param autoRestore - Whether to restore state from localStorage on init
   */
  constructor(
    options: Partial<DebugOptions> = {},
    autoRestore: boolean = true
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    if (autoRestore && this.options.persistState) {
      this.restoreState();
    }
  }

  /**
   * Enable debug mode
   */
  enable(): void {
    if (this.enabled) return;

    this.enabled = true;
    this.persistState();
    this.emit('enabled');
  }

  /**
   * Disable debug mode
   */
  disable(): void {
    if (!this.enabled) return;

    this.enabled = false;
    this.persistState();
    this.emit('disabled');
  }

  /**
   * Toggle debug mode on/off
   */
  toggle(): void {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Check if debug mode is currently enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get current debug options
   */
  getOptions(): Required<DebugOptions> {
    return { ...this.options };
  }

  /**
   * Update debug options
   *
   * @param options - Partial options to update (merged with current)
   */
  setOptions(options: Partial<DebugOptions>): void {
    this.options = { ...this.options, ...options };
    this.persistState();
    this.emit('options-changed');
  }

  /**
   * Add an event listener for debug mode state changes
   *
   * @param listener - Function to call when state changes
   */
  addEventListener(listener: DebugModeListener): void {
    this.listeners.add(listener);
  }

  /**
   * Remove an event listener
   *
   * @param listener - Function to remove
   */
  removeEventListener(listener: DebugModeListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Remove all event listeners
   */
  clearEventListeners(): void {
    this.listeners.clear();
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: DebugModeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Persist current state to localStorage
   */
  private persistState(): void {
    if (!this.options.persistState) return;

    try {
      const state = {
        enabled: this.enabled,
        options: this.options,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Silently fail if localStorage is not available (e.g., private browsing)
      console.warn('Failed to persist debug mode state:', error);
    }
  }

  /**
   * Restore state from localStorage
   */
  private restoreState(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const state = JSON.parse(stored) as {
        enabled: boolean;
        options: Required<DebugOptions>;
      };

      this.enabled = state.enabled;
      this.options = { ...DEFAULT_OPTIONS, ...state.options };
    } catch (error) {
      // Silently fail if localStorage is not available or data is corrupt
      console.warn('Failed to restore debug mode state:', error);
    }
  }

  /**
   * Clear persisted state from localStorage
   */
  clearPersistedState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear debug mode state:', error);
    }
  }
}
