import type { Deck } from '../types/deck';
import { DeckNavigator } from '../navigation/deck-navigator';
import { NavigationController } from '../navigation/navigation-controller';
import { layoutRegistry } from '../design-system/layout-registry';
import type { LayoutDefinition } from '../types/layout';
import type { Slide } from '../types/slide';

export interface DeckRendererOptions {
  container?: HTMLElement;
}

export class DeckRenderer {
  private navigator: DeckNavigator;
  private controller: NavigationController;
  private container: HTMLElement;
  private slideElements: HTMLElement[] = [];
  private unsubscribe?: () => void;

  constructor(
    private readonly deck: Deck,
    options: DeckRendererOptions = {}
  ) {
    this.container = options.container || this.createDefaultContainer();
    this.navigator = new DeckNavigator(deck);
    this.controller = new NavigationController(this.navigator);
  }

  render(): void {
    // Apply theme CSS variables to document root
    this.applyTheme();

    // Render all slides
    this.renderSlides();

    // Show initial slide
    this.updateVisibleSlide();

    // Listen for navigation events
    this.unsubscribe = this.navigator.onNavigate(() => {
      this.updateVisibleSlide();
    });
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.controller.destroy();
    this.container.innerHTML = '';
  }

  getNavigator(): DeckNavigator {
    return this.navigator;
  }

  getController(): NavigationController {
    return this.controller;
  }

  private createDefaultContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'presentation-container';
    return container;
  }

  private applyTheme(): void {
    const cssVars = this.deck.theme.getCSSVariables();
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  private renderSlides(): void {
    this.slideElements = this.deck.slides.map((slide, index) => {
      const slideElement = this.createSlideElement(slide, index);
      this.container.appendChild(slideElement);
      return slideElement;
    });
  }

  private createSlideElement(slide: Slide, index: number): HTMLElement {
    const layout = layoutRegistry.getLayout(slide.layout);
    const slideDiv = document.createElement('div');

    slideDiv.className = 'slide';
    slideDiv.dataset.slideId = slide.id;
    slideDiv.dataset.slideIndex = String(index);
    slideDiv.dataset.layout = slide.layout;

    // Apply layout styles
    this.applyLayoutStyles(slideDiv, layout);

    // Add zone content
    this.addZoneContent(slideDiv, slide, layout);

    return slideDiv;
  }

  private applyLayoutStyles(element: HTMLElement, layout: LayoutDefinition): void {
    element.style.display = 'grid';
    if (layout.gridTemplateAreas) {
      element.style.gridTemplateAreas = layout.gridTemplateAreas;
    }
    element.style.gridTemplateColumns = layout.gridTemplateColumns || '1fr';
    element.style.gridTemplateRows = layout.gridTemplateRows || 'auto';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.padding = 'var(--spacing-12)';
    element.style.gap = 'var(--spacing-6)';
  }

  private addZoneContent(
    slideElement: HTMLElement,
    slide: Slide,
    layout: LayoutDefinition
  ): void {
    layout.zones.forEach((zone) => {
      const content = slide.content[zone.name];
      if (!content) return;

      const zoneDiv = document.createElement('div');
      zoneDiv.className = `slide-zone zone-${zone.name}`;
      zoneDiv.style.gridArea = zone.gridArea || zone.name;
      zoneDiv.style.display = 'flex';
      zoneDiv.style.flexDirection = 'column';
      zoneDiv.style.justifyContent = 'center';
      zoneDiv.style.alignItems = 'center';
      zoneDiv.style.textAlign = 'center';

      // Apply zone-specific styling
      if (zone.name === 'title') {
        zoneDiv.style.fontSize = 'var(--font-size-4xl)';
        zoneDiv.style.fontWeight = 'var(--font-weight-bold)';
        zoneDiv.style.color = 'var(--color-primary)';
      } else if (zone.name === 'subtitle') {
        zoneDiv.style.fontSize = 'var(--font-size-xl)';
        zoneDiv.style.fontWeight = 'var(--font-weight-medium)';
        zoneDiv.style.color = 'var(--color-muted)';
        zoneDiv.style.marginTop = 'var(--spacing-4)';
      }

      zoneDiv.textContent = content;
      slideElement.appendChild(zoneDiv);
    });
  }

  private updateVisibleSlide(): void {
    const currentIndex = this.navigator.getCurrentIndex();

    this.slideElements.forEach((element, index) => {
      if (index === currentIndex) {
        element.style.display = 'grid';
      } else {
        element.style.display = 'none';
      }
    });
  }
}
