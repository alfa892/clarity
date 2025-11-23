/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                medical: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                health: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3eed2',
                    300: '#95deb3',
                    400: '#5ec48f',
                    500: '#38a772',
                    600: '#288659',
                    700: '#226b49',
                    800: '#1e553c',
                    900: '#194633',
                },
                slate: {
                    850: '#1e293b', // Custom dark slate
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(0, 102, 255, 0.3)',
            }
        },
    },
    plugins: [],
}
