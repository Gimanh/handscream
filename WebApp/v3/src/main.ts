import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import api from '@/plugins/axios';
import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';

import './assets/app.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(api);
app.use(i18n);
app.use(vuetify);

app.mount('#app');

export { app }
