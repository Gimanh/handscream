import colors from 'vuetify/es5/util/colors';

export default {
    dir: {
        pages: process.env.BUILD === 'admin' ? 'admins' : 'pages'
    },

    env: {
        isAdmin: process.env.BUILD === 'admin'
    },

    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    mode: 'spa',

    telemetry: false,

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
            { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
        ]
    },
    router: {
        mode: 'hash',
        base: process.env.NODE_ENV === 'production' ? './' : undefined
    },
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/app.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/fetch-app-config.ts',
        '@/plugins/components-plugin.ts',
        '@/plugins/token-refresh.ts',
        '@/plugins/mitt.ts'
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
        defaultLocale: 'ru',
        vueI18n: {
            // fallbackLocale: 'en',
            // locales: [
            //     {
            //         code: 'ru',
            //         file: 'ru.json'
            //     },
            //     {
            //         code: 'de',
            //         file: 'de.json'
            //     },
            //     {
            //         code: 'en',
            //         file: 'en.json'
            //     }
            // ],
            // lazy: false,
            // langDir: 'lang/',
            // defaultLocale: 'en',
            messages: {
                en: require( './lang/en.json' ),
                ru: require( './lang/ru.json' )
            }
        }
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: process.env.NODE_ENV !== 'production' ? 'http://tvapi.localhost' : './',
        withCredentials: true
    },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'ru'
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
            dark: false,
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
