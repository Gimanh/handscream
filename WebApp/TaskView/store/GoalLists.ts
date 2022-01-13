import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TGoalAddList,
    TGoalAddListResponse, TGoalDeleteListResponse, TGoalList, TGoalLists,
    TGoalListStoreStateUrls, TGoalListUpdateResponse, TGoalUpdateList
} from '~/classes/util/GoalTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export class GoalListsState {
    public urls: TGoalListStoreStateUrls = {
        addListUrl: '/module/goal_lists/add',
        fetchLists: '/module/goal_lists',
        updateList: '/module/goal_lists/update',
        deleteList: '/module/goal_lists/delete'
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

    deleteList( listId: number ) {
        for ( let i = 0; i < this.state.lists.length; i++ ) {
            if ( +this.state.lists[ i ].id === listId ) {
                this.state.lists.splice( i, 1 );
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
        const result = await this.store.$axios.$get<AppResponse<TGoalLists>>( `${ this.state.urls.fetchLists }?goalId=${ goalId }` )
            .catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.updateComponents( result.response ?? [] );
        }
        return result;
    }

    async addComponent( component: TGoalAddList ): Promise<AppResponse<TGoalAddListResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TGoalAddListResponse>>( this.state.urls.addListUrl, qs.stringify( component ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.add && result.response.component ) {
                this.mutations.addComponent( result.response.component );
            }
        }
        return result;
    }

    async updateComponent( component: TGoalUpdateList ): Promise<AppResponse<TGoalListUpdateResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TGoalListUpdateResponse>>( this.state.urls.updateList, qs.stringify( component ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.update && result.response.component ) {
                this.mutations.updateComponent( result.response.component );
            }
        }
        return result;
    }

    async deleteList( listId: number ): Promise<AppResponse<TGoalDeleteListResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TGoalDeleteListResponse>>( this.state.urls.deleteList, qs.stringify( { listId } ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.delete ) {
                this.mutations.deleteList( listId );
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
