/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      heading: ["CalSans", "sans-serif"],
      light: ["PoppinsLight", "sans-serif"],
      regular: ["PoppinsRegular", "sans-serif"],
      medium: ["PoppinsMedium", "sans-serif"],
      semibold: ["PoppinsSemiBold", "sans-serif"],
      bold: ["PoppinsBold", "sans-serif"],
    },
    extend: {
      colors: {
        background: "hsl(0, 0%, 96%)",
        foreground: "hsl(223.8136 0.0000% 3.9388%)",
        primary: "hsl(141.1765 62.9630% 37.0588%)",
        "primary-foreground": "hsl(223.8136 0.0004% 98.0256%)",
        secondary: "hsl(223.8136 0.0002% 96.0587%)",
        "secondary-foreground": "hsl(223.8136 0.0000% 9.0527%)",
        card: "hsl(223.8136 -172.5242% 100.0000%)",
        "card-foreground": "hsl(223.8136 0.0000% 3.9388%)",
        border: "hsl(223.8136 0.0001% 89.8161%)",
        muted: "hsl(223.8136 0.0002% 96.0587%)",
        "muted-foreground": "hsl(223.8136 0.0000% 45.1519%)",
      },
    },
  },
  plugins: [],
};
