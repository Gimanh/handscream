import LocalStorage from '@/helpers/LocalStorage';
import type { App } from 'vue';
import $api from '@/helpers/axios';

const lsPlugin = {
    install( app: App ) {
        app.config.globalProperties.$ls = new LocalStorage( {
            namespace: 'task_view',
            axios: $api
        } );
    }
}
export default lsPlugin;
