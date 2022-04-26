import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask } from '~/classes/util/TaskTypes';
import { getColor } from '~/classes/util/Helper';
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

    getPriorityColor() {
        for ( const k of this.priorities ) {
            if ( +k.id === +this.task.priorityId ) {
                return getColor( k );
            }
        }
    }

    emitChange( value: boolean ) {
        this.$emit( 'change', value );
    }

}
