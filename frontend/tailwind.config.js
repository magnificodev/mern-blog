import flowbite from "flowbite-react/tailwind";
import tailwindScrollbar from "tailwind-scrollbar";
import lineClamp from "@tailwindcss/line-clamp";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [flowbite.plugin(), tailwindScrollbar, lineClamp],
};
