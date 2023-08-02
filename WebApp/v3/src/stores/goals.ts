import { defineStore } from 'pinia';
import type { GoalItem, GoalItemAdd, GoalItemDelete, GoalItemUpdate, GoalsStoreState } from '@/types/goals';
import $api from '@/helpers/axios';
import type { AppResponse } from '@/types/global-app';

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
        async deleteGoal( goal: GoalItemDelete ) {

        }
    }
} )
