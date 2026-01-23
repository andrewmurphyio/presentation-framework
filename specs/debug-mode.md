# Debug Mode Specification

## Overview

Debug mode provides developers with a visual overlay system that displays internal framework data during presentation development. This helps authors understand how layouts are applied, which design tokens are active, and how content maps to layout zones.

## Goals

- **Layout Transparency**: Show which layout is being used for each slide
- **Token Visibility**: Display active design token values
- **Zone Mapping**: Visualize how content maps to layout zones
- **Theme Debugging**: Show which theme is active and token overrides
- **Development Aid**: Reduce guess-work during presentation development

## Activation

### Toggle Methods

```typescript
// Programmatic activation
deck.setDebugMode(true);

// Keyboard shortcut
// Press 'D' key to toggle debug overlay

// URL parameter
// ?debug=true

// Configuration option
const deck = new Deck({
  debug: true,
  debugOptions: {
    showLayout: true,
    showTokens: true,
    showZones: true,
    showMetadata: true,
  }
});
```

### Persistence

- Debug mode state persists in `localStorage` for the session
- Can be enabled globally or per-deck
- Safe for production (no impact when disabled)

## Visual Overlay Components

### 1. Layout Information Panel

**Position**: Top-left corner (configurable)

**Content**:
```
┌─────────────────────────────┐
│ Layout: two-column          │
│ Zones: title, left, right   │
│ Grid: 1fr 1fr              │
│ Rows: auto 1fr             │
└─────────────────────────────┘
```

**Data Displayed**:
- Layout name (e.g., "two-column", "title", "code")
- Zone list with names
- Grid template columns
- Grid template rows
- Any custom layout properties

### 2. Zone Boundaries Overlay

**Visual Style**:
- Semi-transparent colored borders around each zone
- Different color per zone for easy identification
- Zone name label in top-left of each zone
- Dashed lines for empty zones

**Example**:
```
┌─────────────────────────────────────┐
│ [title]                             │
│                                     │
├─────────────────┬───────────────────┤
│ [left]          │ [right]           │
│                 │                   │
│                 │                   │
└─────────────────┴───────────────────┘
```

**Color Scheme**:
- Zone 1: `rgba(255, 99, 71, 0.3)` (tomato)
- Zone 2: `rgba(0, 191, 255, 0.3)` (deep sky blue)
- Zone 3: `rgba(50, 205, 50, 0.3)` (lime green)
- Zone 4+: Rotate through palette

### 3. Design Token Inspector

**Position**: Bottom-right corner (configurable)

**Content**:
```
┌─────────────────────────────────┐
│ Design Tokens                   │
├─────────────────────────────────┤
│ Colors:                         │
│  --color-primary: #667eea       │
│  --color-background: #ffffff    │
│  --color-text: #2d3748          │
│                                 │
│ Typography:                     │
│  --font-family-sans: Inter      │
│  --font-size-base: 1rem         │
│  --font-weight-bold: 700        │
│                                 │
│ Spacing:                        │
│  --spacing-md: 1rem             │
│  --spacing-lg: 2rem             │
└─────────────────────────────────┘
```

**Features**:
- Collapsible sections (colors, typography, spacing)
- Search/filter tokens by name
- Show computed values (not just CSS variables)
- Highlight overridden tokens
- Click to copy token name or value

### 4. Theme Information

**Position**: Integrated with token inspector

**Content**:
```
┌─────────────────────────────────┐
│ Theme: Example Theme            │
│ Base: Default Tokens            │
│ Overrides: 5                    │
└─────────────────────────────────┘
```

**Data Displayed**:
- Theme name
- Base theme (if using inheritance)
- Number of token overrides
- Custom theme properties

### 5. Slide Metadata Panel

**Position**: Top-right corner (configurable)

**Content**:
```
┌─────────────────────────────────┐
│ Slide 3 of 11                   │
│ ID: slide-content-demo          │
│ Layout: content                 │
│ Zones Populated: 2/2            │
│ Animations: 0                   │
│ Transitions: fade               │
└─────────────────────────────────┘
```

**Data Displayed**:
- Slide number and total
- Slide ID
- Active layout name
- Zone population status (filled vs. total)
- Animation count
- Transition type

### 6. Content Zone Mapping

**Interaction**: Hover over content to highlight zone

**Visual Feedback**:
- Hovering over text highlights the zone border
- Shows tooltip with zone name and content key
- Displays character count and overflow status

**Example Tooltip**:
```
┌─────────────────────────────────┐
│ Zone: "content"                 │
│ Key: content                    │
│ Length: 247 chars               │
│ Overflow: No                    │
└─────────────────────────────────┘
```

## Debug Data Structure

### DebugInfo Interface

