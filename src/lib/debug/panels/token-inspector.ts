import type { DebugThemeInfo, DebugPanelPosition } from '../../types/debug';

/**
 * TokenInspector displays design tokens in the debug overlay
 *
 * Shows:
 * - All active design tokens organized by category
 * - Token names and computed values
 * - Overridden tokens highlighted
 * - Copy-to-clipboard functionality
 *
 * Features:
 * - Collapsible sections by token category
 * - Click to copy token name or value
 * - Configurable position
 * - Auto-updates on theme change
 */
export class TokenInspector {
  private container: HTMLElement | null = null;
  private position: DebugPanelPosition;
  private collapsed: boolean = false;
  private collapsedSections: Set<string> = new Set();

  /**
   * Create a new TokenInspector
   *
   * @param position - Panel position (top-left, top-right, bottom-left, bottom-right)
   */
  constructor(position: DebugPanelPosition = 'top-right') {
    this.position = position;
  }

  /**
   * Render the panel and return the DOM element
   *
   * @param themeInfo - Theme debug information to display
   * @returns Panel container element
   */
  render(themeInfo: DebugThemeInfo): HTMLElement {
    this.container = this.createPanelContainer();
    this.updateContent(themeInfo);
    return this.container;
  }

  /**
   * Update panel content with new theme info
   *
   * @param themeInfo - New theme information
   */
  update(themeInfo: DebugThemeInfo): void {
    if (!this.container) return;
    this.updateContent(themeInfo);
  }

