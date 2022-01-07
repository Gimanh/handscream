import { Component, Prop } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksMutations, TasksStoreActions } from '~/store/Tasks';
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

    async created() {
        this.startLoading();
        await this.fetchTaskDetails( +this.taskId );
        this.endLoading();
    }

    beforeDestroy() {
        this.resetDetailedTask();
    }

    async goBack() {
        if ( this.subtask ) {
            await this.$router.push( {
                name: 'user-goals-id-list-task-subtask',
                params: {
                    subtask: this.detailedTask.id.toString()
                }
            } );
        } else {
            await this.$router.push( {
                name: 'user-goals-id-list-task',
                params: {
                    task: this.detailedTask.id.toString()
                }
            } );
        }
    }
}
