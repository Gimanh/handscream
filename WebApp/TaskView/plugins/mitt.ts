import { Plugin } from '@nuxt/types';
import mitt from 'mitt';
import { AppEvents } from '~/classes/util/AppEvents';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const injectMitt: Plugin = ( context, inject ) => {
    context.$mitt = mitt<AppEvents>();
    inject( 'mitt', context.$mitt );
};

export default injectMitt;
