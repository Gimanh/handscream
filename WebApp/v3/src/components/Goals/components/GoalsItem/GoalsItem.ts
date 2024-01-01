import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { GoalEventMoreMenu, GoalItem } from '@/types/goals.types';
import { mdiDotsVertical } from '@mdi/js';
import { TvBtn } from '@/components/TvBtn';

export default defineComponent( {
    components: { TvBtn },
    props: {
        goal: {
            type: Object as PropType<GoalItem>,
            required: true
        },

    },
    data() {
        return {
            mdiDotsVertical
        }
    },
    methods: {
        showActionDialog( ev: Event ) {
            const event: GoalEventMoreMenu = {
                activator: ev.currentTarget as HTMLElement,
                goal: this.goal
            };
            this.$emit( 'showActions', event );
        },
        goToLists() {
            return {
                name: 'goal-lists',
                params: { goalId: this.goal.id }
            }
        }
    }
} );
