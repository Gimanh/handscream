module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended'
    ],
    plugins: [],
    // add your custom rules here
    rules: {
        quotes: [ 2, 'single' ],
        indent: [ 'error', 4, { SwitchCase: 1 } ],
        'space-before-blocks': [ 1, 'always' ],
        'vue/max-attributes-per-line': 'off',
        'vue/no-use-v-if-with-v-for': 'off',
        'vue/no-v-html': 'off',
        'no-trailing-spaces': 'off',
        'padded-blocks': 'off',
        'array-bracket-spacing': [ 'error', 'always' ],
        'vue/script-indent': [ 'error', 4, {
            baseIndent: 1,
            switchCase: 0,
            ignores: []
        }
        ],
        'no-console': 0,
        'space-before-function-paren': 0,
        'space-in-parens': 0,
        'template-curly-spacing': 0,
        'dot-notation': 0,
        'computed-property-spacing': 0,
        semi: [ 2, 'always' ],
        'vue/html-indent': [ 'error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: []
        } ],

        // allow paren-less arrow functions
        'arrow-parens': 0,
        // // allow async-await
        'generator-star-spacing': 0,
        // // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
