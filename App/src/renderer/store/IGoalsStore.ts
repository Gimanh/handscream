import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal, IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems,
    IGoals
} from '@/Interfaces/IApp';
import { IArgAddNested } from '@/classes/IZDatabase';
import { ITimeRecords } from '@/store/ITimeRecord';

export type IArgCheckboxUpdate = {
    status: number
    item: IGoalNestedItems[0]
    date_complete: number | null
}

export type IArgItemDate = {
    date: number,
    item: IGoalNestedItems[0]
};

export type IArgItemComment = {
    comment: string,
    item: IGoalNestedItems[0]
};

export type IArgItemDescription = {
    description: string,
    item: IGoalNestedItems[0]
};

export type IArgItemName = {
    name: string,
    id: number
};

export type IArgAddGoal = {
    name: string
    description: string
    color: string
};

export type IArgUpdateGoal = {
    id: number
    name: string
    description: string
    color: string
};

export type IArgAddGoalItem = {
    goalId: number
    name: string
    description: string
}

export interface IGoalStoreState {

    goals: IGoals;

    goalItems: IGoalItems;

    nestedGoalItems: IGoalNestedItems;

    selectedNestedItemId: number;

    labels: IAppLabels;
}

export type IArgNestedGoalItem = {
    order_key: number
    parentId: number,
    description: string
}

export type INestedOrders = { id: number, order_key: number }[];

export type INestedItem = IGoalNestedItems[0];

export type IArgUpdateArchiveGoalStatus = {
    goalId: number
    archiveStatus: number
};

export type IArgSetGoalProgress = {
    goalId: number
    progress: number
};

export type IArgReport = {
    start: number
    end: number
    labels: number[]
};

export interface IReportResultItem {
    id: number
    description: string
    checked: number
    parent_id: number
    date_creation: number
    order_key: number
    date_complete: number
    list_name: string
    list_description: string
    goal_name: string
    goal_description: string
    label_name: string
    label_color: string
    deadline: number
    work_start: number
    work_end: number
}

export type IReportResult = IReportResultItem[];

export interface IReportResultCleanItem extends Omit<IReportResultItem, 'label_name' | 'label_color' | 'work_start' | 'work_end'> {
    labels: Omit<IAppLabel, 'id' | 'date_creation'>[]
    date_creation_locale: string
    date_complete_locale: string
    deadline_locale: string
    totalTime: number
    formatTotalTime: string
}

export type IReportResultClean = IReportResultCleanItem[];

export type TMoveTaskArg = { taskId: number; newParentListId: number };

export interface IGoalsStoreActions {
    fetchGoalsFromStorage(): void;

    fetchGoalItems( goalId: number ): void;

    fetchNestedGoalItems( goalItemId: string ): void;

    updateNestedGoalItemsCheckboxStatus( options: IArgCheckboxUpdate ): void;

    updateNestedGoalItemsExpDate( options: IArgItemDate ): void;

    updateNestedGoalItemsComment( options: IArgItemComment ): void;

    updateNestedGoalItemDescription( options: IArgItemDescription ): void;

    updateGoalItemName( options: IArgItemName ): void;

    addGoal( options: IArgAddGoal ): Promise<IGoal | false>;

    deleteGoal( goal: IGoal ): void;

    updateGoal( goalInfo: IArgUpdateGoal ): void;

    addGoalItem( goalItem: IArgAddGoalItem ): void;

    deleteGoalItem( id: number ): void;

    addNestedGoalItem( nestedItem: IArgNestedGoalItem ): void;

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): void;

    fetchGoalProgress( goalId: number ): void;

    deleteNestedItem( item: INestedItem ): void;

    updateGoalsOrder( items: IGoalChangeItemsOrder ): void;

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): void;

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): void;

    addNewLabelToDb( label: IAppAddLabel ): Promise<IAppLabel | false>;

    deleteLabelFromDb( label: IAppLabel ): void;

    fetchAllLabels(): void;

    updateLabelsOnNestedItem( options: { nestedId: number, labels: IAppLabels } );

    fetchReportData( options: IArgReport ): Promise<IReportResult>;

    fetchPlanReportData( options: IArgReport ): Promise<IReportResult>;

    fetchTimeActivityRecords( taskId: number ): Promise<ITimeRecords>;

    fetchGoalItemStats( listId: number ): Promise<number>;

    updateLabel( label: IAppLabel ): Promise<boolean>;

    fetchGoalItemsWithoutCommit( goalId: number ): Promise<IGoalItems>;

    moveTaskToNewList( options: TMoveTaskArg ): Promise<boolean>

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ): Promise<boolean>;
}

export interface IGoalsStoreMutations {
    setGoals( goals: IGoal[] ): void;

    setGoalItems( goalItems: IGoalItems ): void;

    setNestedGoalItems( nestedItems: IGoalNestedItems ): void;

    setNestedGoalItemsCheckboxStatus( options: IArgCheckboxUpdate ): void;

    setNestedGoalItemsExpDate( options: IArgItemDate ): void;

    setNestedGoalItemsComment( options: IArgItemComment ): void;

    setNestedGoalItemDescription( options: IArgItemDescription ): void;

    setGoalItemName( options: IArgItemName ): void;

    addGoal( goal: IGoal ): void;

    deleteGoal( goal: IGoal ): void;

    updateGoal( goalInfo: IArgUpdateGoal ): void;

    addGoalItem( goalItem: IGoalItem ): void;

    setSelectedNestedItemId( newId: number );

    deleteGoalItem( id: number ): void;

    addNestedGoalItem( item: INestedItem ): void;

    updateOrderForNestedItems( values: INestedOrders ): void;

    setArchiveGoal( options: IArgUpdateArchiveGoalStatus ): void;

    setGoalProgress( options: IArgSetGoalProgress ): void;

    deleteNestedItem( item: INestedItem );

    setGoalsOrder( items: IGoalChangeItemsOrder ): void;

    setGoalItemsOrder( items: IGoalChangeItemsOrder ): void;

    setGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): void;

    addNewLabel( label: IAppLabel ): void;

    deleteLabel( label: IAppLabel ): void;

    setLabels( labels: IAppLabels ): void;

    updateLabelsOnNestedItem( options: { nestedId: number, labels: IAppLabels } );

    updateLabelInfo( label: IAppLabel );

    removeNestedItemFromList( options: TMoveTaskArg );

    deleteNestedGoalItemsExpDate( item: IGoalNestedItems[0] ): void;
}
