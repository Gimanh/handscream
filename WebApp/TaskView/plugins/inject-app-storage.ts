import { Plugin } from '@nuxt/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchConfig: Plugin = ( context, inject ) => {
    inject( 'stock', context.store );
    context.$stock = context.store;
};

export default fetchConfig;
