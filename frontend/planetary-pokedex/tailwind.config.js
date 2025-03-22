module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": {
          900: "#0a192f",
          800: "#112240",
        },
        red: {
          600: "#e63946",
          700: "#d62839",
        },
      },
    },
  },
  plugins: [],
};

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
    },
  },
};