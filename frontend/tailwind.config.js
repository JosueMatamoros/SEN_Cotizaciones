module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#22D3EE",
          "cyan-light": "#67E8F9",
          "cyan-dark": "#06B6D4",
          black: "#0F172A",
        },
        light: {
          bg: "#FFFFFF",
          "bg-secondary": "#F8FAFC",
          "bg-tertiary": "#F1F5F9",
          text: "#0F172A",
          "text-secondary": "#334155",
          "text-muted": "#64748B",
          border: "#E2E8F0",
          accent: "#22D3EE",
        },
      },
    },
  },
  plugins: [],
};
