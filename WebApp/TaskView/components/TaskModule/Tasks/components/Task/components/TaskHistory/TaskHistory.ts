import { Component, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask, AppTaskHistoryItem } from '~/classes/util/TaskTypes';
import { TasksState, TasksStoreActions } from '~/store/Tasks';
import { VuetifyHeaderItems } from '~/classes/util/AppTypes';

@Component
export default class TaskHistory extends AppBase {
    @Prop( {
        default: () => {
        }
    } )

    public task!: AppTask;

    public dialog: boolean = false;

    @State( state => state.Tasks.taskHistory ) taskHistory!: TasksState['taskHistory'];

    @Action( 'fetchTaskHistory', { namespace: 'Tasks' } ) fetchTaskHistory!: TasksStoreActions['fetchTaskHistory'];

    @Action( 'recoverTaskState', { namespace: 'Tasks' } ) recoverTaskState!: TasksStoreActions['recoverTaskState'];

    get headers(): VuetifyHeaderItems {
        return [
            // {
            //     text: this.$t( 'table.headers.id' ) as string,
            //     value: 'id'
            // },
            {
                text: this.$t( 'table.headers.description' ) as string,
                value: 'description'
            },
            {
                text: this.$t( 'table.headers.complete' ) as string,
                value: 'complete'
            },
            {
                text: this.$t( 'table.headers.goal_list_id' ) as string,
                value: 'goal_list_id'
            },
            {
                text: this.$t( 'table.headers.parent_id' ) as string,
                value: 'parent_id'
            },
            // {
            //     text: this.$t( 'table.headers.responsible_id' ) as string,
            //     value: 'responsible_id'
            // },
            {
                text: this.$t( 'table.headers.deadline' ) as string,
                value: 'deadline'
            },
            {
                text: this.$t( 'table.headers.note' ) as string,
                value: 'note'
            },
            {
                text: this.$t( 'table.headers.priority' ) as string,
                value: 'priority'
            },
            {
                text: this.$t( 'table.headers.actions' ) as string,
                value: 'actions',
                sortable: false
            }
        ];
    }

    async fetchHistory() {
        await this.fetchTaskHistory( this.task.id );
    }

    async created() {
        await this.fetchHistory();
    }

    async accept( item: AppTaskHistoryItem ) {
        const result = await this.recoverTaskState( item.history_id );
        if ( result && result.response.recovery ) {
            this.$router.go( 0 );
        }
    }

    cancel() {
        this.dialog = false;
    }

}
