import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal, IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems, IGoalNestedItemWithCommentAndReminder,
    IGoals, TaskItem, TasksOrderItems
} from '@/interfaces/IApp';
import { Actions, Getters, Module, Mutations } from 'vuex-smart-module'
import {
    ArgFetchTasks,
    IArgAddGoal, IArgAddGoalItem,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName, IArgAddTask, IArgReport, IArgSetGoalProgress, IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    IReportResult, NoMoreTasks, TMoveTaskArg, IArgAddTaskInMutation
} from '@/store/Types/Goals/Types';
import { $database } from '@/store/plugins/API';
import { IGoalStoreState } from '@/store/Types/Goals/IGoalsState';
import { IGoalsStoreMutations } from '@/store/Types/Goals/IGoalsStoreMutations';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';
import { ITimeRecords } from '@/store/Types/TimeRecord/Types';

class GoalsStoreState implements IGoalStoreState {

    goals: IGoals = [];

    goalItems: IGoalItems = [];

    nestedGoalItems: IGoalNestedItems = [];

    selectedNestedItemId: number = -1;

    labels: IAppLabels = [];

    selectedTaskForDialog: IGoalNestedItemWithCommentAndReminder = {
        checked: 0,
        date_complete: 0,
        date_creation: '',
        description: '',
        id: -1,
        item_comment_date_creation: 0,
        item_comment_id: 0,
        item_comment_owner: '',
        item_comment_parent_id: 0,
        item_comment_text: '',
        item_reminder_date_creation: 0,
        item_reminder_exp_date: 0,
        item_reminder_id: 0,
        item_reminder_owner: '',
        item_reminder_parent_id: 0,
        labels: [],
        order_key: 0,
        parent_id: 0
    };
}

class GoalsStoreGetters extends Getters<GoalsStoreState> {

}

class GoalsStoreMutations extends Mutations<GoalsStoreState> implements IGoalsStoreMutations {

    setGoals( goals: IGoals ): void {
        this.state.goals = goals;
    }

    setGoalItems( goalItems: IGoalItems ) {
        this.state.goalItems = goalItems;
    }

    setNestedGoalItems( nestedItems: IGoalNestedItems ) {
        this.state.nestedGoalItems = nestedItems;
    }

    addMoreTasks( nestedItems: IGoalNestedItems ) {
        //TODO
        this.state.nestedGoalItems = [ ...this.state.nestedGoalItems, ...nestedItems ];
    }

