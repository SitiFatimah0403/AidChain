/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// This is a Tailwind CSS configuration file.
// It specifies the paths to the content files that Tailwind should scan for class names.
// The `content` array includes the main HTML file and all JavaScript/TypeScript files in the `src` directory.
// The `theme` object allows for extending the default Tailwind theme, but currently has no extensions.
// The `plugins` array is empty, indicating no additional plugins are being used at this time