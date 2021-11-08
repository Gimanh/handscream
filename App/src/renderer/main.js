import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.css'
import '@/assets/material-icons/material-icons.css'
import '@/assets/material-icons/material-icons-outlined.css'
import '@/assets/vue-ctk-date-time-picker.css'
import '@/assets/app.css'
import '@/assets/app-new.css'
import TaskView from '@/plugins/task_view'
import VueI18n from 'vue-i18n'
import draggable from 'vuedraggable'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import vuetify from '@/plugins/vuetify'
import { AxiosPlugin } from '@/plugins/axios';
import { LocalStoragePlugin } from '@/plugins/local_storage';

Vue.use( VueI18n );
Vue.use( TaskView );
Vue.use( LocalStoragePlugin, { namespace: 'tv' } );
Vue.use( AxiosPlugin, {
    withCredentials: true,
    baseURL: 'http://tvapi.localhost',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    xsrfCookieName: 'XSRF-TOKEN',
    adapter: require( 'axios/lib/adapters/xhr' )
} );

if ( !process.env.IS_WEB ) Vue.use( require( 'vue-electron' ) );

// Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.component( 'draggable', draggable );
Vue.component( 'VueCtkDateTimePicker', VueCtkDateTimePicker );

Vue.prototype.$eventBus = new Vue();

const messages = {
    en: require( './locale/en.json' ),
    ru: require( './locale/ru.json' ),
    de: require( './locale/de.json' ),
};

const { app } = require( 'electron' ).remote;
let locale = app.getLocale().split( '-' );
let localeLang = locale[ 0 ];
if ( !messages[ localeLang ] ) {
    localeLang = 'en';
}

const i18n = new VueI18n( {
    locale: localeLang,
    messages,
    silentTranslationWarn: true,
} );

/* eslint-disable no-new */
new Vue( {
    components: { App },
    router,
    store,
    vuetify,
    i18n,
    template: '<App/>'
} ).$mount( '#app' );
