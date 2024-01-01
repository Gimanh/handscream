import { defineStore } from 'pinia';
import type { FetchTasksArg, TaskAddArg, TaskAddResponse, TaskItems, TasksStoreState } from '@/types/tasks.types';
import $api from '@/helpers/axios';
import type { AppResponse } from '@/types/global-app.types';
import qs from 'qs';

export const useTasksStore = defineStore( 'tasks', {
    state(): TasksStoreState {
        return {
            urls: {
                addTaskUrl: '/module/tasks/add',
                fetchTasks: '/module/tasks/fetch/tasks',
                updateStatus: '/module/tasks/update/status',
                updateDescription: '/module/tasks/update/description',
                deleteTask: '/module/tasks/delete',
                fetchTaskDetails: '/module/tasks/details',
                updateTaskNote: '/module/tasks/update/note',
                updateTaskDeadline: '/module/tasks/update/deadline',
                fetchSubtasks: '/module/tasks/fetch/subtasks',
                moveTask: '/module/tasks/move/task',
                allPriorities: '/module/tasks/fetch/all/priorities',
                updatePriority: '/module/tasks/update/priority',
                taskHistory: '/module/tasks/fetch/history',
                taskHistoryRecovery: '/module/tasks/recovery/history/state'
            },
            tasks: []
        }
    },
    actions: {
        async addTask( task: TaskAddArg ): Promise<boolean> {
            const result = await $api.post<AppResponse<TaskAddResponse>>( this.urls.addTaskUrl, qs.stringify( task ) )
                .catch( err => console.log( err ) );
            if ( result ) {
                if ( result.data.response.add ) {
                    this.tasks.unshift( result.data.response.task );
                    return true;
                }
            }
            return false;
        },

        async fetchTasks( data: FetchTasksArg ): Promise<boolean> {
            let addMore: boolean = false;
            // if ( this.state.currentListId !== data.componentId ) {
            //     this.tasks = [];
            //     addMore = false;
            // }
            const url = `${ this.urls.fetchTasks }?componentId=${ data.componentId }&page=${ data.page }&showCompleted=${ data.showCompleted }&searchText=${ data.searchText }`;
            const result = await $api.get<AppResponse<TaskItems>>( url ).catch( err => console.log( err ) );
            console.log( result );
            // debugger;
            if ( result && result.data.response ) {
                if ( addMore ) {
                    // this.mutations.addTasks( result.response );
                } else {
                    this.tasks = [...result.data.response];
                }
                return true;
            }
            return false;
        }
    }
} );
