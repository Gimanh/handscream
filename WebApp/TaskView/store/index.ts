import { Module } from 'vuex-smart-module';
import * as stores from './vuex-smart';

const md: any = {};
const storeModules = stores as { [ key: string ]: Module<any, any, any, any> };

for ( const k in storeModules ) {
    md[ k ] = storeModules[ k ];
}

const root = new Module( {
    modules: md
} );

export const {
    state,
    getters,
    mutations,
    actions,
    modules,
    plugins
} = root.getStoreOptions();
