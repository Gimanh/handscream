module.exports = {
    root: true,
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaFeatures: {
            legacyDecorators: true
        }
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        "plugin:vue/recommended"
    ],
    globals: {
        __static: true
    },
    plugins: [
        "vue"
    ],
    'rules': {
        "quotes": [ 2, "single" ],
        "indent": [ "error", 4, { "SwitchCase": 1 } ],
        "space-before-blocks": [ 1, "always" ],
        "vue/max-attributes-per-line": "off",
        "vue/no-use-v-if-with-v-for": "off",
        "vue/no-v-html": "off",

        'vue/script-indent': [ 'error', 4, {
            baseIndent: 1,
            switchCase: 0,
            ignores: []
        } ],

        "vue/html-indent": [ "error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        } ],

        // allow paren-less arrow functions
        'arrow-parens': 0,
        // // allow async-await
        'generator-star-spacing': 0,
        // // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    "overrides": [
        {
            "files": [ "*.vue" ],
            "rules": {
                "indent": "off",
            }
        }
    ]
}
