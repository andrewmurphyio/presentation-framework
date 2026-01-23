/**
 * Debugging Leadership Default Theme (Dark)
 *
 * A theme designed for debuggingleadership.com - focused on engineering leadership,
 * management practices, and creating healthy tech teams. The theme uses colors
 * inspired by code editors and debugging tools, creating a technical but
 * approachable aesthetic for leadership content.
 *
 * Color Philosophy:
 * - Primary: Debug blue (breakpoint/info color) - trust and stability
 * - Secondary: Success green - growth and positive change
 * - Accent: Warning amber - attention and important insights
 * - Error: Bug red - problems to fix
 * - Dark backgrounds with light text for code editor feel
 */

import { Theme } from '../../../../src/lib/theming/theme';
import type { DesignTokens } from '../../../../src/lib/types/tokens';

export const tokens: DesignTokens = {
  colors: {
    // Core brand colors from actual Debugging Leadership presentation
    primary: '#D946EF',      // Vibrant pink/magenta - main headings and brand
    secondary: '#22D3EE',    // Bright cyan - secondary elements and highlights
    accent: '#FB923C',       // Warm orange - emphasis and calls-to-action
    background: '#1E0E2E',   // Deep purple-black background
    foreground: '#FFFFFF',   // Pure white for main text
    muted: '#A78BFA',        // Soft purple for secondary text
    border: '#4C1D95',       // Purple border for subtle separation
    error: '#EF4444',        // Clear red for errors and warnings
  },
  typography: {
    fontFamily: {
      // Technical but readable fonts
      sans: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      // Slightly larger for presentations
      xs: '0.875rem',   // 14px
      sm: '1rem',       // 16px
      base: '1.125rem', // 18px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '2rem',    // 32px
      '3xl': '2.5rem',  // 40px
      '4xl': '3rem',    // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,       // For headings
      normal: 1.6,      // For body text
      relaxed: 1.8,     // For readability
    },
  },
  spacing: {
    // Consistent spacing scale
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
  },
  borders: {
    radius: {
      none: '0',
      sm: '0.25rem',   // 4px - subtle rounding
      base: '0.375rem', // 6px - default
      lg: '0.5rem',    // 8px - buttons/cards
      full: '9999px',  // Pills/circles
    },
    width: {
      thin: '1px',
      base: '2px',
      thick: '3px',
    },
  },
  shadows: {
    // Subtle shadows for dark theme
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 2px 8px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    lg: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 5px 10px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 10px 20px -5px rgba(0, 0, 0, 0.5)',
  },
};

/**
 * Debugging Leadership Default Theme Instance (Dark)
 *
 * Use this theme for presentations about:
 * - Engineering leadership and management
 * - Team health and burnout prevention
 * - Technical culture and practices
 * - Developer experience and productivity
 * - Code reviews and technical mentorship
 */
export const theme = new Theme('debugging-leadership', tokens);

// Default export for convenience
export default theme;