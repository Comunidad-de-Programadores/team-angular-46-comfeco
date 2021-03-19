module.exports = {
    prefix: '',
    purge: {
      enabled: true,
      preserveHtmlElements: false,
      content: [
        './apps/**/*.{html,scss,ts}',
        './libs/**/*.{html,scss,ts}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
};
