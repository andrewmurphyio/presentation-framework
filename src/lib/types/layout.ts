/**
 * Layout type definitions
 *
 * Layouts define the structure and positioning of content zones on a slide.
 * They provide consistent, reusable templates for different slide types.
 */

/**
 * Source of a layout definition in the three-tier hierarchy
 */
export enum LayoutSource {
  /** Built-in framework layouts */
  SYSTEM = 'system',
  /** Theme-provided layouts */
  THEME = 'theme',
  /** Deck-specific custom layouts */
  DECK = 'deck',
}

/**
 * A zone is a named area within a layout where content can be placed
 */
export interface LayoutZone {
  /** Unique name for this zone (e.g., "title", "content", "image") */
  name: string;

  /** CSS grid area name or positioning rules */
  gridArea?: string;

  /** Optional description of what should go in this zone */
  description?: string;
}

/**
 * Layout definition specifying zones and their arrangement
 */
export interface LayoutDefinition {
  /** Unique identifier for this layout */
  name: string;

  /** Human-readable description */
  description: string;

  /** Named zones where content can be placed */
  zones: LayoutZone[];

  /** CSS grid template areas defining zone positioning */
  gridTemplateAreas?: string;

  /** CSS grid template columns */
  gridTemplateColumns?: string;

  /** CSS grid template rows */
  gridTemplateRows?: string;

  /** Optional custom CSS styles for this layout */
  customStyles?: string;

  /** Source of this layout in the hierarchy */
  source?: LayoutSource;

  /** Priority for layout resolution (higher takes precedence) */
  priority?: number;
}
