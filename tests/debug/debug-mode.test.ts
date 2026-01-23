import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DebugMode } from '@/lib/debug/debug-mode';

describe('DebugMode', () => {
  let debugMode: DebugMode;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    debugMode = new DebugMode({}, false); // Don't auto-restore for tests
  });

  afterEach(() => {
    debugMode.clearEventListeners();
    localStorage.clear();
  });

  describe('State management', () => {
    it('should start disabled by default', () => {
      expect(debugMode.isEnabled()).toBe(false);
    });

    it('should enable debug mode', () => {
      debugMode.enable();
      expect(debugMode.isEnabled()).toBe(true);
    });

    it('should disable debug mode', () => {
      debugMode.enable();
      debugMode.disable();
      expect(debugMode.isEnabled()).toBe(false);
    });

    it('should toggle debug mode on', () => {
      debugMode.toggle();
      expect(debugMode.isEnabled()).toBe(true);
    });

    it('should toggle debug mode off', () => {
      debugMode.enable();
      debugMode.toggle();
      expect(debugMode.isEnabled()).toBe(false);
    });

    it('should not emit event when enabling already enabled mode', () => {
      const listener = vi.fn();
      debugMode.addEventListener(listener);

      debugMode.enable();
      listener.mockClear();

      debugMode.enable();
      expect(listener).not.toHaveBeenCalled();
    });

    it('should not emit event when disabling already disabled mode', () => {
      const listener = vi.fn();
      debugMode.addEventListener(listener);

      debugMode.disable();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Options management', () => {
    it('should have default options', () => {
      const options = debugMode.getOptions();

      expect(options.showLayout).toBe(true);
      expect(options.showTokens).toBe(true);
      expect(options.showZones).toBe(true);
      expect(options.showMetadata).toBe(true);
      expect(options.showContentMapping).toBe(true);
      expect(options.panelPosition).toBe('top-left');
      expect(options.persistState).toBe(true);
    });

    it('should accept custom options on construction', () => {
      const customDebugMode = new DebugMode(
        {
          showLayout: false,
          panelPosition: 'bottom-right',
        },
        false
      );

      const options = customDebugMode.getOptions();
      expect(options.showLayout).toBe(false);
      expect(options.panelPosition).toBe('bottom-right');
      expect(options.showTokens).toBe(true); // Still has default
    });

    it('should update options', () => {
      debugMode.setOptions({
        showLayout: false,
        zoneHighlightColor: 'rgba(0, 255, 0, 0.5)',
      });

      const options = debugMode.getOptions();
      expect(options.showLayout).toBe(false);
      expect(options.zoneHighlightColor).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('should return a copy of options to prevent mutation', () => {
      const options1 = debugMode.getOptions();
      options1.showLayout = false;

      const options2 = debugMode.getOptions();
      expect(options2.showLayout).toBe(true);
    });
  });

  describe('Event system', () => {
    it('should emit "enabled" event when enabling', () => {
      const listener = vi.fn();
      debugMode.addEventListener(listener);

      debugMode.enable();

      expect(listener).toHaveBeenCalledWith('enabled');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should emit "disabled" event when disabling', () => {
      debugMode.enable();

      const listener = vi.fn();
      debugMode.addEventListener(listener);

      debugMode.disable();

      expect(listener).toHaveBeenCalledWith('disabled');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should emit "options-changed" event when updating options', () => {
      const listener = vi.fn();
      debugMode.addEventListener(listener);

      debugMode.setOptions({ showLayout: false });

      expect(listener).toHaveBeenCalledWith('options-changed');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      debugMode.addEventListener(listener1);
      debugMode.addEventListener(listener2);

      debugMode.enable();

      expect(listener1).toHaveBeenCalledWith('enabled');
      expect(listener2).toHaveBeenCalledWith('enabled');
    });

    it('should remove event listener', () => {
      const listener = vi.fn();
      debugMode.addEventListener(listener);
      debugMode.removeEventListener(listener);

      debugMode.enable();

      expect(listener).not.toHaveBeenCalled();
    });

    it('should clear all event listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      debugMode.addEventListener(listener1);
      debugMode.addEventListener(listener2);
      debugMode.clearEventListeners();

      debugMode.enable();

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist enabled state to localStorage', () => {
      const persistDebugMode = new DebugMode({ persistState: true }, false);
      persistDebugMode.enable();

      const stored = localStorage.getItem('pf-debug-mode');
      expect(stored).toBeDefined();

      const state = JSON.parse(stored!);
      expect(state.enabled).toBe(true);
    });

    it('should persist disabled state to localStorage', () => {
      const persistDebugMode = new DebugMode({ persistState: true }, false);
      persistDebugMode.enable();
      persistDebugMode.disable();

      const stored = localStorage.getItem('pf-debug-mode');
      const state = JSON.parse(stored!);
      expect(state.enabled).toBe(false);
    });

    it('should persist options to localStorage', () => {
      const persistDebugMode = new DebugMode({ persistState: true }, false);
      persistDebugMode.setOptions({ showLayout: false, panelPosition: 'bottom-right' });

      const stored = localStorage.getItem('pf-debug-mode');
      const state = JSON.parse(stored!);
      expect(state.options.showLayout).toBe(false);
      expect(state.options.panelPosition).toBe('bottom-right');
    });

    it('should restore state from localStorage on init', () => {
      // Set up persisted state
      const initialDebugMode = new DebugMode({ persistState: true }, false);
      initialDebugMode.enable();
      initialDebugMode.setOptions({ showLayout: false });

      // Create new instance with auto-restore
      const restoredDebugMode = new DebugMode({ persistState: true }, true);

      expect(restoredDebugMode.isEnabled()).toBe(true);
      expect(restoredDebugMode.getOptions().showLayout).toBe(false);
    });

    it('should not persist if persistState is false', () => {
      const noPersistDebugMode = new DebugMode({ persistState: false }, false);
      noPersistDebugMode.enable();

      const stored = localStorage.getItem('pf-debug-mode');
      expect(stored).toBeNull();
    });

    it('should clear persisted state', () => {
      const persistDebugMode = new DebugMode({ persistState: true }, false);
      persistDebugMode.enable();

      persistDebugMode.clearPersistedState();

      const stored = localStorage.getItem('pf-debug-mode');
      expect(stored).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const persistDebugMode = new DebugMode({ persistState: true }, false);

      // Should not throw
      expect(() => persistDebugMode.enable()).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle corrupt localStorage data gracefully', () => {
      // Set invalid JSON in localStorage
      localStorage.setItem('pf-debug-mode', 'invalid json{');

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Should not throw and should use defaults
      const restoredDebugMode = new DebugMode({ persistState: true }, true);

      expect(restoredDebugMode.isEnabled()).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});
