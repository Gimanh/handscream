import { defineComponent } from 'vue';
import { mdiEye } from '@mdi/js';
import { mdiEyeOff } from '@mdi/js';
import qs from 'qs';
import type { FormFieldRules, ResetPasswordResponse } from '@/helpers/AppTypes';
import PasswordHelper from '@/helpers/PasswordHelper';
import { logError } from '@/helpers/app-helper';

export default defineComponent( {
    data() {
        return {
            url: '/module/auth/password/reset',
            valid: false,
            password: '',
            passwordRepeat: '',
            reset: true,
            passwordType: 'password' as 'password' | 'text',
            passwordRepeatType: 'password' as 'password' | 'text',
        }
    },
    computed: {
        passwordLabel(): string {
            return this.$t( 'msg.password' ) as string;
        },

        passwordLabelRepeat(): string {
            return this.$t( 'msg.passwordRepeat' ) as string;
        },

        passwordIcon(): string {
            return this.passwordType === 'password' ? mdiEye : mdiEyeOff;
        },

        passwordRepeatIcon(): string {
            return this.passwordRepeatType === 'password' ? mdiEye : mdiEyeOff;
        },

        passwordRules(): FormFieldRules {
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

        errorResetAlert(): string {
            return this.$t( 'msg.canNotResetPassword' ) as string;
        }
    },
    methods: {
        async cancel(): Promise<void> {
            await this.$router.push( '/' );
        },

        async submit(): Promise<void> {
            if ( this.$refs.form.validate() ) {
                const data = {
                    code: this.$route.query.resetCode,
                    login: this.$route.query.login,
                    password: this.password,
                    passwordRepeat: this.passwordRepeat
                };
                const result = await this.$axios.post<ResetPasswordResponse>( this.url, qs.stringify( data ) )
                    .catch( logError );
                if ( result ) {
                    this.reset = result.data.reset;
                    if ( this.reset ) {
                        await this.cancel();
                    }
                }
            }
        },

        inversePasswordType() {
            this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        },

        inversePasswordRepeatType() {
            this.passwordRepeatType = this.passwordRepeatType === 'text' ? 'password' : 'text';
        }
    }
} );