    setNestedGoalItemsCheckboxStatus( options: IArgCheckboxUpdate ): void {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id == options.item.id ) {
                this.state.nestedGoalItems[ k ].checked = options.status ? 1 : 0;
                break;
            }
        }
    }

    setNestedGoalItemsExpDate( options: IArgItemDate ): void {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id == options.item.id ) {
                this.state.nestedGoalItems[ k ].item_reminder_exp_date = options.date;
                break;
            }
        }
    }

    setNestedGoalItemsComment( options: IArgItemComment ): void {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id == options.item.id ) {
                this.state.nestedGoalItems[ k ].item_comment_text = options.comment;
                break;
            }
        }
    }

    setNestedGoalItemDescription( options: IArgItemDescription ): void {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id == options.item.id ) {
                this.state.nestedGoalItems[ k ].description = options.description;
                break;
            }
        }
    }

    setGoalItemName( options: IArgItemName ): void {
        for ( let k in this.state.goalItems ) {
            if ( this.state.goalItems[ k ].id == options.id ) {
                this.state.goalItems[ k ].name = options.name;
                break;
            }
        }
    }

    addGoal( goal: IGoal ): void {
        this.state.goals.push( goal );
    }

    deleteGoal( goal: IGoal ): void {
        for ( let k = 0; k < this.state.goals.length; k++ ) {
            if ( this.state.goals[ k ].id === goal.id ) {
                this.state.goals.splice( k, 1 );
                break;
            }
        }
    }

    updateGoal( goalInfo: IArgUpdateGoal ): void {
        for ( let k in this.state.goals ) {
            if ( this.state.goals[ k ].id === goalInfo.id ) {
                this.state.goals[ k ] = Object.assign( this.state.goals[ k ], goalInfo );
                break;
            }
        }
    }

    addGoalItem( goalItem: IGoalItem ): void {
        this.state.goalItems.push( goalItem );
    }

    setSelectedNestedItemId( newId: number ) {
        this.state.selectedNestedItemId = newId;
    }

    deleteGoalItem( id: number ): void {
        for ( let k = 0; k < this.state.goalItems.length; k++ ) {
            if ( this.state.goalItems[ k ].id == id ) {
                this.state.goalItems.splice( k, 1 );
                break;
            }
        }
    }

    addTask( item: IArgAddTaskInMutation ): void {
        // debugger
        if ( item.insertAfterItem !== undefined ) {
            for ( let i = 0; i < this.state.nestedGoalItems.length; i++ ) {
                if ( this.state.nestedGoalItems[ i ].id == item.insertAfterItem ) {
                    this.state.nestedGoalItems.splice( i + 1, 0, item.item );
                    break;
                }
            }
        } else {
            this.state.nestedGoalItems.splice( item.insertAfterItem, 0, item.item );
        }
    }

    updateOrderForNestedItems( values: TasksOrderItems ) {
        values.map( ( item ) => {
            let stateItem = this.state.nestedGoalItems.find( ( x ) => x.id === item.id );
            if ( stateItem ) {
                stateItem.order_key = item.order_key;
            }
        } )
    }

    setArchiveGoal( options: IArgUpdateArchiveGoalStatus ): void {
        for ( let k in this.state.goals ) {
            if ( this.state.goals[ k ].id == options.goalId ) {
                this.state.goals[ k ].archive = options.archiveStatus;
                break;
            }
        }
    }

    setGoalProgress( options: IArgSetGoalProgress ): void {
        for ( let k in this.state.goals ) {
            if ( this.state.goals[ k ].id == options.goalId ) {
                this.state.goals[ k ].progress = options.progress;
                break;
            }
        }
    }

    deleteTask( item: TaskItem ) {
        for ( let i = 0; i < this.state.nestedGoalItems.length; i++ ) {
            if ( this.state.nestedGoalItems[ i ].id == item.id ) {
                this.state.nestedGoalItems.splice( i, 1 );
                break;
            }
        }
    }

    setGoalsOrder( items: IGoalChangeItemsOrder ) {
        let orderIndex: { [ key: string ]: number } = {}
        items.forEach( function ( value ) {
            orderIndex[ value.id ] = value.order_key;
        } )

        this.state.goals.forEach( function ( value ) {
            if ( orderIndex[ value.id ] !== undefined ) {
                value.order_key = orderIndex[ value.id ];
            }
        } );
        orderIndex = {};
    }

    setGoalItemsOrder( items: IGoalChangeItemsOrder ) {
        let orderIndex: { [ key: string ]: number } = {}
        items.forEach( function ( value ) {
            orderIndex[ value.id ] = value.order_key;
        } )

        this.state.goalItems.forEach( function ( value ) {
            if ( orderIndex[ value.id ] !== undefined ) {
                value.order_key = orderIndex[ value.id ];
            }
        } );
        orderIndex = {};
    }

    setGoalNestedItemsOrder( items: IGoalChangeItemsOrder ) {
        let orderIndex: { [ key: string ]: number } = {}
        items.forEach( function ( value ) {
            orderIndex[ value.id ] = value.order_key;
        } )

        this.state.nestedGoalItems.forEach( function ( value ) {
            if ( orderIndex[ value.id ] !== undefined ) {
                value.order_key = orderIndex[ value.id ];
            }
        } );
        orderIndex = {};
    }

    addNewLabel( label: IAppLabel ) {
        this.state.labels.push( label );
    }

    deleteLabel( label: IAppLabel ) {
        for ( let k = 0; k < this.state.labels.length; k++ ) {
            if ( this.state.labels[ k ].id == label.id ) {
                this.state.labels.splice( k, 1 );
                break;
            }
        }
        //Delete label from nested tasks
        for ( let k in this.state.nestedGoalItems ) {
            for ( let i = 0; i < this.state.nestedGoalItems[ k ].labels.length; i++ ) {
                if ( this.state.nestedGoalItems[ k ].labels[ i ].id == label.id ) {
                    this.state.nestedGoalItems[ k ].labels.splice( i, 1 );
                }
            }
        }
    }

    setLabels( labels: IAppLabels ) {
        this.state.labels = labels;
    }

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ) {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id == options.nestedId ) {
                this.state.nestedGoalItems[ k ].labels = options.labels;
                break;
            }
        }
    }

    updateLabelInfo( label: IAppLabel ) {
        for ( let k in this.state.labels ) {
            if ( this.state.labels[ k ].id == label.id ) {
                this.state.labels[ k ] = label;
                break;
            }
        }
    }

    removeNestedItemFromList( options: TMoveTaskArg ) {
        for ( let k = 0; k < this.state.nestedGoalItems.length; k++ ) {
            if ( this.state.nestedGoalItems[ k ].id === options.taskId ) {
                this.state.nestedGoalItems.splice( k, 1 );
                break;
            }
        }
    }

    deleteNestedGoalItemsExpDate( item: TaskItem ) {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id === item.id ) {
                this.state.nestedGoalItems[ k ].item_reminder_exp_date = null;
                break;
            }
        }
    }

    setSelectedTaskForDialog( item: IGoalNestedItemWithCommentAndReminder ) {
        this.state.selectedTaskForDialog = item;
    }
}

