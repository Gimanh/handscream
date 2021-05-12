import ZMixin from '@/mixins/mixin';
import { Component, Prop } from 'vue-property-decorator';
import { TaskItem } from '@/interfaces/IApp';
import { Helper } from '@/classes/Helper';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { APP_EVENT_TASK_COMPLETE_STATUS } from '@/AppConsts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class TaskCheckbox extends ZMixin {

    @Prop( {
        default: function () {
            return {}
        }
    } )
    public item!: TaskItem

    @Action( 'updateTaskStatus', { namespace: NS_GOALS } )
    updateTaskStatus!: IGoalsStoreActions['updateTaskStatus'];

    @Action( 'fetchGoalProgress', { namespace: NS_GOALS } )
    fetchGoalProgress!: IGoalsStoreActions['fetchGoalProgress'];

    async updateStatus( checked: boolean ): Promise<void> {
        await this.checkBoxStateChanged( checked ).catch( this.logError );
    }

    async checkBoxStateChanged( event: boolean ) {
        await this.updateTaskStatus( {
            status: Number( event ),
            item: this.item,
            date_complete: event ? Helper.dateNow() : null
        } ).catch( this.logError );

        await this.fetchGoalProgress( Number( this.$route.params.id ) );
        this.emitEventForList(this.item.parent_id);
        if ( event ) {
            if ( this.activeRecordTask === this.item.id ) {
                this.workingOnTask( this.item.id ).catch( this.logError );
            }
        }
    }

    // emitEventForList() {
    //     this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + this.item.parent_id );
    // }
}
