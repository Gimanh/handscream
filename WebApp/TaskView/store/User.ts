import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import { JWTPayload } from '~/classes/util/AppTypes';

/**
 * Class for root state each request to database
 * or server for fetching data must use only actions
 * and then mutation { DONT USE MUTATIONS FOR ACCESS TO DATABASE }
 */
export class UserState {

    public login: string = '';

    public email: string = '';

    public accessToken: string = '';

    public refreshToken: string = '';

    public authType: JWTPayload['type'] = 'jwt';

}

export class UserMutations extends Mutations<UserState> {
    setAccessToken( token: string ) {
        this.state.accessToken = token;
    }

    setRefreshToken( token: string ) {
        this.state.refreshToken = token;
    }

    setLogin( login: string ) {
        this.state.login = login;
    }

    setEmail( email: string ) {
        this.state.email = email;
    }

    setAuthType( type: JWTPayload['type'] ) {
        this.state.authType = type;
    }
}

export class UserStoreGetters extends Getters<UserState> {

}

export class UserStoreActions extends Actions<UserState, UserStoreGetters, UserMutations, UserStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

}

const module = new Module( {
    state: UserState,
    getters: UserStoreGetters,
    mutations: UserMutations,
    actions: UserStoreActions
} );
export { module as User };
export default module;
