import { Plugin } from '@nuxt/types';
import qs from 'qs';
import { RefreshTokenResponse } from '~/classes/util/AppTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const axiosTokenRefresh: Plugin = ( context, inject ) => {
    console.log( context.$axios );
    const $ls = context.$ls;
    const $axios = context.$axios;
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
                    $axios.$post<RefreshTokenResponse>( '/module/auth/refresh/token', qs.stringify( { refreshToken } ) )
                        .then( ( data ) => {
                            $ls.setToken( data.access );
                            $ls.setRefreshToken( data.refresh );
                            $ls.checkTokenAndSetForAxios();
                            $ls.updateUserStoreByToken( context.store );
                            originalRequest.headers[ 'Authorization' ] = 'Bearer ' + data.access;
                            processQueue( null, data.access );
                            resolve( $axios( originalRequest ) );
                        } )
                        .catch( ( err ) => {
                            processQueue( err, null );
                            reject( err );
                        } )
                        .finally( () => {
                            isRefreshing = false;
                        } );
                } );
            }
        }
        return Promise.reject( error );
    } );
};

export default axiosTokenRefresh;
