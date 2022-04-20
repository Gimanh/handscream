import { Component, Prop } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TagsState, TagsStoreActions } from '~/store/Tags';
import { TagItem } from '~/classes/util/TagsTypes';
import { AppTask, DetailedTask } from '~/classes/util/TaskTypes';
import { TasksMutations } from '~/store/Tasks';

@Component
export default class TaskTags extends AppBase {

    @Prop( {
        default: () => {
        }
    } )
    public task!: AppTask;

    @State( state => state.Tags.tags ) tags!: TagsState['tags'];

    @State( state => state.Tasks.detailedTask ) detailedTask!: DetailedTask;

    @Action( 'toggleTagForTask', { namespace: 'Tags' } ) toggleTagForTask!: TagsStoreActions['toggleTagForTask'];

    @Action( 'deleteTag', { namespace: 'Tags' } ) deleteTag!: TagsStoreActions['deleteTag'];

    @Mutation( 'addTagToTask', { namespace: 'Tasks' } ) addTagToTask!: TasksMutations['addTagToTask'];

    @Mutation( 'deleteTagFromTask', { namespace: 'Tasks' } ) deleteTagFromTask!: TasksMutations['deleteTagFromTask'];

    public showAddForm: boolean = false;

    addTag() {
        this.showAddForm = true;
    }

    closeAdd() {
        this.showAddForm = false;
    }

    async toggleTag( tag: TagItem ) {
        const result = await this.toggleTagForTask( { taskId: this.task.id, tagId: tag.id } );
        if ( result ) {
            if ( result.response.action === 'add' ) {
                this.addTagToTask( { taskId: this.task.id, tagId: tag.id, taskParentId: this.task.parentId } );
            }
            if ( result.response.action === 'delete' ) {
                this.deleteTagFromTask( { taskId: this.task.id, tagId: tag.id, taskParentId: this.task.parentId } );
            }
        }
    }

    getTagColor( tag: TagItem ) {
        if ( this.detailedTask.tags.includes( tag.id ) ) {
            return tag.color;
        }
        return undefined;
    }

    async deleteTagF( tag: TagItem ) {
        await this.deleteTag( tag );
    }
}
