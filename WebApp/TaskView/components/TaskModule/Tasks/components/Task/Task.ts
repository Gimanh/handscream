import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class Task extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public task!: TasksState['tasks'][0];

    @Prop( { default: false } )
    public restrictedMode!: boolean;

    @Action( 'updateCompleteStatus', { namespace: 'Tasks' } ) updateCompleteStatus!: TasksStoreActions['updateCompleteStatus'];

    @Action( 'updateDescription', { namespace: 'Tasks' } ) updateDescription!: TasksStoreActions['updateDescription'];

    @Action( 'deleteTask', { namespace: 'Tasks' } ) deleteTask!: TasksStoreActions['deleteTask'];

    get routeTo() {
        if ( !this.restrictedMode ) {
            return {
                name: 'user-goals-id-list-task',
                params: {
                    task: this.task.id.toString()
                }
            };
        }
        return undefined;
    }

    goToDetails() {
        this.$router.push( {
            name: 'user-goals-id-list-task-details',
            params: {
                task: this.task.id.toString()
            }
        } );
    }

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
