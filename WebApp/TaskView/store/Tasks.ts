import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TasksStoreStateUrls,
    AppTasks,
    TaskAddArg,
    AppTask,
    TaskAddResponse,
    TaskCompleteChanged,
    TaskCompleteChangedResponse,
    TaskDescriptionChanged,
    TaskDescriptionChangedResponse,
    TaskDeleteResponse,
    TaskIdArg,
    DetailedTask,
    TaskNoteUpdateResponse,
    TaskNoteUpdateArg,
    TaskDeadlineUpdateArg,
    TaskDeadlineUpdateResponse, SubtasksAddMutationArg, AppTasksMap, DetailedTaskResponse
} from '~/classes/util/TaskTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export const DETAILED_TASK: DetailedTask = {
    id: -1,
    description: '',
    complete: false,
    note: null,
    dateComplete: null,
    dateCreation: '',
    deadline: null,
    responsibleUser: null,
    parentId: null,
    subtasks: [],
    permissions: {
        editDescription: false,
        editDeadline: false,
        editNode: false,
        editStatus: false,
        watchDetails: false,
        delete: false,
        watchSubtasks: false,
        addSubtasks: false,
    }
};

export class TasksState {
    public tasks: AppTasks = [];

    public urls: TasksStoreStateUrls = {
        addTaskUrl: '/module/tasks/add',
        fetchTasks: '/module/tasks/fetch/tasks',
        updateStatus: '/module/tasks/update/status',
        updateDescription: '/module/tasks/update/description',
        deleteTask: '/module/tasks/delete',
        fetchTaskDetails: '/module/tasks/details',
        updateTaskNote: '/module/tasks/update/note',
        updateTaskDeadline: '/module/tasks/update/deadline',
        fetchSubtasks: '/module/tasks/fetch/subtasks'
    };

    public detailedTask: DetailedTask = DETAILED_TASK;

    public tasksMap: AppTasksMap = new Map<number, AppTask>();
}

export class TasksMutations extends Mutations<TasksState> {
    addTask( task: AppTask ) {
        if ( task.parentId !== null ) {
            const tsk = this.state.tasksMap.get( +task.parentId );
            tsk?.subtasks.push( task );
        } else {
            this.state.tasks.push( task );
        }
        this.state.tasksMap.set( +task.id, task );
    }

    setTasks( tasks: AppTasks ) {
        this.state.tasksMap.clear();
        this.state.tasks = tasks;
        for ( const k of this.state.tasks ) {
            this.state.tasksMap.set( +k.id, k );
        }
    }

    updateTaskStatus( task: AppTask ) {
        const tsk = this.state.tasksMap.get( +task.id );
        if ( tsk ) {
            tsk.complete = task.complete;
        }
        if ( this.state.detailedTask.id === task.id ) {
            this.state.detailedTask.complete = task.complete;
        }
    }

    updateTaskDescription( task: AppTask ) {
        const tsk = this.state.tasksMap.get( +task.id );
        if ( tsk ) {
            tsk.description = task.description;
        }
        if ( this.state.detailedTask.id === task.id ) {
            this.state.detailedTask.description = task.description;
        }
    }

    deleteTask( taskId: TaskIdArg ) {
        this.state.tasksMap.delete( +taskId );
        for ( let i = 0; i < this.state.tasks.length; i++ ) {
            if ( +taskId === this.state.tasks[ i ].id ) {
                this.state.tasks.splice( i, 1 );
                break;
            }
        }
    }

    resetDetailedTask() {
        this.state.detailedTask = DETAILED_TASK;
    }

    setDetailedTask( detailedTask: DetailedTask ) {
        this.state.detailedTask = detailedTask;
    }

    updateTaskNote( updateData: TaskNoteUpdateArg ) {
        const tsk = this.state.tasksMap.get( +updateData.taskId );
        if ( tsk ) {
            tsk.note = updateData.note;
        }
        if ( this.state.detailedTask.id === updateData.taskId ) {
            this.state.detailedTask.note = updateData.note;
        }
    }

