import { Component, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';
import { TTaskPriority } from '~/classes/util/TaskTypes';

@Component
export default class TaskPriority extends AppBase {

    @Prop( { default: false } )
    public currentlySelected!: number;

    @Prop( { default: false } )
    public taskId!: number;

    public selected: number | null = null;

    @State( state => state.Tasks.priorities ) priorities!: TasksState['priorities'];

    @Action( 'updateTaskPriority', { namespace: 'Tasks' } ) updateTaskPriority!: TasksStoreActions['updateTaskPriority'];

    created() {
        this.selected = this.currentlySelected;
    }

    async priorityChanged(id:number) {
        if ( this.selected !== null ) {
            await this.updateTaskPriority( {
                taskId: this.taskId,
                priorityId: id
            } );
        }
    }

    getLabel( priority: TTaskPriority ): string {
        if ( priority.code === 'high' ) {
            return this.$t( 'priority.high' ) as string;
        }
        if ( priority.code === 'low' ) {
            return this.$t( 'priority.low' ) as string;
        }
        if ( priority.code === 'medium' ) {
            return this.$t( 'priority.medium' ) as string;
        }
        return '---';
    }

    getColor( priority: TTaskPriority ): string {
        if ( priority.code === 'high' ) {
            return 'red';
        }
        if ( priority.code === 'low' ) {
            return 'grey';
        }
        if ( priority.code === 'medium' ) {
            return 'orange';
        }
        return 'green';
    }

}