```typescript
interface DebugInfo {
  slide: {
    id: string;
    index: number;
    total: number;
    layout: string;
  };

  layout: {
    name: string;
    description: string;
    zones: Array<{
      name: string;
      gridArea: string;
      populated: boolean;
      contentLength?: number;
    }>;
    gridTemplateAreas: string;
    gridTemplateColumns: string;
    gridTemplateRows: string;
  };

  theme: {
    name: string;
    baseTheme?: string;
    tokens: {
      colors: Record<string, string>;
      typography: Record<string, string>;
      spacing: Record<string, string>;
    };
    overrides: string[];
  };

  content: Record<string, {
    value: string;
    length: number;
    zone: string;
  }>;

  animations?: {
    count: number;
    fragments: number;
  };

  transitions?: {
    type: string;
    duration: number;
  };
}
```

## Debug Mode API

### Deck-Level Methods

```typescript
class Deck {
  // Enable/disable debug mode
  setDebugMode(enabled: boolean): void;

  // Get current debug state
  getDebugMode(): boolean;

  // Configure debug options
  setDebugOptions(options: DebugOptions): void;

  // Get debug info for current slide
  getDebugInfo(): DebugInfo;

  // Export debug data as JSON
  exportDebugData(): string;
}
```

### DebugOptions Interface

```typescript
interface DebugOptions {
  // Which panels to show
  showLayout?: boolean;
  showTokens?: boolean;
  showZones?: boolean;
  showMetadata?: boolean;
  showContentMapping?: boolean;

  // Visual options
  zoneHighlightColor?: string;
  overlayOpacity?: number;
  panelPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  // Interaction options
  persistState?: boolean;
  keyboardShortcut?: string;
  hoverToInspect?: boolean;
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Toggle debug mode on/off |
| `Shift+D` | Toggle specific debug panels |
| `Ctrl+D` | Export debug data to console |
| `Alt+Z` | Toggle zone boundaries only |
| `Alt+T` | Toggle token inspector only |

## Performance Considerations

### Rendering Impact

- Debug overlays are separate DOM layers (no impact on slide content)
- Use CSS `position: fixed` with `pointer-events: none` where appropriate
- Lazy-render panels (only render visible panels)
- Debounce hover events (100ms)

### Memory Impact

- Debug data is computed on-demand (not cached per slide)
- Remove event listeners when debug mode disabled
- Clean up overlay DOM when toggling off

### Production Safety

- Debug code is tree-shakable (can be removed in production builds)
- No debug data sent to analytics or logging
- No impact on slide rendering when disabled

## CSS Structure

```css
/* Debug overlay container */
.pf-debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
}

/* Debug panels */
.pf-debug-panel {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  padding: 12px;
  border-radius: 4px;
  pointer-events: auto;
  max-width: 400px;
  max-height: 600px;
  overflow-y: auto;
}

/* Zone boundaries */
.pf-debug-zone {
  position: absolute;
  border: 2px dashed;
  pointer-events: none;
  transition: border-color 0.2s;
}

.pf-debug-zone-label {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 2px;
  font-family: monospace;
}
```

## Implementation Phases

### Phase 1: Basic Debug Mode Toggle
- Implement on/off toggle via keyboard shortcut
- Create basic overlay container
- Show simple layout name indicator

### Phase 2: Zone Visualization
- Add zone boundary overlays
- Color-code zones
- Show zone labels

### Phase 3: Token Inspector
- Display active design tokens
- Show theme information
- Implement token search/filter

### Phase 4: Advanced Features
- Hover-to-inspect functionality
- Export debug data
- Performance optimizations

### Phase 5: Configuration
- Customizable debug options
- Panel positioning
- User preferences persistence

## Use Cases

### 1. Layout Development
**Scenario**: Creating a new custom layout
**Debug Help**:
- See zone boundaries in real-time
- Verify grid template is applied correctly
- Check zone population status

### 2. Theme Customization
**Scenario**: Overriding design tokens for a custom theme
**Debug Help**:
- See which tokens are overridden
- Compare values with base theme
- Verify CSS variables are applied

### 3. Content Debugging
**Scenario**: Content not appearing in expected zone
**Debug Help**:
- See content-to-zone mapping
- Check if zone exists in layout
- Verify content key matches zone name

### 4. Visual QA
**Scenario**: Testing presentation before delivery
**Debug Help**:
- Quick scan of all layouts used
- Verify consistent theme application
- Check for empty or overfilled zones

## Future Enhancements

- **Performance Profiler**: Show render times per slide
- **Accessibility Inspector**: Check contrast ratios, font sizes
- **Content Validator**: Warn about empty zones or overflow
- **Layout Recommendations**: Suggest better layouts for content
- **Export to Figma**: Generate design file from debug data
- **Grid Inspector**: Interactive grid visualization tool
