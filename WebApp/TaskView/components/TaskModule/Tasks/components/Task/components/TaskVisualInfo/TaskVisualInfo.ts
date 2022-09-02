import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask } from '~/classes/util/TaskTypes';
import { TasksState } from '~/store/Tasks';
import { canWatchPriority, canWatchTags } from '~/classes/util/Helper';
import { TagItem } from '~/classes/util/TagsTypes';
import { TagsState } from '~/store/Tags';

@Component
export default class TaskVisualInfo extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public task!: AppTask;

    @State( state => state.Tasks.priorities ) priorities!: TasksState['priorities'];

    @State( state => state.Tags.tags ) tags!: TagsState['tags'];

    get canWatchTags(): boolean {
        return canWatchTags( this.task );
    }

    get canWatchPriority() {
        return canWatchPriority( this.task );
    }

    getTagColor( tagId: TagItem['id'] ) {
        for ( const k of this.tags ) {
            if ( +k.id === +tagId ) {
                return k.color;
            }
        }
    }
}
