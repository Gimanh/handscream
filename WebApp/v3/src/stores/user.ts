import { defineStore } from 'pinia';
import type { JWTPayload } from '@/helpers/AppTypes';

export const useUserStore = defineStore( 'user', {
    state: () => ( {
        login: '',
        email: '',
        accessToken: '',
        refreshToken: '',
        authType: 'jwt'
    } ),
    actions: {
        setAccessToken( token: string ) {
            this.accessToken = token;
        },
        setRefreshToken( token: string ) {
            this.refreshToken = token;
        },
        setLogin( login: string ) {
            this.login = login;
        },

        setEmail( email: string ) {
            this.email = email;
        },

        setAuthType( type: JWTPayload['type'] ) {
            this.authType = type;
        }
    }
} )



