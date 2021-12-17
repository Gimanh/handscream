import { Component } from 'vue-property-decorator';
import axios from 'axios';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { RegistrationResult } from '~/components/Authentication/RegistrationForm/Types';

@Component
export default class RegistrationForm extends AppBase {

    public url: string = '/module/auth/registration';

    public login: string = 'user';

    public email: string = 'test@mail.dest'

    public password: string = 'user1!#Q';

    public passwordRepeat: string = 'user1!#Q';

    public valid: boolean = true;

    public registrationResponse: RegistrationResult = {
        registration: false,
        confirmEmail: false
    };

    public $refs!: {
        form: any
    };

    public showAlert: boolean = false;

    get alertType() {
        return this.registrationResponse.registration ? 'success' : 'warning';
    }

    get messageRegistration(): string {
        if ( this.registrationResponse.registration ) {
            return this.$t( 'msg.registrationSuccess' ) as string;
        }
        return this.$t( 'msg.registrationError' ) as string;
    }

    get confirmMessage(): string {
        if ( this.registrationResponse.confirmEmail ) {
            return this.$t( 'msg.confirmEmail' ) as string;
        }
        return '';
    }

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

    get emailLabel() {
        return this.$t( 'msg.email' );
    }

    get passwordLabelRepeat() {
        return this.$t( 'msg.passwordRepeat' );
    }

    get passwordRepeatRule() {
        return [
            ( v: string ) => v === this.password || this.$t( 'msg.requiredField' )
        ];
    }

    get emailRule() {
        return [
            ( email: string ) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' );
            }
        ];
    }

    async submit() {
        const { url, login, password, passwordRepeat, email } = this;
        const data = {
            email: email.toLowerCase(),
            login: login.toLowerCase(),
            password,
            passwordRepeat
        };
        const validation = this.$refs.form.validate();
        if ( validation ) {
            const result = await axios.post<RegistrationResult>( url, qs.stringify( data ) ).catch( this.logError );
            if ( result ) {
                this.registrationResponse = result.data;
                this.showAlert = true;
            }
        }
    }

    cancel() {
        this.$emit( 'cancel' );
    }
}
