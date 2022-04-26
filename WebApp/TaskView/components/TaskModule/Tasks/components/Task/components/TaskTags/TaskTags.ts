import { Component, Prop } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TagsState, TagsStoreActions } from '~/store/Tags';
import { TagItem } from '~/classes/util/TagsTypes';
import { AppTask, DetailedTask } from '~/classes/util/TaskTypes';
import { TasksMutations } from '~/store/Tasks';
import { canEditTags, canWatchTags } from '~/classes/util/Helper';

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

    public showDeleteTagForm: boolean = false;

    public selectedTagForAction: TagItem | null = null;

    public showEditeLabelIcon: boolean = false;

    public showEditTagForm: boolean = false;

    public showDeleteIcon: boolean = false;

    get showActionChipIcon() {
        return this.showDeleteIcon || this.showEditeLabelIcon;
    }

    get canWatchTags(): boolean {
        return canWatchTags( this.task );
    }

    get canEditTags(): boolean {
        return canEditTags( this.task );
    }

    get tagIcon(): string {
        if ( this.showEditeLabelIcon ) {
            return 'mdi-pencil-outline';
        }
        if ( this.showDeleteIcon ) {
            return 'mdi-delete';
        }
        return '';
    }

    addTag() {
        this.showAddForm = true;
    }

    editTags() {
        this.showDeleteIcon = false;
        this.showEditeLabelIcon = !this.showEditeLabelIcon;
    }

    enableDelete() {
        this.showEditeLabelIcon = false;
        this.showDeleteIcon = !this.showDeleteIcon;
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

    iconClickTagHandler( tag: TagItem ) {
        this.selectedTagForAction = tag;
        if ( this.showEditeLabelIcon ) {
            this.showEditTagForm = true;
        } else {
            this.showDeleteTagForm = true;
        }
    }

    cancelDeleting() {
        this.showDeleteTagForm = false;
        this.selectedTagForAction = null;
    }

    async runDeletion() {
        if ( this.selectedTagForAction ) {
            await this.deleteTag( this.selectedTagForAction );
            this.cancelDeleting();
        }
    }

    closeEdit() {
        this.showEditTagForm = false;
        this.selectedTagForAction = null;
    }
}
