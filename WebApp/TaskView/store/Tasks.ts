import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    TasksStoreStateUrls,
    Tasks,
    TaskAddArg,
    Task,
    TaskAddResponse,
    TaskCompleteChanged, TaskCompleteChangedResponse
} from '~/classes/util/TaskTypes';
import { AppResponse } from '~/classes/util/AppTypes';

export class TasksState {
    public tasks: Tasks = [];
    public urls: TasksStoreStateUrls = {
        addTaskUrl: '/module/tasks/add',
        fetchTasks: '/module/tasks/',
        updateTask: '/module/tasks/update',
        updateStatus: '/module/tasks/update/status'
    };
}

export class TasksMutations extends Mutations<TasksState> {
    addTask( task: Task ) {
        this.state.tasks.push( task );
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
}

const module = new Module( {
    state: TasksState,
    getters: TasksStoreGetters,
    mutations: TasksMutations,
    actions: TasksStoreActions
} );
export { module as Tasks };
export default module;
