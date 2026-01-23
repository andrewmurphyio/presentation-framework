/**
 * Presentation Framework - Main Entry Point
 *
 * This file exports the public API for the presentation framework library.
 */

// Type exports
export type {
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  BorderTokens,
  ShadowTokens,
  DesignTokens,
  Theme,
  CSSVariables,
  LayoutZone,
  LayoutDefinition,
  Slide,
  SlideContent,
  Deck,
  DeckMetadata,
} from './lib/types';

// Design System
export { TokenRegistry } from './lib/design-system/token-registry';
export { defaultTokens } from './lib/design-system/default-tokens';
export { LayoutRegistry } from './lib/design-system/layout-registry';
export { layoutRegistry } from './lib/design-system/layout-registry';
export { titleLayout } from './lib/design-system/layouts/title';

// Theming
export { ThemeClass } from './lib/theming/theme-class';
export { exampleTheme } from './lib/theming/example-theme';

// Navigation
export { DeckNavigator } from './lib/navigation/deck-navigator';
export { NavigationController } from './lib/navigation/navigation-controller';

// Rendering
export { SlideRenderer, slideRenderer } from './lib/rendering/slide-renderer';
export { DeckRenderer } from './lib/rendering/deck-renderer';
export type { DeckRendererOptions } from './lib/rendering/deck-renderer';

// UI Components
export { ProgressIndicator } from './lib/ui/progress-indicator';
export type {
  ProgressIndicatorStyle,
  ProgressIndicatorPosition,
  ProgressIndicatorOptions,
} from './lib/ui/progress-indicator';
