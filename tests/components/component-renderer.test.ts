import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRenderer, componentRenderer } from '@/lib/components/component-renderer';
import { componentRegistry } from '@/lib/components/component-registry';
import { Theme } from '@/lib/theming/theme';
import { defaultTokens } from '@/lib/design-system/default-tokens';
import type {
  PresentationComponent,
  CodeBlock,
  List,
  Callout,
  Image,
} from '@/lib/types/component';

describe('ComponentRenderer', () => {
  let renderer: ComponentRenderer;

  beforeEach(() => {
    renderer = new ComponentRenderer();
    componentRegistry.clear();
  });

  describe('setTheme', () => {
    it('should set the theme', () => {
      const theme = new Theme('test-theme', defaultTokens);

      renderer.setTheme(theme);

      expect(renderer.getTheme()).toBe(theme);
    });

    it('should update the theme when called multiple times', () => {
      const theme1 = new Theme('theme-1', defaultTokens);
      const theme2 = new Theme('theme-2', defaultTokens);

      renderer.setTheme(theme1);
      expect(renderer.getTheme()).toBe(theme1);

      renderer.setTheme(theme2);
      expect(renderer.getTheme()).toBe(theme2);
    });
  });

  describe('getTheme', () => {
    it('should return null when no theme is set', () => {
      expect(renderer.getTheme()).toBeNull();
    });

    it('should return the current theme', () => {
      const theme = new Theme('test-theme', defaultTokens);
      renderer.setTheme(theme);

      expect(renderer.getTheme()).toBe(theme);
    });
  });

  describe('clearTheme', () => {
    it('should clear the theme', () => {
      const theme = new Theme('test-theme', defaultTokens);
      renderer.setTheme(theme);

      renderer.clearTheme();

      expect(renderer.getTheme()).toBeNull();
    });
  });

  describe('render', () => {
    it('should render a component using registered renderer', () => {
      componentRegistry.registerRenderer('code-block', (component: CodeBlock) => {
        return `<code class="${component.language}">${component.code}</code>`;
      });

      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("test");',
      };

      const result = renderer.render(component);

      expect(result).toBe('<code class="javascript">console.log("test");</code>');
    });

    it('should throw error when no renderer is registered', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("test");',
      };

      expect(() => renderer.render(component)).toThrow(
        'No renderer registered for component type "code-block"'
      );
    });

    it('should render different component types', () => {
      componentRegistry.registerRenderer('code-block', (component: CodeBlock) => {
        return `<code>${component.code}</code>`;
      });

      componentRegistry.registerRenderer('list', (component: List) => {
        return `<ul>${component.items.length}</ul>`;
      });

      const codeComponent: CodeBlock = {
        type: 'code-block',
        language: 'js',
        code: 'test',
      };

      const listComponent: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
      };

      expect(renderer.render(codeComponent)).toBe('<code>test</code>');
      expect(renderer.render(listComponent)).toBe('<ul>2</ul>');
    });

    it('should render components with all properties', () => {
      componentRegistry.registerRenderer('code-block', (component: CodeBlock) => {
        const lines = component.showLineNumbers ? 'with-lines' : 'no-lines';
        const caption = component.caption || 'no-caption';
        return `<pre class="${lines}"><code>${component.code}</code><p>${caption}</p></pre>`;
      });

      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x = 1;',
        showLineNumbers: true,
        caption: 'Example code',
      };

      const result = renderer.render(component);

      expect(result).toContain('with-lines');
      expect(result).toContain('const x = 1;');
      expect(result).toContain('Example code');
    });
  });

  describe('renderMany', () => {
    beforeEach(() => {
      componentRegistry.registerRenderer('code-block', (component: CodeBlock) => {
        return `<code>${component.code}</code>`;
      });

      componentRegistry.registerRenderer('list', (component: List) => {
        return `<ul>${component.items.map((i) => `<li>${i.text}</li>`).join('')}</ul>`;
      });

      componentRegistry.registerRenderer('callout', (component: Callout) => {
        return `<div class="${component.calloutType}">${component.content}</div>`;
      });
    });

    it('should render empty array to empty string', () => {
      const result = renderer.renderMany([]);

      expect(result).toBe('');
    });

    it('should render single component', () => {
      const components: PresentationComponent[] = [
        {
          type: 'code-block',
          language: 'js',
          code: 'test',
        },
      ];

      const result = renderer.renderMany(components);

      expect(result).toBe('<code>test</code>');
    });

    it('should render multiple components of same type', () => {
      const components: PresentationComponent[] = [
        {
          type: 'code-block',
          language: 'js',
          code: 'code1',
        },
        {
          type: 'code-block',
          language: 'js',
          code: 'code2',
        },
      ];

      const result = renderer.renderMany(components);

      expect(result).toBe('<code>code1</code>\n<code>code2</code>');
    });

    it('should render multiple components of different types', () => {
      const components: PresentationComponent[] = [
        {
          type: 'code-block',
          language: 'js',
          code: 'test',
        },
        {
          type: 'list',
          variant: 'bullet',
          items: [{ text: 'Item' }],
        },
        {
          type: 'callout',
          calloutType: 'info',
          content: 'Note',
        },
      ];

      const result = renderer.renderMany(components);

      expect(result).toContain('<code>test</code>');
      expect(result).toContain('<ul><li>Item</li></ul>');
      expect(result).toContain('<div class="info">Note</div>');
    });

    it('should maintain order when rendering', () => {
      const components: PresentationComponent[] = [
        {
          type: 'callout',
          calloutType: 'info',
          content: 'First',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content: 'Second',
        },
        {
          type: 'callout',
          calloutType: 'error',
          content: 'Third',
        },
      ];

      const result = renderer.renderMany(components);

      const firstIndex = result.indexOf('First');
      const secondIndex = result.indexOf('Second');
      const thirdIndex = result.indexOf('Third');

      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });
  });

  describe('canRender', () => {
    it('should return false when no renderer is registered', () => {
      expect(renderer.canRender('code-block')).toBe(false);
    });

    it('should return true when renderer is registered', () => {
      componentRegistry.registerRenderer('code-block', () => '');

      expect(renderer.canRender('code-block')).toBe(true);
    });

    it('should return correct values for multiple types', () => {
      componentRegistry.registerRenderer('code-block', () => '');
      componentRegistry.registerRenderer('list', () => '');

      expect(renderer.canRender('code-block')).toBe(true);
      expect(renderer.canRender('list')).toBe(true);
      expect(renderer.canRender('callout')).toBe(false);
      expect(renderer.canRender('image')).toBe(false);
    });
  });

  describe('registerRenderer', () => {
    it('should register a renderer via ComponentRenderer', () => {
      renderer.registerRenderer('code-block', (component: CodeBlock) => {
        return `<code>${component.code}</code>`;
      });

      expect(renderer.canRender('code-block')).toBe(true);
      expect(componentRegistry.hasRenderer('code-block')).toBe(true);
    });

    it('should allow rendering after registration', () => {
      renderer.registerRenderer('list', (component: List) => {
        return `<ul>${component.items.length} items</ul>`;
      });

      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
      };

      const result = renderer.render(component);

      expect(result).toBe('<ul>2 items</ul>');
    });
  });

  describe('getRenderableTypes', () => {
    it('should return empty array when no renderers registered', () => {
      expect(renderer.getRenderableTypes()).toEqual([]);
    });

    it('should return all registered types', () => {
      renderer.registerRenderer('code-block', () => '');
      renderer.registerRenderer('list', () => '');
      renderer.registerRenderer('callout', () => '');

      const types = renderer.getRenderableTypes();

      expect(types).toHaveLength(3);
      expect(types).toContain('code-block');
      expect(types).toContain('list');
      expect(types).toContain('callout');
    });
  });

  describe('integration with all component types', () => {
    beforeEach(() => {
      // Register renderers for all component types
      componentRegistry.registerRenderer('code-block', (component: CodeBlock) => {
        return `<pre class="${component.language}">${component.code}</pre>`;
      });

      componentRegistry.registerRenderer('list', (component: List) => {
        const items = component.items
          .map((item) => `<li>${item.text}</li>`)
          .join('');
        return `<${component.variant === 'numbered' ? 'ol' : 'ul'}>${items}</${component.variant === 'numbered' ? 'ol' : 'ul'}>`;
      });

      componentRegistry.registerRenderer('callout', (component: Callout) => {
        const title = component.title ? `<h3>${component.title}</h3>` : '';
        return `<div class="callout-${component.calloutType}">${title}<p>${component.content}</p></div>`;
      });

      componentRegistry.registerRenderer('image', (component: Image) => {
        const caption = component.caption
          ? `<figcaption>${component.caption}</figcaption>`
          : '';
        return `<figure><img src="${component.src}" alt="${component.alt}" class="${component.fitMode || 'contain'}" />${caption}</figure>`;
      });
    });

    it('should render CodeBlock', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x: number = 42;',
      };

      const result = renderer.render(component);

      expect(result).toBe('<pre class="typescript">const x: number = 42;</pre>');
    });

    it('should render List', () => {
      const component: List = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'First' }, { text: 'Second' }],
      };

      const result = renderer.render(component);

      expect(result).toBe('<ul><li>First</li><li>Second</li></ul>');
    });

    it('should render Callout', () => {
      const component: Callout = {
        type: 'callout',
        calloutType: 'warning',
        title: 'Warning',
        content: 'Be careful!',
      };

      const result = renderer.render(component);

      expect(result).toContain('callout-warning');
      expect(result).toContain('<h3>Warning</h3>');
      expect(result).toContain('Be careful!');
    });

    it('should render Image', () => {
      const component: Image = {
        type: 'image',
        src: '/path/to/image.jpg',
        alt: 'Test image',
        fitMode: 'cover',
        caption: 'Figure 1',
      };

      const result = renderer.render(component);

      expect(result).toContain('/path/to/image.jpg');
      expect(result).toContain('Test image');
      expect(result).toContain('cover');
      expect(result).toContain('Figure 1');
    });

    it('should render mixed component types together', () => {
      const components: PresentationComponent[] = [
        {
          type: 'callout',
          calloutType: 'info',
          content: 'Introduction',
        },
        {
          type: 'code-block',
          language: 'javascript',
          code: 'console.log("Hello");',
        },
        {
          type: 'list',
          variant: 'numbered',
          items: [{ text: 'Step 1' }, { text: 'Step 2' }],
        },
        {
          type: 'image',
          src: '/diagram.png',
          alt: 'Diagram',
        },
      ];

      const result = renderer.renderMany(components);

      expect(result).toContain('callout-info');
      expect(result).toContain('console.log("Hello")');
      expect(result).toContain('<ol><li>Step 1</li><li>Step 2</li></ol>');
      expect(result).toContain('/diagram.png');
    });
  });
});

describe('componentRenderer singleton', () => {
  beforeEach(() => {
    componentRenderer.clearTheme();
    componentRegistry.clear();
  });

  it('should be a ComponentRenderer instance', () => {
    expect(componentRenderer).toBeInstanceOf(ComponentRenderer);
  });

  it('should work as a global singleton', () => {
    const theme = new Theme('test', defaultTokens);

    componentRenderer.setTheme(theme);

    expect(componentRenderer.getTheme()).toBe(theme);
  });

  it('should render components using singleton', () => {
    componentRenderer.registerRenderer('test', () => 'test output');

    const result = componentRenderer.render({
      type: 'test',
    } as PresentationComponent);

    expect(result).toBe('test output');
  });
});
