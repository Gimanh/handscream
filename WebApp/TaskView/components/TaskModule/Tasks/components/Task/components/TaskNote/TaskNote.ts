import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AppTask, TaskNoteValue } from '~/classes/util/TaskTypes';
import { TasksStoreActions } from '~/store/Tasks';

@Component
export default class TaskNote extends AppBase {
    @Prop()
    public note!: TaskNoteValue;

    @Prop()
    public taskId!: AppTask['id'];

    @Prop( { default: false } )
    public canEdit!: boolean;

    public noteModel: TaskNoteValue = this.note;

    public errorMessage: string = '';

    get hideDetails() {
        return this.errorMessage.trim() === '';
    }

    get sendUpdateAgain() {
        return this.hideDetails ? undefined : 'mdi-upload';
    }

    @Action( 'updateTaskNote', { namespace: 'Tasks' } ) updateTaskNote!: TasksStoreActions['updateTaskNote'];

    @Watch( 'note' )
    noteWatcher( val: TaskNoteValue ) {
        this.noteModel = val;
    }

    clearErrorMessage() {
        this.errorMessage = '';
    }

    async updateNote() {
        this.clearErrorMessage();
        const result = await this.updateTaskNote( { taskId: this.taskId, note: this.noteModel } );
        if ( !result || !result.response.update ) {
            this.errorMessage = this.$t( 'task.errorUpdateNote' ) as string;
        } else {
            this.clearErrorMessage();
        }
    }
}
