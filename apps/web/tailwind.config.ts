import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F7F9FC",
                primary: {
                    DEFAULT: "#1E3A5F",
                    light: "#2A4E7A",
                    dark: "#142944",
                },
                accent: {
                    DEFAULT: "#2E86AB",
                    light: "#3A9BC4",
                    dark: "#236A87",
                },
                success: "#27AE60",
                warning: "#E67E22",
                danger: "#E74C3C",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                card: "6px",
                btn: "4px",
            },
        },
        theme: {
            container: {
                center: true,
                padding: "2rem",
                screens: {
                    "2xl": "1400px",
                },
            },
        },
    },
    plugins: [],
};
export default config;
