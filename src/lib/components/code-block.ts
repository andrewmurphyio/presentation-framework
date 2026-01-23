import type { CodeBlock } from '../types/component';
import { componentRegistry } from './component-registry';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render a CodeBlock component to HTML
 *
 * Features:
 * - Syntax highlighting via language class (for integration with highlight.js, prism, etc.)
 * - Optional line numbers
 * - Optional line highlighting
 * - Optional caption
 * - Optional copy button
 */
export function renderCodeBlock(component: CodeBlock): string {
  const {
    language,
    code,
    showLineNumbers = false,
    highlightLines = [],
    caption,
    showCopyButton = false,
    id,
    className,
  } = component;

  // Escape the code content
  const escapedCode = escapeHtml(code);

  // Split code into lines for line number rendering
  const lines = escapedCode.split('\n');

  // Build classes
  const containerClasses = ['code-block-container'];
  if (className) {
    containerClasses.push(className);
  }

  const preClasses = ['code-block'];
  if (showLineNumbers) {
    preClasses.push('with-line-numbers');
  }

  const codeClasses = [`language-${language}`];

  // Generate line number column if enabled
  const lineNumbersHtml = showLineNumbers
    ? `<div class="line-numbers" aria-hidden="true">
${lines.map((_, index) => `<span class="line-number">${index + 1}</span>`).join('\n')}
</div>`
    : '';

  // Generate code with optional line highlighting
  const codeHtml = showLineNumbers
    ? lines
        .map((line, index) => {
          const lineNum = index + 1;
          const isHighlighted = highlightLines.includes(lineNum);
          const lineClass = isHighlighted ? ' class="highlighted-line"' : '';
          return `<span${lineClass}>${line}</span>`;
        })
        .join('\n')
    : escapedCode;

  // Generate copy button if enabled
  const copyButtonHtml = showCopyButton
    ? `<button class="copy-button" aria-label="Copy code" data-code="${escapeHtml(code)}" onclick="navigator.clipboard.writeText(this.dataset.code)">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 4V2.5C12 1.67157 11.3284 1 10.5 1H2.5C1.67157 1 1 1.67157 1 2.5V10.5C1 11.3284 1.67157 12 2.5 12H4" stroke="currentColor" stroke-width="1.5"/>
  </svg>
</button>`
    : '';

  // Generate caption if provided
  const captionHtml = caption
    ? `<figcaption class="code-caption">${escapeHtml(caption)}</figcaption>`
    : '';

  // Build the complete HTML structure
  return `<figure class="${containerClasses.join(' ')}"${id ? ` id="${escapeHtml(id)}"` : ''}>
  <div class="code-block-header">
    <span class="code-language">${escapeHtml(language)}</span>
    ${copyButtonHtml}
  </div>
  <div class="code-block-content">
    ${lineNumbersHtml}
    <pre class="${preClasses.join(' ')}"><code class="${codeClasses.join(' ')}">${codeHtml}</code></pre>
  </div>
  ${captionHtml}
</figure>`;
}

/**
 * Register the CodeBlock renderer with the global component registry
 */
export function registerCodeBlockRenderer(): void {
  componentRegistry.registerRenderer('code-block', renderCodeBlock);
}

// Auto-register when module is imported
registerCodeBlockRenderer();
