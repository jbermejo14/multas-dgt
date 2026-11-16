// Tailwind se integra por PostCSS para que funcione igual con webpack y con Turbopack.
// Los plugins se declaran por nombre (requisito de Next). El primero solo actúa en Windows;
// ver postcss-tailwind-windows.cjs y el README.
const config = {
  plugins: ["./postcss-tailwind-windows.cjs", "@tailwindcss/postcss"],
};

export default config;
