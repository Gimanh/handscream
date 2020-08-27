import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

Vue.use( Vuex );

export default new Vuex.Store( {
    plugins: [ createPersistedState() ],
    strict: process.env.NODE_ENV !== 'production'
} );
