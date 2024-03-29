import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    Goal,
    GoalAddItem,
    AddGoalResponse,
    Goals,
    GoalsStoreStateUrls,
    GoalUpdateResponse, GoalUpdate, DeleteGoalResponse, DeleteGoalArg
} from '~/classes/util/GoalTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export class GoalsState {
    public goals: Goals = [];
    public urls: GoalsStoreStateUrls = {
        addGoalUrl: '/module/goals/add',
        fetchGoals: '/module/goals/fetch',
        updateGoal: '/module/goals/update',
        deleteGoal: '/module/goals/delete'
    };
}

export class GoalsMutations extends Mutations<GoalsState> {
    addGoal( goal: Goal ) {
        this.state.goals.push( goal );
    }

    setGoals( goals: Goals ) {
        this.state.goals = goals;
    }

    updateGoal( goal: Goal ) {
        for ( const k of this.state.goals ) {
            if ( +k.id === +goal.id ) {
                k.name = goal.name;
                k.description = goal.description;
                break;
            }
        }
    }

    deleteGoal( goalId: DeleteGoalArg ) {
        for ( let i = 0; i < this.state.goals.length; i++ ) {
            if ( +goalId === this.state.goals[ i ].id ) {
                this.state.goals.splice( i, 1 );
                break;
            }
        }
    }
}

export class GoalsStoreGetters extends Getters<GoalsState> {

}

export class GoalsStoreActions extends Actions<GoalsState, GoalsStoreGetters, GoalsMutations, GoalsStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

    async addGoal( goal: GoalAddItem ): Promise<AppResponse<AddGoalResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<AddGoalResponse>>( this.state.urls.addGoalUrl, qs.stringify( goal ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.add && result.response.goal ) {
                this.mutations.addGoal( result.response.goal );
            }
        }
        return result;
    }

    async fetchGoals(): Promise<AppResponse<Goals> | void> {
        const result = await this.store.$axios.$get<AppResponse<Goals>>( this.state.urls.fetchGoals )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.length > 0 ) {
                this.mutations.setGoals( result.response );
            }
        }
        return result;
    }

    async updateGoal( goal: GoalUpdate ): Promise<AppResponse<GoalUpdateResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<GoalUpdateResponse>>( this.state.urls.updateGoal, qs.stringify( goal ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.update && result.response.goal ) {
                this.mutations.updateGoal( result.response.goal );
            }
        }
        return result;
    }

    async deleteGoal( goalId: DeleteGoalArg ): Promise<AppResponse<DeleteGoalResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<DeleteGoalResponse>>( this.state.urls.deleteGoal, qs.stringify( { goalId } ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.delete ) {
                this.mutations.deleteGoal( goalId );
            }
        }
        return result;
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
