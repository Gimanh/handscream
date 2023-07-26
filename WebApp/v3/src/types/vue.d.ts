import { AxiosInstance } from 'axios'
import LocalStorage from '~/app/LocalStorage';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance,
        $refs: {
            [key: string]: HTMLElement|any,
        },
        $ls: LocalStorage,
    }
}
