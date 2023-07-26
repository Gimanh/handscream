import { reactive } from 'vue';
import { $i18n } from '@/plugins/i18n';

export type AppCredentialsFormTabs = {
    title: string,
    component: string,
    recovery: boolean
}[];

export const LoginTabs: AppCredentialsFormTabs = reactive( [
    {
        title: $i18n.t( 'msg.login' ) as string,
        component: 'login-form',
        recovery: false
    },
    {
        title: $i18n.t( 'msg.registration' ) as string,
        component: 'registration-form',
        recovery: false
    },
    {
        title: $i18n.t( 'msg.passwordRecovery' ) as string,
        component: 'password-recovery',
        recovery: true
    }
] );
