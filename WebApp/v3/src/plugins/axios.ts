import $api from '@/helpers/axios'
import type { App } from 'vue';
import qs from 'qs';
import type { RefreshTokenResponse } from '@/helpers/AppTypes';
import LocalStorage from '@/helpers/LocalStorage';

let $ls: LocalStorage;
const api = {
    install( app: App ) {
        app.config.globalProperties.$ls = new LocalStorage( {
            namespace: 'task_view',
            axios: $api
        } );
        app.config.globalProperties.$axios = $api;

        $ls = app.config.globalProperties.$ls;

        $ls.checkTokenAndSetForAxios();

        const $axios = app.config.globalProperties.$axios;
        let isRefreshing = false;
        let failedQueue: { resolve: ( value: unknown ) => void, reject: ( value: unknown ) => void }[] = [];

        const processQueue = ( error: any, token: string | null = null ) => {
            failedQueue.forEach( prom => {
                if ( error ) {
                    prom.reject( error );
                } else {
                    prom.resolve( token );
                }
            } );
            failedQueue = [];
        };

        $axios.interceptors.response.use( ( response ) => response, ( error ) => {
            const originalRequest = error.config;
            if ( error.response.status === 401 && !originalRequest._retry ) {
                if ( isRefreshing ) {
                    return new Promise( ( resolve, reject ) => {
                        failedQueue.push( { resolve, reject } );
                    } ).then( token => {
                        originalRequest.headers[ 'Authorization' ] = 'Bearer ' + token;
                        return $axios( originalRequest );
                    } ).catch( err => {
                        return Promise.reject( err );
                    } );
                }
                originalRequest._retry = true;
                isRefreshing = true;
                const refreshToken = $ls.getRefreshToken();
                if ( refreshToken ) {
                    return new Promise( function ( resolve, reject ) {
                        $axios.post<RefreshTokenResponse>( '/module/auth/refresh/token', qs.stringify( { refreshToken } ) )
                            .then( ( data ) => {
                                $ls.setToken( data.data.access );
                                $ls.setRefreshToken( data.data.refresh );
                                $ls.checkTokenAndSetForAxios();
                                $ls.updateUserStoreByToken();
                                originalRequest.headers[ 'Authorization' ] = 'Bearer ' + data.data.access;
                                processQueue( null, data.data.access );
                                resolve( $axios( originalRequest ) );
                            } )
                            .catch( ( err ) => {
                                processQueue( err, null );
                                $ls.invalidateTokens();
                                app.config.globalProperties.$router.push( '/' );
                                reject( err );
                            } )
                            //@ts-ignore PHPSTORM
                            .finally( () => {
                                isRefreshing = false;
                            } );
                    } );
                }
            }
            return Promise.reject( error );
        } );
    }
}

export { $ls }
export default api
