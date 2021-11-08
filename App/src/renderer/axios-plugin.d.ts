import { AxiosStatic } from 'axios';
import LocalStorage from '@/classes/LocalStorage';

declare module 'vue/types/vue' {
    interface Vue {
        $axios: AxiosStatic;
        $ls: LocalStorage;
    }
}
