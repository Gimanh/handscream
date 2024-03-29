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

    @Prop( { default: false } )
    public canAddSubtasksInComponent!: boolean;

    public keyIndexes: {
        checkbox: number
        description: number
    } = {
        checkbox: 1,
        description: 1
    };

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

    get canEditStatus(): boolean {
        return !!this.task.permissions.task_can_edit_status;
    }

    get canEditDescription(): boolean {
        return !!this.task.permissions.task_can_edit_description;
    }

    get canAddSubtasks(): boolean {
        return !!this.task.permissions.task_can_add_subtasks || this.canAddSubtasksInComponent;
    }

    get canWatchDetails(): boolean {
        return !!this.task.permissions.task_can_watch_details;
    }

    get canWatchPriority(): boolean {
        return !!this.task.permissions.task_can_watch_priority;
    }

    get canEditPriority(): boolean {
        return !!this.task.permissions.task_can_edit_priority;
    }

    get canWatchTags(): boolean {
        return !!this.task.permissions.task_can_watch_tags;
    }

    get canEditTags(): boolean {
        return !!this.task.permissions.task_can_edit_tags;
    }

    get canWatchSubtasks() {
        return !!this.task.permissions.task_can_watch_subtasks && +this.$route.params.task === +this.task.id;
    }

    get canDeleteTask(): true | undefined {
        return this.task.permissions.task_can_delete;
    }

    get checkboxKey() {
        return 'checkbox_' + this.keyIndexes.checkbox;
    }

    get descriptionKey() {
        return 'description_' + this.keyIndexes.description;
    }

    goToDetails() {
        if ( this.canWatchDetails ) {
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
    }

    async statusChanged( value: boolean ) {
        const result = await this.updateCompleteStatus( {
            complete: value,
            taskId: this.task.id
        } );
        if ( !result ) {
            this.keyIndexes.checkbox++;
        }
    }

    async descriptionChanged( value: string ) {
        const result = await this.updateDescription( {
            description: value,
            taskId: this.task.id
        } );
        if ( !result ) {
            this.keyIndexes.description++;
        }
    }

    async deleteThisTask() {
        if ( this.canDeleteTask ) {
            await this.deleteTask( +this.task.id );
        }
    }
}
