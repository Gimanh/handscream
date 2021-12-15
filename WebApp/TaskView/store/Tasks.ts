import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import { TasksStoreStateUrls, Tasks } from '~/classes/util/TaskTypes';

export class TasksState {
    public goals: Tasks = [];
    public urls: TasksStoreStateUrls = {
        addTaskUrl: '/module/tasks/add',
        fetchTasks: '/module/tasks/fetch',
        updateTask: '/module/tasks/update'
    };
}

export class TasksMutations extends Mutations<TasksState> {

}

export class TasksStoreGetters extends Getters<TasksState> {

}

export class TasksStoreActions extends Actions<TasksState, TasksStoreGetters, TasksMutations, TasksStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
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
