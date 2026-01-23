import type { LayoutDefinition } from '../../types/layout';

/**
 * Image-right layout - content on left, image on right
 *
 * A layout with a title at the top, content on the left (60%),
 * and an image on the right (40%). Creates visual hierarchy with
 * the content as primary focus and image as supporting element.
 *
 * Features:
 * - Three zones: "title" (top), "content" (left 60%), "image" (right 40%)
 * - Asymmetric grid layout emphasizing content
 * - Image provides visual support for the textual content
 *
 * This layout is ideal for:
 * - Text-heavy content with supporting visuals
 * - Feature descriptions with screenshots
 * - Explanations with diagrams on the side
 * - Content with illustrative images
 * - Articles with side imagery
 */
export const imageRightLayout: LayoutDefinition = {
  name: 'image-right',
  description: 'Content on left (60%), image on right (40%)',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'content',
      gridArea: 'content',
      description: 'Text content (left side)',
    },
    {
      name: 'image',
      gridArea: 'image',
      description: 'Image content (right side)',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "content image"
  `,
  gridTemplateColumns: '3fr 2fr',
  gridTemplateRows: 'auto 1fr',
};
