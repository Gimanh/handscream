import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IAppLabels, TaskItem } from '@/interfaces/IApp';
import { Helper } from '@/classes/Helper';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { APP_EVENT_TASK_COMPLETE_STATUS } from '@/AppConsts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class Task extends ZMixin {

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: TaskItem;

    @Prop( { default: false } )
    public showCompleted!: boolean;

    public deleteDialog: boolean = false;

    @Action( 'updateTaskStatus', { namespace: NS_GOALS } )
    updateTaskStatus!: IGoalsStoreActions['updateTaskStatus'];

    @Action( 'fetchGoalProgress', { namespace: NS_GOALS } )
    fetchGoalProgress!: IGoalsStoreActions['fetchGoalProgress'];

    @Action( 'deleteTask', { namespace: NS_GOALS } )
    deleteTask!: IGoalsStoreActions['deleteTask'];

    getUiDate( itemExpDate: number ): string {
        if ( itemExpDate ) {
            return Helper.getDateTimeForUi( itemExpDate );
        }
        return '';
    }

    // emitEventForList(): void {
    //     this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + this.item.parent_id );
    // }

    canShowNotActiveLabelsRow(): boolean {
        return this.item.labels.length > 0;
    }

    emitAddNewTaskToList() {
        this.$emit( 'addNewTaskToList', this.item );
    }

    showDeleteDialog(): void {
        this.deleteDialog = true;
    }

    hideDeleteDialog(): void {
        this.deleteDialog = false;
    }

    async deleteEmptyItem( event ): Promise<void> {
        let value = event.target.value;
        value = Helper.replaceAllSpacesToOne( value );
        if ( !value || value === ' ' ) {
            if ( !this.item.item_comment_text && !this.item.item_reminder_exp_date ) {
                this.deleteItem().catch( err => {
                    console.log( err );
                } );
            } else {
                this.showDeleteDialog();
            }
        }
        this.emitEventForList(this.item.parent_id);
    }

    async deleteItem(): Promise<void> {
        await this.deleteTask( this.item ).catch( this.logError );
        await this.fetchGoalProgress( Number( this.$route.params.id ) ).catch( this.logError );

        this.hideDeleteDialog();
    }

    canShowNotActiveDateCommentRow(): boolean {
        return !!( this.item.item_comment_text || this.item.item_reminder_exp_date );
    }

    getLabelsForItem(): IAppLabels {
        let result: IAppLabels = [];
        for ( let itemLabel of this.item.labels ) {
            for ( let label of this.labels ) {
                if ( itemLabel.id === label.id ) {
                    result.push( label );
                }
            }
        }
        return result;
    }
}
