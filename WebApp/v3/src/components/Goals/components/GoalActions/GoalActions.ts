import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { GoalActionsItems, GoalItem } from '@/types/goals';

export default defineComponent( {
    props: {
        activator: {
            type: Object as PropType<HTMLElement>
        },
        goal: {
            type: Object as PropType<GoalItem>
        },
        showMenu: Boolean
    },
    data(): { dialogStatusModel: boolean } {
        return {
            dialogStatusModel: false
        }
    },
    computed: {
        actions(): GoalActionsItems {
            return [
                { id: 1, name: this.$t( 'msg.edit' ), eventName: 'editGoal' },
                { id: 2, name: this.$t( 'msg.delete' ), eventName: 'deleteGoal' },
            ];
        }
    },
    watch: {
        dialogStatusModel( value: boolean ): void {
            if ( !value ) {
                this.$emit( 'menuClosed' )
            }
        },
        showMenu( value: boolean ): void {
            this.dialogStatusModel = value;
        }
    },
    methods: {
        emitSelectedEvent( eventName: string ): void {
            this.$emit( eventName );
        }
    }
} );
