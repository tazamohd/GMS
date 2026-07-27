module.exports = {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SALIS AUTO Brand Colors - Monochrome Palette
        "salis-black": "#010101",
        "salis-white": "#FFFFFF",
        "salis-gray": "#6B7280",
        "salis-gray-light": "#D1D5DB",
        "salis-gray-dark": "#374151",
        "salis-50-black": "#808080",
        
        // Legacy compatibility (map to monochrome)
        "dark-navy": "#010101",
        
        // SALIS AUTO design-system brand tokens (client/src/index.css)
        "salis-blue": "var(--salis-blue)",
        "salis-blue-hover": "var(--salis-blue-hover)",
        "salis-blue-bright": "var(--salis-blue-bright)",
        "salis-navy": "var(--salis-navy)",
        "salis-orange": "var(--salis-orange)",
        "salis-orange-hover": "var(--salis-orange-hover)",

        // shadcn/ui aliases, mapped onto the design-system tokens.
        //
        // These previously read hsl(var(--border)) etc., which assumed a parallel
        // set of bare-HSL-channel variables. The design system defines --ring and
        // --destructive as full color values, so wrapping them in hsl() yields
        // hsl(#0A5ED7) — invalid. Pointing the aliases straight at the tokens
        // keeps one source of truth instead of two that disagree.
        border: "var(--border-default)",
        input: "var(--border-default)",
        ring: "var(--ring)",
        background: "var(--bg-page)",
        foreground: "var(--text-body)",
        primary: {
          DEFAULT: "var(--salis-blue)",
          foreground: "var(--success-fg)",
        },
        secondary: {
          DEFAULT: "var(--surface-inset)",
          foreground: "var(--text-heading)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-fg)",
        },
        muted: {
          DEFAULT: "var(--surface-inset)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--salis-orange)",
          foreground: "var(--warning-fg)",
        },
        popover: {
          DEFAULT: "var(--surface-card)",
          foreground: "var(--text-body)",
        },
        card: {
          DEFAULT: "var(--surface-card)",
          foreground: "var(--text-body)",
        },
      },
      fontFamily: {
        // SALIS AUTO Typography
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        "14-regular": "var(--14-regular-font-family)",
        "body-base": "var(--body-base-font-family)",
        "body-bold-small": "var(--body-bold-small-font-family)",
        "body-emphasized": "var(--body-emphasized-font-family)",
        "body-medium": "var(--body-medium-font-family)",
        "body-regular": "var(--body-regular-font-family)",
        "body-regular-medium": "var(--body-regular-medium-font-family)",
        "body-semibold": "var(--body-semibold-font-family)",
        "caps-md": "var(--caps-md-font-family)",
        "display-large-semibold": "var(--display-large-semibold-font-family)",
        "display-medium-semibold": "var(--display-medium-semibold-font-family)",
        "display-small-semibold": "var(--display-small-semibold-font-family)",
        "headline-bold": "var(--headline-bold-font-family)",
        "headline-medium": "var(--headline-medium-font-family)",
        "headline-semibold": "var(--headline-semibold-font-family)",
        "label-medium": "var(--label-medium-font-family)",
        "label-regular": "var(--label-regular-font-family)",
        "label-small": "var(--label-small-font-family)",
        "m3-title-small": "var(--m3-title-small-font-family)",
        "single-line-body-base": "var(--single-line-body-base-font-family)",
        "text-sm-medium": "var(--text-sm-medium-font-family)",
        "text-sm-normal": "var(--text-sm-normal-font-family)",
        "text-xs-medium": "var(--text-xs-medium-font-family)",
        "title-medium": "var(--title-medium-font-family)",
        "title-regular": "var(--title-regular-font-family)",
        "title-semibold": "var(--title-semibold-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "drop-shadow-100": "var(--drop-shadow-100)",
        shadow: "var(--shadow)",
        "shadow-black-lg": "var(--shadow-black-lg)",
        "shadow-black-sm": "var(--shadow-black-sm)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};
