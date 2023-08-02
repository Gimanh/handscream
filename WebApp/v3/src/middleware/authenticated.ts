import type { RouteLocationNormalized } from 'vue-router';
import { $ls } from '@/plugins/axios'

export default function authenticated( to: RouteLocationNormalized, from: RouteLocationNormalized ) {
    if ( !$ls.getToken() ) {
        return { name: 'login' };
    }
    return true;
}
