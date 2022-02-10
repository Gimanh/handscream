import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { AppCredentialsFormTabs } from '~/classes/util/AppTypes';

@Component
export default class AppCredentialsForm extends AppBase {

    public recoveryModeActive: boolean = false;

    public tab: number = 0;

    get tabs(): AppCredentialsFormTabs {
        return [
            {
                title: this.$t( 'msg.registration' ) as string,
                component: 'registration-form',
                recovery: false
            },
            {
                title: this.$t( 'msg.login' ) as string,
                component: 'login-form',
                recovery: false
            },

            {
                title: this.$t( 'msg.passwordRecovery' ) as string,
                component: 'password-recovery',
                recovery: true
            }
        ];
    }

    get forgotPassword(): string {
        return this.$t( 'msg.forgotPassword' ) as string;
    }

    get resetPassword(): boolean {
        return !!this.$route.query.resetCode && !!this.$route.query.login;
    }

    setRecoveryMode( value: boolean ): void {
        this.recoveryModeActive = value;
        if ( !this.recoveryModeActive ) {
            this.tab = 0;
        }
    }

    canDisplayComponent( cmp: AppCredentialsFormTabs[0] ): boolean {
        if ( this.recoveryModeActive ) {
            return cmp.recovery;
        }
        return !cmp.recovery;
    }

    created(): void {
        console.log( this.$route );
    }
}
