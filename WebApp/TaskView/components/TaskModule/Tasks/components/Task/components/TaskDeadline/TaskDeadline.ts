import { Component, Prop, Watch } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { Action } from 'vuex-class';
import { TasksState, TasksStoreActions } from '~/store/Tasks';

@Component
export default class TaskDeadline extends AppBase {

    @Prop()
    public taskId!: TasksState['tasks'][0]['id'];

    @Prop()
    public deadline!: TasksState['tasks'][0]['deadline'];

    public dialog: boolean = false;

    public date: string = '';

    public time: string = '';

    public showWarning: boolean = false;

    public dateChangedManually: boolean = false;

    @Action( 'updateTaskDeadline', { namespace: 'Tasks' } ) updateTaskDeadline!: TasksStoreActions['updateTaskDeadline'];

    @Watch( 'deadline', { immediate: true } )
    deadlineWatcher( val: string ) {
        if ( val ) {
            this.setDateFromDeadline();
            this.setTimeFromDeadline();
        }
    }

    @Watch( 'date' )
    dateWatcher( val: string ) {
        if ( val ) {
            if ( !this.time ) {
                this.time = '00:00';
            }
        }
    }

    get saveDisabled() {
        return this.isTimeDisabled;
    }

    get isTimeDisabled() {
        return !this.date;
    }

    get fullDeadline() {
        const value = `${ this.formatDate } ${ this.time }`;
        return value.trim() ? value : null;
    }

    get formatDate() {
        if ( !this.date ) {
            return '';
        }
        const [ year, month, day ] = this.date.split( '-' );
        return `${ day }-${ month }-${ year }`;
    }

    setDateFromDeadline() {
        if ( this.deadline ) {
            this.date = this.deadline.substr( 0, 10 );
        }
    }

    setTimeFromDeadline() {
        if ( this.deadline ) {
            this.time = this.deadline.substr( 11, 5 );
        }
    }

    async save() {
        this.showWarning = false;
        const deadline = `${ this.date } ${ this.time }`;
        const result = await this.updateTaskDeadline( {
            taskId: this.taskId,
            deadline
        } );
        if ( !result || !result.response.update ) {
            this.showWarning = true;
        } else {
            this.dialog = false;
            this.dateChangedManually = false;
        }

    }

    cancel() {
        this.dialog = false;
        if ( !this.deadline ) {
            this.date = '';
            this.time = '';
        }
        if ( this.deadline && this.dateChangedManually ) {
            this.setDateFromDeadline();
            this.setTimeFromDeadline();
        }
    }

    dateChanged() {
        this.dateChangedManually = true;
    }
}
