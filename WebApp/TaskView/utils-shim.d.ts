import LocalStorage from '@/classes/util/LocalStorage';

declare module 'vue/types/vue' {
    interface Vue {
        $ls: LocalStorage;
    }
}
