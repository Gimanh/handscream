import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import axios from 'axios';
import qs from 'qs';

@Component
export default class LoginForm extends ZMixin {
    public server: string = 'http://taskviewapi.com/module/auth/login';

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

    submit() {
        let { server, login, password } = this;
        let data = { login, password };
        let validation = this.$refs.form.validate();
        console.log( validation );
        if ( validation ) {
            axios.post( server, qs.stringify( data ) ).then(
                ( result ) => console.log( result )
            );
        }
    }

    cancel() {
        this.$emit( 'cancel' )
    }
}
