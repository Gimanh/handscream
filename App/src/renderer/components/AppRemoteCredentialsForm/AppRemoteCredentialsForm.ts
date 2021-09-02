import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class AppRemoteCredentialsForm extends ZMixin {
    public tab: number = 0;

    get tabs() {
        return [
            {
                'title': this.$t( 'msg.login' ),
                'component':'login-form'
            },
            {
                'title': this.$t( 'msg.registration' ),
                'component':'registration-form'
            }
        ];
    }
}
