# Animations

Build animations, slide transitions, and timing control.

## Job to Be Done

Animations are essential to how I present. Support expressive, consistent animations without manual timeline fiddling.

## Animation Types

### Build Animations (Within a Slide)

Content appearing incrementally during a slide:

- **Entry**: How elements appear (fade, slide-in, zoom, typewriter, etc.)
- **Exit**: How elements leave (for content that disappears)
- **Emphasis**: Draw attention to existing content (pulse, highlight, shake)

### Slide Transitions (Between Slides)

Effects when moving from one slide to the next:

- Fade
- Slide (directional)
- Zoom
- Morph (smooth element transitions - if elements share IDs across slides)
- None (instant cut)

## Animation Properties

Each animation can specify:

- **Type**: Which animation effect
- **Duration**: How long the animation takes
- **Delay**: Wait before starting (for staggered reveals)
- **Easing**: Timing function (ease-in, ease-out, bounce, etc.)
- **Order**: Sequence for builds (which elements animate first)

## Build Order / Fragments

Content can be grouped into "fragments" that reveal together:

- Fragment 1: Title appears
- Fragment 2: First bullet appears
- Fragment 3: Second and third bullets appear together
- Fragment 4: Image fades in

Presenter advances through fragments with keyboard/clicker.

## Timing Modes

- **Manual**: Presenter controls fragment advancement (default)
- **Auto**: Fragments advance on timer (for self-running presentations)
- **Hybrid**: Some fragments manual, some timed

## Acceptance Criteria

- Common animations available as named presets
- Build order is explicit and readable in source
- Slide transitions are configurable per-slide or globally
- Staggered animations work on lists without manual delay math
- Animations preview correctly in browser output
- Can disable all animations for quick review/export
