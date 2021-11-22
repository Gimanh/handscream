import { AxiosInstance } from 'axios';

export const ACCESS_TOKEN_KEY = 'access';
export const REFRESH_TOKEN_KEY = 'refresh';

export default class LocalStorage {
    protected namespace: string = '';

    constructor( options: { namespace: string } ) {
        this.namespace = options.namespace;
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

    checkTokenAndSetForAxios( axios: AxiosInstance ): void {
        const token = this.getToken();
        if ( token ) {
            axios.defaults.headers.common[ 'Authorization' ] = `Bearer ${ token }`
        }
    }
}
