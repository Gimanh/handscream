import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TasksStoreStateUrls,
    Tasks,
    TaskAddArg,
    Task,
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
    TaskDeadlineUpdateResponse, SubtasksAddMutationArg
} from '~/classes/util/TaskTypes';
import { AppResponse } from '~/classes/util/AppTypes';

const DETAILED_TASK: DetailedTask = {
    id: -1,
    description: '',
    complete: false,
    note: null,
    dateComplete: null,
    dateCreation: '',
    deadline: null,
    responsibleUser: null,
    parentId: null,
    subtasks: []
};

export class TasksState {
    public tasks: Tasks = [];

    public urls: TasksStoreStateUrls = {
        addTaskUrl: '/module/tasks/add',
        fetchTasks: '/module/tasks/',
        updateTask: '/module/tasks/update',
        updateStatus: '/module/tasks/update/status',
        updateDescription: '/module/tasks/update/description',
        deleteTask: '/module/tasks/delete',
        fetchTaskDetails: '/module/tasks/details',
        updateTaskNote: '/module/tasks/update/note',
        updateTaskDeadline: '/module/tasks/update/deadline',
        fetchSubtasks: '/module/tasks/fetch/subtasks/for/'
    };

    public detailedTask: DetailedTask = DETAILED_TASK;

}

export class TasksMutations extends Mutations<TasksState> {
    addTask( task: Task ) {
        if ( task.parentId !== null ) {
            for ( const t of this.state.tasks ) {
                if ( +t.id === +task.parentId ) {
                    t.subtasks.push( task );
                }
            }
        } else {
            this.state.tasks.push( task );
        }
    }

    setTasks( tasks: Tasks ) {
        this.state.tasks = tasks;
    }

    updateTaskStatus( task: Task ) {
        for ( const t of this.state.tasks ) {
            if ( t.id === task.id ) {
                t.complete = task.complete;
                break;
            }
        }
        if ( this.state.detailedTask.id === task.id ) {
            this.state.detailedTask.complete = task.complete;
        }
    }

    updateTaskDescription( task: Task ) {
        for ( const t of this.state.tasks ) {
            if ( t.id === task.id ) {
                t.description = task.description;
                break;
            }
        }
    }

    deleteTask( taskId: TaskIdArg ) {
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
        for ( const task of this.state.tasks ) {
            if ( task.id === updateData.taskId ) {
                task.note = updateData.note;
                break;
            }
        }
        if ( this.state.detailedTask.id === updateData.taskId ) {
            this.state.detailedTask.note = updateData.note;
        }
    }

    updateTaskDeadline( updateData: TaskDeadlineUpdateArg ) {
        for ( const task of this.state.tasks ) {
            if ( task.id === updateData.taskId ) {
                task.deadline = updateData.deadline;
                break;
            }
        }
        if ( this.state.detailedTask.id === updateData.taskId ) {
            this.state.detailedTask.deadline = updateData.deadline;
        }
    }

    addSubtasks( data: SubtasksAddMutationArg ) {
        for ( const task of this.state.tasks ) {
            if ( task.id === data.taskId ) {
                task.subtasks = data.subtasks;
                break;
            }
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

    async fetchTasks( componentId: number ): Promise<AppResponse<Tasks> | void> {
        this.mutations.setTasks( [] );
        const result = await this.store.$axios.$get<AppResponse<Tasks>>( `${ this.state.urls.fetchTasks }${ componentId }` )
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

    async fetchTaskDetails( taskId: TaskIdArg ): Promise<AppResponse<DetailedTask> | void> {
        const result = await this.store.$axios.$post<AppResponse<DetailedTask>>( this.state.urls.fetchTaskDetails,
            qs.stringify( { taskId } ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response ) {
                this.mutations.setDetailedTask( result.response );
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

    async fetchSubtasksForTask( taskId: Task['id'] ): Promise<AppResponse<Task['subtasks']> | void> {
        const result = await this.store.$axios.$get<AppResponse<Task['subtasks']>>( `${ this.state.urls.fetchSubtasks }${ taskId }` )
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
