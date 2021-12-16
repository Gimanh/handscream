import { Emitter } from 'mitt';
import LocalStorage from '@/classes/util/LocalStorage';
import { AppEvents } from '~/classes/util/AppEvents';

declare module 'vue/types/vue' {
    interface Vue {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
    }
    // nuxtContext.$myInjectedFunction
    interface Context {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
    }
}
