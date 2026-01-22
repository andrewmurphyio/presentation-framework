# Slide Authoring

How slides are written and structured as code.

## Job to Be Done

Write slides in a simple, readable format that separates content from presentation. Version control friendly.

## Source Format

Slides are defined in a text-based format (likely HTML or a markdown variant that compiles to HTML). Key requirements:

- Human readable and writable
- Diffs well in git
- Supports structured content (not just freeform text)
- Can reference layouts, components, and tokens by name
- Supports conditional content (see audience-variants.md)

## Slide Structure

Each slide specifies:

- **Layout**: Which layout template to use
- **Content**: The actual content, mapped to layout zones
- **Animations**: Build order and animation references (optional)
- **Speaker notes**: Presenter-only notes (optional)
- **Variant conditions**: When this slide appears (optional, see audience-variants.md)

## Talk Structure

A talk/presentation is composed of:

- **Metadata**: Talk-level information (see talk-metadata.md)
- **Theme reference**: Which theme to apply
- **Slides**: Ordered list of slides
- **Sections**: Optional grouping of slides into named sections

## File Organization

Options to consider:

- Single file per talk (all slides in one file)
- Directory per talk (metadata + individual slide files)
- Hybrid (metadata separate, slides in one or more files)

Should support splitting large talks across files for manageability.

## Acceptance Criteria

- Slides are plain text files, version controllable
- Content and presentation concerns are separated
- Referencing layouts/components is simple (by name, not inline definition)
- Speaker notes are supported but not rendered in output
- File format is readable without tooling
