import { type Config } from "tailwindcss";

export default {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffa200",
        primaryLight: "#FFF5E2",
        primaryHover: "#ff8800",
        primaryDark: "#333533",
        secondaryDark: "#202020",
        shade: "#888888",
      },
      fontFamily: {
        poppins: ['Poppins'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("flowbite/plugin")
  ],
} satisfies Config;