class GoalsStoreActions extends Actions<GoalsStoreState, GoalsStoreGetters, GoalsStoreMutations, GoalsStoreActions> implements IGoalsStoreActions {
    async fetchGoals() {
        this.commit( 'setGoals', $database.fetchGoals() );
    }

    async fetchGoalItems( goalId: number ) {
        await this.fetchAllLabels();
        this.commit( 'setGoalItems', $database.fetchGoalItems( goalId ) );
    }

    async fetchTasks( options: ArgFetchTasks ) {
        this.commit( 'setNestedGoalItems', $database.fetchTasks( options ) );
    }

    async loadMoreTasks( options: ArgFetchTasks ): Promise<void | NoMoreTasks> {
        let tasks = $database.fetchTasks( options );
        if ( tasks.length === 0 ) {
            return true;
        }
        this.commit( 'addMoreTasks', tasks );
    }

    async updateTaskStatus( options: IArgCheckboxUpdate ) {
        let result = $database.updateNestedGoalItemCheckboxStatus( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsCheckboxStatus', options );
        } else {
            alert( 'Can not update checkbox status for item ' + options.item.id );
        }
    }

    async updateTaskExpDate( options: IArgItemDate ) {
        let result = $database.updateTaskExpDate( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsExpDate', options );
        } else {
            alert( 'Can not update Exp date for item ' + options.item.id );
        }
    }

    async updateTaskComment( options: IArgItemComment ) {
        let result = $database.updateNestedGoalItemComment( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsComment', options );
        } else {
            alert( 'Can not update comment for item ' + options.item.id );
        }
    }

    async updateTaskDescription( options: IArgItemDescription ) {
        let result = $database.updateNestedGoalItemDescriptions( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemDescription', options );
        } else {
            alert( 'Can not update description for item ' + options.item.id );
        }
    }

    async updateGoalItemName( options: IArgItemName ) {
        let result = $database.updateGoalItemName( options );
        if ( result ) {
            this.commit( 'setGoalItemName', options );
        }
    }

    async addGoal( options: IArgAddGoal ): Promise<IGoal | false> {
        let result: IGoal | false = $database.addGoal( options );
        if ( result ) {
            this.commit( 'addGoal', result );
        }
        return result;
    }

    async deleteGoal( goal: IGoal ) {
        let result = $database.deleteGoal( goal );
        if ( result ) {
            this.commit( 'deleteGoal', goal );
        }
    }

    async updateGoal( goalInfo: IArgUpdateGoal ) {
        let result = $database.updateGoal( goalInfo );
        if ( result ) {
            this.commit( 'updateGoal', goalInfo );
        }
    }

    async addGoalItem( goalItem: IArgAddGoalItem ) {
        let result = $database.addGoalItem( goalItem );
        if ( result ) {
            this.commit( 'addGoalItem', result );
        }
    }

