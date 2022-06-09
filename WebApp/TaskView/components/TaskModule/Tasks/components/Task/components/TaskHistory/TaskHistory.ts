import { Component, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask, AppTaskHistoryItem, TTaskPriority } from '~/classes/util/TaskTypes';
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

    @State( state => state.Tasks.priorities ) priorities!: TasksState['priorities'];

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
                value: 'completeDescription'
            },
            {
                text: this.$t( 'table.headers.goal_list_id' ) as string,
                value: 'goalListIdDescription'
            },
            {
                text: this.$t( 'table.headers.parent_id' ) as string,
                value: 'parentIdDescription'
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

    getTaskPriorityCode( item: AppTaskHistoryItem ): TTaskPriority['code'] {
        console.log( item[ 'priorityId' ] );
        for ( const k of this.priorities ) {
            if ( k.id === item[ 'priorityId' ] ) {
                return k.code;
            }
        }
        return 'low';
    }

    getLabel( item: AppTaskHistoryItem ): string {
        const code = this.getTaskPriorityCode( item );
        if ( code === 'high' ) {
            return this.$t( 'priority.high' ) as string;
        }
        if ( code === 'low' ) {
            return this.$t( 'priority.low' ) as string;
        }
        if ( code === 'medium' ) {
            return this.$t( 'priority.medium' ) as string;
        }
        return '---';
    }

    async fetchHistory() {
        await this.fetchTaskHistory( this.task.id );
    }

    async created() {
        await this.fetchHistory();
    }

    async accept( item: AppTaskHistoryItem ) {
        const result = await this.recoverTaskState( item.historyId );
        if ( result && result.response.recovery ) {
            this.$router.go( 0 );
        }
    }

    cancel() {
        this.dialog = false;
    }

}
