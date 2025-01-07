/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
        "6xl": "40px",
      },
      zIndex: {
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        100: "100", // Add a custom high z-index value
      },
      backgroundImage: {
        "login-image": "url('/loginpageimage.webp')",
        "search-image": "url('/searchPage.png')",
      },
      fontFamily: {
        poppins: "Poppins, sans-serif",
      },
      colors: {
        "med-green": "#03b58b",
      },
      screens: {
        lsm: "350px",

        esm: "400px",

        em: "480px",

        ew: "510px",

        vem: "560px",

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        mmd: "860px",

        emd: "999px",

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xlg: "1150px",

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        exl: "1300px",

        "1xl": "1440px",

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }

        "3xl": "1600px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* WebKit browsers */,
          },
        },
      });
    },
  ],
};
