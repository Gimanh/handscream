import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal, IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems,
    IGoals
} from '@/Interfaces/IApp';
import { Actions, Getters, Module, Mutations } from 'vuex-smart-module'
import {
    IArgAddGoal, IArgAddGoalItem,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName, IArgNestedGoalItem, IArgReport, IArgSetGoalProgress, IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    IGoalsStoreActions,
    IGoalsStoreMutations, IGoalStoreState, INestedItem, INestedOrders, IReportResult, TMoveTaskArg
} from '@/store/IGoalsStore';
import { $database } from '@/store/plugins/API';
import { Vue } from 'vue-property-decorator';
import { ITimeRecords } from '@/store/ITimeRecord';

class GoalsStoreState implements IGoalStoreState {
    /**
     * Цели доступные
     */
    goals: IGoals = [];

    /**
     * Первый уровень содежимого цели
     * это могут быть заметки листы
     * либо отдельные компоненты
     */
    goalItems: IGoalItems = [];

    nestedGoalItems: IGoalNestedItems = [];

    selectedNestedItemId: number = -1;

    labels: IAppLabels = [];
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

    addNestedGoalItem( item: INestedItem ): void {
        this.state.nestedGoalItems.push( item );
    }

    updateOrderForNestedItems( values: INestedOrders ) {
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

    deleteNestedItem( item: INestedItem ) {
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
            orderIndex[ value.id ] = value.orderKey;
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
            orderIndex[ value.id ] = value.orderKey;
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
            orderIndex[ value.id ] = value.orderKey;
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

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ) {
        for ( let k in this.state.nestedGoalItems ) {
            if ( this.state.nestedGoalItems[ k ].id === item.id ) {
                this.state.nestedGoalItems[ k ].item_reminder_exp_date = null;
                break;
            }
        }
    }
}

class GoalsStoreActions extends Actions<GoalsStoreState, GoalsStoreGetters, GoalsStoreMutations, GoalsStoreActions> implements IGoalsStoreActions {
    fetchGoalsFromStorage() {
        this.commit( 'setGoals', $database.fetchGoals() );
    }

    fetchGoalItems( goalId: number ) {
        this.fetchAllLabels();
        this.commit( 'setGoalItems', $database.fetchGoalItems( goalId ) );
    }

    fetchNestedGoalItems( goalItemId: string ): void {
        this.commit( 'setNestedGoalItems', $database.fetchNestedGoalItems( goalItemId ) );
    }

    updateNestedGoalItemsCheckboxStatus( options: IArgCheckboxUpdate ): void {
        let result = $database.updateNestedGoalItemCheckboxStatus( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsCheckboxStatus', options );
        } else {
            alert( 'Can not update checkbox status for item ' + options.item.id );
        }
    }

    updateNestedGoalItemsExpDate( options: IArgItemDate ): void {
        let result = $database.updateNestedGoalItemExpDate( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsExpDate', options );
        } else {
            alert( 'Can not update Exp date for item ' + options.item.id );
        }
    }

    updateNestedGoalItemsComment( options: IArgItemComment ): void {
        let result = $database.updateNestedGoalItemComment( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemsComment', options );
        } else {
            alert( 'Can not update comment for item ' + options.item.id );
        }
    }

    updateNestedGoalItemDescription( options: IArgItemDescription ): void {
        let result = $database.updateNestedGoalItemDescriptions( options );
        if ( result ) {
            this.commit( 'setNestedGoalItemDescription', options );
        } else {
            alert( 'Can not update description for item ' + options.item.id );
        }
    }

    updateGoalItemName( options: IArgItemName ) {
        let result = $database.updateGoalItemName( options );
        if ( result ) {
            this.commit( 'setGoalItemName', options );
        }
    }

    addGoal( options: IArgAddGoal ): Promise<IGoal | false> {
        let result: IGoal | false = $database.addGoal( options );
        if ( result ) {
            this.commit( 'addGoal', result );
        }
        return new Promise( resolve => {
            resolve( result );
        } );
    }

    deleteGoal( goal: IGoal ): void {
        let result = $database.deleteGoal( goal );
        if ( result ) {
            this.commit( 'deleteGoal', goal );
        }
    }

    updateGoal( goalInfo: IArgUpdateGoal ): void {
        let result = $database.updateGoal( goalInfo );
        if ( result ) {
            this.commit( 'updateGoal', goalInfo );
        }
    }

