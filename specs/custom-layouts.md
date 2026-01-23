# Custom Layout Authoring Guide

A comprehensive guide to creating custom layouts for your presentations using the three-tier layout system.

## Overview

The framework supports three levels of layouts with priority-based resolution:

1. **System Layouts** - Core layouts provided by the framework
2. **Theme Layouts** - Brand-specific layouts for all decks using a theme
3. **Deck Layouts** - Presentation-specific custom layouts (highest priority)

Resolution order: **Deck → Theme → System**

## Creating Deck-Specific Layouts

### Basic Custom Layout

Use `CustomLayoutBuilder` to create layouts with a fluent API:

```typescript
import { CustomLayoutBuilder } from './lib/design-system/custom-layout-builder';
import type { CustomLayoutDefinition } from './lib/types/deck';

const myLayout = CustomLayoutBuilder.create('my-layout', 'Description of layout')
  .addZone('title', 'title', 'Main heading')
  .addZone('content', 'content', 'Main content area')
  .setGridTemplateAreas(`
    "title"
    "content"
  `)
  .setGridTemplateRows('auto 1fr')
  .build();
```

### Adding to a Deck

```typescript
import type { Deck } from './lib/types/deck';

const myDeck: Deck = {
  metadata: { /* ... */ },
  theme: myTheme,
  customLayouts: [myLayout],  // Add your custom layouts here
  slides: [
    {
      id: 'slide-1',
      layout: 'my-layout',  // Reference by name
      content: {
        title: 'My Title',
        content: 'My content'
      }
    }
  ]
};
```

## Layout Extension Patterns

### Extending Existing Layouts

Add zones to an existing layout:

```typescript
const titleWithTagline = CustomLayoutBuilder.create('title-with-tagline', 'Title with tagline')
  .extends('title')  // Inherit from system title layout
  .addZone('tagline', 'tagline', 'Small tagline below subtitle')
  .setGridTemplateAreas(`
    "title"
    "subtitle"
    "tagline"
  `)
  .setGridTemplateRows('1fr auto auto 1fr')
  .build();
```

**Key Points:**
- Use `.extends(layoutName)` to inherit zones from parent
- Add new zones with `.addZone()`
- Override grid template to position new zones
- Parent zones are automatically included

### Composing Multiple Layouts

Combine zones from multiple layouts:

```typescript
const composedLayout = CustomLayoutBuilder.create('composed', 'Composed from multiple')
  .composeFrom(['title', 'two-column'])  // Combine zones
  .setGridTemplateAreas(`
    "title title"
    "left right"
  `)
  .setGridTemplateColumns('1fr 1fr')
  .build();
```

### Completely Custom Layouts

Build from scratch without inheritance:

```typescript
const threeColumn = CustomLayoutBuilder.create('three-column-data', 'Three column layout')
  .addZone('heading', 'heading', 'Section heading')
  .addZone('metric1', 'metric1', 'First metric')
  .addZone('metric2', 'metric2', 'Second metric')
  .addZone('metric3', 'metric3', 'Third metric')
  .setGridTemplateAreas(`
    "heading heading heading"
    "metric1 metric2 metric3"
  `)
  .setGridTemplateColumns('1fr 1fr 1fr')
  .setGridTemplateRows('auto 1fr')
  .build();
```

## Custom Styling

### Adding Custom CSS

Use `.setCustomStyles()` to add layout-specific styling:

```typescript
const styledLayout = CustomLayoutBuilder.create('styled-layout', 'Layout with custom styles')
  .addZone('title', 'title', 'Title')
  .addZone('content', 'content', 'Content')
  .setGridTemplateAreas(`
    "title"
    "content"
  `)
  .setCustomStyles(`
    .slide[data-layout="styled-layout"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: var(--spacing-20);
    }

    .slide[data-layout="styled-layout"] .zone-title {
      font-size: var(--font-size-4xl);
      color: white;
      text-align: center;
    }

    .slide[data-layout="styled-layout"] .zone-content {
      color: white;
      max-width: 80%;
      margin: 0 auto;
    }
  `)
  .build();
```

