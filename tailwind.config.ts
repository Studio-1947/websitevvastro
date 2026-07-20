import type { Config } from 'tailwindcss';

/**
 * Design tokens extracted verbatim from the original site's `css/style.css`
 * `:root` block (see MIGRATION_AUDIT.md §1). These are the *actual* values the
 * static site uses — not Tailwind defaults — so utilities stay 1:1 with source.
 *
 * NOTE: the site's layout is overwhelmingly `clamp()`-based and fluid. Most
 * sizing is preserved as ported CSS (global.css + scoped component styles);
 * Tailwind primarily provides the token vocabulary (colors, fonts, radius,
 * container width, easing) for any utility usage.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#e60000',
          dark: '#9e2a2a',
        },
        ink: '#000000',
        grey: {
          900: '#111111',
          700: '#454545',
          500: '#6b6b6b',
          300: '#b8b8b8',
        },
        line: '#e4e4e4',
        bg: {
          DEFAULT: '#ffffff',
          alt: '#f5f5f5',
        },
        'blue-grey': '#869bb4',
      },
      fontFamily: {
        display: ['Syne', 'Arial', 'sans-serif'],
        body: ['"Google Sans"', 'Arial', 'sans-serif'],
        // DM Sans is used only on the homepage hero eyebrow in the source.
        dm: ['"DM Sans"', '"Google Sans"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '18px', // --radius
        lg: '28px', // --radius-lg
        pill: '999px',
      },
      maxWidth: {
        container: '1760px', // --container
      },
      spacing: {
        gutter: 'clamp(18px, 3.4vw, 55px)', // --gutter
      },
      transitionTimingFunction: {
        // --ease: shared easing across the whole site
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
