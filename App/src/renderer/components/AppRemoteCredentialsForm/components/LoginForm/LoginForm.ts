import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import qs from 'qs';
import { LoginResponse } from '@/components/AppRemoteCredentialsForm/components/LoginForm/Types';
import { Mutation } from 'vuex-class';
import { NS_MAIN_STORE } from '@/store/Types/Consts';
import { initializeDatabase } from '@/store/plugins/API';

@Component
export default class LoginForm extends ZMixin {

    @Mutation( 'setLayout', { namespace: NS_MAIN_STORE } ) setLayout;

    public server: string = 'http://tvapi.localhost/module/auth/login';

    public login: string = 'user';

    public password: string = 'user1!#Q';

    public valid: boolean = true;

    $refs!: {
        form: any
    };

    get credentialsRules() {
        return [
            v => !!v || this.$t( 'msg.requiredField' ),
        ];
    }

    get serverLabel() {
        return this.$t( 'msg.server' )
    }

    get loginLabel() {
        return this.$t( 'msg.login' )
    }

    get passwordLabel() {
        return this.$t( 'msg.password' )
    }

    async submit() {
        let { server, login, password } = this;
        let data = { login, password };
        let validation = this.$refs.form.validate();
        if ( validation ) {
            let result = await this.$axios.post<LoginResponse>( server, qs.stringify( data ) );
            if ( result && result.data ) {
                this.$ls.setToken( result.data.access );
                this.$ls.setRefreshToken( result.data.refresh );
                this.$ls.checkTokenAndSetForAxios( this.$axios );
                initializeDatabase( 'remote', this.version );
                this.setLayout( 'MainLayout' );
                this.$router.push( { name: 'user', params: { user: result.data.userData.login } } );
            }
        }
    }

    cancel() {
        this.$emit( 'cancel' )
    }
}
