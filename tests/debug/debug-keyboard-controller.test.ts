import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DebugKeyboardController } from '@/lib/debug/debug-keyboard-controller';
import { DebugMode } from '@/lib/debug/debug-mode';

describe('DebugKeyboardController', () => {
  let controller: DebugKeyboardController;
  let debugMode: DebugMode;

  beforeEach(() => {
    debugMode = new DebugMode({}, false);
    controller = new DebugKeyboardController(debugMode);
  });

  afterEach(() => {
    controller.destroy();
  });

  describe('Lifecycle', () => {
    it('should start disabled', () => {
      expect(controller.isEnabled()).toBe(false);
    });

    it('should enable keyboard listeners', () => {
      controller.enable();

      expect(controller.isEnabled()).toBe(true);
    });

    it('should disable keyboard listeners', () => {
      controller.enable();
      controller.disable();

      expect(controller.isEnabled()).toBe(false);
    });

    it('should not enable twice', () => {
      controller.enable();
      const firstEnable = controller.isEnabled();
      controller.enable();

      expect(controller.isEnabled()).toBe(firstEnable);
    });

    it('should handle disable when not enabled', () => {
      expect(() => controller.disable()).not.toThrow();
    });

    it('should destroy and clean up', () => {
      controller.enable();
      controller.destroy();

      expect(controller.isEnabled()).toBe(false);
    });
  });

  describe('Toggle Debug Mode (D key)', () => {
    it('should toggle debug mode on D key press', () => {
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(debugMode.isEnabled()).toBe(true);
    });

    it('should toggle debug mode off when pressed again', () => {
      controller.enable();
      debugMode.enable();

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(debugMode.isEnabled()).toBe(false);
    });

    it('should call registered callbacks', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should call multiple registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      controller.onToggleDebugMode(callback1);
      controller.onToggleDebugMode(callback2);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it('should not respond when disabled', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should ignore D key with modifiers', () => {
      controller.enable();

      const withShift = new KeyboardEvent('keydown', { key: 'd', shiftKey: true });
      const withAlt = new KeyboardEvent('keydown', { key: 'd', altKey: true });
      const withCtrl = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true });

      document.dispatchEvent(withShift);
      document.dispatchEvent(withAlt);
      document.dispatchEvent(withCtrl);

      expect(debugMode.isEnabled()).toBe(false);
    });
  });

  describe('Toggle Panels (Shift+D)', () => {
    it('should trigger on Shift+D', () => {
      const callback = vi.fn();
      controller.onTogglePanels(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'D', shiftKey: true });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not trigger on lowercase d with shift', () => {
      const callback = vi.fn();
      controller.onTogglePanels(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'd', shiftKey: true });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should call multiple registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      controller.onTogglePanels(callback1);
      controller.onTogglePanels(callback2);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'D', shiftKey: true });
      document.dispatchEvent(event);

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it('should ignore with other modifiers', () => {
      const callback = vi.fn();
      controller.onTogglePanels(callback);
      controller.enable();

      const withAlt = new KeyboardEvent('keydown', { key: 'D', shiftKey: true, altKey: true });
      document.dispatchEvent(withAlt);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Toggle Zone Boundaries (Alt+Z)', () => {
    it('should trigger on Alt+Z', () => {
      const callback = vi.fn();
      controller.onToggleZoneBoundaries(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'z', altKey: true });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should call multiple registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      controller.onToggleZoneBoundaries(callback1);
      controller.onToggleZoneBoundaries(callback2);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'z', altKey: true });
      document.dispatchEvent(event);

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it('should ignore with other modifiers', () => {
      const callback = vi.fn();
      controller.onToggleZoneBoundaries(callback);
      controller.enable();

      const withShift = new KeyboardEvent('keydown', { key: 'z', altKey: true, shiftKey: true });
      document.dispatchEvent(withShift);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should ignore without Alt', () => {
      const callback = vi.fn();
      controller.onToggleZoneBoundaries(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'z' });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Toggle Token Inspector (Alt+T)', () => {
    it('should trigger on Alt+T', () => {
      const callback = vi.fn();
      controller.onToggleTokenInspector(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 't', altKey: true });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should call multiple registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      controller.onToggleTokenInspector(callback1);
      controller.onToggleTokenInspector(callback2);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 't', altKey: true });
      document.dispatchEvent(event);

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it('should ignore with other modifiers', () => {
      const callback = vi.fn();
      controller.onToggleTokenInspector(callback);
      controller.enable();

      const withShift = new KeyboardEvent('keydown', { key: 't', altKey: true, shiftKey: true });
      document.dispatchEvent(withShift);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should ignore without Alt', () => {
      const callback = vi.fn();
      controller.onToggleTokenInspector(callback);
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 't' });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Input Field Handling', () => {
    it('should ignore events from input fields', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);
      controller.enable();

      const input = document.createElement('input');
      document.body.appendChild(input);

      const event = new KeyboardEvent('keydown', { key: 'd', bubbles: true });
      input.dispatchEvent(event);

      document.body.removeChild(input);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should ignore events from textarea', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);
      controller.enable();

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      const event = new KeyboardEvent('keydown', { key: 'd', bubbles: true });
      textarea.dispatchEvent(event);

      document.body.removeChild(textarea);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should respond to events from non-input elements', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);
      controller.enable();

      const div = document.createElement('div');
      document.body.appendChild(div);

      const event = new KeyboardEvent('keydown', { key: 'd', bubbles: true });
      div.dispatchEvent(event);

      document.body.removeChild(div);

      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('Callback Management', () => {
    it('should clear all callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      const callback4 = vi.fn();

      controller.onToggleDebugMode(callback1);
      controller.onTogglePanels(callback2);
      controller.onToggleZoneBoundaries(callback3);
      controller.onToggleTokenInspector(callback4);

      controller.clearCallbacks();
      controller.enable();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'D', shiftKey: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', altKey: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 't', altKey: true }));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();
    });

    it('should clear callbacks on destroy', () => {
      const callback = vi.fn();
      controller.onToggleDebugMode(callback);
      controller.destroy();

      controller.enable();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Event Prevention', () => {
    it('should prevent default for D key', () => {
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'd', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default for Shift+D', () => {
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'D', shiftKey: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default for Alt+Z', () => {
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 'z', altKey: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default for Alt+T', () => {
      controller.enable();

      const event = new KeyboardEvent('keydown', { key: 't', altKey: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
