import { defineComponent } from 'vue';
import { useGoalsStore } from '@/stores/goals';
import { GoalsItem } from '@/components/Goals/components/GoalsItem';
import { GoalActions } from '@/components/Goals/components/GoalActions'
import type { GoalItem } from '@/types/goals';
import type { GoalEventMoreMenu } from '@/types/goals';
import { FormDelete } from '@/components/FormDelete';

type GoalDataType = {
    open: string[]
    menuActivator: null | HTMLElement
    dialogStatus: boolean
    storage: ReturnType<typeof useGoalsStore>
    selectedGoal: null | GoalItem
    showDeleteDialog: boolean
};

export default defineComponent( {
    components: { GoalsItem, GoalActions, FormDelete },
    data(): GoalDataType {
        const storage = useGoalsStore();
        return {
            storage,
            open: [ 'goals' ],
            menuActivator: null,
            dialogStatus: false,
            selectedGoal: null,
            showDeleteDialog: false,
        }
    },
    created() {
        this.storage.fetchGoals();
    },
    computed: {
        goals(): GoalItem[] {
            return this.storage.goals;
        },
        deleteDialogTitle(): string {
            return `${ this.$t( 'msg.deletion' ) } (${ this.selectedGoal?.name })`
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
        },
        showDeleteGoal() {
            this.showDeleteDialog = true;
        },
        cancelDeletion() {
            this.showDeleteDialog = false;
        },
        deleteSelectedGoal() {
            this.selectedGoal && this.storage.deleteGoal( this.selectedGoal.id );
        },
    }
} );
