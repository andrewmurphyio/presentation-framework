import type { DeckNavigator } from '../navigation/deck-navigator';

export type ProgressIndicatorStyle = 'text' | 'bar' | 'dots';
export type ProgressIndicatorPosition = 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ProgressIndicatorOptions {
  style?: ProgressIndicatorStyle;
  position?: ProgressIndicatorPosition;
  container?: HTMLElement;
}

export class ProgressIndicator {
  private element: HTMLElement;
  private unsubscribe?: () => void;
  private style: ProgressIndicatorStyle;
  private position: ProgressIndicatorPosition;

  constructor(
    private readonly navigator: DeckNavigator,
    options: ProgressIndicatorOptions = {}
  ) {
    this.style = options.style || 'text';
    this.position = options.position || 'bottom-right';
    this.element = this.createElement();

    if (options.container) {
      options.container.appendChild(this.element);
    }
  }

  render(): void {
    this.updateContent();
    this.unsubscribe = this.navigator.onNavigate(() => {
      this.updateContent();
    });
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private createElement(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'progress-indicator';
    div.dataset.style = this.style;
    div.dataset.position = this.position;

    this.applyPositionStyles(div);

    return div;
  }

  private applyPositionStyles(element: HTMLElement): void {
    element.style.position = 'fixed';
    element.style.zIndex = '1000';
    element.style.padding = 'var(--spacing-4)';
    element.style.fontSize = 'var(--font-size-sm)';
    element.style.color = 'var(--color-muted)';

    switch (this.position) {
      case 'top':
        element.style.top = '0';
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        element.style.bottom = '0';
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
        break;
      case 'top-left':
        element.style.top = '0';
        element.style.left = '0';
        break;
      case 'top-right':
        element.style.top = '0';
        element.style.right = '0';
        break;
      case 'bottom-left':
        element.style.bottom = '0';
        element.style.left = '0';
        break;
      case 'bottom-right':
        element.style.bottom = '0';
        element.style.right = '0';
        break;
    }
  }

  private updateContent(): void {
    const current = this.navigator.getCurrentIndex() + 1;
    const total = this.navigator.getTotalSlides();

    switch (this.style) {
      case 'text':
        this.element.textContent = `Slide ${current} of ${total}`;
        break;

      case 'bar':
        this.renderProgressBar(current, total);
        break;

      case 'dots':
        this.renderProgressDots(current, total);
        break;
    }
  }

  private renderProgressBar(current: number, total: number): void {
    const percentage = (current / total) * 100;
    this.element.innerHTML = `
      <div style="width: 200px; height: 4px; background: var(--color-border); border-radius: var(--border-radius-full);">
        <div style="width: ${percentage}%; height: 100%; background: var(--color-primary); border-radius: var(--border-radius-full); transition: width 0.3s ease;"></div>
      </div>
    `;
  }

  private renderProgressDots(current: number, total: number): void {
    const dots = Array.from({ length: total }, (_, i) => {
      const isActive = i + 1 === current;
      const dotStyle = `
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 4px;
        border-radius: 50%;
        background: ${isActive ? 'var(--color-primary)' : 'var(--color-border)'};
        transition: background 0.3s ease;
      `;
      return `<span style="${dotStyle}"></span>`;
    }).join('');

    this.element.innerHTML = `<div style="display: flex; align-items: center;">${dots}</div>`;
  }
}
