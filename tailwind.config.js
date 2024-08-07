/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './components/**/*.{js,ts,vue}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    theme: {
      extend: {},
      height: {
        'calc-100-minus-100px': 'calc(100% - 100px)',
      },
    },
    plugins: [],
  }
  