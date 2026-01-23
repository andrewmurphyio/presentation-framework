import type { Slide } from './slide';
import type { Theme } from './theme';
import type { LayoutDefinition } from './layout';

/**
 * Deck metadata
 *
 * Provides information about the presentation itself.
 */
export interface DeckMetadata {
  /** Title of the presentation */
  title: string;

  /** Author name */
  author: string;

  /** Optional description */
  description?: string;

  /** Optional date */
  date?: string;
}

/**
 * Custom layout definition for deck-specific layouts
 *
 * Extends LayoutDefinition with additional properties for composition and inheritance.
 */
export interface CustomLayoutDefinition extends LayoutDefinition {
  /** Base layout to extend from (name of existing layout) */
  extends?: string;

  /** Layouts to compose together (names of existing layouts) */
  composeFrom?: string[];

  /** Whether this layout overrides a theme or system layout */
  overrides?: string;

  /** Additional zones to add when extending */
  additionalZones?: LayoutDefinition['zones'];

  /** Zones to remove when extending */
  removeZones?: string[];

  /** Zones to modify when extending */
  modifyZones?: {
    [zoneName: string]: Partial<LayoutDefinition['zones'][0]>;
  };
}

/**
 * A complete presentation deck
 *
 * Contains all slides, theme, metadata, and custom layouts for a presentation.
 */
export interface Deck {
  /** Presentation metadata */
  metadata: DeckMetadata;

  /** Theme to apply to all slides */
  theme: Theme;

  /** Array of slides in presentation order */
  slides: Slide[];

  /** Optional deck-specific custom layouts */
  customLayouts?: CustomLayoutDefinition[];
}
