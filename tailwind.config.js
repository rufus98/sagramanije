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
        title: ["BricolageGrotesque-Bold"],
        jakarta: ["PlusJakartaSans-Regular"],
        "jakarta-medium": ["PlusJakartaSans-Medium"],
        "jakarta-semibold": ["PlusJakartaSans-SemiBold"],
        "jakarta-bold": ["PlusJakartaSans-Bold"],
      },
    },
  },
  plugins: [],
};
