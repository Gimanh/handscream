import axios from 'axios';
import qs from 'qs';

let AxiosPlugin = function ( Vue, options ) {
    let $axios = axios.create( options );
    Vue.prototype.$axios = $axios;

    let $ls = Vue.prototype.$ls;

    // for multiple requests
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = ( error, token = null ) => {
        failedQueue.forEach( prom => {
            if ( error ) {
                prom.reject( error );
            } else {
                prom.resolve( token );
            }
        } )

        failedQueue = [];
    }

    $axios.interceptors.response.use( function ( response ) {
        return response;
    }, function ( error ) {

        const originalRequest = error.config;

        if ( error.response.status === 401 && !originalRequest._retry ) {

            if ( isRefreshing ) {
                return new Promise( function ( resolve, reject ) {
                    failedQueue.push( { resolve, reject } )
                } ).then( token => {
                    originalRequest.headers[ 'Authorization' ] = 'Bearer ' + token;
                    return $axios( originalRequest );
                } ).catch( err => {
                    return Promise.reject( err );
                } )
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = $ls.getRefreshToken();
            debugger
            if ( refreshToken ) {
                return new Promise( function ( resolve, reject ) {
                    $axios.post( '/module/auth/refresh/token', qs.stringify( { refreshToken } ) )
                        .then( ( { data } ) => {
                            $ls.setToken( data.access );
                            $ls.setRefreshToken( data.refresh );
                            $ls.checkTokenAndSetForAxios( $axios );
                            originalRequest.headers[ 'Authorization' ] = 'Bearer ' + data.access;
                            processQueue( null, data.access );
                            resolve( $axios( originalRequest ) );
                        } )
                        .catch( ( err ) => {
                            processQueue( err, null );
                            reject( err );
                        } )
                        .finally( () => {
                            isRefreshing = false
                        } )
                } )
            }


        }
        return Promise.reject( error );
    } );
}
export { AxiosPlugin };
export default AxiosPlugin;
