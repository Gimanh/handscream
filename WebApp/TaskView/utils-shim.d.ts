import { Emitter } from 'mitt';
import { Store } from 'vuex';
import LocalStorage from '@/classes/util/LocalStorage';
import { AppEvents } from '~/classes/util/AppEvents';
import { AppVuexStoreTypes } from '~/store/AppVuexStoreTypes';

declare module 'vue/types/vue' {
    interface Vue {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
        $stock: Store<AppVuexStoreTypes>;
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
        $stock: Store<AppVuexStoreTypes>;
    }
    // nuxtContext.$myInjectedFunction
    interface Context {
        $ls: LocalStorage;
        $mitt: Emitter<AppEvents>;
        $stock: Store<AppVuexStoreTypes>;
    }
}
