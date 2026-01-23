/**
 * Component types for reusable presentation elements
 */

/**
 * Base component interface that all components extend
 */
export interface Component {
  type: string;
  id?: string;
  className?: string;
}

/**
 * Code block component for displaying syntax-highlighted code
 */
export interface CodeBlock extends Component {
  type: 'code-block';
  language: string;
  code: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  caption?: string;
  showCopyButton?: boolean;
}

/**
 * List variant types
 */
export type ListVariant = 'bullet' | 'numbered' | 'checklist';

/**
 * List item that can contain nested lists
 */
export interface ListItem {
  text: string;
  checked?: boolean; // For checklist variant
  children?: ListItem[];
}

/**
 * List component for displaying structured content
 */
export interface List extends Component {
  type: 'list';
  variant: ListVariant;
  items: ListItem[];
}

/**
 * Callout types for different message severities
 */
export type CalloutType = 'info' | 'warning' | 'success' | 'error';

/**
 * Callout component for highlighting important information
 */
export interface Callout extends Component {
  type: 'callout';
  calloutType: CalloutType;
  title?: string;
  content: string;
}

/**
 * Image fit modes
 */
export type ImageFitMode = 'contain' | 'cover' | 'original';

/**
 * Image component for displaying media
 */
export interface Image extends Component {
  type: 'image';
  src: string;
  alt: string;
  fitMode?: ImageFitMode;
  caption?: string;
  lazyLoad?: boolean;
}

/**
 * Union type of all component types
 */
export type PresentationComponent = CodeBlock | List | Callout | Image;
