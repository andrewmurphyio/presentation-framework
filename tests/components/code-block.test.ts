import { describe, it, expect, beforeEach } from 'vitest';
import { renderCodeBlock, registerCodeBlockRenderer } from '@/lib/components/code-block';
import { componentRegistry } from '@/lib/components/component-registry';
import type { CodeBlock } from '@/lib/types/component';

describe('CodeBlock Component', () => {
  beforeEach(() => {
    componentRegistry.clear();
    registerCodeBlockRenderer();
  });

  describe('renderCodeBlock', () => {
    it('should render basic code block with language', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("Hello");',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('language-javascript');
      expect(result).toContain('console.log(&quot;Hello&quot;);');
      expect(result).toContain('code-block-container');
    });

    it('should escape HTML in code content', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'html',
        code: '<script>alert("XSS")</script>',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&lt;/script&gt;');
      expect(result).not.toContain('<script>');
    });

    it('should show language label', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x: number = 42;',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('code-language');
      expect(result).toContain('typescript');
    });

    it('should include custom id if provided', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'python',
        code: 'print("test")',
        id: 'my-code-block',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('id="my-code-block"');
    });

    it('should include custom className if provided', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'rust',
        code: 'fn main() {}',
        className: 'custom-code-style',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('custom-code-style');
    });
  });

  describe('line numbers', () => {
    it('should not show line numbers by default', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;\nconst y = 2;',
      };

      const result = renderCodeBlock(component);

      expect(result).not.toContain('line-numbers');
      expect(result).not.toContain('with-line-numbers');
    });

    it('should show line numbers when enabled', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;\nconst y = 2;\nconst z = 3;',
        showLineNumbers: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('line-numbers');
      expect(result).toContain('with-line-numbers');
      expect(result).toContain('line-number');
    });

    it('should generate correct number of line numbers', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'python',
        code: 'line1\nline2\nline3\nline4\nline5',
        showLineNumbers: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('>1<');
      expect(result).toContain('>2<');
      expect(result).toContain('>3<');
      expect(result).toContain('>4<');
      expect(result).toContain('>5<');
    });

    it('should handle single line with line numbers', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'bash',
        code: 'echo "hello"',
        showLineNumbers: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('>1<');
      expect(result).not.toContain('>2<');
    });
  });

  describe('line highlighting', () => {
    it('should not highlight lines by default', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;\nconst y = 2;',
        showLineNumbers: true,
      };

      const result = renderCodeBlock(component);

      expect(result).not.toContain('highlighted-line');
    });

    it('should highlight specified lines', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'line1\nline2\nline3\nline4',
        showLineNumbers: true,
        highlightLines: [2, 4],
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('highlighted-line');
      // Should have exactly 2 highlighted lines
      const highlightedCount = (result.match(/highlighted-line/g) || []).length;
      expect(highlightedCount).toBe(2);
    });

    it('should highlight single line', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'python',
        code: 'def hello():\n    print("world")\n    return True',
        showLineNumbers: true,
        highlightLines: [2],
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('highlighted-line');
      const highlightedCount = (result.match(/highlighted-line/g) || []).length;
      expect(highlightedCount).toBe(1);
    });

    it('should work without line numbers', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;\nconst y = 2;',
        showLineNumbers: false,
        highlightLines: [1],
      };

      const result = renderCodeBlock(component);

      // Highlighting only works with line numbers enabled
      expect(result).not.toContain('highlighted-line');
    });
  });

  describe('caption', () => {
    it('should not show caption by default', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;',
      };

      const result = renderCodeBlock(component);

      expect(result).not.toContain('code-caption');
      expect(result).not.toContain('figcaption');
    });

    it('should show caption when provided', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'const x: number = 42;',
        caption: 'Example: Type annotations',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('code-caption');
      expect(result).toContain('figcaption');
      expect(result).toContain('Example: Type annotations');
    });

    it('should escape HTML in caption', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'html',
        code: '<div></div>',
        caption: 'Using <div> tags',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('Using &lt;div&gt; tags');
      expect(result).not.toContain('Using <div> tags');
    });
  });

  describe('copy button', () => {
    it('should not show copy button by default', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = 1;',
      };

      const result = renderCodeBlock(component);

      expect(result).not.toContain('copy-button');
    });

    it('should show copy button when enabled', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'console.log("test");',
        showCopyButton: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('copy-button');
      expect(result).toContain('aria-label="Copy code"');
    });

    it('should include code in data attribute for copying', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'python',
        code: 'print("hello world")',
        showCopyButton: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('data-code=');
      expect(result).toContain('print(&quot;hello world&quot;)');
    });

    it('should escape HTML in copy data attribute', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'html',
        code: '<script>alert("test")</script>',
        showCopyButton: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('data-code=');
      // Should be double-escaped in attribute
      expect(result).not.toContain('data-code="<script>');
    });
  });

  describe('integration with all features', () => {
    it('should render with all features enabled', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'typescript',
        code: 'function add(a: number, b: number): number {\n  return a + b;\n}',
        showLineNumbers: true,
        highlightLines: [2],
        caption: 'Simple addition function',
        showCopyButton: true,
        id: 'add-function',
        className: 'featured-code',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('id="add-function"');
      expect(result).toContain('featured-code');
      expect(result).toContain('language-typescript');
      expect(result).toContain('line-numbers');
      expect(result).toContain('highlighted-line');
      expect(result).toContain('Simple addition function');
      expect(result).toContain('copy-button');
    });

    it('should handle multi-line code with all features', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: `const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
  return true;
};

greet('World');`,
        showLineNumbers: true,
        highlightLines: [2, 6],
        caption: 'Arrow function example',
        showCopyButton: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('>1<');
      expect(result).toContain('>6<');
      expect(result).toContain('highlighted-line');
      expect(result).toContain('Arrow function example');
      expect(result).toContain('copy-button');
    });
  });

  describe('registry integration', () => {
    it('should register renderer with component registry', () => {
      expect(componentRegistry.hasRenderer('code-block')).toBe(true);
    });

    it('should render via component registry', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'rust',
        code: 'fn main() { println!("Hello"); }',
      };

      const renderer = componentRegistry.getRenderer('code-block');
      const result = renderer(component);

      expect(result).toContain('language-rust');
      expect(result).toContain('println!');
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'text',
        code: '',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('language-text');
      expect(result).toContain('<code');
    });

    it('should handle code with special characters', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: 'const x = "test & <test>";',
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should handle code with quotes', () => {
      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: `const x = "double";
const y = 'single';`,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('&quot;');
      expect(result).toContain('&#039;');
    });

    it('should handle very long code', () => {
      const longCode = Array(100)
        .fill('console.log("line");')
        .join('\n');

      const component: CodeBlock = {
        type: 'code-block',
        language: 'javascript',
        code: longCode,
        showLineNumbers: true,
      };

      const result = renderCodeBlock(component);

      expect(result).toContain('>100<');
      expect(result).toContain('line-numbers');
    });
  });
});
