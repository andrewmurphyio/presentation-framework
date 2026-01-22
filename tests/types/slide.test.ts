import { describe, it, expect } from 'vitest';
import type { Slide, SlideContent } from '@/lib/types/slide';

describe('Slide Types', () => {
  it('should accept a valid SlideContent object', () => {
    const content: SlideContent = {
      title: 'Welcome',
      subtitle: 'An Introduction',
    };

    expect(content.title).toBe('Welcome');
    expect(content.subtitle).toBe('An Introduction');
  });

  it('should accept a valid Slide object', () => {
    const slide: Slide = {
      id: 'slide-1',
      layout: 'title',
      content: {
        title: 'Presentation Framework',
        subtitle: 'Building Better Presentations',
      },
      notes: 'This is the opening slide',
    };

    expect(slide.id).toBe('slide-1');
    expect(slide.layout).toBe('title');
    expect(slide.content.title).toBe('Presentation Framework');
    expect(slide.notes).toBe('This is the opening slide');
  });

  it('should accept a slide without notes', () => {
    const slide: Slide = {
      id: 'slide-2',
      layout: 'content',
      content: {
        body: 'Main content here',
      },
    };

    expect(slide.notes).toBeUndefined();
  });
});
