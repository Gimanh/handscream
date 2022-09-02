import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask } from '~/classes/util/TaskTypes';
import { TasksState } from '~/store/Tasks';

@Component
export default class TaskCheckbox extends AppBase {

    @Prop()
    public complete!: boolean;

    @Prop( {
        default: () => {
        }
    } )
    public task!: AppTask;

    @State( state => state.Tasks.priorities ) priorities!: TasksState['priorities'];

    getPriorityClassColor() {
        for ( const k of this.priorities ) {
            if ( +k.id === +this.task.priorityId ) {
                return 'task-priority__' + k.code;
            }
        }
    }

    emitChange( value: boolean ) {
        this.$emit( 'change', value );
    }

}
