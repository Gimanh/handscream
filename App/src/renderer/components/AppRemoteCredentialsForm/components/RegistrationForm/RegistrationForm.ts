import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import axios from 'axios';
import qs from 'qs';

@Component
export default class RegistrationForm extends ZMixin {

    public server: string = 'http://taskviewapi.com/module/auth/registration';

    public login: string = 'user';

    public email: string = 'test@mail.dest'

    public password: string = 'user1!#Q';

    public passwordRepeat: string = 'user1!#Q';

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
        return this.$t( 'msg.server' );
    }

    get loginLabel() {
        return this.$t( 'msg.login' );
    }

    get passwordLabel() {
        return this.$t( 'msg.password' );
    }

    get emailLabel() {
        return this.$t( 'msg.email' );
    }

    get passwordLabelRepeat() {
        return this.$t( 'msg.passwordRepeat' );
    }

    get passwordRepeatRule() {
        return [
            v => v === this.password || this.$t( 'msg.requiredField' )
        ];
    }

    get emailRule() {
        return [
            ( email ) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' );
            },
        ];
    }

    submit() {
        let { server, login, password, passwordRepeat, email } = this;
        let data = {
            email: email.toLowerCase(),
            login: login.toLowerCase(),
            password,
            passwordRepeat
        };
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
