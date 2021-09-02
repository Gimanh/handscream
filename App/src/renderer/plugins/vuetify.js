import Vue from 'vue'
import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

const opts = {
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
};

export default new Vuetify(opts);
