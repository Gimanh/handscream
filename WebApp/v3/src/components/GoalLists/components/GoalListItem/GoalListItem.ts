import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { GoalListEventMoreMenu, GoalListItem } from '@/types/goal-lists';
import { TvBtn } from '@/components/TvBtn';
import { mdiDotsVertical } from '@mdi/js';

export default defineComponent( {
    components: { TvBtn },
    props: {
        list: {
            type: Object as PropType<GoalListItem>,
            required: true,
        }
    },
    data() {
        return {
            mdiDotsVertical
        }
    },
    methods: {
        goToTasks() {
            console.log( 'goToTasks' );
        },
        showActionDialog( ev: Event ) {
            const event: GoalListEventMoreMenu = {
                activator: ev.currentTarget as HTMLElement,
                list: this.list
            };
            this.$emit( 'showActions', event );
        }
    }
} );
