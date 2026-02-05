/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 'selector' in newer v4 alpha/beta, but 'class' works for backward compat usually
    // v4 scans files automatically, but explicit content config doesn't hurt if we use JS config
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
