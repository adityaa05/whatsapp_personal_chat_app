/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#003366", // Footer
          DEFAULT: "#003b73", // Tabs, Primary Buttons
          light: "#00508e", // Hover states[cite: 3]
        },
        panel: {
          bg: "#f6f6f6", //[cite: 3]
          border: "#cfcfcf", //[cite: 3]
        },
        accent: {
          green: "#54ff00", // Active nav, focus[cite: 3]
        },
        table: {
          header: "#e6e6e6", //[cite: 3]
          rowAlt: "#f9f9f9", //[cite: 3]
          hover: "#eef5fb", //[cite: 3]
        },
        layout: {
          content: "#f5f6f8", //[cite: 3]
        },
      },
      fontFamily: {
        sans: ["Montserrat", "Arial", "Helvetica", "sans-serif"], //[cite: 3]
      },
      fontSize: {
        "legacy-body": "12px", //[cite: 3]
        "legacy-nav": "13px", //[cite: 3]
        "legacy-title": "22px", //[cite: 3]
      },
      spacing: {
        xxs: "4px", //[cite: 3]
        xs: "8px", //[cite: 3]
        sm: "12px", //[cite: 3]
        md: "16px", //[cite: 3]
        lg: "20px", //[cite: 3]
      },
      boxShadow: {
        "panel-bevel": "inset 0 1px 0 #ffffff, inset 0 -1px 0 #d6d6d6", //[cite: 3]
        "header-edge": "inset 0 -1px 0 rgba(0,0,0,0.25)", //[cite: 3]
      },
    },
  },
  plugins: [],
};