    addGoalItem( goalItem: IArgAddGoalItem ): void {
        let result = $database.addGoalItem( goalItem );
        if ( result ) {
            this.commit( 'addGoalItem', result );
        }
    }

    deleteGoalItem( id: number ): void {
        let result = $database.deleteGoalItem( id );
        if ( result ) {
            this.commit( 'deleteGoalItem', id );
        }
    }

    addNestedGoalItem( nestedItem: IArgNestedGoalItem ): void {
        let result = $database.addNestedGoalItem( nestedItem );
        if ( result ) {
            this.commit( 'addNestedGoalItem', result.newItem );
            this.commit( 'updateOrderForNestedItems', result.itemsOrder );
        }
    }

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): void {
        let result = $database.setArchiveGoalStatus( options );
        if ( result ) {
            this.commit( 'setArchiveGoal', options );
        }
    }

    fetchGoalProgress( goalId: number ) {
        let progress = $database.fetchProgressForGoal( goalId );
        this.commit( 'setGoalProgress', { goalId: goalId, progress: progress } );
    }

    deleteNestedItem( item: INestedItem ): void {
        let result = $database.deleteNestedItem( item );
        if ( result ) {
            this.commit( 'deleteNestedItem', item );
        }
    }

    updateGoalsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalsOrder( items );
        if ( result ) {
            this.commit( 'setGoalsOrder', items );
        }
    }

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalItemsOrder( items );
        if ( result ) {
            this.commit( 'setGoalItemsOrder', items );
        }
    }

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ) {
        let result = $database.updateGoalNestedItemsOrder( items );
        if ( result ) {
            this.commit( 'setGoalNestedItemsOrder', items );
        }
    }

    addNewLabelToDb( label: IAppAddLabel ): Promise<IAppLabel | false> {
        let result = $database.addNewLabel( label );
        if ( result !== false ) {
            this.commit( 'addNewLabel', result );
        }
        return new Promise( ( resolve ) => {
            resolve( result )
        } );
    }

    deleteLabelFromDb( label: IAppLabel ) {
        let result = $database.deleteLabel( label );
        if ( result ) {
            this.commit( 'deleteLabel', label );
        }
    }

    fetchAllLabels() {
        let result = $database.fetchAllLabels();
        this.commit( 'setLabels', result );
    }

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ) {
        let result = $database.updateLabelsOnNestedItem( options );
        if ( result ) {
            this.commit( 'updateLabelsOnNestedItem', options );
        }
    }

    fetchReportData( options: IArgReport ): Promise<IReportResult> {
        let reportData = $database.fetchReportData( options );
        return new Promise( resolve => {
            resolve( reportData );
        } );
    }

    fetchPlanReportData( options: IArgReport ): Promise<IReportResult> {
        let reportData = $database.fetchPlanReportData( options );
        return new Promise( resolve => {
            resolve( reportData );
        } );
    }

    fetchTimeActivityRecords( taskId: number ): Promise<ITimeRecords> {
        let result = $database.fetchTimeActivityRecordsForTask( taskId );
        return new Promise( resolve => {
            resolve( result );
        } );
    }

    fetchGoalItemStats( listId: number ): Promise<number> {
        let result = $database.fetchGoalItemStats( listId );
        return new Promise( resolve => {
            resolve( result );
        } )
    }

    updateLabel( label: IAppLabel ): Promise<boolean> {
        let result = $database.updateLabel( label );
        if ( result ) {
            this.commit( 'updateLabelInfo', label );
        }
        return new Promise( resolve => {
            resolve( result );
        } );
    }

    fetchGoalItemsWithoutCommit( goalId: number ): Promise<IGoalItems> {
        let result = $database.fetchGoalItems( goalId );
        return new Promise( ( resolve ) => {
            resolve( result )
        } )
    }

    moveTaskToNewList( options: { taskId: number; newParentListId: number } ): Promise<boolean> {
        let result = $database.moveTaskToNewList( options );
        if ( result ) {
            this.commit( 'removeNestedItemFromList', options );
        }
        return new Promise( ( resolve ) => {
            resolve( result );
        } )
    }

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ): Promise<boolean> {
        let result = $database.deleteNestedGoalItemsExpDate( item );
        if ( result ) {
            this.commit( 'deleteNestedGoalItemsExpDate', item );
        }
        return new Promise( ( resolve ) => {
            resolve( result );
        } )
    }
}

const module = new Module( {
    state: GoalsStoreState,
    getters: GoalsStoreGetters,
    mutations: GoalsStoreMutations,
    actions: GoalsStoreActions
} );
export default module;
