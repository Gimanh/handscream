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
    TaskDeadlineUpdateResponse,
    SubtasksAddMutationArg,
    AppTasksMap,
    DetailedTaskResponse,
    MoveTaskResponse,
    MoveTaskArg,
    FetchTasksArg,
    TaskPriorities,
    TaskPrioritiesResponse,
    TaskPriorityUpdateResponse,
    UpdateTaskPriorityArg,
    AddTagToTaskArg, DeleteTagFromTask
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
    permissions: {},
    goalListId: -1,
    priorityId: -1,
    tags: []
};

export const DEFAULT_LIST_ID = -1;
export const DEFAULT_COMPLETED_TASK_ID = -1;

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
        fetchSubtasks: '/module/tasks/fetch/subtasks',
        moveTask: '/module/tasks/move/task',
        allPriorities: '/module/tasks/fetch/all/priorities',
        updatePriority: '/module/tasks/update/priority'
    };

    public detailedTask: DetailedTask = DETAILED_TASK;

    public tasksMap: AppTasksMap = new Map<number, AppTask>();

    public currentListId: number = DEFAULT_LIST_ID;

    public lastCompletedTask: number = DEFAULT_COMPLETED_TASK_ID;

    public priorities: TaskPriorities = [];
}

export class TasksMutations extends Mutations<TasksState> {

    addTask( task: AppTask ) {
        if ( task.parentId !== null ) {
            const tsk = this.state.tasksMap.get( +task.parentId );
            tsk?.subtasks.unshift( task );
        } else {
            this.state.tasks.unshift( task );
        }
        this.state.tasksMap.set( +task.id, task );
    }

    setCurrentListId( id: number ) {
        this.state.currentListId = id;
    }

    setTasks( tasks: AppTasks ) {
        this.state.tasksMap.clear();
        this.state.tasks = tasks;
        for ( const k of this.state.tasks ) {
            this.state.tasksMap.set( +k.id, k );
        }
    }

    addTasks( tasks: AppTasks ) {
        this.state.tasks = [ ...this.state.tasks, ...tasks ];
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
        this.deleteTask( task.id );
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

    setPriorities( priorities: TaskPriorities ) {
        this.state.priorities = priorities;
    }

    setTaskPriority( data: UpdateTaskPriorityArg ) {
        const mainTaskId = data.taskParentId ? data.taskParentId : data.taskId;
        let tsk = this.state.tasksMap.get( +mainTaskId );
        if ( tsk ) {
            if ( data.taskParentId ) {
                for ( const t of tsk.subtasks ) {
                    if ( +t.id === +data.taskId ) {
                        tsk = t;
                        break;
                    }
                }
            }

            tsk.priorityId = data.priorityId;
        }
        if ( this.state.detailedTask.id === data.taskId ) {
            this.state.detailedTask.priorityId = data.priorityId;
        }
    }

    addTagToTask( data: AddTagToTaskArg ) {
        const mainTaskId = data.taskParentId ? data.taskParentId : data.taskId;
        let tsk = this.state.tasksMap.get( +mainTaskId );
        if ( tsk ) {
            if ( data.taskParentId ) {
                for ( const t of tsk.subtasks ) {
                    if ( +t.id === +data.taskId ) {
                        tsk = t;
                        break;
                    }
                }
            }
            tsk.tags.push( +data.tagId );
        }
        if ( +this.state.detailedTask.id === +data.taskId ) {
            this.state.detailedTask.tags.push( +data.tagId );
        }
    }

    deleteTagFromTask( data: DeleteTagFromTask ) {
        const mainTaskId = data.taskParentId ? data.taskParentId : data.taskId;
        let tsk = this.state.tasksMap.get( +mainTaskId );
        if ( tsk ) {
            if ( data.taskParentId ) {
                for ( const t of tsk.subtasks ) {
                    if ( +t.id === +data.taskId ) {
                        tsk = t;
                        break;
                    }
                }
            }
            const index = tsk.tags.indexOf( +data.tagId );
            if ( index !== -1 ) {
                tsk.tags.splice( index, 1 );
            }

        }
        if ( +this.state.detailedTask.id === +data.taskId ) {
            const index = this.state.detailedTask.tags.indexOf( +data.tagId );
            if ( index !== -1 ) {
                this.state.detailedTask.tags.splice( index, 1 );
            }
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

    async fetchTasks( data: FetchTasksArg ): Promise<AppResponse<AppTasks> | void> {
        console.log( data );
        let addMore: boolean = true;
        if ( this.state.currentListId !== data.componentId ) {
            this.mutations.setTasks( [] );
            addMore = false;
        }
        const result = await this.store.$axios.$get<AppResponse<AppTasks>>( `${ this.state.urls.fetchTasks }?componentId=${ data.componentId }&page=${ data.page }&showCompleted=${ data.showCompleted }` )
            .catch( err => console.log( err ) );
        if ( result && result.response ) {
            if ( addMore ) {
                this.mutations.addTasks( result.response );
            } else {
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

    async moveTask( data: MoveTaskArg ): Promise<MoveTaskResponse | void> {
        const result = await this.store.$axios.$post<MoveTaskResponse>( this.state.urls.moveTask, qs.stringify( data ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.deleteTask( data.taskId );
        }
        return result;
    }

    async fetchPriorities(): Promise<TaskPrioritiesResponse | void> {
        const result = await this.store.$axios.$get<TaskPrioritiesResponse>( this.state.urls.allPriorities )
            .catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.setPriorities( result.response );
        }
        return result;
    }

    async updateTaskPriority( data: UpdateTaskPriorityArg ): Promise<TaskPriorityUpdateResponse | void> {
        const result = await this.store.$axios.$post<TaskPriorityUpdateResponse>(
            this.state.urls.updatePriority,
            qs.stringify( data )
        ).catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.setTaskPriority( data );
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
