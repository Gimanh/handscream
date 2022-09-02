import { Component } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { RegistrationResult } from '~/components/Authentication/RegistrationForm/Types';
import { FormFieldRules } from '~/classes/util/AppTypes';
import { validLogin } from '~/classes/util/Helper';
import PasswordHelper from '~/classes/util/PasswordHelper';

@Component
export default class RegistrationForm extends AppBase {

    public url: string = '/module/auth/registration';

    public login: string = '';

    public email: string = ''

    public password: string = '';

    public passwordRepeat: string = '';

    public valid: boolean = true;

    public passwordType: 'password' | 'text' = 'password';

    public passwordRepeatType: 'password' | 'text' = 'password';

    public registrationResponse: RegistrationResult = {
        registration: false,
        confirmEmail: false
    };

    public $refs!: {
        form: any
    };

    public showAlert: boolean = false;

    private termAccepted: boolean = false;

    get isAccepted() {
        return this.termAccepted;
    }

    get passwordIcon() {
        return this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
    }

    get passwordRepeatIcon() {
        return this.passwordRepeatType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
    }

    get alertType(): 'success' | 'warning' {
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

    get credentialsRules(): FormFieldRules {
        return [
            ( v: string ) => !!v || this.$t( 'msg.requiredField' ) as string,
            ( v: string ) => {
                return PasswordHelper.check( v ) || this.$t( 'msg.passwordStrength' ) as string;
            }
        ];
    }

    get passwordRepeatRule(): FormFieldRules {
        return [
            ( v: string ) => v === this.password || this.$t( 'msg.requiredField' ) as string,
            ( v: string ) => {
                return PasswordHelper.check( v ) || this.$t( 'msg.passwordStrength' ) as string;
            }
        ];
    }

    get loginRules(): FormFieldRules {
        return [
            ( v: string ) => ( !!v && validLogin( v ) ) || this.$t( 'msg.requiredField' ) as string
        ];
    }

    get loginLabel(): string {
        return this.$t( 'msg.login' ) as string;
    }

    get passwordLabel(): string {
        return this.$t( 'msg.password' ) as string;
    }

    get emailLabel(): string {
        return this.$t( 'msg.email' ) as string;
    }

    get passwordLabelRepeat(): string {
        return this.$t( 'msg.passwordRepeat' ) as string;
    }

    get emailRule(): FormFieldRules {
        return [
            ( email: string ) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' ) as string;
            }
        ];
    }

    async submit(): Promise<void> {
        const { url, login, password, passwordRepeat, email } = this;
        const data = {
            email: email.toLowerCase(),
            login: login.toLowerCase(),
            password,
            passwordRepeat
        };
        const validation = this.$refs.form.validate();
        if ( validation ) {
            const result = await this.$axios.post<RegistrationResult>( url, qs.stringify( data ) ).catch( this.logError );
            if ( result ) {
                this.registrationResponse = result.data;
                this.showAlert = true;
            }
        }
    }

    inversePasswordType() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    }

    inversePasswordRepeatType() {
        this.passwordRepeatType = this.passwordRepeatType === 'text' ? 'password' : 'text';
    }

    termAcceptSuccessHandler() {
        this.termAccepted = true;
    }

    termAcceptCancelHandler() {
        this.termAccepted = false;
    }
}
