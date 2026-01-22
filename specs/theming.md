# Theming / Branding

Support for multiple brand contexts with easy theme switching.

## Job to Be Done

Maintain 2-3 distinct brand identities (e.g., work, personal, side project) and apply them to any talk without duplicating content.

## Theme Definition

A theme provides concrete values for the design system tokens:

- Color palette (mapping semantic colors to actual hex values)
- Typography choices (which fonts to use)
- Logo / brand assets
- Any brand-specific component styling overrides

Themes implement the token interface defined in the design system.

## Theme Structure

Each theme is a self-contained package

## Theme Application

- A talk references a theme by name in its metadata
- Theme can be overridden at build time (generate same talk with different branding)
- Switching themes requires no content changes

## Theme Inheritance

Optional: themes can extend a base theme and override specific tokens. Useful for slight variations (e.g., dark mode variant of a brand).

## Acceptance Criteria

- Same talk content renders correctly with any compatible theme
- Themes are self-contained and portable
- Switching themes is a single-line change (or CLI flag)
- Brand assets (logos, etc.) are part of the theme package
- No content duplication to support multiple brands
