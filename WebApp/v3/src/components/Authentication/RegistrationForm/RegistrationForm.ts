import { defineComponent } from 'vue';
import qs from 'qs';
import { mdiEye } from '@mdi/js';
import { mdiEyeOff } from '@mdi/js';
import type { FormFieldRules, RegistrationResult } from '@/helpers/AppTypes';
import PasswordHelper from '@/helpers/PasswordHelper';
import { validLogin } from '@/helpers/Helper';
import type { AppResponse } from '@/types/global-app.types';

export default defineComponent( {
    data() {
        return {
            url: '/module/auth/registration',
            login: '',
            email: '',
            password: '',
            passwordRepeat: '',
            valid: true,
            passwordType: 'password', // 'password' | 'text'
            passwordRepeatType: 'password', //'password' | 'text'
            registrationResponse: {
                registration: false,
                confirmEmail: false
            },
            showAlert: false,
            termAccepted: false,
            checkInProcess: false,
            loginAlreadyExists: false,
        }
    },
    components: {
        // TermOfUse: defineAsyncComponent(
        //     () => import('~/components/TermOfUse/TermOfUse.vue')
        // ),
    },
    computed: {
        isAccepted(): boolean {
            return this.termAccepted;
        },

        passwordIcon(): string {
            return this.passwordType === 'password' ? mdiEye : mdiEyeOff;
        },

        passwordRepeatIcon(): string {
            return this.passwordRepeatType === 'password' ? mdiEye : mdiEyeOff;
        },

        alertType(): 'success' | 'warning' {
            return this.registrationResponse.registration ? 'success' : 'warning';
        },

        messageRegistration(): string {
            if ( this.registrationResponse.registration ) {
                return this.$t( 'msg.registrationSuccess' ) as string;
            }
            return this.$t( 'msg.registrationError' ) as string;
        },

        confirmMessage(): string {
            if ( this.registrationResponse.confirmEmail ) {
                return this.$t( 'msg.confirmEmail' ) as string;
            }
            return '';
        },

        credentialsRules(): FormFieldRules {
            return [
                ( v: string ) => !!v || this.$t( 'msg.requiredField' ) as string,
                ( v: string ) => {
                    return PasswordHelper.check( v ) || this.$t( 'msg.passwordStrength' ) as string;
                }
            ];
        },

        passwordRepeatRule(): FormFieldRules {
            return [
                ( v: string ) => v === this.password || this.$t( 'msg.requiredField' ) as string,
                ( v: string ) => {
                    return PasswordHelper.check( v ) || this.$t( 'msg.passwordStrength' ) as string;
                }
            ];
        },

        loginRules(): FormFieldRules {
            return [
                ( v: string ) => ( !!v && validLogin( v ) ) || this.$t( 'msg.requiredField' ) as string,
                ( v: string ) => ( !!v && !this.loginAlreadyExists ) || this.$t( 'msg.loginExists' ) as string
            ];
        },

        loginLabel(): string {
            return this.$t( 'msg.login' ) as string;
        },

        passwordLabel(): string {
            return this.$t( 'msg.password' ) as string;
        },

        emailLabel(): string {
            return this.$t( 'msg.email' ) as string;
        },

        passwordLabelRepeat(): string {
            return this.$t( 'msg.passwordRepeat' ) as string;
        },

        emailRule(): FormFieldRules {
            return [
                ( email: string ) => {
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' ) as string;
                }
            ];
        }
    },
    methods: {
        async checkLoginOnServer() {
            this.checkInProcess = true;
            //FIXME check response
            const result = await this.$axios.get<AppResponse<{ exists: boolean }>>( `/check/app/user/${ this.login }` )
                .catch( err => console.log( err ) );
            if ( result ) {
                this.loginAlreadyExists = result.data.response.exists;
                this.$refs.form.validate();
            }
            this.checkInProcess = false;
        },

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
                const result = await this.$axios.post<RegistrationResult>( url, qs.stringify( data ) )
                    .catch( ( err ) => console.log( err ) );
                if ( result ) {
                    this.registrationResponse = result.data;
                    this.showAlert = true;
                }
            }
        },

        inversePasswordType() {
            this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        },

        inversePasswordRepeatType() {
            this.passwordRepeatType = this.passwordRepeatType === 'text' ? 'password' : 'text';
        },

        termAcceptSuccessHandler() {
            this.termAccepted = true;
        },

        termAcceptCancelHandler() {
            this.termAccepted = false;
        }
    }
} );
