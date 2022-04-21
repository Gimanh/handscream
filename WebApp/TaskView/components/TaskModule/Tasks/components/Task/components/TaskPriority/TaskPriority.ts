import { Component, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksState, TasksStoreActions } from '~/store/Tasks';
import { AppTask, TTaskPriority } from '~/classes/util/TaskTypes';
import { canEditPriority, canWatchPriority, getColor } from '~/classes/util/Helper';

@Component
export default class TaskPriority extends AppBase {

    @Prop( { default: false } )
    public currentlySelected!: number;

    @Prop( {
        default: () => {
        }
    } )
    public task!: AppTask;

    public selected: number | null = null;

    @State( state => state.Tasks.priorities ) priorities!: TasksState['priorities'];

    @Action( 'updateTaskPriority', { namespace: 'Tasks' } ) updateTaskPriority!: TasksStoreActions['updateTaskPriority'];

    get canWatchPriority(): boolean {
        return canWatchPriority( this.task );
    }

    get canEditPriority(): boolean {
        return canEditPriority( this.task );
    }

    created() {
        this.selected = this.currentlySelected;
    }

    async priorityChanged( id: number ) {
        if ( this.selected !== null ) {
            await this.updateTaskPriority( {
                taskId: this.task.id,
                priorityId: id,
                taskParentId: this.task.parentId
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

    getRadioColor( priority: TTaskPriority ): string {
        return getColor( priority );
    }

}
