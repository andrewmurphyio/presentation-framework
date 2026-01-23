import { describe, it, expect, beforeEach } from 'vitest';
import { renderCallout, registerCalloutRenderer } from '@/lib/components/callout';
import { componentRegistry } from '@/lib/components/component-registry';
import type { Callout } from '@/lib/types/component';

describe('Callout Component', () => {
  beforeEach(() => {
    componentRegistry.clear();
    registerCalloutRenderer();
  });

  describe('renderCallout - basic rendering', () => {
    it('should render info callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'This is informational',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-info');
      expect(result).toContain('This is informational');
      expect(result).toContain('callout-container');
    });

    it('should render warning callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'This is a warning',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-warning');
      expect(result).toContain('This is a warning');
    });

    it('should render success callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'success',
        content: 'Operation successful',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-success');
      expect(result).toContain('Operation successful');
    });

    it('should render error callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'error',
        content: 'An error occurred',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-error');
      expect(result).toContain('An error occurred');
    });

    it('should escape HTML in content', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: '<script>alert("XSS")</script>',
      };

      const result = renderCallout(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('<script>');
    });
  });

  describe('title', () => {
    it('should render callout without title', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content only',
      };

      const result = renderCallout(component);

      expect(result).not.toContain('callout-title');
      expect(result).toContain('Content only');
    });

    it('should render callout with title', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        title: 'Important Notice',
        content: 'Please read carefully',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-title');
      expect(result).toContain('Important Notice');
      expect(result).toContain('Please read carefully');
    });

    it('should escape HTML in title', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        title: '<b>Bold Title</b>',
        content: 'Content',
      };

      const result = renderCallout(component);

      expect(result).toContain('&lt;b&gt;Bold Title&lt;/b&gt;');
      expect(result).not.toContain('<b>Bold Title</b>');
    });
  });

  describe('icons', () => {
    it('should include icon for info callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Info',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-icon');
      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should include icon for warning callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'Warning',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-icon');
      expect(result).toContain('<svg');
    });

    it('should include icon for success callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'success',
        content: 'Success',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-icon');
      expect(result).toContain('<svg');
    });

    it('should include icon for error callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'error',
        content: 'Error',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-icon');
      expect(result).toContain('<svg');
    });
  });

  describe('ARIA attributes', () => {
    it('should use status role for info callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Info',
      };

      const result = renderCallout(component);

      expect(result).toContain('role="status"');
    });

    it('should use status role for success callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'success',
        content: 'Success',
      };

      const result = renderCallout(component);

      expect(result).toContain('role="status"');
    });

    it('should use alert role for warning callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'Warning',
      };

      const result = renderCallout(component);

      expect(result).toContain('role="alert"');
    });

    it('should use alert role for error callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'error',
        content: 'Error',
      };

      const result = renderCallout(component);

      expect(result).toContain('role="alert"');
    });
  });

  describe('custom attributes', () => {
    it('should include custom id if provided', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content',
        id: 'my-callout',
      };

      const result = renderCallout(component);

      expect(result).toContain('id="my-callout"');
    });

    it('should include custom className if provided', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'Content',
        className: 'custom-callout-style',
      };

      const result = renderCallout(component);

      expect(result).toContain('custom-callout-style');
    });

    it('should escape HTML in custom id', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content',
        id: '<script>alert("xss")</script>',
      };

      const result = renderCallout(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('id="<script>');
    });
  });

  describe('registry integration', () => {
    it('should register renderer with component registry', () => {
      expect(componentRegistry.hasRenderer('callout')).toBe(true);
    });

    it('should render via component registry', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'success',
        content: 'Registry test',
      };

      const renderer = componentRegistry.getRenderer('callout');
      const result = renderer(component);

      expect(result).toContain('Registry test');
      expect(result).toContain('callout-success');
    });
  });

  describe('HTML structure', () => {
    it('should have proper container wrapper', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-container');
    });

    it('should have header section', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-header');
    });

    it('should have content section', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-content');
    });

    it('should have header with icon and title together', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        title: 'Title',
        content: 'Content',
      };

      const result = renderCallout(component);

      const headerMatch = result.match(
        /<div class="callout-header">([\s\S]*?)<\/div>/
      );
      expect(headerMatch).toBeTruthy();
      if (headerMatch) {
        expect(headerMatch[1]).toContain('callout-icon');
        expect(headerMatch[1]).toContain('callout-title');
      }
    });
  });

  describe('all callout types', () => {
    it('should render all four types correctly', () => {
      const types: Array<Callout['calloutType']> = [
        'info',
        'warning',
        'success',
        'error',
      ];

      types.forEach((calloutType) => {
        const component: Callout = {
          type: 'callout',
          calloutType,
          content: `${calloutType} content`,
        };

        const result = renderCallout(component);

        expect(result).toContain(`callout-${calloutType}`);
        expect(result).toContain(`${calloutType} content`);
        expect(result).toContain('callout-icon');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: '',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-content');
      expect(result).toContain('callout-info');
    });

    it('should handle special characters in content', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Content with & < > " \' characters',
      };

      const result = renderCallout(component);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#039;');
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: longContent,
      };

      const result = renderCallout(component);

      expect(result).toContain(longContent);
    });

    it('should handle multiline content', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'Line 1\nLine 2\nLine 3',
      };

      const result = renderCallout(component);

      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
    });
  });

  describe('complete examples', () => {
    it('should render info callout with all features', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'info',
        title: 'Did you know?',
        content: 'This is useful information',
        id: 'info-1',
        className: 'featured',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-info');
      expect(result).toContain('Did you know?');
      expect(result).toContain('This is useful information');
      expect(result).toContain('id="info-1"');
      expect(result).toContain('featured');
      expect(result).toContain('callout-icon');
      expect(result).toContain('role="status"');
    });

    it('should render warning callout with all features', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        title: 'Caution',
        content: 'Proceed with care',
        id: 'warn-1',
        className: 'important',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-warning');
      expect(result).toContain('Caution');
      expect(result).toContain('Proceed with care');
      expect(result).toContain('id="warn-1"');
      expect(result).toContain('important');
      expect(result).toContain('callout-icon');
      expect(result).toContain('role="alert"');
    });

    it('should render success callout with all features', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'success',
        title: 'Success!',
        content: 'Everything worked perfectly',
        id: 'success-1',
        className: 'celebration',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-success');
      expect(result).toContain('Success!');
      expect(result).toContain('Everything worked perfectly');
      expect(result).toContain('id="success-1"');
      expect(result).toContain('celebration');
      expect(result).toContain('callout-icon');
      expect(result).toContain('role="status"');
    });

    it('should render error callout with all features', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'error',
        title: 'Error',
        content: 'Something went wrong',
        id: 'error-1',
        className: 'critical',
      };

      const result = renderCallout(component);

      expect(result).toContain('callout-error');
      expect(result).toContain('Error');
      expect(result).toContain('Something went wrong');
      expect(result).toContain('id="error-1"');
      expect(result).toContain('critical');
      expect(result).toContain('callout-icon');
      expect(result).toContain('role="alert"');
    });
  });
});
