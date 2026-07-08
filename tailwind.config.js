/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ec5a35",
      },
      fontFamily: {
        display: "var(--font-display)",
        mono: "var(--font-mono)",
        rounded: "var(--font-rounded)",
        serif: "var(--font-serif)",
        title: ["BricolageGrotesque_700Bold"],
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-medium": ["PlusJakartaSans_500Medium"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
      },
    },
  },
  plugins: [],
};
