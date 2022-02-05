import { Component, Prop } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { DETAILED_TASK, TasksMutations, TasksStoreActions } from '~/store/Tasks';
import { DetailedTask } from '~/classes/util/TaskTypes';

@Component
export default class TaskDetails extends AppBase {

    @Prop( { default: false } )
    public subtask!: boolean;

    @State( state => state.Tasks.detailedTask ) detailedTask!: DetailedTask;

    @Action( 'fetchTaskDetails', { namespace: 'Tasks' } ) fetchTaskDetails!: TasksStoreActions['fetchTaskDetails'];

    @Mutation( 'resetDetailedTask', { namespace: 'Tasks' } ) resetDetailedTask!: TasksMutations['resetDetailedTask'];

    public dialog: boolean = true;

    get closeBtnParams() {
        return {
            fab: true,
            elevation: 1,
            xSmall: true
        };
    }

    get taskId() {
        if ( this.subtask ) {
            return +this.$route.params.subtask;
        }
        return +this.$route.params.task;
    }

    get canEditDeadline(): true | undefined {
        return this.detailedTask.permissions.task_can_edit_deadline;
    }

    async created() {
        this.startLoading();
        const result = await this.fetchTaskDetails( +this.taskId );
        this.endLoading();
        if ( !result ) {
            await this.goBack();
        }
    }

    beforeDestroy() {
        this.resetDetailedTask();
    }

    async goBack() {
        let taskId = this.detailedTask.id.toString();
        if ( +taskId === +DETAILED_TASK.id ) {
            if ( this.subtask ) {
                taskId = this.$route.params.subtask;
            } else {
                taskId = this.$route.params.task;
            }
        }
        if ( this.subtask ) {
            await this.$router.push( {
                name: 'user-goals-id-list-task-subtask',
                params: {
                    subtask: taskId.toString()
                }
            } );
        } else {
            await this.$router.push( {
                name: 'user-goals-id-list-task',
                params: {
                    task: taskId.toString()
                }
            } );
        }
    }
}
