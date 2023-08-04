import { defineStore } from 'pinia';
import type {
    AddGoalResponse,
    DeleteGoalResponse,
    GoalItem,
    GoalItemAdd,
    GoalItemDelete,
    GoalItemUpdate,
    GoalsStoreState, GoalUpdateResponse
} from '@/types/goals';
import $api from '@/helpers/axios';
import type { AppResponse } from '@/types/global-app';
import qs from 'qs';

export const useGoalsStore = defineStore( 'goals', {
    state: (): GoalsStoreState => ( {
        selectedItem: -1,
        goals: [],
        urls: {
            addGoalUrl: '/module/goals/add',
            fetchGoals: '/module/goals/fetch',
            updateGoal: '/module/goals/update',
            deleteGoal: '/module/goals/delete'
        }
    } ),
    actions: {
        async fetchGoals(): Promise<void> {
            const result = await $api.get<AppResponse<GoalItem[]>>( this.urls.fetchGoals ).catch( err => console.log( err ) );
            this.goals = result && result.data.response || [];
        },
        async addGoal( goal: GoalItemAdd ): Promise<boolean> {
            const result = await $api.post<AppResponse<AddGoalResponse>>( this.urls.addGoalUrl, qs.stringify( goal ) )
            if ( result ) {
                result.data.response.add && result.data.response.goal && this.goals.unshift( result.data.response.goal );
                if ( result.data.response.add ) {
                    return true;
                }
            }
            return false;
        },
        async updateGoal( goal: GoalItemUpdate ): Promise<boolean> {
            const result = await $api.post<AppResponse<GoalUpdateResponse>>( this.urls.updateGoal, qs.stringify( goal ) )
                .catch( err => console.log( err ) );
            if ( result ) {
                const responseGoal = result.data.response.goal;
                if ( result.data.response.update && responseGoal ) {
                    const index = this.goals.findIndex( ( goal ) => +goal.id === +responseGoal.id );
                    if ( index !== -1 ) {
                        const g = this.goals[ index ]
                        g.name = responseGoal.name;
                        g.description = responseGoal.description;
                        return true;
                    }
                }
            }
            return false
        },
        async deleteGoal( goalId: GoalItemDelete ): Promise<void> {
            const result = await $api.post<AppResponse<DeleteGoalResponse>>( this.urls.deleteGoal, qs.stringify( { goalId } ) ).catch( err => console.log( err ) );
            if ( result ) {
                if ( result.data.response ) {
                    const index = this.goals.findIndex( ( goal ) => +goal.id === +goalId );
                    this.goals.splice( index, 1 );
                }
            }
        }
    }
} )
