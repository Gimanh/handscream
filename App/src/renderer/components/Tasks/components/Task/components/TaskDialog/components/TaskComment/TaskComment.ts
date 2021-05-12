import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';


@Component
export default class TaskComment extends ZMixin {
    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: TaskItem;

    @Action( 'updateTaskComment', { namespace: NS_GOALS } )
    updateTaskComment!: IGoalsStoreActions['updateTaskComment'];

    commentChanged( $event: string, item: TaskItem ) {
        this.updateTaskComment( {
            comment: $event,
            item: item
        } ).catch( this.logError );

        this.emitChange();
    }

    emitChange() {
        this.$emit( 'change' );
    }
}