  /**
   * Toggle panel collapsed state
   */
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    if (this.container) {
      const content = this.container.querySelector(
        '.pf-debug-panel-content'
      ) as HTMLElement;
      if (content) {
        content.style.display = this.collapsed ? 'none' : 'block';
      }
    }
  }

  /**
   * Toggle a section's collapsed state
   *
   * @param section - Section name to toggle
   */
  toggleSection(section: string): void {
    if (this.collapsedSections.has(section)) {
      this.collapsedSections.delete(section);
    } else {
      this.collapsedSections.add(section);
    }
  }

  /**
   * Check if a section is collapsed
   *
   * @param section - Section name to check
   * @returns True if collapsed
   */
  isSectionCollapsed(section: string): boolean {
    return this.collapsedSections.has(section);
  }

  /**
   * Copy text to clipboard
   *
   * @param text - Text to copy
   * @returns Promise that resolves when copy is complete
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  /**
   * Destroy the panel and clean up
   */
  destroy(): void {
    if (this.container?.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.container = null;
    this.collapsedSections.clear();
  }

  /**
   * Get the panel container element
   */
  getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * Create the panel container with base styles
   */
  private createPanelContainer(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'pf-debug-panel pf-debug-token-inspector';
    panel.setAttribute('data-position', this.position);

    // Apply base panel styles
    panel.style.position = 'absolute';
    panel.style.background = 'rgba(0, 0, 0, 0.85)';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'Monaco, Courier New, monospace';
    panel.style.fontSize = '12px';
    panel.style.padding = '12px';
    panel.style.borderRadius = '4px';
    panel.style.maxWidth = '400px';
    panel.style.maxHeight = '600px';
    panel.style.overflowY = 'auto';
    panel.style.pointerEvents = 'auto';
    panel.style.zIndex = '10000';

    // Position based on setting
    this.applyPosition(panel);

    return panel;
  }

  /**
   * Apply position styles to panel
   */
  private applyPosition(panel: HTMLElement): void {
    switch (this.position) {
      case 'top-left':
        panel.style.top = '12px';
        panel.style.left = '12px';
        break;
      case 'top-right':
        panel.style.top = '12px';
        panel.style.right = '12px';
        break;
      case 'bottom-left':
        panel.style.bottom = '12px';
        panel.style.left = '12px';
        break;
      case 'bottom-right':
        panel.style.bottom = '12px';
        panel.style.right = '12px';
        break;
    }
  }

  /**
   * Update panel content with theme information
   */
  private updateContent(themeInfo: DebugThemeInfo): void {
    if (!this.container) return;

    const header = this.createHeader();
    const content = this.createContent(themeInfo);

    this.container.innerHTML = '';
    this.container.appendChild(header);
    this.container.appendChild(content);
  }

  /**
   * Create panel header
   */
  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'pf-debug-panel-header';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '8px';
    header.style.cursor = 'pointer';
    header.textContent = 'Design Tokens';

    header.addEventListener('click', () => this.toggleCollapse());

    return header;
  }

  /**
   * Create panel content
   */
  private createContent(themeInfo: DebugThemeInfo): HTMLElement {
    const content = document.createElement('div');
    content.className = 'pf-debug-panel-content';
    content.style.display = this.collapsed ? 'none' : 'block';

    // Theme name
    const name = document.createElement('div');
    name.style.marginBottom = '8px';
    name.innerHTML = `<strong>Theme:</strong> ${themeInfo.name}`;
    content.appendChild(name);

    // Base theme
    if (themeInfo.baseTheme) {
      const base = document.createElement('div');
      base.style.marginBottom = '8px';
      base.style.color = '#aaa';
      base.style.fontSize = '11px';
      base.innerHTML = `Extends: ${themeInfo.baseTheme}`;
      content.appendChild(base);
    }

    // Token categories
    const categories = [
      { name: 'colors', title: 'Colors', tokens: themeInfo.tokens.colors },
      { name: 'typography', title: 'Typography', tokens: themeInfo.tokens.typography },
      { name: 'spacing', title: 'Spacing', tokens: themeInfo.tokens.spacing },
    ];

    categories.forEach((category) => {
      const section = this.createTokenSection(
        category.name,
        category.title,
        category.tokens,
        themeInfo.overrides
      );
      content.appendChild(section);
    });

    return content;
  }

  /**
   * Create a token section
   */
  private createTokenSection(
    sectionName: string,
    title: string,
    tokens: Record<string, string>,
    overrides: string[]
  ): HTMLElement {
    const section = document.createElement('div');
    section.className = 'pf-debug-token-section';
    section.style.marginTop = '12px';

    // Section header
    const header = document.createElement('div');
    header.className = 'pf-debug-section-header';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '4px';
    header.style.cursor = 'pointer';
    header.style.userSelect = 'none';
    header.textContent = `▼ ${title} (${Object.keys(tokens).length})`;

    header.addEventListener('click', () => {
      this.toggleSection(sectionName);
      const tokenList = section.querySelector('.pf-debug-token-list') as HTMLElement;
      if (tokenList) {
        tokenList.style.display = this.isSectionCollapsed(sectionName) ? 'none' : 'block';
        header.textContent = `${this.isSectionCollapsed(sectionName) ? '▶' : '▼'} ${title} (${Object.keys(tokens).length})`;
      }
    });

    section.appendChild(header);

    // Token list
    const tokenList = document.createElement('div');
    tokenList.className = 'pf-debug-token-list';
    tokenList.style.display = this.isSectionCollapsed(sectionName) ? 'none' : 'block';
    tokenList.style.paddingLeft = '8px';

    Object.entries(tokens).forEach(([key, value]) => {
      const tokenItem = this.createTokenItem(key, value, overrides.includes(key));
      tokenList.appendChild(tokenItem);
    });

    section.appendChild(tokenList);

    return section;
  }

  /**
   * Create a token item
   */
  private createTokenItem(key: string, value: string, isOverridden: boolean): HTMLElement {
    const item = document.createElement('div');
    item.className = 'pf-debug-token-item';
    item.style.marginBottom = '4px';
    item.style.padding = '4px';
    item.style.borderRadius = '2px';
    item.style.fontSize = '11px';

    if (isOverridden) {
      item.style.background = 'rgba(255, 215, 0, 0.15)';
      item.style.borderLeft = '2px solid #ffd700';
      item.style.paddingLeft = '6px';
    }

    // Token name
    const nameEl = document.createElement('div');
    nameEl.style.color = '#8be9fd';
    nameEl.style.marginBottom = '2px';
    nameEl.style.cursor = 'pointer';
    nameEl.textContent = key;
    nameEl.title = 'Click to copy token name';

    nameEl.addEventListener('click', () => {
      void this.copyToClipboard(key).then(() => {
        this.showCopyFeedback(nameEl, 'Copied!');
      });
    });

    item.appendChild(nameEl);

    // Token value
    const valueEl = document.createElement('div');
    valueEl.style.color = '#f1fa8c';
    valueEl.style.cursor = 'pointer';
    valueEl.style.wordBreak = 'break-all';
    valueEl.textContent = value;
    valueEl.title = 'Click to copy token value';

    valueEl.addEventListener('click', () => {
      void this.copyToClipboard(value).then(() => {
        this.showCopyFeedback(valueEl, 'Copied!');
      });
    });

    item.appendChild(valueEl);

    return item;
  }

  /**
   * Show brief copy feedback
   */
  private showCopyFeedback(element: HTMLElement, message: string): void {
    const originalText = element.textContent;
    element.textContent = message;
    element.style.opacity = '0.6';

    setTimeout(() => {
      element.textContent = originalText;
      element.style.opacity = '1';
    }, 500);
  }
}
