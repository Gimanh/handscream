import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';
import { TaskDeleteArg } from '~/classes/util/TaskTypes';

@Component
export default class Task extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public task!: TasksState['tasks'][0];

    @Action( 'updateCompleteStatus', { namespace: 'Tasks' } ) updateCompleteStatus!: TasksStoreActions['updateCompleteStatus'];

    @Action( 'updateDescription', { namespace: 'Tasks' } ) updateDescription!: TasksStoreActions['updateDescription'];

    @Action( 'deleteTask', { namespace: 'Tasks' } ) deleteTask!: TasksStoreActions['deleteTask'];

    async statusChanged( value: boolean ) {
        await this.updateCompleteStatus( {
            complete: value,
            taskId: this.task.id
        } );
    }

    async descriptionChanged( value: string ) {
        await this.updateDescription( {
            description: value,
            taskId: this.task.id
        } );
    }

    async deleteThisTask() {
        await this.deleteTask( +this.task.id );
    }
}
