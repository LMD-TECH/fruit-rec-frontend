// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#2E7D32", // Your custom color
            foreground: "#ffffff", // Adjust foreground color if needed
          },
        },
      },
    },
    plugins: [],
  };