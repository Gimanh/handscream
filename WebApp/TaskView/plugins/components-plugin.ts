import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import { Plugin } from '@nuxt/types';
import * as components from '~/components/index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ComponentsPlugin: Plugin = ( context, inject ) => {
    for ( const k in components ) {
        // @ts-ignore
        const component = components[ k ];
        Vue.component( k, component);
    }
};

export default ComponentsPlugin;
