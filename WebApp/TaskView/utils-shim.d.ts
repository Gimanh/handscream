import LocalStorage from '@/classes/util/LocalStorage';

declare module 'vue/types/vue' {
    interface Vue {
        $ls: LocalStorage;
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $ls: LocalStorage;
    }
    // nuxtContext.$myInjectedFunction
    interface Context {
        $ls: LocalStorage;
    }
}
