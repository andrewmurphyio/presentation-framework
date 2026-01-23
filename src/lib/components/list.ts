import type { List, ListItem } from '../types/component';
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
 * Render a single list item with optional nesting
 */
function renderListItem(item: ListItem, variant: string, level: number = 0): string {
  const escapedText = escapeHtml(item.text);

  // Handle checklist variant
  if (variant === 'checklist') {
    const checked = item.checked ? ' checked' : '';
    const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const children = item.children
      ? `\n<ul class="list-nested list-nested-level-${level + 1}">\n${item.children
          .map((child) => renderListItem(child, variant, level + 1))
          .join('\n')}\n</ul>`
      : '';

    return `<li class="list-item list-item-checklist">
  <input type="checkbox" id="${checkboxId}" class="list-checkbox"${checked} disabled>
  <label for="${checkboxId}" class="list-label">${escapedText}</label>${children}
</li>`;
  }

  // Handle bullet and numbered variants
  const children = item.children
    ? `\n<${variant === 'numbered' ? 'ol' : 'ul'} class="list-nested list-nested-level-${
        level + 1
      }">\n${item.children
        .map((child) => renderListItem(child, variant, level + 1))
        .join('\n')}\n</${variant === 'numbered' ? 'ol' : 'ul'}>`
    : '';

  return `<li class="list-item">${escapedText}${children}</li>`;
}

/**
 * Render a List component to HTML
 *
 * Features:
 * - Three variants: bullet, numbered, checklist
 * - Nested list support (unlimited depth)
 * - Checkbox state for checklist variant
 * - Proper semantic HTML (ul/ol)
 * - Custom id and className support
 */
export function renderList(component: List): string {
  const { variant, items, id, className } = component;

  // Build classes
  const containerClasses = ['list-container', `list-${variant}`];
  if (className) {
    containerClasses.push(className);
  }

  // Choose the appropriate list tag
  const listTag = variant === 'numbered' ? 'ol' : 'ul';

  // Render all items
  const itemsHtml = items.map((item) => renderListItem(item, variant, 0)).join('\n');

  // Build the complete HTML structure
  return `<div class="${containerClasses.join(' ')}"${id ? ` id="${escapeHtml(id)}"` : ''}>
  <${listTag} class="list list-level-0">
${itemsHtml}
  </${listTag}>
</div>`;
}

/**
 * Register the List renderer with the global component registry
 */
export function registerListRenderer(): void {
  componentRegistry.registerRenderer('list', renderList);
}

// Auto-register when module is imported
registerListRenderer();
