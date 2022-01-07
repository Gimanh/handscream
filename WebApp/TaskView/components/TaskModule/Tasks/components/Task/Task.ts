import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksStoreActions } from '~/store/Tasks';
import { AppTask } from '~/classes/util/TaskTypes';

@Component
export default class Task extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public task!: AppTask;

    @Prop( { default: false } )
    public restrictedMode!: boolean;

    @Prop( { default: false } )
    public subtask!: boolean;

    @Action( 'updateCompleteStatus', { namespace: 'Tasks' } ) updateCompleteStatus!: TasksStoreActions['updateCompleteStatus'];

    @Action( 'updateDescription', { namespace: 'Tasks' } ) updateDescription!: TasksStoreActions['updateDescription'];

    @Action( 'deleteTask', { namespace: 'Tasks' } ) deleteTask!: TasksStoreActions['deleteTask'];

    @Action( 'fetchSubtasksForTask', { namespace: 'Tasks' } ) fetchSubtasksForTask!: TasksStoreActions['fetchSubtasksForTask'];

    @Watch( '$route.params.task', { deep: true, immediate: true } )
    async taskRouteWatcher( value: string, oldValue: string ) {
        if ( +value === +this.task.id ) {
            if ( value !== oldValue ) {
                await this.fetchSubtasksForTask( +value );
            }
        }
    }

    get routeTo() {
        if ( !this.restrictedMode ) {
            if ( this.subtask ) {
                return {
                    name: 'user-goals-id-list-task-subtask',
                    params: {
                        subtask: this.task.id.toString()
                    }
                };
            } else {
                return {
                    name: 'user-goals-id-list-task',
                    params: {
                        task: this.task.id.toString()
                    }
                };
            }
        }
        return undefined;
    }

    get showSubTasks() {
        return +this.$route.params.task === +this.task.id;
    }

    goToDetails() {
        if ( !this.subtask ) {
            this.$router.push( {
                name: 'user-goals-id-list-task-details',
                params: {
                    task: this.task.id.toString()
                }
            } );
        } else {
            this.$router.push( {
                name: 'user-goals-id-list-task-subtask-details',
                params: {
                    subtask: this.task.id.toString()
                }
            } );
        }

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
