# Media

Images, videos, audio, and other embedded media in slides.

## Job to Be Done

Include rich media in presentations with consistent handling, proper sizing, and reliable playback.

## Media Types

### Images
- Static images (PNG, JPG, SVG, WebP, GIF)
- Screenshots, diagrams, photos, illustrations

### Video
- Embedded video clips
- Screen recordings, demos
- Animated explanations

### Audio
- Background music (rare)
- Sound effects
- Voiceover/narration (for self-running presentations)

### Other
- Animated GIFs
- Lottie animations (vector animations)
- Embedded iframes (live demos, codepens - requires network)

## Media Organization

Media lives alongside talk source, version controlled together.

## Image Handling

- **Sizing**: Fit to container, maintain aspect ratio
- **Fit modes**: Contain (show all), cover (fill, may crop), original (actual size)
- **Lazy loading**: Don't load images for slides not yet visible
- **Optimization**: Compress/resize at build time for web delivery

## Video Handling

- **Autoplay options**: Play on slide enter, manual start, loop
- **Controls**: Show/hide player controls
- **Muted by default**: Browser autoplay policies
- **Poster image**: Thumbnail before playing
- **Timing**: Start/end timestamps for clips

## Audio Handling

- **Background**: Loop during presentation (rare use case)
- **Per-slide**: Play when slide is entered
- **Manual**: Play on click/interaction

## Offline Considerations

- All media bundled into output
- No external URLs at runtime (or fallback behavior)
- Video files may need compression for reasonable bundle size

## Responsive Behavior

- Media scales appropriately for different screen sizes
- Full-bleed images work correctly
- Videos maintain aspect ratio

## Acceptance Criteria

- Can embed images, videos, audio in slides
- Media referenced by relative paths (portable)
- Video playback controls work during presentation
- Media lazy-loads for performance
- Output bundles all media for offline use
- Broken media references caught at build time
