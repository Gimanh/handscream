import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TGoalAddList,
    TGoalAddListResponse, TGoalList, TGoalLists,
    TGoalListStoreStateUrls, TGoalListUpdateResponse, TGoalUpdateList
} from '~/classes/util/GoalTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export class GoalListsState {
    public urls: TGoalListStoreStateUrls = {
        addComponentUrl: '/module/goalcomponents/add',
        fetchComponents: '/module/goalcomponents/',
        updateComponents: '/module/goalcomponents/update'
    };

    public lists: TGoalLists = [];
}

export class GoalListsMutations extends Mutations<GoalListsState> {

    addComponent( component: TGoalList ) {
        this.state.lists.push( component );
    }

    updateComponents( components: TGoalLists ) {
        this.state.lists = components;
    }

    updateComponent( component: TGoalList ) {
        for ( const k of this.state.lists ) {
            if ( +k.id === +component.id ) {
                k.name = component.name;
                break;
            }
        }
    }
}

export class GoalListsStoreGetters extends Getters<GoalListsState> {

}

export class GoalListsStoreActions extends Actions<GoalListsState, GoalListsStoreGetters, GoalListsMutations, GoalListsStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

    async fetchAllComponents( goalId: string ): Promise<AppResponse<TGoalLists> | void> {
        this.mutations.updateComponents( [] );
        const result = await this.store.$axios.$get<AppResponse<TGoalLists>>( `${ this.state.urls.fetchComponents }${ goalId }` )
            .catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.updateComponents( result.response ?? [] );
        }
        return result;
    }

    async addComponent( component: TGoalAddList ): Promise<AppResponse<TGoalAddListResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TGoalAddListResponse>>( this.state.urls.addComponentUrl, qs.stringify( component ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.add && result.response.component ) {
                this.mutations.addComponent( result.response.component );
            }
        }
        return result;
    }

    async updateComponent( component: TGoalUpdateList ): Promise<AppResponse<TGoalListUpdateResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TGoalListUpdateResponse>>( this.state.urls.updateComponents, qs.stringify( component ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.update && result.response.component ) {
                this.mutations.updateComponent( result.response.component );
            }
        }
        return result;
    }

}

const module = new Module( {
    state: GoalListsState,
    getters: GoalListsStoreGetters,
    mutations: GoalListsMutations,
    actions: GoalListsStoreActions
} );
export { module as GoalLists };
export default module;
