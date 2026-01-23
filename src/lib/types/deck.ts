import type { Slide } from './slide';
import type { Theme } from './theme';

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
 * A complete presentation deck
 *
 * Contains all slides, theme, and metadata for a presentation.
 */
export interface Deck {
  /** Presentation metadata */
  metadata: DeckMetadata;

  /** Theme to apply to all slides */
  theme: Theme;

  /** Array of slides in presentation order */
  slides: Slide[];
}
