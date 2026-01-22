# Output / Rendering

Generate the final presentation for delivery.

## Job to Be Done

Build a browser-based presentation from source that I can fullscreen and present from.

## Primary Output: HTML/Browser

The main output is a self-contained HTML presentation:

- Runs in any modern browser
- Fullscreen mode for presenting
- Keyboard/clicker navigation
- Responsive (works on different screen sizes)

Similar to Reveal.js or similar browser-based presentation frameworks.

## Presentation Features

### Navigation
- Arrow keys / spacebar to advance
- Clicker support (standard presenter remotes)
- Slide overview / grid view
- Jump to slide by number
- Progress indicator (optional)

### Presenter View
- Current slide + next slide preview
- Speaker notes visible
- Timer / clock
- Fragment progress (if multiple builds)

Works with dual-monitor setup (slides on projector, presenter view on laptop).

### URL Navigation
- Each slide has a URL
- Shareable deep links to specific slides
- Browser back/forward works

## Development Mode

- Live reload on source changes
- Fast iteration while authoring
- Hot module replacement if feasible

## Offline Support

Generated presentation should work offline:

- All assets bundled or inlined
- No external dependencies at runtime
- Can present without internet

## Acceptance Criteria

- Build produces working HTML presentation
- Keyboard/clicker navigation works
- Presenter view available for dual-monitor setup
- Speaker notes render in presenter view
- Animations and transitions play correctly
- Output works offline (no network required)
- Dev mode enables fast iteration
- Can specify theme and variant at build time
