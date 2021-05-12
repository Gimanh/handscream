import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';
import { ROUTE_NAME_TASK_DIALOG } from '@/AppConsts';
import { Helper } from '@/classes/Helper';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class TaskText extends ZMixin {

    @Prop( {
        default: function () {
            return {}
        }
    } )
    public item!: TaskItem

    @Action( 'updateTaskDescription', { namespace: NS_GOALS } )
    updateTaskDescription!: IGoalsStoreActions['updateTaskDescription'];

    get textareaId() {
        return 'textarea-' + this.item.id;
    }

    get taskDescription() {
        return this.item.description;
    }

    get placeholder() {
        return this.$t( 'msg.typeTask' );
    }

    get recordIconColor() {
        return this.isActiveTask ? 'red' : '';
    }

    get recordIconAnimationClass() {
        return 'material-icons-outlined ' + ( this.isActiveTask ? 'task-pulse' : '' );
    }

    get recordIcon() {
        return this.isActiveTask ? 'stop_circle' : 'radio_button_checked';
    }

    get isActiveTask() {
        return +this.activeRecordTask === +this.item.id;
    }

    selectRow(): void {
        this.setSelectedNestedItemId( this.item.id );
    }

    emitAddNewTask(): void {
        this.$emit( 'addNewTask', this.item )
    }

    emitDeleteTask( event: any ): void {
        this.$emit( 'deleteTask', event )
    }

    goToDialog() {
        this.goToTaskDialog( this.item.id );
    }

    async runTimerOnItem(): Promise<void> {
        await this.workingOnTask( this.item.id );
    }

    async descriptionChanged( event: string ): Promise<void> {
        event = Helper.replaceAllSpacesToOne( event );
        if ( event !== ' ' ) {
            await this.updateTaskDescription( {
                description: event,
                item: this.item
            } ).catch( this.logError );
        }
    }

}
