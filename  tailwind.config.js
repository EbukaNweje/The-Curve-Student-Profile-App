// tailwind.config.js
module.exports = {
    theme: {
      extend: {},
    },
    plugins: [],
    future: {
      // 👇 This disables the new color format
      respectDefaultRingColorOpacity: false,
    },
    // 👇 This line forces Tailwind to use RGB colors instead of OKLCH
    experimental: {
      disableUniversalDefaults: true,
    },
  }