import type { LayoutDefinition } from '../../types/layout';

/**
 * Image-left layout - image on left, content on right
 *
 * A layout with a title at the top, an image on the left (40%),
 * and content on the right (60%). Creates visual hierarchy with
 * the image supporting the textual content.
 *
 * Features:
 * - Three zones: "title" (top), "image" (left 40%), "content" (right 60%)
 * - Asymmetric grid layout emphasizing content
 * - Image provides visual context for the content
 *
 * This layout is ideal for:
 * - Product demonstrations with supporting text
 * - Screenshot explanations
 * - Diagrams with descriptions
 * - Photo-based storytelling
 * - Visual examples with annotations
 */
export const imageLeftLayout: LayoutDefinition = {
  name: 'image-left',
  description: 'Image on left (40%), content on right (60%)',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'image',
      gridArea: 'image',
      description: 'Image content (left side)',
    },
    {
      name: 'content',
      gridArea: 'content',
      description: 'Text content (right side)',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "image content"
  `,
  gridTemplateColumns: '2fr 3fr',
  gridTemplateRows: 'auto 1fr',
};