**Best Practices:**
- Always use the `[data-layout="layout-name"]` selector for scoping
- Target zones using `.zone-{zoneName}` class
- Use CSS variables from your theme for consistency
- Styles are automatically injected once when layout is first used

## Zone Naming Conventions

### Standard Zone Names

Use these conventional zone names for consistency:

- `title` - Main heading
- `subtitle` - Supporting heading
- `content` - Primary content area
- `image` - Image or visual content
- `left` / `right` - Column content
- `header` / `footer` - Top/bottom sections
- `sidebar` - Supplementary content
- `kicker` - Small text above title
- `cta` - Call-to-action area

### Custom Zone Names

For specialized zones:
- Use descriptive, semantic names: `metric1`, `author-bio`, `code-sample`
- Use kebab-case: `primary-content`, `side-note`
- Prefix related zones: `metric1`, `metric2`, `metric3`
- Avoid generic names: `zone1`, `box`, `div`

### Zone Description

Always provide clear descriptions in `.addZone()`:

```typescript
.addZone('author-bio', 'author-bio', 'Author biography and headshot')
```

This helps other developers understand zone purpose.

## Grid Template Patterns

### Single Column

```typescript
.setGridTemplateAreas(`
  "header"
  "content"
  "footer"
`)
.setGridTemplateRows('auto 1fr auto')
```

### Two Column (Equal)

```typescript
.setGridTemplateAreas(`
  "title title"
  "left right"
`)
.setGridTemplateColumns('1fr 1fr')
```

### Two Column (60/40)

```typescript
.setGridTemplateAreas(`
  "title title"
  "left right"
`)
.setGridTemplateColumns('3fr 2fr')
```

### Three Column

```typescript
.setGridTemplateAreas(`
  "heading heading heading"
  "col1 col2 col3"
`)
.setGridTemplateColumns('1fr 1fr 1fr')
```

### Complex Grid with Spacers

Use `"."` for empty cells:

```typescript
.setGridTemplateAreas(`
  "."
  "kicker"
  "title"
  "subtitle"
  "."
  "cta"
  "."
`)
.setGridTemplateRows('1fr auto auto auto 2fr auto 1fr')
```

## Best Practices

### Maintainability

1. **One layout per use case** - Don't create overly generic layouts
2. **Clear naming** - Use descriptive layout and zone names
3. **Document purpose** - Add clear descriptions
4. **Consistent styling** - Use theme CSS variables
5. **Minimal custom CSS** - Only add styles when necessary

### Performance

1. **Reuse layouts** - Don't create duplicate layouts
2. **Extend when possible** - Use `.extends()` instead of duplicating
3. **Scope styles properly** - Always use `[data-layout="..."]` selector
4. **Avoid inline styles** - Define styles in layout, not in slide content

### Composition

1. **Extend system layouts** - Build on existing layouts when possible
2. **Compose strategically** - Only combine layouts when it makes sense
3. **Avoid deep hierarchies** - Keep extension chains shallow
4. **Test combinations** - Verify extended layouts work as expected

### Zone Design

1. **Semantic zones** - Name zones by purpose, not position
2. **Flexible content** - Don't assume content length
3. **Responsive grids** - Use `fr` units for flexibility
4. **Consistent alignment** - Follow theme alignment patterns

## Common Patterns

### Metrics Dashboard

```typescript
const metricsLayout = CustomLayoutBuilder.create('metrics-dashboard', 'Metrics display')
  .addZone('heading', 'heading', 'Dashboard title')
  .addZone('metric1', 'metric1', 'First metric')
  .addZone('metric2', 'metric2', 'Second metric')
  .addZone('metric3', 'metric3', 'Third metric')
  .addZone('footnote', 'footnote', 'Data source note')
  .setGridTemplateAreas(`
    "heading heading heading"
    ". . ."
    "metric1 metric2 metric3"
    ". . ."
    "footnote footnote footnote"
  `)
  .setGridTemplateColumns('1fr 1fr 1fr')
  .setGridTemplateRows('auto 1fr auto 1fr auto')
  .setCustomStyles(`
    .slide[data-layout="metrics-dashboard"] [class*="zone-metric"] {
      background: white;
      padding: var(--spacing-8);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      text-align: center;
    }
  `)
  .build();
```

