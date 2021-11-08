import { DatabaseConnectOptions, IArgAddNested, IZDatabase } from '@/classes/IZDatabase';
import { ConfigStore } from '@/classes/ConfigStore';
import {
    ArgFetchTasks,
    IArgAddGoal,
    IArgAddGoalItem, IArgAddTask,
    IArgCheckboxUpdate,
    IArgItemComment,
    IArgItemDate,
    IArgItemDescription,
    IArgItemName,
    IArgReport,
    IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal, IReportResult,
    TMoveTaskArg
} from '@/store/Types/Goals/Types';
import {
    IAppAddLabel,
    IAppLabel,
    IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItem, IGoalItems, IGoalNestedItems, IGoalNestedItemWithCommentAndReminder, TaskItem
} from '@/interfaces/IApp';
import { IAppSettingsItems } from '@/store/Types/AppSettings/Types';
import {
    IArgStartTimeRecord,
    IArgStopTimeRecord,
    ITimeRecords
} from '@/store/Types/TimeRecord/Types';
import { IConfigDataTaskView } from '@/classes/IConfigStore';

export default class ZDatabaseRemote implements IZDatabase {
    constructor() {
        debugger
    }

    config: ConfigStore;
    db: any;

    addGoal( options: IArgAddGoal ): IGoal | false {
        return undefined;
    }

    addGoalItem( goalItem: IArgAddGoalItem ): IGoalItem | false {
        return undefined;
    }

    addNewLabel( label: IAppAddLabel ): IAppLabel | false {
        return undefined;
    }

    addTask( nestedItem: IArgAddTask ): IArgAddNested | false {
        return undefined;
    }

    closeCurrentDatabase(): boolean {
        return false;
    }

    createDatabase( name: string, destination?: string ): any {
    }

    deleteGoal( goal: IGoal ): boolean {
        return false;
    }

    deleteGoalItem( id: number ): boolean {
        return false;
    }

    deleteLabel( label: IAppLabel ): boolean {
        return false;
    }

    deleteNestedGoalItemsExpDate( item: TaskItem ): boolean {
        return false;
    }

    deleteTask( item: TaskItem ): boolean {
        return false;
    }

    fetchAllLabels(): IAppLabels {
        return undefined;
    }

    fetchAllSettings(): IAppSettingsItems {
        return undefined;
    }

    fetchGoalItemStats( listId: number ): number {
        return 0;
    }

    fetchGoalItems( goalId: number ): IGoalItems {
        return undefined;
    }

    fetchGoals(): IGoal[] {
        return [];
    }

    fetchLabelsForNestedItemById( taskId: number ): IAppLabels {
        return undefined;
    }

    fetchNestedGoalItemById( id: number ): TaskItem | false {
        return undefined;
    }

    fetchPlanReportData( options: IArgReport ): IReportResult {
        return undefined;
    }

    fetchProgressForGoal( goalId: number ): number {
        return 0;
    }

    fetchReportData( options: IArgReport ): IReportResult {
        return undefined;
    }

    fetchTaskById( id: number ): IGoalNestedItemWithCommentAndReminder | null {
        return undefined;
    }

    fetchTasks( options: ArgFetchTasks ): IGoalNestedItems {
        return undefined;
    }

    fetchTimeActivityRecordsForTask( taskId: number ): ITimeRecords {
        return undefined;
    }

    getConfigData(): IConfigDataTaskView {
        return undefined;
    }

    getLicenseText(): string {
        return '';
    }

    getName(): string {
        return '';
    }

    getRepository(): string {
        return '';
    }

    hasActiveDb(): boolean {
        return false;
    }

    moveTaskToNewList( options: TMoveTaskArg ): boolean {
        return false;
    }

    openDatabase( options?: DatabaseConnectOptions ): boolean {
        return false;
    }

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): boolean {
        return false;
    }

    startTimeRecordForTask( options: IArgStartTimeRecord ): false | number {
        return undefined;
    }

    stopTimeRecordForTask( options: IArgStopTimeRecord ): boolean {
        return false;
    }

    updateAllSettings( items: IAppSettingsItems ): boolean {
        return false;
    }

    updateGoal( goalInfo: IArgUpdateGoal ): boolean {
        return false;
    }

    updateGoalItemName( options: IArgItemName ): boolean {
        return false;
    }

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): boolean {
        return false;
    }

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): boolean {
        return false;
    }

    updateGoalsOrder( items: IGoalChangeItemsOrder ): boolean {
        return false;
    }

    updateLabel( label: IAppLabel ): boolean {
        return false;
    }

    updateLabelsOnNestedItem( options: { nestedId: number; labels: IAppLabels } ): boolean {
        return false;
    }

    updateNestedGoalItemCheckboxStatus( options: IArgCheckboxUpdate ): boolean {
        return false;
    }

    updateNestedGoalItemComment( options: IArgItemComment ): boolean {
        return false;
    }

    updateNestedGoalItemDescriptions( options: IArgItemDescription ): boolean {
        return false;
    }

    updateNestedItemsOrder( items: { id: number; order_key: number }[] ): boolean {
        return false;
    }

    updateTaskExpDate( options: IArgItemDate ): boolean {
        return false;
    }
}
