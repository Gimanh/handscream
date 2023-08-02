import { defineAsyncComponent, defineComponent } from 'vue';
import type { AppCredentialsFormTabs } from '@/components/Authentication/AppCredentialsForm/tabs';
import { LoginTabs } from '@/components/Authentication/AppCredentialsForm/tabs';


export default defineComponent( {
    data(): { [ key: string ]: any } {
        return {
            recoveryModeActive: false,
            tab: 'login-form',
            tabs: LoginTabs
        }
    },

    components: {
        LoginForm: defineAsyncComponent(
            () => import('@/components/Authentication/LoginForm')
        ),
        RegistrationForm: defineAsyncComponent(
            () => import('@/components/Authentication/RegistrationForm')
        ),
        PasswordRecovery: defineAsyncComponent(
            () => import('@/components/Authentication/PasswordRecovery')
        ),
        ResetPassword: defineAsyncComponent(
            () => import('@/components/Authentication/ResetPassword')
        )
    },

    computed: {
        resetPassword(): boolean {
            return !!this.$route.query.resetCode && !!this.$route.query.login;
        },

        forgotPassword(): string {
            return this.$t( 'msg.forgotPassword' ) as string;
        }
    },

    methods: {
        canDisplayComponent( cmp: AppCredentialsFormTabs[0] ): boolean {
            if ( this.recoveryModeActive ) {
                return cmp.recovery;
            }
            return !cmp.recovery;
        },
        setRecoveryMode( value: boolean ): void {
            this.recoveryModeActive = value;
            if ( value ) {
                this.$nextTick( () => {
                    this.tab = 'password-recovery';
                } );
            }
            if ( !this.recoveryModeActive ) {
                this.tab = 'login-form';
            }
        },
    },
    created() {
        console.log( this.$route );
    }
} );
