import { Component } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { FormFieldRules, ResetPasswordResponse } from '~/classes/util/AppTypes';

@Component
export default class ResetPassword extends AppBase {
    public url: string = '/module/auth/password/reset'

    public valid: boolean = false;

    public password: string = '';

    public passwordRepeat: string = '';

    public reset: boolean = true;

    public $refs!: {
        form: any
    };

    get passwordLabel(): string {
        return this.$t( 'msg.password' ) as string;
    }

    get passwordLabelRepeat(): string {
        return this.$t( 'msg.passwordRepeat' ) as string;
    }

    get passwordRepeatRule(): FormFieldRules {
        return [
            ( v: string ) => v === this.password || this.$t( 'msg.requiredField' ) as string
        ];
    }

    get passwordRules(): FormFieldRules {
        return [
            ( v: string ) => !!v || this.$t( 'msg.requiredField' ) as string
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
}
