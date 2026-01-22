# Talk Metadata

Structured and flexible metadata for talks, optimized for CFP submissions.

## Job to Be Done

Store talk information in a reusable format that can populate CFP forms, speaker pages, and talk listings without re-typing the same info.

## Metadata Categories

### Core Information
- Title, tagline, abstract, full description

### Audience Information
- Skill level, target audience, prerequisites

### Logistics
- Duration, format (talk/workshop/etc), language

### Outcomes
- What attendees will learn, topic tags

### History
- Creation date, past presentations, venues

### Assets
- Links to slides, recordings, related resources

## Flexible Fields

Arbitrary fields can be added for CFP-specific questions that don't fit standard categories.

## Variant-Aware Metadata

Metadata fields can have different values per talk variant. For example:

- **duration**: 15 minutes for short variant, 45 minutes for full variant
- **abstract**: Technical version vs executive version
- **outcomes**: Different takeaways for different audiences
- **audience_level**: Beginner for intro variant, advanced for deep-dive variant

When exporting metadata for a specific variant, the appropriate field values are used.

## Speaker Metadata

Speaker information is separate from talk metadata and reusable across talks:

- Name, bio (multiple lengths), photo, social links, affiliation

Speaker metadata can also have variant-specific values. For example:

- **bio**: Technical bio emphasizing engineering background vs business bio emphasizing leadership
- **affiliation**: Different titles or roles depending on context

## Acceptance Criteria

- All common CFP fields have a home
- Arbitrary custom fields supported without friction
- Metadata fields can vary by talk variant
- Can reuse speaker info across talks
- Export to copy-paste friendly formats
- Metadata is stored alongside talk source (version controlled)
- Can query/filter talks by metadata (e.g., "find all advanced talks")
