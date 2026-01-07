/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#d90a2c",
                "primary-dark": "#b00825",
                "primary-light": "#ff4757",
                "background": "#f8f9fa",
                "background-dark": "#0f1419",
                "surface": "#ffffff",
                "surface-dark": "#1a1f26",
                "surface-elevated": "#ffffff",
                "surface-elevated-dark": "#252b33",
                "text-main": "#1a1f26",
                "text-secondary": "#6b7280",
                "text-tertiary": "#9ca3af",
                "border": "#e5e7eb",
                "border-dark": "#2d3540",
                "success": "#22c55e",
                "warning": "#f59e0b",
                "error": "#ef4444",
            },
            fontFamily: {
                "sans": ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.08)',
                'elevated': '0 8px 24px rgba(0, 0, 0, 0.12), 0 24px 64px rgba(0, 0, 0, 0.12)',
                'glow-primary': '0 4px 20px rgba(217, 10, 44, 0.25)',
                'glow-primary-lg': '0 8px 32px rgba(217, 10, 44, 0.35)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-in': 'slideIn 0.4s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
