import { Component } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksMutations, TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class TaskDetails extends AppBase {

    @State( state => state.Tasks.detailedTask ) detailedTask!: TasksState['detailedTask'];

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

    async created() {
        this.startLoading();
        await this.fetchTaskDetails( +this.$route.params.task );
        this.endLoading();
    }

    beforeDestroy() {
        this.resetDetailedTask();
    }

    async goBack() {
        await this.$router.push( {
            name: 'user-goals-id-list-task',
            params: {
                task: this.detailedTask.id.toString()
            }
        } );
    }
}
