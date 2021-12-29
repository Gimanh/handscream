import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { TasksStoreActions } from '~/store/Tasks';
import { TaskAddArg } from '~/classes/util/TaskTypes';

@Component
export default class TaskAdd extends AppBase {

    @Prop()
    public componentId!: number;

    @Prop( { default: false } )
    public modeSubtask!: boolean;

    @Prop()
    public parentId!: number;

    public taskName: string = '';

    public invalidName: boolean = false;

    @Action( 'addTask', { namespace: 'Tasks' } ) addTask!: TasksStoreActions['addTask'];

    get errorMessage() {
        return this.invalidName ? this.$t( 'msg.requiredField' ) : '';
    }

    get iconForInput(): string {
        if ( this.taskName ) {
            return 'mdi-keyboard-return';
        }
        return 'mdi-keyboard-variant';
    }

    get label(): string {
        if ( this.modeSubtask ) {
            return this.$t( 'task.addSubtask' ) as string;
        }
        return this.$t( 'task.add' ) as string;
    }

    isValidName() {
        return this.taskName && !!this.taskName.trim();
    }

    inputHandler( v: string ) {
        if ( v.trim() ) {
            this.invalidName = false;
        }
    }

    canAddGoal() {
        if ( this.isValidName() ) {
            return true;
        }
        this.invalidName = true;
    }

    cancel() {
        this.taskName = '';
        this.invalidName = false;
    }

    async add() {
        if ( this.canAddGoal() ) {
            console.log( this.taskName );
            const task: TaskAddArg = {
                description: this.taskName,
                componentId: +this.componentId
            };
            if ( this.modeSubtask ) {
                task.parentId = this.parentId;
            }
            const result = await this.addTask( task ).catch( this.logError );
            if ( result && result.response.add ) {
                this.cancel();
            }
        }
    }
}
