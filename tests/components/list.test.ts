import { describe, it, expect, beforeEach } from 'vitest';
import { renderList, registerListRenderer } from '@/lib/components/list';
import { componentRegistry } from '@/lib/components/component-registry';
import type { List } from '@/lib/types/component';

describe('List Component', () => {
  beforeEach(() => {
    componentRegistry.clear();
    registerListRenderer();
  });

  describe('renderList - bullet variant', () => {
    it('should render basic bullet list', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }],
      };

      const result = renderList(component);

      expect(result).toContain('list-bullet');
      expect(result).toContain('<ul');
      expect(result).toContain('Item 1');
      expect(result).toContain('Item 2');
      expect(result).toContain('Item 3');
      expect(result).toContain('</ul>');
    });

    it('should render single item bullet list', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Single item' }],
      };

      const result = renderList(component);

      expect(result).toContain('<ul');
      expect(result).toContain('Single item');
    });

    it('should escape HTML in bullet items', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: '<script>alert("xss")</script>' }],
      };

      const result = renderList(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('<script>');
    });
  });

  describe('renderList - numbered variant', () => {
    it('should render basic numbered list', () => {
      const component: List = {
        type: 'list',
        variant: 'numbered',
        items: [{ text: 'First' }, { text: 'Second' }, { text: 'Third' }],
      };

      const result = renderList(component);

      expect(result).toContain('list-numbered');
      expect(result).toContain('<ol');
      expect(result).toContain('First');
      expect(result).toContain('Second');
      expect(result).toContain('Third');
      expect(result).toContain('</ol>');
    });

    it('should use ordered list tag for numbered variant', () => {
      const component: List = {
        type: 'list',
        variant: 'numbered',
        items: [{ text: 'Step 1' }],
      };

      const result = renderList(component);

      expect(result).toContain('<ol');
      expect(result).not.toContain('<ul');
    });
  });

  describe('renderList - checklist variant', () => {
    it('should render basic checklist', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [
          { text: 'Task 1', checked: true },
          { text: 'Task 2', checked: false },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('list-checklist');
      expect(result).toContain('type="checkbox"');
      expect(result).toContain('Task 1');
      expect(result).toContain('Task 2');
    });

    it('should mark checked items correctly', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [
          { text: 'Done task', checked: true },
          { text: 'Pending task', checked: false },
        ],
      };

      const result = renderList(component);

      // Should have at least one checked checkbox
      expect(result).toContain('checked');
      // Should have checkboxes
      expect(result).toContain('type="checkbox"');
    });

    it('should use unordered list for checklist', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [{ text: 'Task', checked: false }],
      };

      const result = renderList(component);

      expect(result).toContain('<ul');
      expect(result).not.toContain('<ol');
    });

    it('should disable checkboxes by default', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [{ text: 'Task', checked: true }],
      };

      const result = renderList(component);

      expect(result).toContain('disabled');
    });

    it('should have unique checkbox IDs', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [{ text: 'Task 1' }, { text: 'Task 2' }],
      };

      const result = renderList(component);

      // Should have two checkboxes with different IDs
      const idMatches = result.match(/id="checkbox-[^"]+"/g);
      expect(idMatches).toBeTruthy();
      expect(idMatches!.length).toBe(2);
      expect(idMatches![0]).not.toBe(idMatches![1]);
    });
  });

  describe('nested lists', () => {
    it('should render single level nesting with bullets', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Parent 1',
            children: [{ text: 'Child 1' }, { text: 'Child 2' }],
          },
          { text: 'Parent 2' },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Parent 1');
      expect(result).toContain('Child 1');
      expect(result).toContain('Child 2');
      expect(result).toContain('Parent 2');
      expect(result).toContain('list-nested');
    });

    it('should render single level nesting with numbered lists', () => {
      const component: List = {
        type: 'list',
        variant: 'numbered',
        items: [
          {
            text: 'Step 1',
            children: [{ text: 'Sub-step 1.1' }, { text: 'Sub-step 1.2' }],
          },
          { text: 'Step 2' },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Step 1');
      expect(result).toContain('Sub-step 1.1');
      expect(result).toContain('Sub-step 1.2');
      expect(result).toContain('Step 2');
    });

    it('should render single level nesting with checklist', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [
          {
            text: 'Main task',
            checked: true,
            children: [
              { text: 'Subtask 1', checked: true },
              { text: 'Subtask 2', checked: false },
            ],
          },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Main task');
      expect(result).toContain('Subtask 1');
      expect(result).toContain('Subtask 2');
      expect(result).toContain('list-nested');
    });

    it('should render deeply nested lists (3 levels)', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Level 1',
            children: [
              {
                text: 'Level 2',
                children: [{ text: 'Level 3' }],
              },
            ],
          },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Level 1');
      expect(result).toContain('Level 2');
      expect(result).toContain('Level 3');
      expect(result).toContain('list-nested-level-1');
      expect(result).toContain('list-nested-level-2');
    });

    it('should handle multiple nested branches', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Parent A',
            children: [{ text: 'Child A1' }, { text: 'Child A2' }],
          },
          {
            text: 'Parent B',
            children: [{ text: 'Child B1' }],
          },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Parent A');
      expect(result).toContain('Child A1');
      expect(result).toContain('Child A2');
      expect(result).toContain('Parent B');
      expect(result).toContain('Child B1');
    });

    it('should use correct list tags for nested numbered lists', () => {
      const component: List = {
        type: 'list',
        variant: 'numbered',
        items: [
          {
            text: 'Step 1',
            children: [{ text: 'Sub-step 1.1' }],
          },
        ],
      };

      const result = renderList(component);

      // Should have both outer and inner <ol> tags
      const olCount = (result.match(/<ol/g) || []).length;
      expect(olCount).toBe(2);
    });

    it('should use correct list tags for nested bullet lists', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Item 1',
            children: [{ text: 'Subitem 1.1' }],
          },
        ],
      };

      const result = renderList(component);

      // Should have both outer and inner <ul> tags
      const ulCount = (result.match(/<ul/g) || []).length;
      expect(ulCount).toBe(2);
    });
  });

  describe('custom attributes', () => {
    it('should include custom id if provided', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item' }],
        id: 'my-list',
      };

      const result = renderList(component);

      expect(result).toContain('id="my-list"');
    });

    it('should include custom className if provided', () => {
      const component: List = {
        type: 'list',
        variant: 'numbered',
        items: [{ text: 'Item' }],
        className: 'custom-list-style',
      };

      const result = renderList(component);

      expect(result).toContain('custom-list-style');
    });

    it('should escape HTML in custom id', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item' }],
        id: '<script>alert("xss")</script>',
      };

      const result = renderList(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('<script>');
    });
  });

  describe('registry integration', () => {
    it('should register renderer with component registry', () => {
      expect(componentRegistry.hasRenderer('list')).toBe(true);
    });

    it('should render via component registry', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Test item' }],
      };

      const renderer = componentRegistry.getRenderer('list');
      const result = renderer(component);

      expect(result).toContain('Test item');
      expect(result).toContain('list-bullet');
    });
  });

  describe('edge cases', () => {
    it('should handle empty list', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [],
      };

      const result = renderList(component);

      expect(result).toContain('<ul');
      expect(result).toContain('</ul>');
    });

    it('should handle items with special characters', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item with & < > " \' characters' }],
      };

      const result = renderList(component);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#039;');
    });

    it('should handle very long item text', () => {
      const longText = 'A'.repeat(1000);
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: longText }],
      };

      const result = renderList(component);

      expect(result).toContain(longText);
    });

    it('should handle unchecked checklist item (no checked property)', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [{ text: 'Task without checked property' }],
      };

      const result = renderList(component);

      expect(result).toContain('type="checkbox"');
      // When checked is undefined/false, should not have checked attribute
      const checkboxMatch = result.match(/<input[^>]*>/);
      expect(checkboxMatch).toBeTruthy();
      if (checkboxMatch) {
        expect(checkboxMatch[0]).not.toContain('checked');
      }
    });

    it('should handle empty nested children array', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item with empty children', children: [] }],
      };

      const result = renderList(component);

      expect(result).toContain('Item with empty children');
    });

    it('should handle mixed checked states in checklist', () => {
      const component: List = {
        type: 'list',
        variant: 'checklist',
        items: [
          { text: 'Checked', checked: true },
          { text: 'Unchecked', checked: false },
          { text: 'No state' },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('Checked');
      expect(result).toContain('Unchecked');
      expect(result).toContain('No state');
    });
  });

  describe('semantic HTML', () => {
    it('should use semantic list-item class', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item' }],
      };

      const result = renderList(component);

      expect(result).toContain('list-item');
    });

    it('should include level indicators for nested lists', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Level 0',
            children: [{ text: 'Level 1' }],
          },
        ],
      };

      const result = renderList(component);

      expect(result).toContain('list-level-0');
      expect(result).toContain('list-nested-level-1');
    });

    it('should have proper container wrapper', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item' }],
      };

      const result = renderList(component);

      expect(result).toContain('list-container');
    });
  });
});
