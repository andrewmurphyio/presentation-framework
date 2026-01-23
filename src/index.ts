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
// Layout exports
export { titleLayout } from './lib/design-system/layouts/title';
export { sectionLayout } from './lib/design-system/layouts/section';
export { contentLayout } from './lib/design-system/layouts/content';
export { twoColumnLayout } from './lib/design-system/layouts/two-column';
export { codeLayout } from './lib/design-system/layouts/code';
export { imageLeftLayout } from './lib/design-system/layouts/image-left';
export { imageRightLayout } from './lib/design-system/layouts/image-right';
export { split4060Layout } from './lib/design-system/layouts/split-40-60';
export { split6040Layout } from './lib/design-system/layouts/split-60-40';
export { quoteLayout } from './lib/design-system/layouts/quote';
export { comparisonLayout } from './lib/design-system/layouts/comparison';

// Theming
export { Theme } from './lib/theming/theme';

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
