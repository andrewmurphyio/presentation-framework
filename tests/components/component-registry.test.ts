import { describe, it, expect, beforeEach } from 'vitest';
import {
  ComponentRegistry,
  componentRegistry,
  type ComponentRenderer,
} from '@/lib/components/component-registry';
import type {
  PresentationComponent,
  CodeBlock,
  List,
  Callout,
  Image,
} from '@/lib/types/component';

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    registry = new ComponentRegistry();
  });

  describe('registerRenderer', () => {
    it('should register a renderer for a component type', () => {
      const mockRenderer: ComponentRenderer<CodeBlock> = (component) =>
        `<code>${component.code}</code>`;

      registry.registerRenderer('code-block', mockRenderer);

      expect(registry.hasRenderer('code-block')).toBe(true);
    });

    it('should overwrite existing renderer for same type', () => {
      const renderer1: ComponentRenderer = () => '<div>renderer1</div>';
      const renderer2: ComponentRenderer = () => '<div>renderer2</div>';

      registry.registerRenderer('test', renderer1);
      registry.registerRenderer('test', renderer2);

      const retrieved = registry.getRenderer('test');
      const result = retrieved({} as PresentationComponent);

      expect(result).toBe('<div>renderer2</div>');
    });

    it('should register multiple renderers for different types', () => {
      const codeRenderer: ComponentRenderer<CodeBlock> = (component) =>
        `<code>${component.code}</code>`;
      const listRenderer: ComponentRenderer<List> = (component) =>
        `<ul>${component.items.length} items</ul>`;

      registry.registerRenderer('code-block', codeRenderer);
      registry.registerRenderer('list', listRenderer);

      expect(registry.hasRenderer('code-block')).toBe(true);
      expect(registry.hasRenderer('list')).toBe(true);
      expect(registry.count()).toBe(2);
    });
  });

  describe('getRenderer', () => {
    it('should retrieve registered renderer', () => {
      const mockRenderer: ComponentRenderer<CodeBlock> = (component) =>
        `<code>${component.code}</code>`;

      registry.registerRenderer('code-block', mockRenderer);

      const retrieved = registry.getRenderer('code-block');

      expect(retrieved).toBe(mockRenderer);
    });

    it('should throw error for unregistered type', () => {
      expect(() => registry.getRenderer('unknown')).toThrow(
        'No renderer registered for component type "unknown"'
      );
    });

    it('should include available types in error message', () => {
      registry.registerRenderer('code-block', () => '');
      registry.registerRenderer('list', () => '');

      expect(() => registry.getRenderer('unknown')).toThrow(
        'Available types: code-block, list'
      );
    });

    it('should return functional renderer that produces correct output', () => {
      const codeRenderer: ComponentRenderer<CodeBlock> = (component) =>
        `<pre><code class="${component.language}">${component.code}</code></pre>`;

      registry.registerRenderer('code-block', codeRenderer);

      const renderer = registry.getRenderer('code-block');
      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x = 1;',
      };

      const result = renderer(component);

      expect(result).toBe(
        '<pre><code class="typescript">const x = 1;</code></pre>'
      );
    });
  });

  describe('hasRenderer', () => {
    it('should return true for registered renderer', () => {
      registry.registerRenderer('code-block', () => '');

      expect(registry.hasRenderer('code-block')).toBe(true);
    });

    it('should return false for unregistered renderer', () => {
      expect(registry.hasRenderer('unknown')).toBe(false);
    });

    it('should return true after registration', () => {
      expect(registry.hasRenderer('list')).toBe(false);

      registry.registerRenderer('list', () => '');

      expect(registry.hasRenderer('list')).toBe(true);
    });
  });

  describe('getRegisteredTypes', () => {
    it('should return empty array when no renderers registered', () => {
      expect(registry.getRegisteredTypes()).toEqual([]);
    });

    it('should return all registered types', () => {
      registry.registerRenderer('code-block', () => '');
      registry.registerRenderer('list', () => '');
      registry.registerRenderer('callout', () => '');

      const types = registry.getRegisteredTypes();

      expect(types).toHaveLength(3);
      expect(types).toContain('code-block');
      expect(types).toContain('list');
      expect(types).toContain('callout');
    });

    it('should not include duplicates after overwriting', () => {
      registry.registerRenderer('test', () => 'v1');
      registry.registerRenderer('test', () => 'v2');

      const types = registry.getRegisteredTypes();

      expect(types).toEqual(['test']);
    });
  });

  describe('clear', () => {
    it('should remove all registered renderers', () => {
      registry.registerRenderer('code-block', () => '');
      registry.registerRenderer('list', () => '');
      registry.registerRenderer('callout', () => '');

      registry.clear();

      expect(registry.count()).toBe(0);
      expect(registry.hasRenderer('code-block')).toBe(false);
      expect(registry.hasRenderer('list')).toBe(false);
      expect(registry.hasRenderer('callout')).toBe(false);
    });

    it('should allow re-registration after clear', () => {
      registry.registerRenderer('test', () => 'v1');
      registry.clear();
      registry.registerRenderer('test', () => 'v2');

      expect(registry.hasRenderer('test')).toBe(true);
      expect(registry.count()).toBe(1);
    });
  });

  describe('count', () => {
    it('should return 0 when no renderers registered', () => {
      expect(registry.count()).toBe(0);
    });

    it('should return correct count after registration', () => {
      registry.registerRenderer('code-block', () => '');
      expect(registry.count()).toBe(1);

      registry.registerRenderer('list', () => '');
      expect(registry.count()).toBe(2);

      registry.registerRenderer('callout', () => '');
      expect(registry.count()).toBe(3);
    });

    it('should not increase count when overwriting', () => {
      registry.registerRenderer('test', () => 'v1');
      registry.registerRenderer('test', () => 'v2');

      expect(registry.count()).toBe(1);
    });

    it('should return 0 after clear', () => {
      registry.registerRenderer('test1', () => '');
      registry.registerRenderer('test2', () => '');

      registry.clear();

      expect(registry.count()).toBe(0);
    });
  });

  describe('type safety', () => {
    it('should work with CodeBlock renderer', () => {
      const codeRenderer: ComponentRenderer<CodeBlock> = (component) => {
        return `<code class="${component.language}">${component.code}</code>`;
      };

      registry.registerRenderer('code-block', codeRenderer);

      const renderer = registry.getRenderer('code-block');
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("test");',
      };

      const result = renderer(component);

      expect(result).toContain('javascript');
      expect(result).toContain('console.log("test");');
    });

    it('should work with List renderer', () => {
      const listRenderer: ComponentRenderer<List> = (component) => {
        const items = component.items.map((item) => `<li>${item.text}</li>`).join('');
        return `<ul class="${component.variant}">${items}</ul>`;
      };

      registry.registerRenderer('list', listRenderer);

      const renderer = registry.getRenderer('list');
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
      };

      const result = renderer(component);

      expect(result).toContain('bullet');
      expect(result).toContain('Item 1');
      expect(result).toContain('Item 2');
    });

    it('should work with Callout renderer', () => {
      const calloutRenderer: ComponentRenderer<Callout> = (component) => {
        return `<div class="callout callout-${component.calloutType}">${component.content}</div>`;
      };

      registry.registerRenderer('callout', calloutRenderer);

      const renderer = registry.getRenderer('callout');
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'Be careful!',
      };

      const result = renderer(component);

      expect(result).toContain('callout-warning');
      expect(result).toContain('Be careful!');
    });

    it('should work with Image renderer', () => {
      const imageRenderer: ComponentRenderer<Image> = (component) => {
        return `<img src="${component.src}" alt="${component.alt}" class="${component.fitMode || 'contain'}" />`;
      };

      registry.registerRenderer('image', imageRenderer);

      const renderer = registry.getRenderer('image');
      const component: Image = {
        type: 'image',
        src: '/test.jpg',
        alt: 'Test image',
        fitMode: 'cover',
      };

      const result = renderer(component);

      expect(result).toContain('/test.jpg');
      expect(result).toContain('Test image');
      expect(result).toContain('cover');
    });
  });
});

describe('componentRegistry singleton', () => {
  beforeEach(() => {
    componentRegistry.clear();
  });

  it('should be a ComponentRegistry instance', () => {
    expect(componentRegistry).toBeInstanceOf(ComponentRegistry);
  });

  it('should work as a global singleton', () => {
    componentRegistry.registerRenderer('test', () => 'test output');

    expect(componentRegistry.hasRenderer('test')).toBe(true);

    const renderer = componentRegistry.getRenderer('test');
    expect(renderer({} as PresentationComponent)).toBe('test output');
  });

  it('should maintain state across multiple accesses', () => {
    componentRegistry.registerRenderer('code-block', () => 'code');
    componentRegistry.registerRenderer('list', () => 'list');

    expect(componentRegistry.count()).toBe(2);
    expect(componentRegistry.getRegisteredTypes()).toHaveLength(2);
  });
});
