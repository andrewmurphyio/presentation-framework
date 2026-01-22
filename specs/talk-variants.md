# Talk Variants

System for creating versions of a talk (e.g. audience-specific or length-specific).

## Job to Be Done

Deliver tailored versions of the same core talk to different audiences (technical vs exec, beginner vs advanced) without maintaining separate copies.

## Variant Concept

A variant is a named audience profile that affects which content is included. Examples:

- `technical` vs `executive`
- `beginner` vs `intermediate` vs `advanced`
- `short` vs `full` (for time-based variants)
- `internal` vs `public`

## Conditional Content

Slides and content blocks can be tagged with variant conditions:

- **Include when**: Show this content only for specific variants
- **Exclude when**: Hide this content for specific variants
- **Default**: Show unless explicitly excluded

Conditions can combine multiple dimensions (e.g., "technical AND advanced").

## What Can Be Conditioned

- Entire slides (include/exclude from deck)
- Sections of slides (show/hide content blocks)
- Content variations (swap one block for another based on variant)
- Speaker notes (different notes for different audiences)

## Variant Metadata

Each variant can have associated metadata for CFP purposes:

- Audience level
- Target audience description
- Duration estimate
- Prerequisites

If the same metadata value is given for a variant, it overrides the main talk's

## Acceptance Criteria

- Single source content, multiple audience outputs
- Variant logic is readable in source (not hidden)
- Can preview any variant quickly
- Combining variants works (e.g., technical + short)
- No orphaned content (easy to see what each variant includes)
- Variant choice can be persisted in talk metadata as a default
