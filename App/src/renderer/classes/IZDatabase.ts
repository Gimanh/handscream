import { ConfigStore } from '@/classes/ConfigStore';
import {
    IAppAddLabel, IAppLabel, IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem,
    IGoalItems,
    IGoalNestedItems, IGoalNestedItemWithCommentAndReminder, TaskItem, TasksOrderItems
} from '@/interfaces/IApp';
import {
    ArgFetchTasks,
    IArgAddGoal,
    IArgAddGoalItem,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName,
    IArgAddTask, IArgReport, IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal,
    IReportResult, TMoveTaskArg
} from '@/store/Types/Goals/Types';
import { IConfigDataTaskView } from '@/classes/IConfigStore';
import {
    IArgStartTimeRecord,
    IArgStopTimeRecord,
    ITimeRecords
} from '@/store/Types/TimeRecord/Types';
import { IAppSettingsItems } from '@/store/Types/AppSettings/Types';

export interface DatabaseConnectOptions {
    path?: string
    login?: string
    password?: string
}

export interface I18N {
    locale: string
    name: string
}

//TODO rename
export type IArgAddNested = {
    newItem: TaskItem,
    itemsOrder: TasksOrderItems
};


export interface IZDatabase {
    db: any;

    config: ConfigStore;

    createDatabase( name: string, destination?: string ): any;

    // openDatabase( options?: DatabaseConnectOptions ): boolean;

    hasActiveDb(): boolean;

    closeCurrentDatabase(): boolean;

    getName(): string;

    getConfigData(): IConfigDataTaskView;

    fetchGoals(): IGoal[];

    fetchGoalItems( goalId: number ): IGoalItems;

    fetchTasks( options: ArgFetchTasks ): IGoalNestedItems;

    updateNestedGoalItemCheckboxStatus( options: IArgCheckboxUpdate ): boolean;

    updateTaskExpDate( options: IArgItemDate ): boolean;

    updateNestedGoalItemComment( options: IArgItemComment ): boolean;

    updateNestedGoalItemDescriptions( options: IArgItemDescription ): boolean;

    updateGoalItemName( options: IArgItemName ): boolean;

    addGoal( options: IArgAddGoal ): IGoal | false;

    deleteGoal( goal: IGoal ): boolean;

    updateGoal( goalInfo: IArgUpdateGoal ): boolean;

    addGoalItem( goalItem: IArgAddGoalItem ): IGoalItem | false;

    deleteGoalItem( id: number ): boolean;

    addTask( nestedItem: IArgAddTask ): IArgAddNested | false;

    fetchNestedGoalItemById( id: number ): TaskItem | false;

    updateNestedItemsOrder( items: { id: number, order_key: number }[] ): boolean;

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): boolean;

    fetchProgressForGoal( goalId: number ): number;

    deleteTask( item: TaskItem ): boolean;

    updateGoalsOrder( items: IGoalChangeItemsOrder ): boolean;

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): boolean;

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): boolean;

    fetchAllSettings(): IAppSettingsItems

    updateAllSettings( items: IAppSettingsItems ): boolean;

    addNewLabel( label: IAppAddLabel ): IAppLabel | false;

    deleteLabel( label: IAppLabel ): boolean;

    fetchAllLabels(): IAppLabels;

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ): boolean;

    fetchLabelsForNestedItemById( taskId: number ): IAppLabels;

    fetchReportData( options: IArgReport ): IReportResult;

    startTimeRecordForTask( options: IArgStartTimeRecord ): false | number;

    stopTimeRecordForTask( options: IArgStopTimeRecord ): boolean;

    fetchPlanReportData( options: IArgReport ): IReportResult;

    fetchTimeActivityRecordsForTask( taskId: number ): ITimeRecords;

    fetchGoalItemStats( listId: number ): number;

    updateLabel( label: IAppLabel ): boolean;

    moveTaskToNewList( options: TMoveTaskArg ): boolean;

    deleteNestedGoalItemsExpDate( item: TaskItem ): boolean;

    getLicenseText(): string;

    getRepository(): string;

    fetchTaskById( id: number ): IGoalNestedItemWithCommentAndReminder | null;
}
