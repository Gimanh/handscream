import { Component } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { FormFieldRules, ResetPasswordResponse } from '~/classes/util/AppTypes';
import PasswordHelper from '~/classes/util/PasswordHelper';

@Component
export default class ResetPassword extends AppBase {
    public url: string = '/module/auth/password/reset'

    public valid: boolean = false;

    public password: string = '';

    public passwordRepeat: string = '';

    public reset: boolean = true;

    public passwordType: 'password' | 'text' = 'password';

    public passwordRepeatType: 'password' | 'text' = 'password';

    public $refs!: {
        form: any
    };

    get passwordLabel(): string {
        return this.$t( 'msg.password' ) as string;
    }

    get passwordLabelRepeat(): string {
        return this.$t( 'msg.passwordRepeat' ) as string;
    }

    get passwordIcon() {
        return this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
    }

    get passwordRepeatIcon() {
        return this.passwordRepeatType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
    }

    get passwordRules(): FormFieldRules {
        return [
            ( v: string ) => !!v || this.$t( 'msg.requiredField' ) as string,
            ( v: string ) => {
                return PasswordHelper.check(v) || this.$t( 'msg.passwordStrength' ) as string;
            }
        ];
    }

    get passwordRepeatRule(): FormFieldRules {
        return [
            ( v: string ) => v === this.password || this.$t( 'msg.requiredField' ) as string,
            ( v: string ) => {
                return PasswordHelper.check(v) || this.$t( 'msg.passwordStrength' ) as string;
            }
        ];
    }

    get errorResetAlert(): string {
        return this.$t( 'msg.canNotResetPassword' ) as string;
    }

    async cancel(): Promise<void> {
        await this.$router.push( '/' );
    }

    async submit(): Promise<void> {
        if ( this.$refs.form.validate() ) {
            const data = {
                code: this.$route.query.resetCode,
                login: this.$route.query.login,
                password: this.password,
                passwordRepeat: this.passwordRepeat
            };
            const result = await this.$axios.$post<ResetPasswordResponse>( this.url, qs.stringify( data ) ).catch( this.logError );
            if ( result ) {
                this.reset = result.reset;
                if ( this.reset ) {
                    await this.cancel();
                }
            }
        }
    }

    inversePasswordType() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    }

    inversePasswordRepeatType() {
        this.passwordRepeatType = this.passwordRepeatType === 'text' ? 'password' : 'text';
    }
}
