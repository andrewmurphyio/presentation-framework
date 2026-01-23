import { describe, it, expect } from 'vitest';
import type {
  Component,
  CodeBlock,
  List,
  ListVariant,
  ListItem,
  Callout,
  CalloutType,
  Image,
  ImageFitMode,
  PresentationComponent,
} from '@/lib/types/component';

describe('Component Types', () => {
  describe('CodeBlock', () => {
    it('should create a valid code block component', () => {
      const codeBlock: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x = 1;',
      };

      expect(codeBlock.type).toBe('code-block');
      expect(codeBlock.language).toBe('typescript');
      expect(codeBlock.code).toBe('const x = 1;');
    });

    it('should support optional properties', () => {
      const codeBlock: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("hello");',
        showLineNumbers: true,
        highlightLines: [1, 3, 5],
        caption: 'Example code',
        showCopyButton: true,
        id: 'code-1',
        className: 'custom-code',
      };

      expect(codeBlock.showLineNumbers).toBe(true);
      expect(codeBlock.highlightLines).toEqual([1, 3, 5]);
      expect(codeBlock.caption).toBe('Example code');
      expect(codeBlock.showCopyButton).toBe(true);
      expect(codeBlock.id).toBe('code-1');
      expect(codeBlock.className).toBe('custom-code');
    });
  });

  describe('List', () => {
    it('should create a bullet list', () => {
      const list: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          { text: 'Item 1' },
          { text: 'Item 2' },
          { text: 'Item 3' },
        ],
      };

      expect(list.type).toBe('list');
      expect(list.variant).toBe('bullet');
      expect(list.items).toHaveLength(3);
    });

    it('should create a numbered list', () => {
      const list: List = {
        type: 'list',
        variant: 'numbered',
        items: [
          { text: 'First step' },
          { text: 'Second step' },
        ],
      };

      expect(list.variant).toBe('numbered');
    });

    it('should create a checklist', () => {
      const list: List = {
        type: 'list',
        variant: 'checklist',
        items: [
          { text: 'Done task', checked: true },
          { text: 'Pending task', checked: false },
        ],
      };

      expect(list.variant).toBe('checklist');
      expect(list.items[0].checked).toBe(true);
      expect(list.items[1].checked).toBe(false);
    });

    it('should support nested lists', () => {
      const list: List = {
        type: 'list',
        variant: 'bullet',
        items: [
          {
            text: 'Parent item',
            children: [
              { text: 'Child 1' },
              { text: 'Child 2' },
            ],
          },
        ],
      };

      expect(list.items[0].children).toHaveLength(2);
      expect(list.items[0].children?.[0].text).toBe('Child 1');
    });

    it('should accept valid list variants', () => {
      const variants: ListVariant[] = ['bullet', 'numbered', 'checklist'];

      variants.forEach((variant) => {
        const list: List = {
          type: 'list',
          variant,
          items: [{ text: 'Test' }],
        };

        expect(list.variant).toBe(variant);
      });
    });
  });

  describe('Callout', () => {
    it('should create an info callout', () => {
      const callout: Callout = {
        type: 'callout',
        calloutType: 'info',
        content: 'This is informational',
      };

      expect(callout.type).toBe('callout');
      expect(callout.calloutType).toBe('info');
      expect(callout.content).toBe('This is informational');
    });

    it('should create a warning callout', () => {
      const callout: Callout = {
        type: 'callout',
        calloutType: 'warning',
        content: 'Be careful!',
        title: 'Warning',
      };

      expect(callout.calloutType).toBe('warning');
      expect(callout.title).toBe('Warning');
    });

    it('should create a success callout', () => {
      const callout: Callout = {
        type: 'callout',
        calloutType: 'success',
        content: 'All done!',
      };

      expect(callout.calloutType).toBe('success');
    });

    it('should create an error callout', () => {
      const callout: Callout = {
        type: 'callout',
        calloutType: 'error',
        content: 'Something went wrong',
        title: 'Error',
      };

      expect(callout.calloutType).toBe('error');
    });

    it('should accept all valid callout types', () => {
      const types: CalloutType[] = ['info', 'warning', 'success', 'error'];

      types.forEach((calloutType) => {
        const callout: Callout = {
          type: 'callout',
          calloutType,
          content: 'Test content',
        };

        expect(callout.calloutType).toBe(calloutType);
      });
    });
  });

  describe('Image', () => {
    it('should create a basic image component', () => {
      const image: Image = {
        type: 'image',
        src: '/path/to/image.jpg',
        alt: 'Description',
      };

      expect(image.type).toBe('image');
      expect(image.src).toBe('/path/to/image.jpg');
      expect(image.alt).toBe('Description');
    });

    it('should support fit modes', () => {
      const imageCover: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Cover image',
        fitMode: 'cover',
      };

      expect(imageCover.fitMode).toBe('cover');

      const imageContain: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Contain image',
        fitMode: 'contain',
      };

      expect(imageContain.fitMode).toBe('contain');

      const imageOriginal: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Original image',
        fitMode: 'original',
      };

      expect(imageOriginal.fitMode).toBe('original');
    });

    it('should support caption and lazy loading', () => {
      const image: Image = {
        type: 'image',
        src: '/image.jpg',
        alt: 'Test image',
        caption: 'Figure 1: Example',
        lazyLoad: true,
      };

      expect(image.caption).toBe('Figure 1: Example');
      expect(image.lazyLoad).toBe(true);
    });

    it('should accept all valid fit modes', () => {
      const modes: ImageFitMode[] = ['contain', 'cover', 'original'];

      modes.forEach((fitMode) => {
        const image: Image = {
          type: 'image',
          src: '/test.jpg',
          alt: 'Test',
          fitMode,
        };

        expect(image.fitMode).toBe(fitMode);
      });
    });
  });

  describe('Component base interface', () => {
    it('should support common base properties', () => {
      const component: Component = {
        type: 'custom',
        id: 'comp-1',
        className: 'custom-class',
      };

      expect(component.type).toBe('custom');
      expect(component.id).toBe('comp-1');
      expect(component.className).toBe('custom-class');
    });
  });

  describe('PresentationComponent union type', () => {
    it('should accept any component type', () => {
      const codeBlock: PresentationComponent = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x = 1;',
      };

      const list: PresentationComponent = {
        type: 'list',
        variant: 'bullet',
        items: [{ text: 'Item' }],
      };

      const callout: PresentationComponent = {
        type: 'callout',
        calloutType: 'info',
        content: 'Info',
      };

      const image: PresentationComponent = {
        type: 'image',
        src: '/test.jpg',
        alt: 'Test',
      };

      expect(codeBlock.type).toBe('code-block');
      expect(list.type).toBe('list');
      expect(callout.type).toBe('callout');
      expect(image.type).toBe('image');
    });
  });

  describe('ListItem', () => {
    it('should support deeply nested lists', () => {
      const nestedItem: ListItem = {
        text: 'Level 1',
        children: [
          {
            text: 'Level 2',
            children: [
              {
                text: 'Level 3',
              },
            ],
          },
        ],
      };

      expect(nestedItem.children?.[0].children?.[0].text).toBe('Level 3');
    });
  });
});
