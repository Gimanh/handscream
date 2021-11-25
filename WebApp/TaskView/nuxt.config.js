import colors from 'vuetify/es5/util/colors';

export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s - TaskView',
        title: 'TaskView',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    router: {
        mode: 'hash'
    },
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/fetch-app-config.ts',
        '@/plugins/components-plugin.ts'
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: false,
    // extensions: [ 'ts', 'js', 'vue' ],
    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
    // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
        '@nuxtjs/i18n'
    ],
    i18n: {
        defaultLocale: 'en',
        vueI18n: {
            fallbackLocale: 'en',
            locales: [
                {
                    code: 'ru',
                    file: 'ru.json'
                },
                {
                    code: 'de',
                    file: 'de.json'
                },
                {
                    code: 'en',
                    file: 'en.json'
                }
            ],
            lazy: true,
            langDir: 'lang/',
            defaultLocale: 'en',
            messages: {
                en: require( './lang/en.json' ),
                ru: require( './lang/ru.json' ),
                de: require( './lang/de.json' )
            }
        }
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: 'http://tvapi.localhost'
    },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en'
        }
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: [ '~/assets/variables.scss' ],
        defaultAssets: false,
        icons: {
            iconfont: 'mdi' // default - only for display purposes
        },
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {}
};
