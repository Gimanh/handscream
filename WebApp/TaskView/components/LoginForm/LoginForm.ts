import { Component } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { LoginResponse } from '~/components/LoginForm/Types';

@Component
export default class LoginForm extends AppBase {

    public url: string = '/module/auth/login';

    public login: string = 'user';

    public password: string = 'user1!#Q';

    public valid: boolean = true;

    $refs!: {
        form: any
    };

    get credentialsRules() {
        return [
            ( v: string ) => !!v || this.$t( 'msg.requiredField' )
        ];
    }

    get loginLabel() {
        return this.$t( 'msg.login' );
    }

    get passwordLabel() {
        return this.$t( 'msg.password' );
    }

    async submit() {
        const { url, login, password } = this;
        const data = { login, password };
        const validation = this.$refs.form.validate();
        if ( validation ) {
            const result = await this.$axios.post<LoginResponse>( url, qs.stringify( data ) ).catch( this.logError );
            if ( result && result.data ) {
                this.$ls.setToken( result.data.access );
                this.$ls.setRefreshToken( result.data.refresh );
                this.$ls.updateUserStoreByToken( this.$store );
                this.redirectToUser();
            }
        }
    }

    cancel() {
        this.$emit( 'cancel' );
    }
}
