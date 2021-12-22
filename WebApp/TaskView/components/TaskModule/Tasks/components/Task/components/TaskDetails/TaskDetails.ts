import { Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class TaskDetails extends AppBase {

    @State( state => state.Tasks.detailedTask ) detailedTask!: TasksState['detailedTask'];

    @Action( 'fetchTaskDetails', { namespace: 'Tasks' } ) fetchTaskDetails!: TasksStoreActions['fetchTaskDetails'];

    public dialog: boolean = true;

    get closeBtnParams() {
        return {
            fab: true,
            elevation: 1,
            xSmall: true
        };
    }

    get hasDetailedTask() {
        return this.detailedTask.id !== -1;
    }

    async created() {
        await this.fetchTaskDetails( +this.$route.params.task );
    }
}
