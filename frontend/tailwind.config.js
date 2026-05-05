// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // <-- this line must exist exactly like this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}