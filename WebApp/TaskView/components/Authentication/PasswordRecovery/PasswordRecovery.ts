import { Component } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { FormFieldRules, RecoveryRequestResponse } from '~/classes/util/AppTypes';

@Component
export default class PasswordRecovery extends AppBase {

    public url: string = '/module/auth/email/recovery';

    public email: string = 'test1@mail.dest';

    public valid: boolean = false;

    public emailSent: boolean = false;

    public sent: boolean = false;

    public $refs!: {
        form: any
    };

    get emailLabel(): string {
        return this.$t( 'msg.email' ) as string;
    }

    get emailRule(): FormFieldRules {
        return [
            ( email: string ) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' ) as string;
            }
        ];
    }

    get alertInfo(): string {
        return this.sent ? this.$t( 'msg.checkEmail' ) as string : this.$t( 'msg.sendRecoveryEmailError' ) as string;
    }

    get alertType(): 'info' | 'warning' {
        return this.sent ? 'info' : 'warning';
    }

    emitCancel(): void {
        this.$emit( 'cancelRecovery' );
    }

    showInfo() {
        this.emailSent = true;
        setTimeout( () => {
            this.emailSent = false;
            this.emitCancel();
        }, this.sent ? 2000 : 3000 );
    }

    async submit(): Promise<void> {
        if ( this.$refs.form.validate() ) {
            const result = await this.$axios.$post<RecoveryRequestResponse>( this.url, qs.stringify( { email: this.email } ) ).catch( this.logError );
            if ( result ) {
                this.sent = result.sent;
                this.showInfo();
            }
        }

    }
}
