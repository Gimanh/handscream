import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class AppCredentialsForm extends AppBase {
    public tab: number = 0;

    get tabs() {
        return [
            {
                title: this.$t('msg.login'),
                component: 'login-form'
            },
            {
                title: this.$t('msg.registration'),
                component: 'registration-form'
            }
        ];
    }
}
