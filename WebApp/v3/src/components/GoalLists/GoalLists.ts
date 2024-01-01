import { defineComponent } from 'vue';
import { GoalListAdd } from '@/components/GoalLists/components/GoalListAdd';
import { useGoalListsStore } from '@/stores/goal-lists.store';
import { GoalListItem } from '@/components/GoalLists/components/GoalListItem';
import type { GoalListActionsItems, GoalListEventMoreMenu, GoalListItems } from '@/types/goal-lists.types';
import { ContextActions } from '@/components/ContextActions';
import { FormDelete } from '@/components/FormDelete';
import { GoalListEdit } from '@/components/GoalLists/components/GoalListEdit';
import { Tasks } from '@/components/Tasks';

type DataType = {
    storage: ReturnType<typeof useGoalListsStore>
    dialogStatus: boolean
    menuActivator: null | HTMLElement
    showDeleteDialog: boolean
    showEditDialog: boolean
    selectedList: null | GoalListEventMoreMenu['list']
};
export default defineComponent( {
    components: {
        GoalListAdd, GoalListItem, ContextActions, FormDelete, GoalListEdit, Tasks
    },
    computed: {
        goalId(): string | undefined {
            return this.$route.params.goalId as string
        },
        lists(): GoalListItems {
            return this.storage.lists;
        },
        actions(): GoalListActionsItems {
            return [
                { id: 1, name: this.$t( 'msg.edit' ), eventName: 'editList' },
                { id: 2, name: this.$t( 'msg.delete' ), eventName: 'deleteList' },
            ];
        },
        deleteDialogTitle(): string {
            return `${ this.$t( 'msg.deletion' ) } (${ this.selectedList?.name })`;
        },
    },
    data(): DataType {
        const storage = useGoalListsStore()
        return {
            storage,
            dialogStatus: false,
            menuActivator: null,
            showDeleteDialog: false,
            showEditDialog: false,
            selectedList: null,
        };
    },
    watch: {
        '$route.params.goalId': {
            handler( value: string, oldValue: string ) {
                if ( value !== oldValue ) {
                    this.fetchLists();
                }
            },
            immediate: true,
        }
    },
    methods: {
        fetchLists() {
            if ( this.goalId ) {
                this.storage.fetchLists( +this.goalId );
            }
        },
        showActions( event: GoalListEventMoreMenu ) {
            this.selectedList = event.list;
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
        showDeleteList() {
            this.showDeleteDialog = true;
        },
        showEditList() {
            this.showEditDialog = true;
        },
        cancelDeletion() {
            this.showDeleteDialog = false;
        },
        deleteSelectedList() {
            if ( this.selectedList ) {
                this.storage.deleteList( this.selectedList.id );
            }
        },
        cancelEditGoal() {
            this.showEditDialog = false;
        },
    },
} );
