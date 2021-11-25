import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';

export class GoalsState {

}

export class GoalsMutations extends Mutations<GoalsState> {

}

export class GoalsStoreGetters extends Getters<GoalsState> {

}

export class GoalsStoreActions extends Actions<GoalsState, GoalsStoreGetters, GoalsMutations, GoalsStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

}

const module = new Module( {
    state: GoalsState,
    getters: GoalsStoreGetters,
    mutations: GoalsMutations,
    actions: GoalsStoreActions
} );
export { module as Goals };
export default module;
