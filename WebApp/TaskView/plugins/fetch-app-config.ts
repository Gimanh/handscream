import { Plugin } from '@nuxt/types';
import LocalStorage from '~/classes/util/LocalStorage';
import { AppConfigResponse } from '~/classes/util/AppTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchConfig: Plugin = async ( context, inject ) => {
    const result = await context.$axios.$get<AppConfigResponse>( '/fetch/app/config' );
    const ls = new LocalStorage( {
        namespace: result.response.namespace || 'task_view',
        axios: context.$axios
    } );
    context.$ls = ls;
    inject( 'ls', ls );
    context.$ls.checkTokenAndSetForAxios();
    context.$ls.updateUserStoreByToken( context.store );
};

export default fetchConfig;
