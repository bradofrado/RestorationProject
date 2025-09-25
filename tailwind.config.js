/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bom: '#F1635C',
        primary: {
          light: '#c59478',
          DEFAULT: '#ad643a',
          dark: '#894219',
        },
        secondary: {
          DEFAULT: '#faf8f2',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        cardForeground: 'var(--card-foreground)',
        popover: 'var(--popover)',
        popoverForeground: 'var(--popover-foreground)',
        primaryForeground: 'var(--primary-foreground)',
        secondaryForeground: 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        mutedForeground: 'var(--muted-foreground)',
        accent: 'var(--accent)',
        accentForeground: 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart1: 'var(--chart-1)',
        chart2: 'var(--chart-2)',
        chart3: 'var(--chart-3)',
        chart4: 'var(--chart-4)',
        chart5: 'var(--chart-5)',
        sidebar: 'var(--sidebar)',
        sidebarForeground: 'var(--sidebar-foreground)',
        sidebarPrimary: 'var(--sidebar-primary)',
        sidebarPrimaryForeground: 'var(--sidebar-primary-foreground)',
        sidebarAccent: 'var(--sidebar-accent)',
        sidebarAccentForeground: 'var(--sidebar-accent-foreground)',
        sidebarBorder: 'var(--sidebar-border)',
        sidebarRing: 'var(--sidebar-ring)',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
