/**
 * Slide type definitions
 *
 * Slides are the core unit of a presentation.
 * Each slide references a layout and provides content for that layout's zones.
 */

/**
 * Content for a slide, mapped by zone name
 * Keys are zone names (e.g., "title", "content")
 * Values are HTML strings or plain text
 */
export type SlideContent = Record<string, string>;

/**
 * A single slide in a presentation
 */
export interface Slide {
  /** Unique identifier for this slide */
  id: string;

  /** Name of the layout to use (e.g., "title", "two-column") */
  layout: string;

  /** Content mapped to layout zones */
  content: SlideContent;

  /** Optional speaker notes (not rendered on slide) */
  notes?: string;
}
