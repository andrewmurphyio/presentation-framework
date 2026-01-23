import type { DeckNavigator } from './deck-navigator';

export interface NavigationControllerOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export class NavigationController {
  private enabled: boolean;
  private target: EventTarget;
  private boundHandleKeyboard: (event: Event) => void;

  constructor(
    private readonly navigator: DeckNavigator,
    options: NavigationControllerOptions = {}
  ) {
    this.target = options.target ?? (typeof window !== 'undefined' ? window : ({} as EventTarget));
    this.enabled = options.enabled ?? true;
    this.boundHandleKeyboard = this.handleKeyboard.bind(this);

    if (this.enabled) {
      this.attach();
    }
  }

  enable(): void {
    if (!this.enabled) {
      this.enabled = true;
      this.attach();
    }
  }

  disable(): void {
    if (this.enabled) {
      this.enabled = false;
      this.detach();
    }
  }

  destroy(): void {
    this.detach();
  }

  private attach(): void {
    this.target.addEventListener('keydown', this.boundHandleKeyboard);
  }

  private detach(): void {
    this.target.removeEventListener('keydown', this.boundHandleKeyboard);
  }

  private handleKeyboard(event: Event): void {
    const keyEvent = event as KeyboardEvent;

    switch (keyEvent.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        keyEvent.preventDefault();
        this.navigator.next();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        keyEvent.preventDefault();
        this.navigator.previous();
        break;

      case 'Home':
        keyEvent.preventDefault();
        this.navigator.goToSlide(0);
        break;

      case 'End':
        keyEvent.preventDefault();
        this.navigator.goToSlide(this.navigator.getTotalSlides() - 1);
        break;
    }
  }
}
