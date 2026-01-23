import type { Callout } from '../types/component';
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
 * Get the icon SVG for a callout type
 */
function getCalloutIcon(type: string): string {
  const icons = {
    info: `<svg class="callout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
  <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
    warning: `<svg class="callout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 10V14M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
    success: `<svg class="callout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
  <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    error: `<svg class="callout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
  <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  };

  return icons[type as keyof typeof icons] || icons.info;
}

/**
 * Render a Callout component to HTML
 *
 * Features:
 * - Four types: info, warning, success, error
 * - Optional title
 * - Automatic icon based on type
 * - Themed colors via CSS classes
 * - Semantic HTML with role attributes
 */
export function renderCallout(component: Callout): string {
  const { calloutType, title, content, id, className } = component;

  // Build classes
  const containerClasses = [
    'callout-container',
    `callout-${calloutType}`,
  ];
  if (className) {
    containerClasses.push(className);
  }

  // Get the appropriate icon
  const icon = getCalloutIcon(calloutType);

  // Render title if provided
  const titleHtml = title
    ? `<div class="callout-title">${escapeHtml(title)}</div>`
    : '';

  // Escape content
  const escapedContent = escapeHtml(content);

  // Determine ARIA role based on type
  const ariaRole =
    calloutType === 'error' || calloutType === 'warning' ? 'alert' : 'status';

  // Build the complete HTML structure
  return `<div class="${containerClasses.join(' ')}"${id ? ` id="${escapeHtml(id)}"` : ''} role="${ariaRole}">
  <div class="callout-header">
    ${icon}
    ${titleHtml}
  </div>
  <div class="callout-content">
    ${escapedContent}
  </div>
</div>`;
}

/**
 * Register the Callout renderer with the global component registry
 */
export function registerCalloutRenderer(): void {
  componentRegistry.registerRenderer('callout', renderCallout);
}

// Auto-register when module is imported
registerCalloutRenderer();
