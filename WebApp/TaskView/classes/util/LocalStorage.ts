import { AxiosInstance } from 'axios';
import { Store } from 'vuex';
import { parseJwt } from '~/classes/util/Helper';
import { JWTPayload } from '~/classes/util/AppTypes';

export const ACCESS_TOKEN_KEY = 'access';
export const REFRESH_TOKEN_KEY = 'refresh';

export default class LocalStorage {

    protected namespace: string = '';

    protected axios!: AxiosInstance;

    public isLoggedIn: boolean = false;

    constructor( options: { namespace: string, axios: AxiosInstance } ) {
        this.namespace = options.namespace;
        this.axios = options.axios;
        this.isLoggedIn = !!this.getToken();
    }

    private key( key: string ): string {
        return `${ this.namespace }.${ key }`;
    }

    getValue( key: string ): string | null {
        return localStorage.getItem( this.key( key ) );
    }

    setValue( key: string, value: { [ key: string ]: any } | string ): void {
        if ( typeof value !== 'string' ) {
            value = JSON.stringify( value );
        }
        localStorage.setItem( this.key( key ), value );
    }

    setToken( token: string ): void {
        this.setValue( ACCESS_TOKEN_KEY, token );
        this.checkTokenAndSetForAxios();
        this.isLoggedIn = true;
    }

    setRefreshToken( refreshToken: string ): void {
        this.setValue( REFRESH_TOKEN_KEY, refreshToken );
    }

    getToken(): string | null {
        return this.getValue( ACCESS_TOKEN_KEY );
    }

    getRefreshToken(): string | null {
        return this.getValue( REFRESH_TOKEN_KEY );
    }

    checkTokenAndSetForAxios(): void {
        const token = this.getToken();
        if ( token ) {
            this.axios.defaults.headers.common[ 'Authorization' ] = `Bearer ${ token }`;
        }
    }

    invalidateTokens() {
        localStorage.removeItem( this.key( REFRESH_TOKEN_KEY ) );
        localStorage.removeItem( this.key( ACCESS_TOKEN_KEY ) );
        delete this.axios.defaults.headers.common[ 'Authorization' ];
        this.isLoggedIn = false;
    }

    updateUserStoreByToken( $store: Store<any> ) {
        const accessToken = this.getToken();
        if ( accessToken ) {
            $store.commit( 'User/setAccessToken', accessToken );
            $store.commit( 'User/setRefreshToken', this.getRefreshToken() );
            const payload = parseJwt<JWTPayload>( accessToken );
            $store.commit( 'User/setLogin', payload.userData.login );
            $store.commit( 'User/setEmail', payload.userData.email );
        }
    }
}
