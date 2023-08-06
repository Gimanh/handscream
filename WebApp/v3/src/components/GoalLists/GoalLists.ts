import { defineComponent } from 'vue';
import { GoalListAdd } from '@/components/GoalLists/components/GoalListAdd';
import { useGoalListsStore } from '@/stores/goal-lists';
import { mapState } from 'pinia';
import { GoalListItem } from '@/components/GoalLists/components/GoalListItem';
import type { GoalListEventMoreMenu, GoalListItems } from '@/types/goal-lists';

type DataType = {
    storage: ReturnType<typeof useGoalListsStore>
};
export default defineComponent( {
    components: {
        GoalListAdd, GoalListItem
    },
    computed: {
        goalId(): string | undefined {
            return this.$route.params.goalId as string
        },
        lists(): GoalListItems {
            return this.storage.lists;
        },
    },
    data(): DataType {
        const storage = useGoalListsStore()
        return {
            storage
        };
    },
    methods: {
        fetchLists() {
            if ( this.goalId ) {
                this.storage.fetchLists( +this.goalId );
            }
        },
        showActions( event: GoalListEventMoreMenu ) {
            console.log( event );
        }
    },
    created() {
        this.fetchLists();
    },
} );
