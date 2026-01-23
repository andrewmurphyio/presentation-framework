# Design System

The foundation layer that ensures visual consistency across all presentations without manual alignment or positioning.

## Job to Be Done

Define visual rules once, have them apply automatically everywhere. No pixel-pushing.

## Design Tokens

Centralized variables that control the visual language:

- **Colors**: Primary, secondary, accent, background, text colors with semantic naming
- **Typography**: Font families, size scale, weights, line heights
- **Spacing**: Consistent spacing scale (e.g., 4px base unit system)
- **Borders**: Radius values, border widths, styles
- **Shadows**: Elevation levels for depth
- **Iconography**: Brand logo, as well as reusable graphical elements with names

Tokens should be defined in a single source file and referenced throughout.

## Layouts

Pre-defined slide layouts that handle positioning automatically. Layouts can be defined at multiple levels:

### System Layouts (Built-in)
Core layouts provided by the framework:
- Title slide
- Section divider
- Single content (centered)
- Two-column (equal, 40/60, 60/40)
- Content + image (left/right variants)
- Full-bleed image with overlay text
- Code slide
- Quote slide
- Comparison (side-by-side)

### Theme Layouts
Themes can provide additional layouts or override system layouts with brand-specific variations.

### Deck Layouts (Custom)
Individual decks/talks can define their own custom layouts for unique presentation needs. These layouts:
- Live alongside the deck source files
- Can extend or compose existing layouts
- Are only available within that specific deck
- Support the same zone-based content flow as system layouts

### Custom Layout Styling
Layouts can include custom CSS styles through the `customStyles` property:
- Styles are automatically scoped to the layout using `[data-layout="layout-name"]`
- Applied when the layout is first used, avoiding duplication
- Allows complete control over zone positioning, typography, and visual effects
- Theme-specific layouts can use CSS variables defined by the theme
- Styles are injected into the document head for optimal performance

Each layout defines zones where content goes. Content flows into zones without manual positioning.

## Components

Reusable building blocks with consistent styling:

- Headings (h1-h4 with appropriate scale)
- Body text / paragraphs
- Bullet lists (styled, not default)
- Numbered lists
- Code blocks (with syntax highlighting)
- Callout boxes (info, warning, tip)
- Quote blocks
- Image containers (with optional captions)
- Diagrams / figures
- Data tables
- Cards / content boxes
- Iconography and reusable graphical elements with names

Components inherit token values and respond to theme changes automatically.

## Animation Presets

Reusable animation definitions (see animations.md for details):

- Entry animations (fade, slide, zoom, etc.)
- Exit animations
- Emphasis animations (pulse, shake, highlight)
- Transition presets between slides

Presets are named and referenced by name in slides, not defined inline.

## Acceptance Criteria

- Changing a token value propagates to all slides using it
- Layouts eliminate need for manual positioning
- Components are consistent across all slides
- No inline styles required for standard use cases
- System is extensible (can add new tokens, layouts, components)
