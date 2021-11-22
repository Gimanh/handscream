import { Module } from 'vuex-smart-module';
import User from '~/store/User';

const root = new Module( {
    modules: {
        User
    }
} );

export const {
    state,
    getters,
    mutations,
    actions,
    modules,
    plugins
} = root.getStoreOptions();
