import { defineStore } from 'pinia';
import type {
    DeleteGoalResponse,
    GoalItem,
    GoalItemAdd,
    GoalItemDelete,
    GoalItemUpdate,
    GoalsStoreState
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
        async fetchGoals() {
            const result = await $api.get<AppResponse<GoalItem[]>>( this.urls.fetchGoals ).catch( err => console.log( err ) );
            this.goals = result && result.data.response || [];
        },
        async addGoal( goal: GoalItemAdd ) {

        },
        async updateGoal( goal: GoalItemUpdate ) {

        },
        async deleteGoal( goalId: GoalItemDelete ) {
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