    async deleteGoalItem( id: number ) {
        let result = $database.deleteGoalItem( id );
        if ( result ) {
            this.commit( 'deleteGoalItem', id );
        }
    }

    async addTask( nestedItem: IArgAddTask ): Promise<TaskItem | false> {
        let result = $database.addTask( nestedItem );
        if ( result ) {
            this.commit( 'addTask', {
                item: result.newItem,
                insertAfterItem: nestedItem.insertAfterItem
            } );
            this.commit( 'updateOrderForNestedItems', result.itemsOrder );
            return result.newItem;
        }
        return false;
    }

    async setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ) {
        let result = $database.setArchiveGoalStatus( options );
        if ( result ) {
            this.commit( 'setArchiveGoal', options );
        }
    }

    async fetchGoalProgress( goalId: number ) {
        let progress = $database.fetchProgressForGoal( goalId );
        this.commit( 'setGoalProgress', { goalId: goalId, progress: progress } );
    }

    async deleteTask( item: TaskItem ) {
        let result = $database.deleteTask( item );
        if ( result ) {
            this.commit( 'deleteTask', item );
        }
    }

    async updateGoalsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalsOrder( items );
        if ( result ) {
            this.commit( 'setGoalsOrder', items );
        }
    }

    async updateGoalItemsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalItemsOrder( items );
        if ( result ) {
            this.commit( 'setGoalItemsOrder', items );
        }
    }

    async updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalNestedItemsOrder( items );
        if ( result ) {
            this.commit( 'setGoalNestedItemsOrder', items );
        }
    }

    async addNewLabelToDb( label: IAppAddLabel ): Promise<IAppLabel | false> {
        let result = $database.addNewLabel( label );
        if ( result !== false ) {
            this.commit( 'addNewLabel', result );
        }
        return result;
    }

    async deleteLabelFromDb( label: IAppLabel ) {
        let result = $database.deleteLabel( label );
        if ( result ) {
            this.commit( 'deleteLabel', label );
        }
    }

    async fetchAllLabels() {
        let result = $database.fetchAllLabels();
        this.commit( 'setLabels', result );
    }

    async updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ) {
        let result = $database.updateLabelsOnNestedItem( options );
        if ( result ) {
            this.commit( 'updateLabelsOnNestedItem', options );
        }
    }

    async fetchReportData( options: IArgReport ): Promise<IReportResult> {
        return $database.fetchReportData( options );
    }

    async fetchPlanReportData( options: IArgReport ): Promise<IReportResult> {
        return $database.fetchPlanReportData( options );
    }

    async fetchTimeActivityRecords( taskId: number ): Promise<ITimeRecords> {
        return $database.fetchTimeActivityRecordsForTask( taskId );
    }

    async fetchGoalItemStats( listId: number ): Promise<number> {
        return $database.fetchGoalItemStats( listId );
    }

    async updateLabel( label: IAppLabel ): Promise<boolean> {
        let result = $database.updateLabel( label );
        if ( result ) {
            this.commit( 'updateLabelInfo', label );
        }
        return result;
    }

    async fetchGoalItemsWithoutCommit( goalId: number ): Promise<IGoalItems> {
        return $database.fetchGoalItems( goalId );
    }

    async moveTaskToNewList( options: { taskId: number; newParentListId: number } ): Promise<boolean> {
        let result = $database.moveTaskToNewList( options );
        if ( result ) {
            this.commit( 'removeNestedItemFromList', options );
        }
        return result;
    }

    async deleteNestedGoalItemsExpDate( item: TaskItem ): Promise<boolean> {
        let result = $database.deleteNestedGoalItemsExpDate( item );
        if ( result ) {
            this.commit( 'deleteNestedGoalItemsExpDate', item );
        }
        return result;
    }

    async fetchSelectedTaskForDialog( id: number ): Promise<IGoalNestedItemWithCommentAndReminder> {
        let result = $database.fetchTaskById( id );
        if ( result ) {
            this.commit( 'setSelectedTaskForDialog', result );
        }
        return result;
    }
}

const module = new Module( {
    state: GoalsStoreState,
    getters: GoalsStoreGetters,
    mutations: GoalsStoreMutations,
    actions: GoalsStoreActions
} );
export default module;
