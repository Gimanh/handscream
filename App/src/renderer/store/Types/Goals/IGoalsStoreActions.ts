import {
    IAppAddLabel,
    IAppLabel,
    IAppLabels,
    IGoal,
    IGoalChangeItemsOrder,
    IGoalItems,
    IGoalNestedItems,
    IGoalNestedItemWithCommentAndReminder,
    TaskItem
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
    IArgAddTask, IArgReport,
    IArgUpdateArchiveGoalStatus,
    IArgUpdateGoal, IReportResult, NoMoreTasks, TMoveTaskArg
} from '@/store/Types/Goals/Types';
import { ITimeRecords } from '@/store/Types/TimeRecord/Types';

export interface IGoalsStoreActions {
    fetchGoals(): Promise<void>;

    addGoal( options: IArgAddGoal ): Promise<IGoal | false>;

    updateGoal( goalInfo: IArgUpdateGoal ): Promise<void>;

    deleteGoal( goal: IGoal ): Promise<void>;

    fetchGoalItems( goalId: number ): Promise<void>;

    addGoalItem( goalItem: IArgAddGoalItem ): Promise<void>;

    updateGoalItemName( options: IArgItemName ): Promise<void>;

    updateGoalItemsOrder( items: IGoalChangeItemsOrder ): void;

    fetchTasks( goalItemId: ArgFetchTasks ): Promise<void>;

    loadMoreTasks( goalItemId: ArgFetchTasks ): Promise<void | NoMoreTasks>;

    updateTaskStatus( options: IArgCheckboxUpdate ): Promise<void>;

    updateTaskExpDate( options: IArgItemDate ): Promise<void>;

    updateTaskComment( options: IArgItemComment ): Promise<void>;

    updateTaskDescription( options: IArgItemDescription ): Promise<void>;

    addTask( nestedItem: IArgAddTask ): Promise<TaskItem | false>;

    deleteTask( item: TaskItem ): Promise<void>;

    deleteGoalItem( id: number ): Promise<void>;

    setArchiveGoalStatus( options: IArgUpdateArchiveGoalStatus ): Promise<void>;

    fetchGoalProgress( goalId: number ): Promise<void>;

    updateGoalsOrder( items: IGoalChangeItemsOrder ): Promise<void>;

    updateGoalNestedItemsOrder( items: IGoalChangeItemsOrder ): Promise<void>;

    addNewLabelToDb( label: IAppAddLabel ): Promise<IAppLabel | false>;

    deleteLabelFromDb( label: IAppLabel ): Promise<void>;

    fetchAllLabels(): Promise<void>;

    updateLabelsOnNestedItem( options: { nestedId: number, labels: IAppLabels } ): Promise<void>;

    fetchReportData( options: IArgReport ): Promise<IReportResult>;

    fetchPlanReportData( options: IArgReport ): Promise<IReportResult>;

    fetchTimeActivityRecords( taskId: number ): Promise<ITimeRecords>;

    fetchGoalItemStats( listId: number ): Promise<number>;

    updateLabel( label: IAppLabel ): Promise<boolean>;

    fetchGoalItemsWithoutCommit( goalId: number ): Promise<IGoalItems>;

    moveTaskToNewList( options: TMoveTaskArg ): Promise<boolean>

    deleteNestedGoalItemsExpDate( item: TaskItem ): Promise<boolean>;

    fetchSelectedTaskForDialog( id: number ): Promise<IGoalNestedItemWithCommentAndReminder>
}
