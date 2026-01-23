import type { Deck } from '../types/deck';
import type { Slide } from '../types/slide';

export interface NavigationEvent {
  previousIndex: number;
  currentIndex: number;
  slide: Slide;
}

export type NavigationListener = (event: NavigationEvent) => void;

export class DeckNavigator {
  private currentIndex: number = 0;
  private listeners: NavigationListener[] = [];

  constructor(private readonly deck: Deck) {
    if (deck.slides.length === 0) {
      throw new Error('Cannot navigate a deck with no slides');
    }
  }

  getCurrentSlide(): Slide {
    return this.deck.slides[this.currentIndex]!;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTotalSlides(): number {
    return this.deck.slides.length;
  }

  next(): boolean {
    if (this.currentIndex >= this.deck.slides.length - 1) {
      return false;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex++;
    this.emitNavigationEvent(previousIndex);
    return true;
  }

  previous(): boolean {
    if (this.currentIndex <= 0) {
      return false;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex--;
    this.emitNavigationEvent(previousIndex);
    return true;
  }

  goToSlide(index: number): boolean {
    if (index < 0 || index >= this.deck.slides.length) {
      return false;
    }

    if (index === this.currentIndex) {
      return true;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex = index;
    this.emitNavigationEvent(previousIndex);
    return true;
  }

  onNavigate(listener: NavigationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emitNavigationEvent(previousIndex: number): void {
    const event: NavigationEvent = {
      previousIndex,
      currentIndex: this.currentIndex,
      slide: this.getCurrentSlide(),
    };

    this.listeners.forEach((listener) => listener(event));
  }
}
