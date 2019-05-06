INLINE_ELEMENTS = [
  "a",
  "abbr",
  "audio",
  "b",
  "bdi",
  "bdo",
  "canvas",
  "cite",
  "code",
  "data",
  "del",
  "dfn",
  "em",
  "i",
  "iframe",
  "ins",
  "kbd",
  "label",
  "map",
  "mark",
  "noscript",
  "object",
  "output",
  "picture",
  "q",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "svg",
  "time",
  "u",
  "var",
  "video"
]

module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'standard',
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    'eslint:recommended',
    // 'plugin:prettier/recommended',
    'plugin:vue/recommended',
    // 'prettier/vue'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    // 'prettier',
    'import'
  ],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true
  },

  // add your custom rules here
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     singleQuote: true,
    //     trailingComma: 'none',
    //     bracketSpacing: true,
    //     jsxBracketSameLine: false,
    //     parser: 'flow'
    //   }
    // ],
    // allow async-await
    "vue/max-attributes-per-line": 'off',
    // "vue/max-attributes-per-line": ["error", {
    //   "singleline": 4,
    //   "multiline": {
    //     "max": 3,
    //     "allowFirstLine": true
    //   }
    // }],
    "vue/singleline-html-element-content-newline": ["error", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", ...INLINE_ELEMENTS]
    }],
    "vue/html-closing-bracket-newline": 'off',
    "vue/html-closing-bracket-spacing": 'off',
    'no-empty': 'off',
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
