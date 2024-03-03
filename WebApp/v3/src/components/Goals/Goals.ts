import { defineComponent } from 'vue';
import { useGoalsStore } from '@/stores/goals.store';
import { GoalsItem } from '@/components/Goals/components/GoalsItem';
import type { GoalItem } from '@/types/goals.types';
import type { GoalEventMoreMenu } from '@/types/goals.types';
import { FormDelete } from '@/components/FormDelete';
import { GoalAdd } from '@/components/Goals/components/GoalAdd';
import { GoalEdit } from '@/components/Goals/components/GoalEdit';
import { ContextActions } from '@/components/ContextActions';
import type { GoalActionsItems } from '@/types/goals.types';

type GoalDataType = {
    open: string[];
    menuActivator: null | HTMLElement;
    dialogStatus: boolean;
    storage: ReturnType<typeof useGoalsStore>;
    selectedGoal: null | GoalItem;
    showDeleteDialog: boolean;
    showGoalEditDialog: boolean;
};

export default defineComponent({
    components: { GoalsItem, ContextActions, FormDelete, GoalAdd, GoalEdit },
    data(): GoalDataType {
        const storage = useGoalsStore();
        return {
            storage,
            open: ['goals'],
            menuActivator: null,
            dialogStatus: false,
            selectedGoal: null,
            showDeleteDialog: false,
            showGoalEditDialog: false,
        };
    },
    async created() {
        await this.storage.fetchGoals();
    },
    computed: {
        goals(): GoalItem[] {
            debugger;
            return this.storage.goals;
        },
        deleteDialogTitle(): string {
            return `${this.$t('msg.deletion')} (${this.selectedGoal?.name})`;
        },
        actions(): GoalActionsItems {
            return [
                { id: 1, name: this.$t('msg.edit'), eventName: 'editGoal' },
                { id: 2, name: this.$t('msg.delete'), eventName: 'deleteGoal' },
            ];
        },
    },
    methods: {
        showGoalEdit() {
            this.showGoalEditDialog = true;
        },
        cancelEditGoal() {
            this.showGoalEditDialog = false;
        },
        showActionDialog(event: GoalEventMoreMenu) {
            this.selectedGoal = event.goal;
            this.menuActivator = event.activator;

            setTimeout(() => {
                this.showMenu();
            }, 150);
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
            this.selectedGoal && this.storage.deleteGoal(this.selectedGoal.id);
        },
    },
});
