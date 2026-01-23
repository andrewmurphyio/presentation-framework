/**
 * Slide type definitions
 *
 * Slides are the core unit of a presentation.
 * Each slide references a layout and provides content for that layout's zones.
 */

import type { PresentationComponent } from './component';

/**
 * Zone content value - can be a string, a component, or an array of components
 */
export type ZoneContent = string | PresentationComponent | PresentationComponent[];

/**
 * Content for a slide, mapped by zone name
 * Keys are zone names (e.g., "title", "content")
 * Values can be strings (plain text/HTML) or components
 */
export type SlideContent = Record<string, ZoneContent>;

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
