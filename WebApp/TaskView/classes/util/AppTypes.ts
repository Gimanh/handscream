import Vue from 'vue';

export type AppConfigResponse = {
    response: {
        namespace: string
    },
    rid: string | null
};

export type JWTPayload = {
    exp: number
    id: number
    type: 'jwt'
    userData: {
        email: string
        id: number
        login: string
        permissions: {
            [ key: string ]: {
                id: number
                name: string
                description: string
            }
        }
    }
};

export type RefreshTokenResponse = {
    access: string
    refresh: string
}

export interface VuetifyForm extends Vue {
    validate(): boolean
}

export type AppResponse<S> = {
    response: S
    rid: string
};

export type FormFieldRules = ( ( v: string ) => true | string )[]

export type AppCredentialsFormTabs = { title: string, component: string, recovery: boolean }[];

export type RecoveryRequestResponse = { sent: boolean }
    ;
export type ResetPasswordResponse = { reset: boolean };
