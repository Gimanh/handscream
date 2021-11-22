import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'

/**
 * Class for root state each request to database
 * or server for fetching data must use only actions
 * and then mutation { DONT USE MUTATIONS FOR ACCESS TO DATABASE }
 */
class MainStoreState {

    public login: string = 'Task View';

}

class MainStoreMutations extends Mutations<MainStoreState> {

    setLogin( login: string ) {
        this.state.login = login;
    }
}

class MainStoreGetters extends Getters<MainStoreState> {

}

class MainStoreActions extends Actions<MainStoreState, MainStoreGetters, MainStoreMutations, MainStoreActions> {
    fetchLicenseText() {
        console.log( 'fetch' );
    }
}

const module = new Module( {
    state: MainStoreState,
    getters: MainStoreGetters,
    mutations: MainStoreMutations,
    actions: MainStoreActions
} );
export default module;