    updateTaskDeadline( updateData: TaskDeadlineUpdateArg ) {
        const tsk = this.state.tasksMap.get( +updateData.taskId );
        if ( tsk ) {
            tsk.deadline = updateData.deadline;
        }
        if ( this.state.detailedTask.id === updateData.taskId ) {
            this.state.detailedTask.deadline = updateData.deadline;
        }
    }

    addSubtasks( data: SubtasksAddMutationArg ) {
        const tsk = this.state.tasksMap.get( +data.taskId );
        if ( tsk ) {
            tsk.subtasks = data.subtasks;
        }
        if ( this.state.detailedTask.id === data.taskId ) {
            this.state.detailedTask.subtasks = data.subtasks;
        }
    }
}

export class TasksStoreGetters extends Getters<TasksState> {

}

export class TasksStoreActions extends Actions<TasksState, TasksStoreGetters, TasksMutations, TasksStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

    async addTask( task: TaskAddArg ): Promise<AppResponse<TaskAddResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskAddResponse>>( this.state.urls.addTaskUrl, qs.stringify( task ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.add ) {
                this.mutations.addTask( result.response.task );
            }
        }
        return result;
    }

    async fetchTasks( componentId: number ): Promise<AppResponse<AppTasks> | void> {
        this.mutations.setTasks( [] );
        const result = await this.store.$axios.$get<AppResponse<AppTasks>>( `${ this.state.urls.fetchTasks }?componentId=${ componentId }` )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.length ) {
                this.mutations.setTasks( result.response );
            }
        }
        return result;
    }

    async updateCompleteStatus( data: TaskCompleteChanged ): Promise<AppResponse<TaskCompleteChangedResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskCompleteChangedResponse>>( this.state.urls.updateStatus, qs.stringify( data ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.task ) {
                this.mutations.updateTaskStatus( result.response.task );
            }
        }
        return result;
    }

    async updateDescription( data: TaskDescriptionChanged ): Promise<AppResponse<TaskDescriptionChangedResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskDescriptionChangedResponse>>( this.state.urls.updateDescription, qs.stringify( data ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.task ) {
                this.mutations.updateTaskDescription( result.response.task );
            }
        }
        return result;
    }

    async deleteTask( taskId: TaskIdArg ): Promise<AppResponse<TaskDeleteResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskDeleteResponse>>( this.state.urls.deleteTask, qs.stringify( { taskId } ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.delete ) {
                this.mutations.deleteTask( taskId );
            }
        }
        return result;
    }

    async fetchTaskDetails( taskId: TaskIdArg ): Promise<AppResponse<DetailedTaskResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<DetailedTaskResponse>>( this.state.urls.fetchTaskDetails,
            qs.stringify( { taskId } ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response ) {
                this.mutations.setDetailedTask( result.response[ 0 ] );
            }
        }
        return result;
    }

    async updateTaskNote( updateData: TaskNoteUpdateArg ): Promise<AppResponse<TaskNoteUpdateResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskNoteUpdateResponse>>( this.state.urls.updateTaskNote,
            qs.stringify( updateData ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response ) {
                this.mutations.updateTaskNote( updateData );
            }
        }
        return result;
    }

    async updateTaskDeadline( updateData: TaskDeadlineUpdateArg ): Promise<AppResponse<TaskDeadlineUpdateResponse> | void> {
        const result = await this.store.$axios.$post<AppResponse<TaskDeadlineUpdateResponse>>( this.state.urls.updateTaskDeadline,
            qs.stringify( updateData ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response ) {
                this.mutations.updateTaskDeadline( updateData );
            }
        }
        return result;
    }

    async fetchSubtasksForTask( taskId: AppTask['id'] ): Promise<AppResponse<AppTask['subtasks']> | void> {
        const result = await this.store.$axios.$get<AppResponse<AppTask['subtasks']>>( `${ this.state.urls.fetchSubtasks }?taskId=${ taskId }` )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response ) {
                this.mutations.addSubtasks( { taskId, subtasks: result.response } );
            }
        }
        return result;
    }
}

const module = new Module( {
    state: TasksState,
    getters: TasksStoreGetters,
    mutations: TasksMutations,
    actions: TasksStoreActions
} );
export { module as Tasks };
export default module;
