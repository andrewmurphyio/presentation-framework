import type { Deck } from '../types/deck';
import { DeckNavigator } from '../navigation/deck-navigator';
import { NavigationController } from '../navigation/navigation-controller';
import { layoutRegistry } from '../design-system/layout-registry';
import type { LayoutDefinition } from '../types/layout';
import type { Slide } from '../types/slide';
import { DebugMode } from '../debug/debug-mode';
import { DebugOverlay } from '../debug/debug-overlay';
import { DebugKeyboardController } from '../debug/debug-keyboard-controller';
import { DebugDataCollector } from '../debug/debug-data-collector';
import type { DebugOptions } from '../types/debug';

export interface DeckRendererOptions {
  container?: HTMLElement;
  debug?: boolean | DebugOptions;
}

export class DeckRenderer {
  private navigator: DeckNavigator;
  private controller: NavigationController;
  private container: HTMLElement;
  private slideElements: HTMLElement[] = [];
  private unsubscribe?: () => void;
  private debugMode?: DebugMode;
  private debugOverlay?: DebugOverlay;
  private debugKeyboard?: DebugKeyboardController;
  private debugCollector?: DebugDataCollector;

  constructor(
    private readonly deck: Deck,
    options: DeckRendererOptions = {}
  ) {
    this.container = options.container || this.createDefaultContainer();
    this.navigator = new DeckNavigator(deck);
    this.controller = new NavigationController(this.navigator);

    // Initialize debug mode if requested
    if (options.debug) {
      this.initializeDebugMode(options.debug);
    }
  }

  render(): void {
    // Apply theme CSS variables to document root
    this.applyTheme();

    // Render all slides
    this.renderSlides();

    // Show initial slide
    this.updateVisibleSlide();

    // Mount debug overlay if enabled
    if (this.debugOverlay) {
      this.debugOverlay.mount();
      this.updateDebugData();
    }

    // Enable debug keyboard if enabled
    if (this.debugKeyboard) {
      this.debugKeyboard.enable();
    }

    // Listen for navigation events
    this.unsubscribe = this.navigator.onNavigate(() => {
      this.updateVisibleSlide();
      this.updateDebugData();
    });
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.controller.destroy();

    // Destroy debug components
    if (this.debugKeyboard) {
      this.debugKeyboard.destroy();
    }
    if (this.debugOverlay) {
      this.debugOverlay.destroy();
    }

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
      zoneDiv.setAttribute('data-zone', zone.name);
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

  private initializeDebugMode(debugOption: boolean | DebugOptions): void {
    const debugOptions = typeof debugOption === 'boolean' ? {} : debugOption;

    this.debugMode = new DebugMode(debugOptions, typeof debugOption === 'boolean' ? debugOption : true);
    this.debugOverlay = new DebugOverlay(this.debugMode, this.container);
    this.debugKeyboard = new DebugKeyboardController(this.debugMode);
    this.debugCollector = new DebugDataCollector();
  }

  private updateDebugData(): void {
    if (!this.debugOverlay || !this.debugCollector || !this.debugMode) return;
    if (!this.debugMode.isEnabled()) return;

    const currentIndex = this.navigator.getCurrentIndex();
    const slide = this.deck.slides[currentIndex];
    if (!slide) return;

    const layout = layoutRegistry.getLayout(slide.layout);

    const debugInfo = this.debugCollector.collectSlideDebugInfo(
      slide,
      layout,
      this.deck.theme,
      currentIndex,
      this.deck.slides.length
    );

    this.debugOverlay.update(debugInfo);
  }
}
