import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import ZMixin from '@/mixins/mixin';
import { IGoal, IGoalItems, IGoalNestedItems } from '@/Interfaces/IApp';
import { State } from 'vuex-class';
import { NS_GOALS } from '@/store/types';
import { IGoalsStoreActions } from '@/store/IGoalsStore';
import { APP_EVENT_TASK_COMPLETE_STATUS } from '@/AppConsts';

type Item = IGoalNestedItems[0];

@Component
export default class GoalNestedItemMove extends ZMixin {

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: Item;

    @State( state => state[ NS_GOALS ].goals ) goals!: IGoal[];

    @Action( 'fetchGoalItemsWithoutCommit', { namespace: NS_GOALS } )
    fetchGoalItemsWithoutCommit!: IGoalsStoreActions['fetchGoalItemsWithoutCommit'];

    @Action( 'moveTaskToNewList', { namespace: NS_GOALS } )
    moveTaskToNewList!: IGoalsStoreActions['moveTaskToNewList'];

    public dialog: boolean = false;

    public selectedGoalId: number = -1;

    public selectedListId: number = -1;

    public lists: IGoalItems = [];

    get canShowGoals() {
        return this.dialog && this.selectedGoalId === -1;
    }

    get canShowList() {
        return !this.canShowGoals;
    }

    canDisplayListItem( listItem: IGoalItems[0] ) {
        return listItem.id !== this.item.parent_id;
    }

    selectGoalId( id ) {
        this.selectedGoalId = id;
        this.fetchGoalItemsWithoutCommit( this.selectedGoalId )
            .then( ( items ) => {
                this.lists = items;
            } )
    }

    async selectListId( listId: number ) {
        if ( this.item.id !== undefined ) {
            let newListId = listId;
            let oldListId = this.item.parent_id;
            this.$emit( 'moveComplete' );
            let result = await this.moveTaskToNewList( {
                taskId: this.item.id,
                newParentListId: listId
            } );

            this.$nextTick( () => {
                this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + newListId );
                this.$eventBus.$emit( APP_EVENT_TASK_COMPLETE_STATUS + oldListId );
            } );

            if ( !result ) {
                alert( 'Can not move task to list' );
            }
        }
    }

    resetState() {
        this.dialog = false;
        this.selectedGoalId = -1;
        this.selectedListId = -1;
    }

    goBackToGoals() {
        this.selectedGoalId = -1;
    }
}
