import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class TaskReminder extends ZMixin {
    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: TaskItem;

    @Action( 'deleteNestedGoalItemsExpDate', { namespace: NS_GOALS } )
    deleteNestedGoalItemsExpDate!: IGoalsStoreActions['deleteNestedGoalItemsExpDate'];

    @Action( 'updateTaskExpDate', { namespace: NS_GOALS } )
    updateTaskExpDate!: IGoalsStoreActions['updateTaskExpDate'];

    async saveDate( $event: number, item: TaskItem ) {
        await this.updateTaskExpDate( {
            date: $event,
            item: item
        } ).catch( this.logError );
        this.emitDateChanged();
    }

    async resetDate( item: TaskItem ) {
        await this.deleteNestedGoalItemsExpDate( item );
        this.emitDateChanged();
    }

    emitDateChanged() {
        this.$emit( 'change' )
    }
}
