import { defineStore } from 'pinia';
import type {
    GoalListAddArg,
    GoalListAddResponse, GoalListDeleteResponse,
    GoalListItem,
    GoalListItems,
    GoalListsStoreState, GoalListUpdateArg, GoalListUpdateResponse
} from '@/types/goal-lists.types';
import $api from '@/helpers/axios';
import type { AppResponse } from '@/types/global-app.types';
import qs from 'qs';
import type { GoalItem } from '@/types/goals.types';


export const useGoalListsStore = defineStore( 'goal-lists', {
    state: (): GoalListsStoreState => ( {
        urls: {
            addListUrl: '/module/goal_lists/add',
            fetchLists: '/module/goal_lists',
            updateList: '/module/goal_lists/update',
            deleteList: '/module/goal_lists/delete'
        },
        lists: []
    } ),
    actions: {
        async addList( listItem: GoalListAddArg ) {
            const result = await $api.post<AppResponse<GoalListAddResponse>>( this.urls.addListUrl, qs.stringify( listItem ) )
                .catch( err => console.log( err ) );
            if ( result ) {
                if ( result.data.response.add && result.data.response.component ) {
                    this.lists.unshift( result.data.response.component );
                    return true;
                }
            }
            return false;
        },
        async fetchLists( goalId: GoalItem['id'] ) {
            debugger;
            this.lists = [];
            const result = await $api.get<AppResponse<GoalListItems>>( `${ this.urls.fetchLists }?goalId=${ goalId }` )
                .catch( err => console.log( err ) );
            if ( result ) {
                if ( result.data.response ) {
                    this.lists = result.data.response
                }
            }
        },
        async deleteList( listId: GoalListItem['id'] ) {
            const result = await $api.post<AppResponse<GoalListDeleteResponse>>( this.urls.deleteList, qs.stringify( { listId } ) );
            if ( result ) {
                if ( result.data.response.delete ) {
                    const index = this.lists.findIndex( ( item ) => +item.id === +listId );
                    index !== -1 && this.lists.splice( index, 1 );
                }
            }
        },
        async updateList( listData: GoalListUpdateArg ) {
            const result = await $api.post<AppResponse<GoalListUpdateResponse>>( this.urls.updateList, qs.stringify( listData ) )
                .catch( err => console.log( err ) );
            if ( result ) {
                if ( result.data.response.update && result.data.response.component ) {
                    const index = this.lists.findIndex( ( item ) => +item.id === +listData.id );
                    if ( index !== -1 ) {
                        this.lists[ index ] = result.data.response.component;
                        return true;
                    }
                }
            }
            return false;
        },
    }
} )
