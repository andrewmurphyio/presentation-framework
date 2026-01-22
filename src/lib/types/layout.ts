/**
 * Layout type definitions
 *
 * Layouts define the structure and positioning of content zones on a slide.
 * They provide consistent, reusable templates for different slide types.
 */

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
}
