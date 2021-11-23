import { Middleware } from '@nuxt/types';

const authenticated: Middleware = ( { store, redirect, $ls } ) => {
    if ( !store.state.User.accessToken ) {
        $ls.invalidateTokens();
        redirect( '/' );
    }
};

export default authenticated;
