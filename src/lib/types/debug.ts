/**
 * Debug mode type definitions
 *
 * Types for the debug overlay system that displays layout info,
 * design tokens, zone boundaries, and slide metadata.
 */

/**
 * Panel position options for debug UI components
 */
export type DebugPanelPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Configuration options for debug mode
 */
export interface DebugOptions {
  /** Show layout information panel */
  showLayout?: boolean;

  /** Show design tokens inspector */
  showTokens?: boolean;

  /** Show zone boundaries overlay */
  showZones?: boolean;

  /** Show slide metadata panel */
  showMetadata?: boolean;

  /** Show content-to-zone mapping on hover */
  showContentMapping?: boolean;

  /** Custom color for zone highlights (CSS color value) */
  zoneHighlightColor?: string;

  /** Opacity for debug overlays (0-1) */
  overlayOpacity?: number;

  /** Position of debug panels */
  panelPosition?: DebugPanelPosition;

  /** Persist debug state in localStorage */
  persistState?: boolean;

  /** Keyboard shortcut to toggle debug mode */
  keyboardShortcut?: string;

  /** Enable hover-to-inspect functionality */
  hoverToInspect?: boolean;
}

/**
 * Zone debug information
 */
export interface DebugZoneInfo {
  /** Zone name (e.g., "title", "content") */
  name: string;

  /** CSS grid area identifier */
  gridArea: string;

  /** Whether this zone has content */
  populated: boolean;

  /** Length of content in characters (if populated) */
  contentLength?: number;
}

/**
 * Layout debug information
 */
export interface DebugLayoutInfo {
  /** Layout name (e.g., "two-column", "title") */
  name: string;

  /** Layout description */
  description: string;

  /** Zone information for this layout */
  zones: DebugZoneInfo[];

  /** CSS grid-template-areas value */
  gridTemplateAreas: string;

  /** CSS grid-template-columns value */
  gridTemplateColumns: string;

  /** CSS grid-template-rows value */
  gridTemplateRows: string;
}

/**
 * Theme debug information
 */
export interface DebugThemeInfo {
  /** Theme name */
  name: string;

  /** Base theme name (if using inheritance) */
  baseTheme?: string;

  /** Design tokens organized by category */
  tokens: {
    /** Color tokens */
    colors: Record<string, string>;

    /** Typography tokens */
    typography: Record<string, string>;

    /** Spacing tokens */
    spacing: Record<string, string>;
  };

  /** List of token keys that are overridden from base */
  overrides: string[];
}

/**
 * Slide debug information
 */
export interface DebugSlideInfo {
  /** Slide ID */
  id: string;

  /** Current slide index (0-based) */
  index: number;

  /** Total number of slides in deck */
  total: number;

  /** Layout name used for this slide */
  layout: string;
}

/**
 * Content mapping information
 */
export interface DebugContentInfo {
  /** Content value */
  value: string;

  /** Length of content in characters */
  length: number;

  /** Zone this content is mapped to */
  zone: string;
}

/**
 * Animation debug information (future use)
 */
export interface DebugAnimationInfo {
  /** Number of animations on slide */
  count: number;

  /** Number of fragments (animated elements) */
  fragments: number;
}

/**
 * Transition debug information (future use)
 */
export interface DebugTransitionInfo {
  /** Transition type (e.g., "fade", "slide") */
  type: string;

  /** Transition duration in milliseconds */
  duration: number;
}

/**
 * Complete debug information for a slide
 */
export interface DebugInfo {
  /** Slide information */
  slide: DebugSlideInfo;

  /** Layout information */
  layout: DebugLayoutInfo;

  /** Theme information */
  theme: DebugThemeInfo;

  /** Content mapping (zone name → content info) */
  content: Record<string, DebugContentInfo>;

  /** Animation information (optional, for future use) */
  animations?: DebugAnimationInfo;

  /** Transition information (optional, for future use) */
  transitions?: DebugTransitionInfo;
}
