import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';


@Component
export default class TaskDialog extends ZMixin {

    public item: TaskItem = {
        checked: 0,
        date_complete: 0,
        date_creation: '',
        description: '',
        id: -1,
        item_comment_date_creation: 0,
        item_comment_id: 0,
        item_comment_owner: '',
        item_comment_parent_id: 0,
        item_comment_text: '',
        item_reminder_date_creation: 0,
        item_reminder_exp_date: 0,
        item_reminder_id: 0,
        item_reminder_owner: '',
        item_reminder_parent_id: 0,
        labels: [],
        order_key: 0,
        parent_id: 0
    };

    @Action( 'fetchSelectedTaskForDialog', { namespace: NS_GOALS } )
    fetchSelectedTaskForDialog!: IGoalsStoreActions['fetchSelectedTaskForDialog'];


    async created() {
        await this.fetchItem();
    }

    async fetchItem() {
        await this.fetchSelectedTaskForDialog( +this.$route.params.taskId )
        this.item = JSON.parse( JSON.stringify( this.selectedTaskForDialog ) );
    }

    emitTaskChanged( $event: any, item: TaskItem ) {
        this.$emit( 'textChanged', {
            event: $event,
            item: item
        } )
    }

    //TODO delete task add button
    emitDeleteTask( $event: any, item: TaskItem ) {
        this.$emit( 'deleteTask', {
            event: $event,
            item: item
        } )
    }

    close() {
        this.goBack();
    }
}
