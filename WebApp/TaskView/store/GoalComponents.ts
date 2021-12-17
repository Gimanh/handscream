import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TGoalAddList,
    TGoalAddListResponse, TGoalList, TGoalLists,
    TGoalListStoreStateUrls, TGoalListUpdateResponse, TGoalUpdateList
} from '~/classes/util/GoalTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export class GoalComponentsState {
    public urls: TGoalListStoreStateUrls = {
        addComponentUrl: '/module/goalcomponents/add',
        fetchComponents: '/module/goalcomponents/',
        updateComponents: '/module/goalcomponents/update'
    };

    public components: TGoalLists = [];
}

export class GoalComponentsMutations extends Mutations<GoalComponentsState> {

    addComponent( component: TGoalList ) {
        this.state.components.push( component );
    }

    updateComponents( components: TGoalLists ) {
        this.state.components = components;
    }

    updateComponent( component: TGoalList ) {
        for ( const k of this.state.components ) {
            if ( +k.id === +component.id ) {
                k.name = component.name;
                break;
            }
        }
    }
}

export class GoalComponentsStoreGetters extends Getters<GoalComponentsState> {

}

export class GoalComponentsStoreActions extends Actions<GoalComponentsState, GoalComponentsStoreGetters, GoalComponentsMutations, GoalComponentsStoreActions> {

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
    state: GoalComponentsState,
    getters: GoalComponentsStoreGetters,
    mutations: GoalComponentsMutations,
    actions: GoalComponentsStoreActions
} );
export { module as GoalComponents };
export default module;
