import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IGoalNestedItems } from '@/Interfaces/IApp';

type Item = IGoalNestedItems[0];

@Component
export default class GoalItemNestedDialog extends ZMixin {

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: Item;

    // public iWantDeleteLabel: boolean = false;

    emitTaskChanged( $event: any, item: Item ) {
        this.$emit( 'textChanged', {
            event: $event,
            item: item
        } )
    }

    emitDeleteTask( $event: any, item: Item ) {
        this.$emit( 'deleteTask', {
            event: $event,
            item: item
        } )
    }

    emitCommentChanged( $event: any, item: Item ) {
        this.$emit( 'commentChanged', {
            event: $event,
            item: item
        } )
    }

    emitSaveDate( $event: any, item: Item ) {
        this.$emit( 'saveDate', {
            event: $event,
            item: item
        } )
    }

    emitClose() {
        this.$emit( 'close' );
    }

    emitResetDate( item: Item ) {
        this.$emit( 'resetDate', item );
    }
}
