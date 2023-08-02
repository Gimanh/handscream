import { defineComponent } from 'vue';
import { useGoalsStore } from '@/stores/goals';
import { GoalsItem } from '@/components/Goals/components/GoalsItem';
import { GoalActions } from '@/components/Goals/components/GoalActions'
import type { GoalItem } from '@/types/goals';
import type { GoalEventMoreMenu } from '@/types/goals';

export default defineComponent( {
    components: { GoalsItem, GoalActions },
    data(): {
        open: string[]
        menuActivator: null | HTMLElement
        dialogStatus: boolean
        storage: ReturnType<typeof useGoalsStore>
        selectedGoal: null | GoalItem
    } {
        const storage = useGoalsStore();
        return {
            storage,
            open: [ 'goals' ],
            menuActivator: null,
            dialogStatus: false,
            selectedGoal: null
        }
    },
    created() {
        this.storage.fetchGoals();
    },
    computed: {
        goals(): GoalItem[] {
            return this.storage.goals;
        }
    },
    methods: {
        showActionDialog( event: GoalEventMoreMenu ) {
            this.selectedGoal = event.goal;
            this.menuActivator = event.activator;

            setTimeout( () => {
                this.showMenu();
            }, 150 );
        },
        showMenu() {
            this.dialogStatus = true;
        },
        hideMenu() {
            this.dialogStatus = false;
        }
    }
} );