### Content with Sidebar

```typescript
const contentWithSidebar = CustomLayoutBuilder.create('content-sidebar', 'Content with sidebar')
  .extends('content')
  .addZone('sidebar', 'sidebar', 'Additional context')
  .setGridTemplateAreas(`
    "title title"
    "content sidebar"
  `)
  .setGridTemplateColumns('2fr 1fr')
  .setGridTemplateRows('auto 1fr')
  .setCustomStyles(`
    .slide[data-layout="content-sidebar"] .zone-sidebar {
      background: var(--color-muted);
      padding: var(--spacing-6);
      border-radius: var(--border-radius-lg);
    }
  `)
  .build();
```

### Featured Hero

```typescript
const heroLayout = CustomLayoutBuilder.create('hero', 'Hero section')
  .addZone('kicker', 'kicker', 'Small text above title')
  .addZone('title', 'title', 'Large hero title')
  .addZone('subtitle', 'subtitle', 'Supporting text')
  .addZone('cta', 'cta', 'Call-to-action')
  .setGridTemplateAreas(`
    "."
    "kicker"
    "title"
    "subtitle"
    "."
    "cta"
    "."
  `)
  .setGridTemplateRows('1fr auto auto auto 2fr auto 1fr')
  .setCustomStyles(`
    .slide[data-layout="hero"] {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      text-align: center;
    }

    .slide[data-layout="hero"] .zone-title {
      font-size: clamp(2rem, 5vw, 4rem);
      color: white;
    }
  `)
  .build();
```

## Troubleshooting

### Layout Not Found

**Error:** `Layout "my-layout" not found in any tier`

**Solution:** Ensure layout is added to deck's `customLayouts` array:

```typescript
customLayouts: [myLayout]
```

### Zones Not Rendering

**Problem:** Zone content not appearing

**Checklist:**
- Zone name in `content` matches zone name in layout definition
- Grid template areas include the zone name
- Zone has a grid area assignment

### Style Not Applying

**Problem:** Custom styles not appearing

**Checklist:**
- Selector uses `[data-layout="layout-name"]`
- Zone selectors use `.zone-{zoneName}`
- Styles are inside `.setCustomStyles()` call
- No syntax errors in CSS

### Infinite Recursion

**Error:** `Maximum call stack size exceeded`

**Cause:** Circular reference (layout extends itself)

**Solution:** Don't use same name when extending:
```typescript
// ❌ BAD - circular reference
CustomLayoutBuilder.create('title', '...').extends('title')

// ✅ GOOD - different name
CustomLayoutBuilder.create('title-enhanced', '...').extends('title')
```

## Examples

See `src/main.ts` for working examples of:
- Extending system layouts (`title-with-tagline`)
- Completely custom layouts (`three-column-data`)
- Extending with sidebar (`content-with-sidebar`)

## API Reference

### CustomLayoutBuilder Methods

- `create(name, description)` - Start building a layout
- `addZone(name, gridArea, description)` - Add a content zone
- `extends(layoutName)` - Inherit from existing layout
- `composeFrom(layoutNames[])` - Combine multiple layouts
- `overrides(layoutName)` - Mark as override (metadata only)
- `setGridTemplateAreas(template)` - Set CSS grid areas
- `setGridTemplateColumns(value)` - Set column sizing
- `setGridTemplateRows(value)` - Set row sizing
- `setCustomStyles(css)` - Add scoped CSS styles
- `build()` - Finalize and return layout definition

All methods except `create()` and `build()` return the builder for chaining.
